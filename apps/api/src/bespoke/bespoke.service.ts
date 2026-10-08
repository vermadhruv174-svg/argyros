import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBespokeInquiryDto } from './dto/create-bespoke-inquiry.dto';
import { BespokeStatus } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class BespokeService {
  private readonly logger = new Logger(BespokeService.name);
  private readonly s3Client: S3Client | null = null;
  private readonly bucket: string;

  constructor(private readonly prisma: PrismaService) {
    const endpoint = process.env['STORAGE_ENDPOINT'];
    const region = process.env['STORAGE_REGION'] || 'auto';
    const accessKeyId = process.env['STORAGE_ACCESS_KEY_ID'];
    const secretAccessKey = process.env['STORAGE_SECRET_ACCESS_KEY'];
    this.bucket = process.env['STORAGE_BUCKET'] || 'argyros-bespoke';

    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region,
        ...(endpoint ? { endpoint } : {}),
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log('S3 / R2 storage client initialised for bespoke uploads');
    } else {
      this.logger.warn('STORAGE_ACCESS_KEY_ID or STORAGE_SECRET_ACCESS_KEY not configured. Presigned uploads will run in mock/local fallback mode.');
    }
  }

  generateReferenceNumber(): string {
    const digits = randomInt(100000, 999999);
    return `ARG-BSP-${digits}`;
  }

  async getPresignedUploadUrl(filename: string, contentType: string): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(contentType.toLowerCase())) {
      throw new BadRequestException('Disallowed file type. Only JPG, PNG, and WEBP formats are accepted.');
    }

    if (filename.toLowerCase().endsWith('.svg') || contentType.toLowerCase().includes('svg')) {
      throw new BadRequestException('SVG files are strictly disallowed.');
    }

    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const key = `inquiries/${Date.now()}-${randomBytes(8).toString('hex')}.${ext}`;

    if (this.s3Client) {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      });
      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
      const publicBase = process.env['STORAGE_PUBLIC_URL'] || `https://${this.bucket}.s3.amazonaws.com`;
      return {
        uploadUrl,
        key,
        publicUrl: `${publicBase}/${key}`,
      };
    }

    return {
      uploadUrl: `/api/bespoke/uploads/mock?key=${encodeURIComponent(key)}`,
      key,
      publicUrl: `https://mock-storage.argyros.in/${key}`,
    };
  }

  async create(dto: CreateBespokeInquiryDto) {
    if (dto.website_secondary && dto.website_secondary.trim().length > 0) {
      this.logger.warn(`Spam bot caught via honeypot field: ${dto.email}`);
      return {
        id: 'bot-filtered',
        referenceNumber: 'ARG-BSP-000000',
        status: BespokeStatus.RECEIVED,
      };
    }

    if (dto.timeToSubmitMs !== undefined && dto.timeToSubmitMs < 3000) {
      this.logger.warn(`Spam bot caught via timeToSubmitMs threshold (<3s): ${dto.timeToSubmitMs}ms`);
      return {
        id: 'bot-filtered',
        referenceNumber: 'ARG-BSP-000000',
        status: BespokeStatus.RECEIVED,
      };
    }

    const referenceNumber = this.generateReferenceNumber();

    return this.prisma.bespokeInquiry.create({
      data: {
        referenceNumber,
        fullName: dto.fullName.trim(),
        email: dto.email.toLowerCase().trim(),
        phone: dto.phone.trim(),
        category: dto.category,
        finish: dto.finish,
        budgetTier: dto.budgetTier,
        estimatedSize: dto.estimatedSize,
        engraving: dto.engraving,
        targetDate: dto.targetDate,
        description: dto.description.trim(),
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
