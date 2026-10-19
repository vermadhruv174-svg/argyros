import { AuthService, hashRefreshToken } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { encryptMfaSecret } from './mfa.crypto';

jest.mock('argon2', () => ({
  argon2id: 2,
  hash: jest.fn(),
  verify: jest.fn().mockResolvedValue(true),
}));

describe('AuthService MFA login', () => {
  const originalEnv = {
    OWNER_EMAIL: process.env.OWNER_EMAIL,
    MFA_ENCRYPTION_KEY: process.env.MFA_ENCRYPTION_KEY,
  };
  const key = Buffer.from('0123456789abcdef0123456789abcdef');
  const user = {
    id: 'owner-id',
    email: 'owner@example.com',
    passwordHash: '$argon2id$v=19$m=16,t=2,p=1$6nRr8n7N4zY$0K1h3J4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A',
    firstName: 'Owner',
    lastName: 'Account',
    role: 'ADMIN',
    mfaEnabled: true,
    mfaSecretEncrypted: encryptMfaSecret('JBSWY3DPEHPK3PXP', key),
  };

  beforeEach(() => {
    process.env.OWNER_EMAIL = 'owner@example.com';
    process.env.MFA_ENCRYPTION_KEY = key.toString('hex');
  });

  afterAll(() => {
    if (originalEnv.OWNER_EMAIL === undefined) delete process.env.OWNER_EMAIL;
    else process.env.OWNER_EMAIL = originalEnv.OWNER_EMAIL;
    if (originalEnv.MFA_ENCRYPTION_KEY === undefined) delete process.env.MFA_ENCRYPTION_KEY;
    else process.env.MFA_ENCRYPTION_KEY = originalEnv.MFA_ENCRYPTION_KEY;
  });

  it('returns a short-lived pending ticket instead of an access or refresh token', async () => {
    const db = {
      user: { findUnique: jest.fn().mockResolvedValue(user) },
    } as never;
    const jwt = new JwtService({ secret: 'test-secret' });
    const service = new AuthService(db, jwt);

    const result = await service.login(' OWNER@EXAMPLE.COM ', 'password-not-used-by-this-test');

    expect(result).toMatchObject({ mfaRequired: true });
    expect(result).toHaveProperty('mfaPendingToken');
    expect((result as { mfaPendingToken: string }).mfaPendingToken).not.toContain('owner@example.com');
  });

  it('rejects a pending ticket with an invalid code before issuing a pair', async () => {
    const db = {
      user: { findUnique: jest.fn().mockResolvedValue(user) },
    } as never;
    const jwt = new JwtService({ secret: 'test-secret' });
    const service = new AuthService(db, jwt);
    const ticket = jwt.sign({ sub: user.id, email: user.email, role: user.role, mfaPending: true }, { expiresIn: '5m' });

    await expect(service.verifyMfa(ticket, '000000')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

describe('AuthService refresh sessions', () => {
  const baseUser = {
    id: 'customer-id',
    email: 'customer@example.com',
    passwordHash: 'hash',
    firstName: 'Customer',
    lastName: 'Account',
    role: 'CUSTOMER',
    mfaEnabled: false,
    mfaSecretEncrypted: null,
  };

  function setup() {
    const db = {
      user: { findUnique: jest.fn().mockResolvedValue(baseUser) },
      refreshToken: {
        create: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findMany: jest.fn(),
      },
    } as never;
    return {
      db: db as {
        user: { findUnique: jest.Mock };
        refreshToken: {
          create: jest.Mock;
          findUnique: jest.Mock;
          updateMany: jest.Mock;
          findMany: jest.Mock;
        };
      },
      service: new AuthService(db, new JwtService({ secret: 'test-secret' })),
    };
  }

  it('rotates refresh credentials and stores only a hash', async () => {
    const { db, service } = setup();
    const firstPair = await service.login('customer@example.com', 'password');
    if ('mfaRequired' in firstPair) throw new Error('Unexpected MFA challenge in rotation test.');
    const firstCreate = db.refreshToken.create.mock.calls[0][0].data as Record<string, unknown>;

    expect(firstCreate.tokenHash).toBe(hashRefreshToken(firstPair.refreshToken));
    expect(firstCreate.tokenHash).not.toBe(firstPair.refreshToken);
    expect(firstCreate).not.toHaveProperty('token');

    db.refreshToken.findUnique.mockResolvedValue({
      id: 'refresh-1',
      userId: baseUser.id,
      sessionId: 'session-1',
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
      reauthenticatedAt: new Date(),
      user: baseUser,
    });

    const nextPair = await service.refresh(firstPair.refreshToken, { userAgent: 'Test device' });
    const rotationWhere = db.refreshToken.updateMany.mock.calls[0][0].where;
    const nextCreate = db.refreshToken.create.mock.calls[1][0].data as Record<string, unknown>;

    expect(rotationWhere).toEqual({ id: 'refresh-1', revokedAt: null });
    expect(nextPair.refreshToken).not.toBe(firstPair.refreshToken);
    expect(nextCreate.tokenHash).toBe(hashRefreshToken(nextPair.refreshToken));
    expect(nextCreate.sessionId).toBe('session-1');
    expect(nextCreate.userAgent).toBe('Test device');
    expect(nextCreate).not.toHaveProperty('token');
  });

  it('revokes all active sessions and never returns refresh secrets in the session list', async () => {
    const { db, service } = setup();
    const secretHash = hashRefreshToken('refresh-secret');
    db.refreshToken.findMany.mockResolvedValue([{
      sessionId: 'session-1',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      lastUsedAt: new Date('2026-01-02T00:00:00Z'),
      expiresAt: new Date('2026-02-01T00:00:00Z'),
      userAgent: 'Test device',
      ipAddress: '127.0.0.1',
      tokenHash: secretHash,
    }]);

    const listed = await service.listSessions('owner-id', 'session-1');
    const revoked = await service.revokeAllSessions('owner-id');

    expect(listed.sessions).toEqual([expect.objectContaining({ id: 'session-1', current: true })]);
    expect(JSON.stringify(listed)).not.toContain(secretHash);
    expect(JSON.stringify(listed)).not.toContain('refresh-secret');
    expect(revoked).toEqual({ revokedCount: 1 });
    expect(db.refreshToken.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: 'owner-id', revokedAt: null },
    }));
  });

  it('treats a rotated-token replay as a session compromise and rejects it', async () => {
    const { db, service } = setup();
    db.refreshToken.findUnique.mockResolvedValue({
      id: 'refresh-old',
      userId: baseUser.id,
      sessionId: 'session-1',
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: new Date(),
      reauthenticatedAt: new Date(),
      user: baseUser,
    });

    await expect(service.refresh('replayed-token')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(db.refreshToken.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: baseUser.id, sessionId: 'session-1', revokedAt: null },
    }));
  });
});
