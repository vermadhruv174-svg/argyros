import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, MfaEnableDto, MfaVerifyDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Throttle } from '@nestjs/throttler';
import type { JwtPayload } from './current-user.decorator';
import { OwnerGuard, OwnerIdentityGuard, RecentOwnerAuthGuard } from '../admin/roles.guard';
import type { SessionContext } from './auth.service';

const COOKIE_NAME = 'argyros_refresh';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
};

function sessionContext(req: Request): SessionContext {
  const userAgent = req.get('user-agent')?.trim();
  const ipAddress = req.ip?.trim();
  return {
    userAgent: userAgent ? userAgent.slice(0, 512) : undefined,
    ipAddress: ipAddress ? ipAddress.slice(0, 64) : undefined,
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(
      dto.email,
      dto.password,
      dto.firstName,
      dto.lastName,
      sessionContext(req),
    );
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    return { accessToken };
  }

  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto.email, dto.password, sessionContext(req));
    if ('mfaRequired' in result) return result;

    const { accessToken, refreshToken } = result;
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    return { accessToken };
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard, OwnerIdentityGuard, RecentOwnerAuthGuard)
  async setupMfa(@CurrentUser() user: JwtPayload) {
    return this.authService.setupMfa(user.sub);
  }

  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @Post('mfa/enable')
  @UseGuards(JwtAuthGuard, OwnerIdentityGuard, RecentOwnerAuthGuard)
  async enableMfa(@CurrentUser() user: JwtPayload, @Body() dto: MfaEnableDto) {
    return this.authService.enableMfa(user.sub, dto.secret, dto.code);
  }

  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  async verifyMfa(
    @Body() dto: MfaVerifyDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.verifyMfa(
      dto.mfaPendingToken,
      dto.code,
      sessionContext(req),
    );
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
    const { accessToken, refreshToken } = await this.authService.refresh(token, sessionContext(req));
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

  @Get('sessions')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  listSessions(@CurrentUser() user: JwtPayload) {
    return this.authService.listSessions(user.sub, user.sid);
  }

  @Delete('sessions/:sessionId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  revokeSession(
    @CurrentUser() user: JwtPayload,
    @Param('sessionId') sessionId: string,
  ) {
    return this.authService.revokeSession(user.sub, sessionId);
  }

  @Post('sessions/revoke-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  revokeAllSessions(@CurrentUser() user: JwtPayload) {
    return this.authService.revokeAllSessions(user.sub);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }
}
