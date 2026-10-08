import { IsString, IsEmail, IsNotEmpty, IsOptional, IsArray, MaxLength, IsNumber } from 'class-validator';

export class CreateBespokeInquiryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  finish!: string;

  @IsString()
  @IsOptional()
  budgetTier?: string;

  @IsString()
  @IsOptional()
  estimatedSize?: string;

  @IsString()
  @IsOptional()
  engraving?: string;

  @IsString()
  @IsOptional()
  targetDate?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @IsString()
  @IsOptional()
  website_secondary?: string;

  @IsNumber()
  @IsOptional()
  timeToSubmitMs?: number;
}
