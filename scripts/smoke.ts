import http from 'http';
import https from 'https';

const baseUrl = process.argv[2] || 'http://localhost:3000';

const ROUTES_TO_TEST = [
  '/',
  '/shop',
  '/collections',
  '/bespoke',
  '/gifts',
  '/support',
  '/size-guide',
  '/track',
  '/bag',
  '/checkout',
  '/privacy',
  '/terms',
  '/shipping-policy',
  '/returns',
  '/contact-and-grievance',
  '/robots.txt',
  '/sitemap.xml',
  '/api/version',
];

async function fetchRoute(route: string): Promise<{ status: number; ok: boolean; contentType: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(route, baseUrl);
    const client = url.protocol === 'https:' ? https : http;

    const req = client.get(url, { headers: { 'User-Agent': 'Argyros-Smoke-Test/2.0' } }, (res) => {
      resolve({
        status: res.statusCode || 0,
        ok: (res.statusCode || 0) >= 200 && (res.statusCode || 0) < 400,
        contentType: res.headers['content-type'] || '',
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${route}`));
    });
  });
}

async function runSmoke() {
  console.log(`\n💨 Running Argyros Storefront Smoke Tests against ${baseUrl}...\n`);
  let passed = 0;
  let failed = 0;

  for (const r of ROUTES_TO_TEST) {
    try {
      const res = await fetchRoute(r);
      if (res.ok) {
        console.log(`\x1b[32m[200 OK]\x1b[0m ${r} (${res.contentType})`);
        passed++;
      } else {
        console.error(`\x1b[31m[FAIL ${res.status}]\x1b[0m ${r}`);
        failed++;
      }
    } catch (err: any) {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${r}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n───────────────────────────────────────────────────`);
  console.log(`Results: ${passed}/${ROUTES_TO_TEST.length} routes reachable | ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runSmoke();
