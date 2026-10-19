/**
 * Read-only deployment and environment verification.
 *
 * This script intentionally reads only public deployment metadata. It does not
 * load dotenv files, enumerate process.env, or inspect any credentials/secrets.
 */

type EnvironmentMode = 'local' | 'staging' | 'production';
type SafeEnvironment = Readonly<Record<string, string | undefined>>;

const CANONICAL_WEB_ORIGIN = 'https://argyros-yw1l.vercel.app';
const CANONICAL_API_BASE_URL = 'https://api.argyros.in/api';
const PUBLIC_DEPLOYMENT_VARIABLES = [
  'APP_ENV',
  'NODE_ENV',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_API_URL',
  'WEB_ORIGIN',
  'WEB_ORIGINS',
] as const;
const PLACEHOLDER_PATTERN = /(?:change[_ -]?this|placeholder|your[_ -]?|replace[_ -]?me|example(?:\.invalid|\.com)?|<[^>]+>|\[\s*[^\]]+\s*\]|todo)/i;
const REQUEST_TIMEOUT_MS = 10_000;

interface Reporter {
  pass(label: string): void;
  skip(label: string, detail: string): void;
  fail(label: string, detail: string): void;
}

interface VerificationSummary {
  failures: number;
  passes: number;
  skips: number;
}

interface ParsedUrl {
  url: URL;
  origin: string;
}

const reporter: Reporter = {
  pass(label) {
    console.log(`[PASS] ${label}`);
  },
  skip(label, detail) {
    console.log(`[SKIP] ${label}: ${detail}`);
  },
  fail(label, detail) {
    console.error(`[FAIL] ${label}: ${detail}`);
  },
};

function readEnv(env: SafeEnvironment, name: string): string {
  return env[name]?.trim() ?? '';
}

function hasPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERN.test(value);
}

function isHttpsRequired(mode: EnvironmentMode): boolean {
  return mode === 'staging' || mode === 'production';
}

function parseMode(args: readonly string[], env: SafeEnvironment): EnvironmentMode | undefined {
  const modeArgument = args.find((argument) => argument.startsWith('--mode='));
  const requestedMode = modeArgument?.slice('--mode='.length).trim().toLowerCase();
  const normalizedRequestedMode = requestedMode === 'preview' ? 'staging' : requestedMode;

  if (args.includes('--local')) return 'local';
  if (normalizedRequestedMode === 'local' || normalizedRequestedMode === 'staging' || normalizedRequestedMode === 'production') {
    return normalizedRequestedMode;
  }
  if (modeArgument) return undefined;

  const configuredAppEnvironment = readEnv(env, 'APP_ENV').toLowerCase();
  if (configuredAppEnvironment === 'production') return 'production';
  if (configuredAppEnvironment === 'staging' || configuredAppEnvironment === 'preview') return 'staging';
  if (configuredAppEnvironment === 'development' || configuredAppEnvironment === 'test') return 'local';

  // A bare shell has no deployment context. Fail closed and require the caller
  // to opt into --local rather than silently treating a deployment as local.
  return undefined;
}

function parsePublicUrl(
  name: string,
  value: string,
  mode: EnvironmentMode,
  allowApiPath: boolean,
  report: Reporter,
): ParsedUrl | undefined {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    report.fail(name, 'must be a valid public HTTP(S) URL');
    return undefined;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    report.fail(name, 'must use HTTP(S)');
    return undefined;
  }
  if (isHttpsRequired(mode) && parsed.protocol !== 'https:') {
    report.fail(name, 'must use HTTPS outside local mode');
    return undefined;
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    report.fail(name, 'must not contain credentials, query parameters, or fragments');
    return undefined;
  }

  const normalizedPath = parsed.pathname.replace(/\/+$/, '') || '/';
  if (allowApiPath) {
    if (normalizedPath !== '/api') {
      report.fail(name, 'must point to an API base ending in /api');
      return undefined;
    }
  } else if (normalizedPath !== '/') {
    report.fail(name, 'must be an origin without a path');
    return undefined;
  }

  return { url: parsed, origin: parsed.origin };
}

