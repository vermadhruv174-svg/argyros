import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import type { JwtPayload } from './current-user.decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, password: string, firstName: string, lastName: string) {
    const existing = await this.db.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('An account with this email already exists.');

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const user = await this.db.user.create({
      data: { email, passwordHash, firstName, lastName },
    });

    return this.issueTokenPair(user.id, user.email, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password.');

    if (!user.passwordHash) throw new UnauthorizedException('Invalid email or password.');

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) throw new UnauthorizedException('Invalid email or password.');

    return this.issueTokenPair(user.id, user.email, user.role);
  }

  async refresh(refreshToken: string) {
    const stored = await this.db.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date() || stored.revokedAt) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    // Rotate: revoke old, issue new pair
    await this.db.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokenPair(stored.user.id, stored.user.email, stored.user.role);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.db.refreshToken
      .updateMany({
        where: { token: refreshToken, revokedAt: null },
        data: { revokedAt: new Date() },
      })
      .catch(() => {}); // Silently ignore if token doesn't exist
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
        createdAt: true,
      },
    });
  }

  private async issueTokenPair(userId: string, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };
    const accessToken = this.jwt.sign(payload);

    const rawToken = randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await this.db.refreshToken.create({
      data: { token: rawToken, userId, expiresAt },
    });

    return { accessToken, refreshToken: rawToken, expiresAt };
  }
}
