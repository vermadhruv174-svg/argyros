import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBespokeInquiryDto } from './dto/create-bespoke-inquiry.dto';
import { BespokeStatus } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class BespokeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBespokeInquiryDto) {
    const year = new Date().getFullYear();
    const randomSuffix = randomBytes(3).toString('hex').toUpperCase();
    const referenceNumber = `ARG-BESPOKE-${year}-${randomSuffix}`;

    return this.prisma.bespokeInquiry.create({
      data: {
        referenceNumber,
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        category: dto.category,
        finish: dto.finish,
        budgetTier: dto.budgetTier,
        estimatedSize: dto.estimatedSize,
        engraving: dto.engraving,
        targetDate: dto.targetDate,
        description: dto.description,
        imageUrls: dto.imageUrls || [],
        status: BespokeStatus.RECEIVED,
      },
    });
  }

  async findAll() {
    return this.prisma.bespokeInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByReference(referenceNumber: string) {
    const inquiry = await this.prisma.bespokeInquiry.findUnique({
      where: { referenceNumber },
    });
    if (!inquiry) {
      throw new NotFoundException(`Bespoke inquiry ${referenceNumber} not found.`);
    }
    return inquiry;
  }

  async updateStatus(id: string, status: BespokeStatus, adminNotes?: string) {
    const existing = await this.prisma.bespokeInquiry.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Inquiry with ID ${id} not found.`);
    }

    return this.prisma.bespokeInquiry.update({
      where: { id },
      data: {
        status,
        ...(adminNotes ? { adminNotes } : {}),
      },
    });
  }
}
