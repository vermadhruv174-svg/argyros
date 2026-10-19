const fs = require('fs');
const path = require('path');
const { siteConfig } = require(path.join(__dirname, '../packages/config/src/site.ts'));
const {
  assertProductionSecrets,
  getAppEnvironment,
} = require(path.join(__dirname, '../packages/config/src/runtime.ts'));

const isLaunch = process.env.LAUNCH_MODE === 'true';
const appEnvironment = getAppEnvironment(process.env);

let totalChecks = 0;
let passedChecks = 0;
let errorCount = 0;
let warningCount = 0;

function checkPass(label: string, detail?: string) {
  totalChecks++;
  passedChecks++;
  console.log(`\x1b[32m[PASS]\x1b[0m ${label}${detail ? ` (${detail})` : ''}`);
}

function checkFail(label: string, detail: string) {
  totalChecks++;
  errorCount++;
  console.error(`\x1b[31m[FAIL]\x1b[0m ${label}: ${detail}`);
}

function checkWarn(label: string, detail: string) {
  warningCount++;
  console.warn(`\x1b[33m[WARN]\x1b[0m ${label}: ${detail}`);
}

console.log(`\n=======================================================`);
console.log(`  ARGYROS STRICT LAUNCH GATE VERIFICATION`);
console.log(`  Environment: ${appEnvironment} | Launch Mode: ${isLaunch ? 'TRUE' : 'FALSE'}`);
console.log(`=======================================================\n`);

if (appEnvironment === 'production') {
  try {
    assertProductionSecrets(process.env);
    checkPass('Production Secret Configuration', 'All JWT, payment, and order signing secrets are set');
  } catch (error: any) {
    checkFail('Production Secret Configuration', error.message);
  }
}

// CHECK 1: Central siteConfig configuration integrity
const placeholderRegex = /^\[.*\]$/;
let placeholderFound = 0;

function scanObjectPlaceholders(obj: Record<string, any>, prefix = '') {
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') {
      if (placeholderRegex.test(v)) {
        placeholderFound++;
        if (isLaunch) {
          checkFail('SiteConfig Placeholder', `Unfilled ${full} = "${v}"`);
        } else {
          checkWarn('SiteConfig Placeholder', `Pending owner confirmation for ${full} = "${v}"`);
        }
      }
    } else if (typeof v === 'object' && v !== null) {
      scanObjectPlaceholders(v, full);
    }
  }
}

scanObjectPlaceholders(siteConfig);
if (placeholderFound === 0) {
  checkPass('Central Config Placeholders', 'All legal & business variables confirmed');
} else if (!isLaunch) {
  checkPass('Central Config Placeholders (Review Mode)', `${placeholderFound} placeholders gated as warnings`);
}

// CHECK 2: Banned Strings in Codebase & Templates
const BANNED_WORDS = [
  'jaipur',
  'unsplash',
  '9876543210',
  'zero dead stock',
  'whatsapp coming soon',
  'heavy 2.5',
];

if (!siteConfig.claims.hallmark.enabled) {
  BANNED_WORDS.push('bis', 'huid');
}

const rootDir = path.resolve(__dirname, '..');
const scanTargets = [
  path.join(rootDir, 'apps', 'web', 'app'),
  path.join(rootDir, 'apps', 'web', 'components'),
  path.join(rootDir, 'apps', 'web', 'lib'),
  path.join(rootDir, 'apps', 'api', 'src'),
  path.join(rootDir, 'packages', 'database', 'prisma', 'seed.ts'),
];

let bannedStringViolations = 0;
const allowedExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.mjs']);

function scanCodeFile(filePath: string) {
  // Allow scripts themselves and allowlists
  if (filePath.includes('launch-check.ts') || filePath.includes('db-audit.ts') || filePath.includes('hallmark-allowlist.txt')) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line: string, idx: number) => {
    for (const w of BANNED_WORDS) {
      const regex = new RegExp(`\\b${w}\\b`, 'i');
      if (regex.test(line)) {
        // Skip code symbols like claims.hallmark or order status
        if (w === 'bis' && /claims\.hallmark|allowlist/i.test(line)) return;
        bannedStringViolations++;
        checkFail('Banned String Found', `${path.relative(rootDir, filePath)}:${idx + 1} -> "${line.trim()}"`);
      }
    }
  });
}

function traverse(target: string) {
  if (!fs.existsSync(target)) return;
  const s = fs.statSync(target);
  if (s.isFile()) {
    scanCodeFile(target);
    return;
  }
  const entries = fs.readdirSync(target);
  for (const entry of entries) {
    if (['node_modules', '.next', 'dist', '.git'].includes(entry)) continue;
    const full = path.join(target, entry);
    const sub = fs.statSync(full);
    if (sub.isDirectory()) {
      traverse(full);
    } else if (allowedExts.has(path.extname(entry))) {
      scanCodeFile(full);
    }
  }
}

for (const dir of scanTargets) {
  traverse(dir);
}

if (bannedStringViolations === 0) {
  checkPass('Banned String Scan', 'Zero occurrences of Jaipur, Unsplash, BIS, or placeholder phones');
}

