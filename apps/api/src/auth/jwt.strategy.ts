import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from './current-user.decorator';
import { getJwtSecret } from '../config/runtime';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly db: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.sub || !payload.sid || !payload.reauthAt) {
      throw new UnauthorizedException('Session no longer valid.');
    }

    const activeSession = await this.db.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        sessionId: payload.sid,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        user: { select: { email: true, role: true, mfaEnabled: true } },
      },
    });

    if (!activeSession) throw new UnauthorizedException('Session no longer valid.');
    return {
      ...payload,
      email: activeSession.user.email,
      role: activeSession.user.role,
      ...(payload.mfa === true && activeSession.user.mfaEnabled ? { mfa: true as const } : {}),
    };
  }
}
