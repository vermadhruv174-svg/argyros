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
} from '@nestjs/common';
import { BespokeService } from './bespoke.service';
import { CreateBespokeInquiryDto } from './dto/create-bespoke-inquiry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../admin/roles.guard';
import { BespokeStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

class UpdateBespokeStatusDto {
  @IsEnum(BespokeStatus)
  status!: BespokeStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}

@Controller('bespoke')
export class BespokeController {
  constructor(private readonly bespokeService: BespokeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
