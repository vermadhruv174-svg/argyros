import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Throttle } from '@nestjs/throttler';
import type { JwtPayload } from './current-user.decorator';

const COOKIE_NAME = 'argyros_refresh';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(
      dto.email,
      dto.password,
      dto.firstName,
      dto.lastName,
    );
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    return { accessToken };
  }

  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto.email, dto.password);
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = (req.cookies as Record<string, string>)?.[COOKIE_NAME];
    if (!token) {
      res.status(401).json({ message: 'No refresh token.' });
      return;
    }
    const { accessToken, refreshToken } = await this.authService.refresh(token);
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = (req.cookies as Record<string, string>)?.[COOKIE_NAME];
    if (token) await this.authService.logout(token);
    res.clearCookie(COOKIE_NAME, { path: '/' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }
}
