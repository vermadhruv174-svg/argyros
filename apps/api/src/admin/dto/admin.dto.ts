import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { OrderStatus } from '@prisma/client';

export class CreateVariantDto {
  @IsString()
  sku!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsNumber()
  @Min(0)
  weightGrams!: number;

  @IsNumber()
  @Min(0)
  priceCents!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtCents?: number;

  @IsNumber()
  @Min(0)
  stock!: number;
}

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  metalPurity?: string;

  @IsString()
  category!: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants!: CreateVariantDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class TransitionOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateStockDto {
  @IsNumber()
  @Min(0)
  stock!: number;
}
