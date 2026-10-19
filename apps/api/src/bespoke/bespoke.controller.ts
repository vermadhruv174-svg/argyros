import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { BespokeService } from './bespoke.service';
import { CreateBespokeInquiryDto } from './dto/create-bespoke-inquiry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecentOwnerAuthGuard, StaffGuard } from '../admin/roles.guard';
import { BespokeStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/current-user.decorator';
import { AuditService, requestIdFrom, requestMetadata } from '../audit/audit.service';

class UpdateBespokeStatusDto {
  @IsEnum(BespokeStatus)
  status!: BespokeStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}

class PresignUploadDto {
  @IsString()
  @IsNotEmpty()
  filename!: string;

  @IsString()
  @IsNotEmpty()
  contentType!: string;
}

@Controller('bespoke')
export class BespokeController {
  constructor(
    private readonly bespokeService: BespokeService,
    private readonly auditService: AuditService,
  ) {}

  @Post('uploads/presign')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 60000, limit: 10 } })
  presignUpload(@Body() dto: PresignUploadDto) {
    return this.bespokeService.getPresignedUploadUrl(dto.filename, dto.contentType);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ short: { ttl: 3600000, limit: 5 } }) // 5 per hour IP rate-limiting
  create(@Body() dto: CreateBespokeInquiryDto) {
    return this.bespokeService.create(dto);
  }

  @Get('inquiry/:referenceNumber')
  findByReference(@Param('referenceNumber') referenceNumber: string) {
    return this.bespokeService.findByReference(referenceNumber);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, StaffGuard)
  findAllForAdmin() {
    return this.bespokeService.findAll();
  }

  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, StaffGuard, RecentOwnerAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBespokeStatusDto,
    @Req() req: Request,
    @CurrentUser() user: JwtPayload,
  ) {
    const before = await this.bespokeService.getAuditSnapshot(id);
    const inquiry = await this.bespokeService.updateStatus(id, dto.status, dto.adminNotes);
    await this.auditService.record({
      actor: user.sub,
      action: 'bespoke.status',
      resource: `bespoke:${id}`,
      requestId: requestIdFrom(req),
      before,
      after: { id: inquiry.id, referenceNumber: inquiry.referenceNumber, status: inquiry.status },
      reason: dto.adminNotes,
      metadata: requestMetadata(req),
    });
    return inquiry;
  }
}