function readProjectFile(relativePath: string): string {
  const filePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf-8');
}

function checkStructuralImplementation(
  label: string,
  requirements: Array<{ file: string; pattern: RegExp; description: string }>,
) {
  const missing = requirements
    .filter(({ file, pattern }) => !pattern.test(readProjectFile(file)))
    .map(({ file, description }) => `${file} (${description})`);

  if (missing.length === 0) {
    checkPass(label, 'Required implementation is present');
  } else {
    checkFail(label, `Missing: ${missing.join('; ')}`);
  }
}

// CHECK 3: Image and Placeholder Policy
checkStructuralImplementation('Product Image Handling', [
  {
    file: 'apps/web/components/media/product-image.tsx',
    pattern: /if\s*\(src\)/,
    description: 'conditional image rendering',
  },
  {
    file: 'apps/web/components/media/product-image.tsx',
    pattern: /role="img"[\s\S]*?Photography in progress/,
    description: 'branded no-image fallback',
  },
  {
    file: 'apps/web/components/catalogue/product-gallery.tsx',
    pattern: /images\s*&&\s*images\.length\s*>\s*0[\s\S]*?fallback/,
    description: 'empty gallery fallback',
  },
]);

// CHECK 4: Ring Size Standard
const sizeGuideSource = readProjectFile('apps/web/components/catalogue/size-guide-modal.tsx');
const ringRows = Array.from(
  sizeGuideSource.matchAll(/\{\s*size:\s*'(IN \d+)',\s*diameter:\s*'([\d.]+) mm',\s*circ:\s*'([\d.]+) mm'/g),
).map((match: RegExpMatchArray) => ({
  size: match[1],
  diameter: Number(match[2]),
  circumference: Number(match[3]),
}));
const expectedRingSizes = Array.from({ length: 9 }, (_, index) => `IN ${index + 10}`);
const hasAllRingSizes = expectedRingSizes.every((size) => ringRows.some((row) => row.size === size));
const ringMeasurementsAreConsistent = ringRows.length === 9 && ringRows.every(
  (row) => row.diameter > 0 && row.circumference > 0 && Math.abs(row.circumference / Math.PI - row.diameter) < 0.2,
);
if (hasAllRingSizes && ringMeasurementsAreConsistent) {
  checkPass('Ring Sizing Scale', 'IN 10 through IN 18 include internally consistent mm measurements');
} else {
  checkFail('Ring Sizing Scale', 'Expected nine IN 10–18 rows with circumference/diameter measurements');
}

// CHECK 5: Bespoke Security Guard
checkStructuralImplementation('Bespoke Atelier Security', [
  {
    file: 'apps/api/src/bespoke/bespoke.service.ts',
    pattern: /endsWith\('\.svg'\)[\s\S]*?includes\('svg'\)[\s\S]*?BadRequestException/,
    description: 'server-side SVG rejection',
  },
  {
    file: 'apps/api/src/bespoke/bespoke.service.ts',
    pattern: /website_secondary[\s\S]*?timeToSubmitMs/,
    description: 'honeypot and submission-speed checks',
  },
  {
    file: 'apps/api/src/bespoke/bespoke.controller.ts',
    pattern: /@Throttle\(\{ short: \{ ttl: 3600000, limit: 5 \} \}\)/,
    description: 'five-per-hour submission throttle',
  },
]);

// CHECK 6: Order Privacy Protection
checkStructuralImplementation('Order Privacy Guard', [
  {
    file: 'apps/web/app/orders/[orderNumber]/page.tsx',
    pattern: /if\s*\(!token\)\s*\{[\s\S]*?redirect\(`\/track\?orderNumber=/,
    description: 'missing-token redirect before order fetch',
  },
  {
    file: 'apps/web/lib/api-client.ts',
    pattern: /fetchOrderByNumber[\s\S]*?x-order-access-token/,
    description: 'access token forwarded to the order API',
  },
  {
    file: 'apps/api/src/order/order.service.ts',
    pattern: /createHmac\('sha256', this\.orderTokenSecret\)[\s\S]*?verifyOrderAccessToken/,
    description: 'server-side HMAC token verification',
  },
  {
    file: 'apps/api/src/order/order.service.ts',
    pattern: /if\s*\(!accessToken\s*\|\|\s*!this\.verifyOrderAccessToken\(order, accessToken\)\)[\s\S]*?UnauthorizedException/,
    description: 'missing or invalid token rejection',
  },
  {
    file: 'apps/api/src/order/order.controller.ts',
    pattern: /x-order-access-token[\s\S]*?getOrderByNumber\(orderNumber, orderAccessToken \|\| bearerToken\)/,
    description: 'controller access-token enforcement path',
  },
]);

console.log(`\n=======================================================`);
console.log(`Gate Summary: ${passedChecks}/${totalChecks} passed | ${warningCount} warnings | ${errorCount} errors`);
console.log(`=======================================================\n`);

if (errorCount > 0) {
  console.error(`❌ Launch check FAILED with ${errorCount} blocking errors.\n`);
  process.exit(1);
} else {
  console.log(`✅ Launch check PASSED in ${isLaunch ? 'launch' : 'review'} mode.\n`);
}
