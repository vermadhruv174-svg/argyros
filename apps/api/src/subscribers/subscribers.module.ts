import { Module, Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

class CreateSubscriberDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;
}

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly db: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async subscribe(@Body() dto: CreateSubscriberDto) {
    const email = dto.email.toLowerCase().trim();
    return this.db.subscriber.upsert({
      where: { email },
      create: {
        email,
        source: dto.source,
        consentAt: new Date(),
      },
      update: {
        source: dto.source,
      },
    });
  }
}

@Module({
  controllers: [SubscribersController],
})
export class SubscribersModule {}
