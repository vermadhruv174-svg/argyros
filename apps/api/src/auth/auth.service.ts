import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';
import type { JwtPayload } from './current-user.decorator';
import { getOwnerEmail, normalizeEmail } from '../config/runtime';
import {
  createTotpUri,
  decryptMfaSecret,
  encryptMfaSecret,
  generateTotpSecret,
  verifyTotpCode,
} from './mfa.crypto';

export interface SessionContext {
  userAgent?: string;
  ipAddress?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    context: SessionContext = {},
  ) {
    const normalizedEmail = normalizeEmail(email);
    const existing = await this.db.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) throw new ConflictException('An account with this email already exists.');

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const user = await this.db.user.create({
      data: { email: normalizedEmail, passwordHash, firstName, lastName },
    });

    return this.issueTokenPair(user.id, user.email, user.role, false, context);
  }

  async login(email: string, password: string, context: SessionContext = {}) {
    const user = await this.db.user.findUnique({ where: { email: normalizeEmail(email) } });
    if (!user) throw new UnauthorizedException('Invalid email or password.');

    if (!user.passwordHash) throw new UnauthorizedException('Invalid email or password.');

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) throw new UnauthorizedException('Invalid email or password.');

    if (this.isConfiguredOwner(user.email, user.role) && user.mfaEnabled && user.mfaSecretEncrypted) {
      const mfaPendingToken = this.jwt.sign(
        { sub: user.id, email: user.email, role: user.role, mfaPending: true },
        { expiresIn: '5m' },
      );
      return { mfaRequired: true as const, mfaPendingToken };
    }

    return this.issueTokenPair(user.id, user.email, user.role, false, context);
  }

  async verifyMfa(mfaPendingToken: string, code: string, context: SessionContext = {}) {
    let payload: JwtPayload;
    try {
      payload = this.jwt.verify<JwtPayload>(mfaPendingToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired MFA ticket.');
    }

    if (!payload.mfaPending || payload.mfa) {
      throw new UnauthorizedException('Invalid or expired MFA ticket.');
    }

    const user = await this.db.user.findUnique({ where: { id: payload.sub } });
    if (!user || !this.isConfiguredOwner(user.email, user.role) || !user.mfaEnabled || !user.mfaSecretEncrypted) {
      throw new UnauthorizedException('Invalid or expired MFA ticket.');
    }

    let secret: string;
    try {
      secret = decryptMfaSecret(user.mfaSecretEncrypted);
    } catch {
      throw new UnauthorizedException('MFA verification is unavailable.');
    }

    if (!verifyTotpCode(secret, code)) {
      throw new UnauthorizedException('Invalid MFA code.');
    }

    const { accessToken, refreshToken } = await this.issueTokenPair(
      user.id,
      user.email,
      user.role,
      true,
      context,
    );
    return { accessToken, refreshToken };
  }

  async setupMfa(userId: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user || !this.isConfiguredOwner(user.email, user.role)) throw new ForbiddenException('Owner access required.');
    if (user.mfaEnabled || user.mfaSecretEncrypted) {
      throw new ConflictException('MFA is already enabled for this owner.');
    }

    const secret = generateTotpSecret();
    return { secret, otpauthUri: createTotpUri(secret, user.email) };
  }

  async enableMfa(userId: string, secret: string, code: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user || !this.isConfiguredOwner(user.email, user.role)) throw new ForbiddenException('Owner access required.');
    if (user.mfaEnabled || user.mfaSecretEncrypted) {
      throw new ConflictException('MFA is already enabled for this owner.');
    }

    if (!verifyTotpCode(secret, code)) throw new UnauthorizedException('Invalid MFA code.');

    const encryptedSecret = encryptMfaSecret(secret);
    await this.db.$transaction([
      this.db.user.update({
        where: { id: user.id },
        data: { mfaEnabled: true, mfaSecretEncrypted: encryptedSecret },
      }),
      // Any pre-enrollment sessions must prove MFA again.
      this.db.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { enabled: true };
  }

  async refresh(refreshToken: string, context: SessionContext = {}) {
    const now = new Date();
    const stored = await this.db.refreshToken.findUnique({
      where: { tokenHash: hashRefreshToken(refreshToken) },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < now) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    // A previously rotated token is a replay signal. Revoke the rest of that
    // device's session before failing so a stolen token cannot keep refreshing.
    if (stored.revokedAt) {
      await this.revokeSessionRecords(stored.userId, stored.sessionId ?? stored.id, now);
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    // Rotate atomically enough for concurrent requests: only one request can
    // transition the current token from active to revoked.
    const revoked = await this.db.refreshToken.updateMany({
      where: { id: stored.id, revokedAt: null },
      data: { revokedAt: now, lastUsedAt: now },
    });
    if (revoked.count !== 1) {
      await this.revokeSessionRecords(stored.userId, stored.sessionId ?? stored.id, now);
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const mfaVerified = this.isConfiguredOwner(stored.user.email, stored.user.role)
      && stored.user.mfaEnabled
      && Boolean(stored.user.mfaSecretEncrypted);
    const reauthenticatedAt = stored.reauthenticatedAt instanceof Date
      ? stored.reauthenticatedAt
      : new Date(0);
    const sessionCreatedAt = stored.createdAt instanceof Date
      ? stored.createdAt
      : now;
    return this.issueTokenPair(
      stored.user.id,
      stored.user.email,
      stored.user.role,
      mfaVerified,
      context,
      stored.sessionId ?? stored.id,
      reauthenticatedAt,
      sessionCreatedAt,
    );
  }

  async logout(refreshToken: string): Promise<void> {
    await this.db.refreshToken
      .updateMany({
        where: { tokenHash: hashRefreshToken(refreshToken), revokedAt: null },
        data: { revokedAt: new Date() },
      })
      .catch(() => {}); // Silently ignore if token doesn't exist
  }

  async listSessions(userId: string, currentSessionId?: string) {
    const sessions = await this.db.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastUsedAt: 'desc' },
      select: {
        sessionId: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
        userAgent: true,
        ipAddress: true,
      },
    });

    // There should be one active refresh token per session after rotation, but
    // de-duplicate defensively so a partial legacy migration cannot expose
    // duplicate devices.
    const seen = new Set<string>();
    return {
      sessions: sessions
        .filter((session) => {
          if (seen.has(session.sessionId)) return false;
          seen.add(session.sessionId);
          return true;
        })
        .map((session) => ({
          id: session.sessionId,
          current: session.sessionId === currentSessionId,
          createdAt: session.createdAt,
          lastUsedAt: session.lastUsedAt,
          expiresAt: session.expiresAt,
          userAgent: session.userAgent,
          ipAddress: session.ipAddress,
        })),
    };
  }

  async revokeSession(userId: string, sessionId: string) {
    const result = await this.db.refreshToken.updateMany({
      where: { userId, sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { revoked: result.count > 0 };
  }

  async revokeAllSessions(userId: string) {
    const result = await this.db.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { revokedCount: result.count };
  }

  async getProfile(userId: string) {
    return this.db.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
         role: true,
         mfaEnabled: true,
         createdAt: true,
      },
    });
  }

  private async issueTokenPair(
    userId: string,
    email: string,
    role: string,
    mfa = false,
    context: SessionContext = {},
    sessionId = randomBytes(16).toString('hex'),
    reauthenticatedAt = new Date(),
    sessionCreatedAt = new Date(),
  ): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
      sid: sessionId,
      reauthAt: Math.floor(reauthenticatedAt.getTime() / 1000),
    };
    if (mfa) payload.mfa = true;
    const accessToken = this.jwt.sign(payload);

    const rawToken = randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await this.db.refreshToken.create({
      data: {
        tokenHash: hashRefreshToken(rawToken),
        sessionId,
        userId,
        expiresAt,
        reauthenticatedAt,
        lastUsedAt: new Date(),
        userAgent: context.userAgent,
        ipAddress: context.ipAddress,
        createdAt: sessionCreatedAt,
      },
    });

    return { accessToken, refreshToken: rawToken, expiresAt };
  }

  private revokeSessionRecords(userId: string, sessionId: string, now: Date) {
    return this.db.refreshToken.updateMany({
      where: { userId, sessionId, revokedAt: null },
      data: { revokedAt: now },
    });
  }

  private isConfiguredOwner(email: string, role: string): boolean {
    return role === 'ADMIN' && Boolean(getOwnerEmail() && normalizeEmail(email) === getOwnerEmail());
  }
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}
