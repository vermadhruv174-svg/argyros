const fs = require('fs');
const path = require('path');
const { siteConfig } = require(path.join(__dirname, '../packages/config/src/site.ts'));

const isLaunch = process.env.LAUNCH_MODE === 'true';

let hasErrors = false;
let warningCount = 0;

function report(type: 'ERROR' | 'WARNING', message: string) {
  if (type === 'ERROR') {
    hasErrors = true;
    console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
  } else {
    warningCount++;
    console.warn(`\x1b[33m[WARNING]\x1b[0m ${message}`);
  }
}

console.log(`\n🔍 Running Argyros Launch Quality Gate (LAUNCH_MODE=${isLaunch ? 'true' : 'false'})...\n`);

// 1. Check central siteConfig for placeholder values /^\[.*\]$/ or empty required legal fields
const placeholderRegex = /^\[.*\]$/;

function checkConfigValues(obj: Record<string, any>, prefix = '') {
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'string') {
      if (placeholderRegex.test(val)) {
        if (isLaunch) {
          report('ERROR', `Unfilled placeholder in siteConfig: ${fullKey} = "${val}"`);
        } else {
          report('WARNING', `Unfilled placeholder in siteConfig: ${fullKey} = "${val}" (Must be filled before production launch)`);
        }
      }
    } else if (typeof val === 'object' && val !== null) {
      checkConfigValues(val, fullKey);
    }
  }
}

checkConfigValues(siteConfig);

// 2. Scan apps/** and packages/database/prisma/seed.ts for banned strings
const BANNED_STRINGS = [
  'jaipur',
  'unsplash',
  '9876543210',
  'zero dead stock',
  'whatsapp coming soon',
  'heavy 2.5',
];

if (!siteConfig.claims.hallmark.enabled) {
  BANNED_STRINGS.push('huid', 'bis');
}

const rootDir = path.resolve(__dirname, '..');
const scanDirs = [
  path.join(rootDir, 'apps', 'web', 'app'),
  path.join(rootDir, 'apps', 'web', 'components'),
  path.join(rootDir, 'apps', 'web', 'lib'),
  path.join(rootDir, 'packages', 'database', 'prisma', 'seed.ts'),
];

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md']);

function scanFileForBannedWords(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lower = content.toLowerCase();

  for (const word of BANNED_STRINGS) {
    if (lower.includes(word)) {
      // Allow if it's the launch-check script itself or config check
      if (filePath.includes('launch-check.ts')) continue;
      // Allow "hallmark" only as code variable or property (e.g. claims.hallmark.enabled)
      if (word === 'bis' && !siteConfig.claims.hallmark.enabled) {
        // Find line
        const lines = content.split('\n');
        lines.forEach((line: string, idx: number) => {
          if (/\bbis\b/i.test(line)) {
            report('ERROR', `Banned word "${word}" found at ${path.relative(rootDir, filePath)}:${idx + 1}: ${line.trim()}`);
          }
        });
      } else {
        const lines = content.split('\n');
        lines.forEach((line: string, idx: number) => {
          if (line.toLowerCase().includes(word)) {
            report('ERROR', `Banned word "${word}" found at ${path.relative(rootDir, filePath)}:${idx + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

function walkDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    scanFileForBannedWords(dir);
    return;
  }
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const s = fs.statSync(fullPath);
    if (s.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist') {
        walkDir(fullPath);
      }
    } else if (EXTENSIONS.has(path.extname(file))) {
      scanFileForBannedWords(fullPath);
    }
  }
}

for (const target of scanDirs) {
  walkDir(target);
}

// 3. Check ring-size verification flag
report('WARNING', 'Ring-size table is marked unverified: Verify with a physical ring gauge before production launch.');

// Final summary
console.log(`\n───────────────────────────────────────────────────`);
if (hasErrors) {
  console.error(`❌ Launch check FAILED with errors.`);
  if (isLaunch) {
    process.exit(1);
  }
} else {
  console.log(`✅ Launch check PASSED in review mode (${warningCount} warnings to confirm before production).`);
}
