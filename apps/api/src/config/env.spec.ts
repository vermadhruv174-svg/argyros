import {
  assertProductionSecrets,
  getAllowedCorsOrigins,
  getAppEnvironment,
  getOwnerEmail,
  getJwtSecret,
  normalizeEmail,
} from './runtime';

describe('runtime environment guards', () => {
  const completeProductionEnv = {
    APP_ENV: 'production',
    JWT_SECRET: 'a'.repeat(64),
    ORDER_TOKEN_SECRET: 'b'.repeat(64),
    STRIPE_SECRET_KEY: 'sk_live_real_value',
    STRIPE_WEBHOOK_SECRET: 'whsec_real_value',
    RAZORPAY_KEY_ID: 'rzp_live_real_value',
    RAZORPAY_KEY_SECRET: 'razorpay-real-value',
    OWNER_EMAIL: 'owner@example.com',
  };

  it('infers production from NODE_ENV when APP_ENV is absent', () => {
    expect(getAppEnvironment({ NODE_ENV: 'production' })).toBe('production');
    expect(getAppEnvironment({ NODE_ENV: 'development' })).toBe('development');
  });

  it('allows explicit staging mode to remain understandable on a production build', () => {
    expect(getAppEnvironment({ APP_ENV: 'staging', NODE_ENV: 'production' })).toBe('staging');
  });

  it('rejects missing production secrets', () => {
    expect(() => assertProductionSecrets(completeProductionEnv, ['JWT_SECRET'])).not.toThrow();
    expect(() =>
      assertProductionSecrets({ ...completeProductionEnv, JWT_SECRET: '' }, ['JWT_SECRET']),
    ).toThrow(/JWT_SECRET/);
  });

  it('rejects known placeholder production secrets', () => {
    expect(() =>
      assertProductionSecrets(
        { ...completeProductionEnv, ORDER_TOKEN_SECRET: 'CHANGE_THIS_TO_A_SECOND_64_CHAR_RANDOM_STRING' },
        ['ORDER_TOKEN_SECRET'],
      ),
    ).toThrow(/ORDER_TOKEN_SECRET/);
  });

  it('requires the owner email in production', () => {
    expect(() => assertProductionSecrets({ ...completeProductionEnv, OWNER_EMAIL: '' })).toThrow(/OWNER_EMAIL/);
    expect(() => assertProductionSecrets({ ...completeProductionEnv, OWNER_EMAIL: 'not-an-email' })).toThrow(/OWNER_EMAIL/);
    expect(assertProductionSecrets(completeProductionEnv)).toBeUndefined();
  });

  it('fails closed when production MFA enforcement has no encryption key', () => {
    expect(() => assertProductionSecrets({ ...completeProductionEnv, MFA_ENFORCEMENT: 'true' })).toThrow(
      /MFA_ENCRYPTION_KEY/,
    );
    expect(() => assertProductionSecrets({
      ...completeProductionEnv,
      MFA_ENFORCEMENT: 'true',
      MFA_ENCRYPTION_KEY: Buffer.alloc(32).toString('base64'),
    })).not.toThrow();
  });

  it('normalizes the configured owner email and JWT email for comparison', () => {
    expect(normalizeEmail('  Owner@Example.COM ')).toBe('owner@example.com');
    expect(getOwnerEmail({ OWNER_EMAIL: '  Owner@Example.COM ' })).toBe('owner@example.com');
    expect(getOwnerEmail({ OWNER_EMAIL: 'not-an-email' })).toBeUndefined();
  });

  it('keeps a local-only JWT value out of production', () => {
    expect(getJwtSecret({ APP_ENV: 'development' })).toBe('local-development-only-jwt-secret');
    expect(() => getJwtSecret({ APP_ENV: 'production' })).toThrow(/JWT_SECRET/);
  });

  it('uses only configured CORS origins and a canonical production default', () => {
    expect(getAllowedCorsOrigins({ WEB_ORIGINS: 'https://argyros.in, https://admin.argyros.in' })).toEqual([
      'https://argyros.in',
      'https://admin.argyros.in',
    ]);
    expect(getAllowedCorsOrigins({ APP_ENV: 'production' })).toEqual(['https://argyros-yw1l.vercel.app']);
  });
});
