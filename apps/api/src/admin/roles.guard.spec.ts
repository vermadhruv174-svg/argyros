import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { OwnerGuard, RecentOwnerAuthGuard, StaffGuard } from './roles.guard';

function contextFor(user?: { email?: string; role?: string; mfa?: true; reauthAt?: number }): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('OwnerGuard', () => {
  const originalOwnerEmail = process.env.OWNER_EMAIL;
  const originalMfaEnforcement = process.env.MFA_ENFORCEMENT;

  afterEach(() => {
    if (originalOwnerEmail === undefined) delete process.env.OWNER_EMAIL;
    else process.env.OWNER_EMAIL = originalOwnerEmail;
    if (originalMfaEnforcement === undefined) delete process.env.MFA_ENFORCEMENT;
    else process.env.MFA_ENFORCEMENT = originalMfaEnforcement;
  });

  it('allows the configured owner using normalized email comparison', () => {
    process.env.OWNER_EMAIL = 'owner@example.com';

    expect(new OwnerGuard().canActivate(contextFor({ email: ' Owner@EXAMPLE.com ', role: 'ADMIN' }))).toBe(true);
  });

  it.each([
    ['configured email without admin role', { email: 'owner@example.com', role: 'CUSTOMER' }],
    ['staff', { email: 'staff@example.com', role: 'STAFF' }],
    ['customer', { email: 'customer@example.com', role: 'CUSTOMER' }],
    ['missing user', undefined],
  ])('denies %s', (_label, user) => {
    process.env.OWNER_EMAIL = 'owner@example.com';

    expect(() => new OwnerGuard().canActivate(contextFor(user))).toThrow(ForbiddenException);
  });

  it('fails closed when owner configuration is absent', () => {
    delete process.env.OWNER_EMAIL;

    expect(() => new OwnerGuard().canActivate(contextFor({ email: 'owner@example.com' }))).toThrow(
      /Owner access required/,
    );
  });

  it('requires an mfa claim for owner access when enforcement is enabled', () => {
    process.env.OWNER_EMAIL = 'owner@example.com';
    process.env.MFA_ENFORCEMENT = 'true';

    expect(() => new OwnerGuard().canActivate(contextFor({ email: 'owner@example.com', role: 'ADMIN' }))).toThrow(
      /MFA verification required/,
    );
    expect(new OwnerGuard().canActivate(contextFor({ email: 'owner@example.com', role: 'ADMIN', mfa: true }))).toBe(true);
  });
});

describe('RecentOwnerAuthGuard', () => {
  afterEach(() => {
    delete process.env.MFA_ENFORCEMENT;
  });

  it('allows a recent password or MFA authentication', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(new RecentOwnerAuthGuard().canActivate(contextFor({ reauthAt: now }))).toBe(true);
  });

  it.each([
    ['missing', undefined],
    ['stale', Math.floor(Date.now() / 1000) - 601],
    ['future', Math.floor(Date.now() / 1000) + 60],
  ])('rejects %s authentication', (_label, reauthAt) => {
    expect(() => new RecentOwnerAuthGuard().canActivate(contextFor({ reauthAt }))).toThrow(
      /Recent re-authentication required/,
    );
  });
});

describe('StaffGuard', () => {
  it('preserves existing ADMIN and STAFF access for non-Owner Space routes', () => {
    const guard = new StaffGuard();
    expect(guard.canActivate(contextFor({ role: 'ADMIN' }))).toBe(true);
    expect(guard.canActivate(contextFor({ role: 'STAFF' }))).toBe(true);
    expect(() => guard.canActivate(contextFor({ role: 'CUSTOMER' }))).toThrow(ForbiddenException);
  });
});
