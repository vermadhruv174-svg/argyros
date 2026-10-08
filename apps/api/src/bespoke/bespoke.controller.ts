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
} from '@nestjs/common';
import { BespokeService } from './bespoke.service';
import { CreateBespokeInquiryDto } from './dto/create-bespoke-inquiry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../admin/roles.guard';
import { BespokeStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Throttle } from '@nestjs/throttler';

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
  constructor(private readonly bespokeService: BespokeService) {}

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
  @UseGuards(JwtAuthGuard, StaffGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBespokeStatusDto,
  ) {
    return this.bespokeService.updateStatus(id, dto.status, dto.adminNotes);
  }
}
