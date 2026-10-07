import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  postalCode!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;
}

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  cartToken!: string;

  @ValidateNested()
  @Type(() => CustomerDto)
  customer!: CustomerDto;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto;
}