function requireValue(name: string, env: SafeEnvironment, mode: EnvironmentMode, report: Reporter): string | undefined {
  const value = readEnv(env, name);
  if (mode === 'local' && !value) return undefined;
  if (!value) {
    report.fail(name, 'is missing');
    return undefined;
  }
  if (hasPlaceholder(value)) {
    report.fail(name, 'is a placeholder');
    return undefined;
  }
  return value;
}

function validateEnvironmentVariables(
  env: SafeEnvironment,
  mode: EnvironmentMode,
  report: Reporter,
): { baseUrl?: URL; apiBaseUrl?: URL } {
  requireValue('APP_ENV', env, mode, report);
  requireValue('NODE_ENV', env, mode, report);

  const appEnvironment = readEnv(env, 'APP_ENV').toLowerCase();
  if (appEnvironment) {
    const validAppEnvironments = mode === 'production'
      ? ['production']
      : mode === 'staging'
        ? ['staging', 'preview']
        : ['development', 'test', 'staging', 'preview', 'production'];
    if (!validAppEnvironments.includes(appEnvironment)) {
      report.fail('APP_ENV', 'has an unsupported environment name');
    }
  }

  const nodeEnvironment = readEnv(env, 'NODE_ENV').toLowerCase();
  if (nodeEnvironment) {
    const validNodeEnvironments = ['production', 'development', 'test'];
    if (!validNodeEnvironments.includes(nodeEnvironment)) {
      report.fail('NODE_ENV', 'has an unsupported environment name');
    } else if (mode !== 'local' && nodeEnvironment !== 'production') {
      report.fail('NODE_ENV', 'must be production for a deployed environment');
    }
  }

  const siteUrlValue = requireValue('NEXT_PUBLIC_SITE_URL', env, mode, report);
  const apiUrlValue = requireValue('NEXT_PUBLIC_API_URL', env, mode, report);
  const webOriginValue = requireValue('WEB_ORIGIN', env, mode, report);
  const webOriginsValue = requireValue('WEB_ORIGINS', env, mode, report);

  const siteUrl = siteUrlValue
    ? parsePublicUrl('NEXT_PUBLIC_SITE_URL', siteUrlValue, mode, false, report)
    : undefined;
  const apiUrl = apiUrlValue
    ? parsePublicUrl('NEXT_PUBLIC_API_URL', apiUrlValue, mode, true, report)
    : undefined;
  const webOrigin = webOriginValue
    ? parsePublicUrl('WEB_ORIGIN', webOriginValue, mode, false, report)
    : undefined;

  const webOrigins = webOriginsValue
    ? webOriginsValue.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];
  if (webOriginsValue && webOrigins.length === 0) {
    report.fail('WEB_ORIGINS', 'must contain at least one web origin');
  }
  const parsedWebOrigins = webOrigins.map((origin, index) =>
    parsePublicUrl(`WEB_ORIGINS entry ${index + 1}`, origin, mode, false, report),
  ).filter((parsed): parsed is ParsedUrl => Boolean(parsed));

  if (siteUrl && webOrigin && siteUrl.origin !== webOrigin.origin) {
    report.fail('WEB_ORIGIN', 'must match NEXT_PUBLIC_SITE_URL');
  }
  if (webOrigin && parsedWebOrigins.length > 0 && !parsedWebOrigins.some((origin) => origin.origin === webOrigin.origin)) {
    report.fail('WEB_ORIGINS', 'must include WEB_ORIGIN');
  }

  if (mode === 'production') {
    if (siteUrl && siteUrl.origin !== CANONICAL_WEB_ORIGIN) {
      report.fail('NEXT_PUBLIC_SITE_URL', 'must use the canonical web origin');
    }
    if (webOrigin && webOrigin.origin !== CANONICAL_WEB_ORIGIN) {
      report.fail('WEB_ORIGIN', 'must use the canonical web origin');
    }
    if (webOriginsValue && (parsedWebOrigins.length !== 1 || parsedWebOrigins[0]?.origin !== CANONICAL_WEB_ORIGIN)) {
      report.fail('WEB_ORIGINS', 'must contain only the canonical web origin');
    }
    if (apiUrl && `${apiUrl.origin}${apiUrl.url.pathname.replace(/\/+$/, '')}` !== CANONICAL_API_BASE_URL) {
      report.fail('NEXT_PUBLIC_API_URL', 'must use the canonical API base URL');
    }
  }

  const baseUrlValue = readEnv(env, 'BASE_URL');
  const apiBaseUrlValue = readEnv(env, 'API_BASE_URL');
  let baseUrl: URL | undefined;
  let apiBaseUrl: URL | undefined;

  if (baseUrlValue) {
    if (hasPlaceholder(baseUrlValue)) {
      report.fail('BASE_URL', 'is a placeholder');
    } else {
      baseUrl = parsePublicUrl('BASE_URL', baseUrlValue, mode, false, report)?.url;
      if (mode === 'production' && baseUrl && baseUrl.origin !== CANONICAL_WEB_ORIGIN) {
        report.fail('BASE_URL', 'must use the canonical web origin');
      }
    }
  }
  if (apiBaseUrlValue) {
    if (hasPlaceholder(apiBaseUrlValue)) {
      report.fail('API_BASE_URL', 'is a placeholder');
    } else {
      apiBaseUrl = parsePublicUrl('API_BASE_URL', apiBaseUrlValue, mode, true, report)?.url;
      if (mode === 'production' && apiBaseUrl && `${apiBaseUrl.origin}${apiBaseUrl.pathname.replace(/\/+$/, '')}` !== CANONICAL_API_BASE_URL) {
        report.fail('API_BASE_URL', 'must use the canonical API base URL');
      }
    }
  }

  return { baseUrl, apiBaseUrl };
}

