export const CANONICAL_SITE_URL = 'https://argyros-yw1l.vercel.app';

type RuntimeEnv = Record<string, string | undefined>;

const PRODUCTION_SECRET_NAMES = [
  'JWT_SECRET',
  'ORDER_TOKEN_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
] as const;

type ProductionSecretName = (typeof PRODUCTION_SECRET_NAMES)[number];

const PLACEHOLDER_SECRET_PATTERN = /(?:change[_ -]?this|placeholder|your[_ -]?|replace[_ -]?me|example(?:\.com)?|(?:dev|development)[-_ ]+(?:only[-_ ]+)?(?:jwt[-_ ]+)?secret)/i;
const KNOWN_PLACEHOLDER_SECRETS = new Set([
  'argyros-dev-secret-change-in-prod',
  'argyros-order-privacy-salt-2026',
  'local-development-only-jwt-secret',
]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AppEnvironment = 'production' | 'staging' | 'development';

export function getAppEnvironment(env: RuntimeEnv = process.env): AppEnvironment {
  const configured = env.APP_ENV?.trim().toLowerCase();
  if (configured === 'production') return 'production';
  if (configured === 'staging' || configured === 'preview') return 'staging';
  if (configured === 'development' || configured === 'test') return 'development';
  const nodeEnvironment = env.NODE_ENV?.trim().toLowerCase();
  if (nodeEnvironment === 'production' || env.VERCEL_ENV?.trim().toLowerCase() === 'production') {
    return 'production';
  }
  return nodeEnvironment === 'development' || nodeEnvironment === 'test' ? 'development' : 'staging';
}

function isProductionEnvironment(env: RuntimeEnv = process.env): boolean {
  return getAppEnvironment(env) === 'production';
}

function isPlaceholderSecret(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return KNOWN_PLACEHOLDER_SECRETS.has(normalized) || PLACEHOLDER_SECRET_PATTERN.test(value.trim());
}

export function normalizeEmail(email: string | undefined): string {
  return email?.trim().toLowerCase() ?? '';
}

export function getOwnerEmail(env: RuntimeEnv = process.env): string | undefined {
  const value = normalizeEmail(env.OWNER_EMAIL);
  return value && EMAIL_PATTERN.test(value) ? value : undefined;
}

/**
 * MFA is opt-in at the deployment boundary. Supporting both spellings keeps
 * the setting easy to discover while there is one canonical example in .env.
 */
export function isMfaEnforcementEnabled(env: RuntimeEnv = process.env): boolean {
  const value = (env.MFA_ENFORCEMENT ?? env.MFA_ENFORCED)?.trim().toLowerCase();
  return value === '1' || value === 'true' || value === 'yes' || value === 'required' || value === 'enforced';
}

/**
 * MFA_ENCRYPTION_KEY is a 32-byte AES-256 key, represented as either 64 hex
 * characters or base64. Invalid values are treated as absent so callers can
 * fail closed without ever echoing key material.
 */
export function getMfaEncryptionKey(env: RuntimeEnv = process.env): Buffer | undefined {
  const value = env.MFA_ENCRYPTION_KEY?.trim();
  if (!value) return undefined;

  if (/^[0-9a-f]{64}$/i.test(value)) return Buffer.from(value, 'hex');

  try {
    const decoded = Buffer.from(value, 'base64');
    return decoded.length === 32 ? decoded : undefined;
  } catch {
    return undefined;
  }
}

export function assertProductionSecrets(
  env: RuntimeEnv = process.env,
  requiredNames: readonly ProductionSecretName[] = PRODUCTION_SECRET_NAMES,
): void {
  if (!isProductionEnvironment(env)) return;

  const invalid = requiredNames.filter((name) => {
    const value = env[name]?.trim();
    return !value || isPlaceholderSecret(value);
  });

  if (invalid.length > 0) {
    throw new Error(
      `Production startup blocked: set non-placeholder values for ${invalid.join(', ')}.`,
    );
  }

  if (!getOwnerEmail(env)) {
    throw new Error('Production startup blocked: set a valid OWNER_EMAIL.');
  }

  if (isMfaEnforcementEnabled(env) && !getMfaEncryptionKey(env)) {
    throw new Error('Production startup blocked: set a valid MFA_ENCRYPTION_KEY when MFA enforcement is enabled.');
  }
}

export function getJwtSecret(env: RuntimeEnv = process.env): string {
  const value = env.JWT_SECRET?.trim();
  if (value && (!isProductionEnvironment(env) || !isPlaceholderSecret(value))) {
    return value;
  }

  if (isProductionEnvironment(env)) {
    throw new Error('Production startup blocked: JWT_SECRET is missing or a placeholder.');
  }

  return 'local-development-only-jwt-secret';
}

export function getAllowedCorsOrigins(env: RuntimeEnv = process.env): string[] {
  const configured = (env.WEB_ORIGINS ?? env.WEB_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configured.length > 0) return [...new Set(configured)];
  return isProductionEnvironment(env) ? [CANONICAL_SITE_URL] : ['http://localhost:3000'];
}
