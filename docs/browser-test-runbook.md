# Browser test runbook

The web acceptance suite lives in `apps/web/e2e` and runs with Playwright. It
covers the public storefront and the unauthenticated boundary of the owner/admin
shell without creating real orders or opening a payment provider.

## First-time setup

From the repository root:

```bash
npm install
npx playwright install chromium
```

For a local web server, use development values (copy `.env.example` to `.env` if
needed):

```dotenv
APP_ENV=development
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

The tests use the Foundation catalogue and local cart fallback when the API is
not running. To exercise the normal API-backed development environment as well,
start the documented stack with `docker compose up -d`, run the database
migrations/seed, and then use `npm run dev`.

## Run the suite

`test:e2e` starts `apps/web` on port 3000 when no compatible server is already
running:

```bash
npm run test:e2e
```

Equivalent workspace command and useful focused commands:

```bash
npm run test:e2e --workspace=apps/web
npm run test:e2e --workspace=apps/web -- --grep "mobile navigation"
```

Set `BASE_URL` to point at an already running web deployment (the legacy
`E2E_BASE_URL` alias is also supported). When either is set Playwright does not
start a second server. Set `E2E_WEB_SERVER_COMMAND` when a different local
startup command is required.
Playwright reports traces, screenshots, and an HTML report for failures; the
report is written under `apps/web/playwright-report`.

The indexing boundary tests are environment-aware. A local staging-compatible
run (the default development server has the same non-production policy) is:

```bash
E2E_APP_ENV=staging E2E_EXPECTED_ENV=staging npm run test:e2e
```

For a running production deployment, point `BASE_URL` at that deployment and
select the production assertions:

```bash
BASE_URL=https://argyros.in E2E_EXPECTED_ENV=production npm run test:e2e
```

The production run requires the deployment to be healthy and is read-only. It
checks `/robots.txt` and `/sitemap.xml`; the staging run checks the inverse
no-index/empty-sitemap policy. Tests do not claim a WCAG conformance result:
the suite runs axe against the homepage and fails only for critical/serious
violations. Review the emitted axe report for lower-impact findings when
needed.

## Scope and credential boundaries

The suite uses synthetic `example.invalid` addresses and intercepted checkout and
tracking responses. It does not use customer records, real payment credentials,
Stripe/Razorpay sessions, webhooks, or a successful order. The payment-failure
case intercepts the app's verification response to prove the UI rejection path;
real provider checkout/verification, fulfilment callbacks, and authenticated
admin workflows require provider credentials and an authenticated test account
and are outside this local acceptance suite.

The production build also requires non-placeholder `ORDER_TOKEN_SECRET` (and the
other production secrets enforced by the app). Those secrets are not needed for
the development browser suite and must not be added to the repository.
