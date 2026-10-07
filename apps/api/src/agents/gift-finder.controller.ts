import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { GiftFinderService } from './gift-finder.service';

class GiftFinderDto {
  @IsString() occasion!: string;
  @IsString() recipient!: string;
  @IsNumber() @Min(500) budgetMinRupees!: number;
  @IsNumber() @Max(100000) budgetMaxRupees!: number;
  @IsString() @IsOptional() style?: string;
}

@Controller('gifts')
export class GiftFinderController {
  constructor(private readonly giftFinder: GiftFinderService) {}

  @Post('find')
  @HttpCode(HttpStatus.OK)
  find(@Body() dto: GiftFinderDto) {
    return this.giftFinder.findGifts(dto);
  }
}
