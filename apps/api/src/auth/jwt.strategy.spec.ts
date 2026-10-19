import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy session revocation', () => {
  const payload = {
    sub: 'owner-id',
    email: 'owner@example.com',
    role: 'ADMIN',
    sid: 'session-1',
    reauthAt: Math.floor(Date.now() / 1000),
  };

  it('accepts a token only while its backing session has an active refresh record', async () => {
    const db = {
      refreshToken: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'refresh-1',
          user: { email: 'owner@example.com', role: 'ADMIN', mfaEnabled: false },
        }),
      },
    };
    const strategy = new JwtStrategy(db as never);

    await expect(strategy.validate(payload)).resolves.toEqual(payload);
    expect(db.refreshToken.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ userId: 'owner-id', sessionId: 'session-1', revokedAt: null }),
      select: expect.objectContaining({ user: { select: { email: true, role: true, mfaEnabled: true } } }),
    }));
  });

  it('uses current user claims so a revoked role cannot keep Owner Space access', async () => {
    const db = {
      refreshToken: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'refresh-1',
          user: { email: 'customer@example.com', role: 'CUSTOMER', mfaEnabled: false },
        }),
      },
    };
    const strategy = new JwtStrategy(db as never);

    await expect(strategy.validate(payload)).resolves.toMatchObject({
      email: 'customer@example.com',
      role: 'CUSTOMER',
    });
  });

  it('rejects a revoked device session', async () => {
    const db = { refreshToken: { findFirst: jest.fn().mockResolvedValue(null) } };
    const strategy = new JwtStrategy(db as never);

    await expect(strategy.validate(payload)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
