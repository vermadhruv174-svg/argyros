import { Module, Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsString()
  @IsNotEmpty()
  consentAt!: string;
}

@Controller('contact')
export class ContactController {
  @Post()
  @HttpCode(HttpStatus.OK)
  async submitContact(@Body() dto: CreateContactDto) {
    // In production, transmits email notification to contact.email
    return {
      success: true,
      receivedAt: new Date().toISOString(),
    };
  }
}

@Module({
  controllers: [ContactController],
})
export class ContactModule {}
