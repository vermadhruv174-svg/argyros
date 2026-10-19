import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}

export class MfaEnableDto {
  @IsString()
  @Matches(/^[A-Z2-7]+=*$/i)
  secret!: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code!: string;
}

export class MfaVerifyDto {
  @IsString()
  @MinLength(1)
  mfaPendingToken!: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code!: string;
}