function joinUrl(base: URL, path: string): URL {
  return new URL(path.replace(/^\//, ''), `${base.toString().replace(/\/+$/, '')}/`);
}

async function fetchWithTimeout(url: URL): Promise<Response> {
  const fetchFunction = globalThis.fetch;
  if (typeof fetchFunction !== 'function') throw new Error('fetch unavailable');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetchFunction(url, {
      method: 'GET',
      redirect: 'error',
      signal: controller.signal,
      headers: {
        Accept: 'text/plain, application/xml, application/json',
        'User-Agent': 'Argyros-Deployment-Verify/1.0',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkRobots(baseUrl: URL, mode: EnvironmentMode, report: Reporter): Promise<void> {
  const label = 'BASE_URL /robots.txt';
  let response: Response;
  try {
    response = await fetchWithTimeout(joinUrl(baseUrl, '/robots.txt'));
  } catch {
    report.fail(label, 'read-only request failed');
    return;
  }
  if (!response.ok) {
    report.fail(label, 'returned a non-success HTTP status');
    return;
  }

  let body: string;
  try {
    body = await response.text();
  } catch {
    report.fail(label, 'response body could not be read');
    return;
  }

  if (mode === 'production') {
    const hasCanonicalSitemap = /(^|\n)\s*sitemap:\s*https:\/\/argyros\.in\/sitemap\.xml\s*(\n|$)/i.test(body);
    const allowsRoot = /^\s*allow:\s*\/\s*$/im.test(body);
    const blocksWholeSite = /^\s*disallow:\s*\/\s*$/im.test(body);
    if (!hasCanonicalSitemap || !allowsRoot || blocksWholeSite) {
      report.fail(label, 'does not match the production indexing policy');
      return;
    }
  } else {
    const blocksWholeSite = /^\s*disallow:\s*\/\s*$/im.test(body);
    const hasSitemap = /^\s*sitemap:/im.test(body);
    const hasNoIndexHeader = /noindex/i.test(response.headers.get('x-robots-tag') ?? '');
    if (!blocksWholeSite || hasSitemap || !hasNoIndexHeader) {
      report.fail(label, 'does not match the non-production indexing policy');
      return;
    }
  }

  report.pass(label);
}

async function checkSitemap(baseUrl: URL, mode: EnvironmentMode, report: Reporter): Promise<void> {
  const label = 'BASE_URL /sitemap.xml';
  let response: Response;
  try {
    response = await fetchWithTimeout(joinUrl(baseUrl, '/sitemap.xml'));
  } catch {
    report.fail(label, 'read-only request failed');
    return;
  }
  if (!response.ok) {
    report.fail(label, 'returned a non-success HTTP status');
    return;
  }

  let body: string;
  try {
    body = await response.text();
  } catch {
    report.fail(label, 'response body could not be read');
    return;
  }

  const hasUrlSet = /<urlset\b/i.test(body);
  const validForProduction = hasUrlSet && /https:\/\/argyros\.in\//i.test(body);
  const validForNonProduction = hasUrlSet && !/<url\b/i.test(body);
  if ((mode === 'production' && !validForProduction) || (mode !== 'production' && !validForNonProduction)) {
    report.fail(label, 'does not match the expected sitemap policy');
    return;
  }

  report.pass(label);
}

async function checkApiHealth(apiBaseUrl: URL, report: Reporter): Promise<void> {
  const label = 'API_BASE_URL /health';
  let response: Response;
  try {
    response = await fetchWithTimeout(joinUrl(apiBaseUrl, '/health'));
  } catch {
    report.fail(label, 'read-only request failed');
    return;
  }
  if (!response.ok) {
    report.fail(label, 'returned a non-success HTTP status');
    return;
  }

  let body: unknown;
  try {
    body = JSON.parse(await response.text());
  } catch {
    report.fail(label, 'did not return a JSON health response');
    return;
  }
  if (typeof body !== 'object' || body === null || (body as { status?: unknown }).status !== 'ok') {
    report.fail(label, 'did not report an ok health status');
    return;
  }

  report.pass(label);
}

async function verifyDeployment(
  env: SafeEnvironment = process.env,
  args: readonly string[] = process.argv.slice(2),
  output: Reporter = reporter,
): Promise<VerificationSummary> {
  const summary: VerificationSummary = { failures: 0, passes: 0, skips: 0 };
  const countingReporter: Reporter = {
    pass(label) {
      summary.passes += 1;
      output.pass(label);
    },
    skip(label, detail) {
      summary.skips += 1;
      output.skip(label, detail);
    },
    fail(label, detail) {
      summary.failures += 1;
      output.fail(label, detail);
    },
  };

  const mode = parseMode(args, env);
  if (!mode) {
    countingReporter.fail('APP_ENV', 'is missing or unsupported; use --local for a no-network check');
    return summary;
  }

  countingReporter.pass(`environment mode: ${mode}`);
  const failuresBeforeEnvironmentValidation = summary.failures;
  const targets = validateEnvironmentVariables(env, mode, countingReporter);
  if (summary.failures === failuresBeforeEnvironmentValidation) {
    countingReporter.pass('public deployment variables and origin shapes');
  }

  if (mode === 'local') {
    countingReporter.skip('remote endpoint probes', 'local mode never makes network requests');
  } else {
    if (targets.baseUrl) {
      await checkRobots(targets.baseUrl, mode, countingReporter);
      await checkSitemap(targets.baseUrl, mode, countingReporter);
    } else {
      countingReporter.skip('BASE_URL robots/sitemap probes', 'BASE_URL was not provided');
    }
    if (targets.apiBaseUrl) {
      await checkApiHealth(targets.apiBaseUrl, countingReporter);
    } else {
      countingReporter.skip('API_BASE_URL health probe', 'API_BASE_URL was not provided');
    }
  }

  return summary;
}

if (require.main === module) {
  void verifyDeployment().then((summary) => {
    console.log(`\nDeployment verification: ${summary.passes} passed, ${summary.skips} skipped, ${summary.failures} failed.`);
    if (summary.failures > 0) process.exitCode = 1;
  }).catch(() => {
    // Do not print an exception: it could contain a URL or other input that
    // was not intended for logs. The checks above already report actionable
    // failures without echoing values.
    console.error('[FAIL] deployment verification: unexpected verifier error');
    process.exitCode = 1;
  });
}

export {
  CANONICAL_API_BASE_URL,
  CANONICAL_WEB_ORIGIN,
  PUBLIC_DEPLOYMENT_VARIABLES,
  verifyDeployment,
};
