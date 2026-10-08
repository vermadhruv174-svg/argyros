import { Test, TestingModule } from '@nestjs/testing';
import { BespokeService } from './bespoke.service';
import { PrismaService } from '../database/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('BespokeService', () => {
  let service: BespokeService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      bespokeInquiry: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'inq-123', ...args.data })),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BespokeService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BespokeService>(BespokeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate reference numbers formatted as ARG-BSP-######', () => {
    const ref = service.generateReferenceNumber();
    expect(ref).toMatch(/^ARG-BSP-\d{6}$/);
  });

  it('should disallow SVG uploads in presign request', async () => {
    await expect(service.getPresignedUploadUrl('sketch.svg', 'image/svg+xml')).rejects.toThrow(BadRequestException);
  });

  it('should silently filter out bots via honeypot field', async () => {
    const res = await service.create({
      fullName: 'Bot User',
      email: 'bot@example.com',
      phone: '9820011111',
      category: 'Ring',
      finish: 'High Polish 925',
      description: 'Spam submission text for testing purposes',
      website_secondary: 'spam-link.com',
    } as any);

    expect(res.id).toBe('bot-filtered');
    expect(prisma.bespokeInquiry.create).not.toHaveBeenCalled();
  });

  it('should reject or filter submissions faster than 3 seconds (bot behavior)', async () => {
    const res = await service.create({
      fullName: 'Speedy Bot',
      email: 'speedy@example.com',
      phone: '9820022222',
      category: 'Ring',
      finish: 'High Polish 925',
      description: 'Quick submission text for testing bot threshold',
      timeToSubmitMs: 1200,
    } as any);

    expect(res.id).toBe('bot-filtered');
    expect(prisma.bespokeInquiry.create).not.toHaveBeenCalled();
  });

  it('should successfully persist valid bespoke inquiries with 6-digit reference format', async () => {
    const res = await service.create({
      fullName: 'Aarav Sharma',
      email: 'aarav@example.com',
      phone: '9820012345',
      category: 'Ring',
      finish: 'High Polish 925',
      description: 'Custom signet ring with engraved ancestral monogram',
      timeToSubmitMs: 8500,
    } as any);

    expect(res.referenceNumber).toMatch(/^ARG-BSP-\d{6}$/);
    expect(prisma.bespokeInquiry.create).toHaveBeenCalled();
  });
});
