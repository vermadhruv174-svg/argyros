export const CANONICAL_SITE_URL = 'https://argyros-yw1l.vercel.app';

export type AppEnvironment = 'production' | 'staging' | 'development';

type RuntimeEnv = Record<string, string | undefined>;

const PRODUCTION_SECRET_NAMES = [
  'JWT_SECRET',
  'ORDER_TOKEN_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
] as const;

export type ProductionSecretName = (typeof PRODUCTION_SECRET_NAMES)[number];

const PLACEHOLDER_SECRET_PATTERN = /(?:change[_ -]?this|placeholder|your[_ -]?|replace[_ -]?me|example(?:\.com)?|(?:dev|development)[-_ ]+(?:only[-_ ]+)?(?:jwt[-_ ]+)?secret)/i;
const KNOWN_PLACEHOLDER_SECRETS = new Set([
  'argyros-dev-secret-change-in-prod',
  'argyros-order-privacy-salt-2026',
  'local-development-only-jwt-secret',
]);

export function getAppEnvironment(env: RuntimeEnv = process.env): AppEnvironment {
  const configured = env.APP_ENV?.trim().toLowerCase();

  if (configured === 'production') return 'production';
  if (configured === 'staging' || configured === 'preview') return 'staging';
  if (configured === 'development' || configured === 'test') return 'development';

  // Next.js sets NODE_ENV=production for builds and starts. Treat that as
  // production only when APP_ENV was not explicitly set to staging/preview.
  const deployment = env.VERCEL_ENV?.trim().toLowerCase();
  if (
    !configured &&
    (env.NODE_ENV?.trim().toLowerCase() === 'production' || deployment === 'production')
  ) {
    return 'production';
  }

  if (!configured && ['development', 'test'].includes(env.NODE_ENV?.trim().toLowerCase() ?? '')) {
    return 'development';
  }

  return 'staging';
}

export function isProductionEnvironment(env: RuntimeEnv = process.env): boolean {
  return getAppEnvironment(env) === 'production';
}

export function isPlaceholderSecret(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return KNOWN_PLACEHOLDER_SECRETS.has(normalized) || PLACEHOLDER_SECRET_PATTERN.test(value.trim());
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
