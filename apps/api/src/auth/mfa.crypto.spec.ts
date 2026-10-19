import { createTotpCode, createTotpUri, decryptMfaSecret, encryptMfaSecret, verifyTotpCode } from './mfa.crypto';

describe('MFA crypto', () => {
  const key = Buffer.from('0123456789abcdef0123456789abcdef');
  const secret = 'JBSWY3DPEHPK3PXP';
  const now = 1_700_000_000_000;

  it('accepts the current TOTP step and one adjacent step, but not two steps away', () => {
    const current = createTotpCode(secret, now);
    const previous = createTotpCode(secret, now - 30_000);
    const tooOld = createTotpCode(secret, now - 60_000);

    expect(verifyTotpCode(secret, current, now)).toBe(true);
    expect(verifyTotpCode(secret, previous, now)).toBe(true);
    expect(verifyTotpCode(secret, tooOld, now)).toBe(false);
    expect(verifyTotpCode(secret, '12345', now)).toBe(false);
  });

  it('round trips an MFA secret through AES-GCM without storing plaintext', () => {
    const envelope = encryptMfaSecret(secret, key);
    expect(envelope).not.toContain(secret);
    expect(decryptMfaSecret(envelope, key)).toBe(secret);
    expect(() => decryptMfaSecret(envelope, Buffer.from('fedcba9876543210fedcba9876543210'))).toThrow();
  });

  it('builds a standards-compatible otpauth URI', () => {
    expect(createTotpUri(secret, 'owner@example.com')).toContain(
      'otpauth://totp/Argyros%3Aowner%40example.com?secret=JBSWY3DPEHPK3PXP',
    );
  });
});
