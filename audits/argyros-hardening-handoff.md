# Argyros 925 — Production Hardening Handoff

**Status:** Hardening implementation complete locally; deployment and provider verification still required.  
**Repository:** `D:\AEOS\argyros`  
**Branch:** `main`  
**Working tree:** local changes present; not committed or pushed by this handoff.

## Implemented

### Commerce and privacy

- Removed browser mock checkout and mock Razorpay order handlers.
- Removed localStorage order creation and local “PAID” order fallback.
- Payment, provider-script, network, cancellation, and signature failures no longer trigger the success ceremony.
- Razorpay order creation now requires a server-issued order access token.
- Razorpay verification validates signature, provider order/payment association, amount, currency, capture state, and replay state.
- Stripe payment intent/webhook paths fail closed when provider configuration is absent and validate order/payment association.
- Direct order lookup requires a short-lived server-issued HMAC access token before order PII is returned.
- Browser code no longer knows the order-token signing secret.

### Environment, routing, and SEO

- Production startup fails when required JWT, order-signing, Stripe, or Razorpay secrets are missing or placeholders.
- Production startup requires a valid `OWNER_EMAIL`.
- CORS uses an explicit configured allowlist instead of reflecting arbitrary origins with credentials.
- Production API URL and canonical site URL are validated during web builds.
- Sitemap and robots output use `https://argyros.in` consistently.
- Staging/preview robots disallow indexing.
- Browser API requests use `NEXT_PUBLIC_API_URL` when configured, allowing Vercel to call the deployed API instead of assuming localhost.
- Account, tracking, gifting, wishlist, contact, newsletter, and concierge requests were aligned with the deployed API base URL.

### Owner Space

- `/admin` API routes now require JWT authentication plus the server-side `OWNER_EMAIL` allowlist and `ADMIN` role; the JWT strategy refreshes those claims from the current user row.
- Authenticated staff/customer accounts receive `403` and cannot grant themselves owner access from the browser.
- Existing `StaffGuard` behavior remains available for non-Owner-Space routes.
- Owner-only TOTP enrollment and MFA-pending login tickets use Node built-in crypto; the enrolled secret is stored as an AES-GCM envelope.
- `MFA_ENFORCEMENT=true` requires an `mfa: true` JWT claim for Owner Space and fails closed in production without `MFA_ENCRYPTION_KEY`.
- Sensitive Owner Space mutations write append-only `AuditEvent` records with an actor ID, action, resource, request ID, and safe metadata.
- Owner writes require `RecentOwnerAuthGuard` proof from a password/MFA-authenticated JWT issued within 10 minutes. TOTP enrollment/verification is the current provider-free MFA foundation; passkeys remain a future upgrade for phishing-resistant authentication and recovery/device revocation, pending the identity-provider and browser/device recovery decision.
- Owner login now renders the MFA challenge returned by the API, and Owner Space includes a Security & Devices page for TOTP enrollment and active-session revocation.
- Refresh tokens are hashed, rotated, replay-detected, and associated with bounded device/session metadata.
- `docs/production-operations-runbook.md` documents backup/restore drills, payment incidents, compromised sessions, deployment rollback, and monthly owner checks.
- Owner Space now uses a responsive iPhone navigation drawer with focus trapping, Escape-to-close, focus return, body-scroll locking, and viewport overflow protection.
- `npm run verify:deployment` provides a read-only deployment metadata and public endpoint verifier; CI runs its safe `--local` mode.

### Launch verification

- Launch checks for image fallback, ring-size measurements, bespoke security patterns, and order privacy are now executable structural checks rather than unconditional pass statements.
- Playwright coverage exercises real storefront clicks, checkout failure boundaries, order-token privacy, mobile navigation, keyboard focus, admin denial, robots/sitemap boundaries, and an axe accessibility scan.
- The homepage axe check passes for critical/serious violations after accessible gold and button contrast corrections.

## Verification performed

Commands run locally:

```text
npm test --workspace=apps/api -- --runInBand
PASS — 8 suites, 55 tests

npm run typecheck
PASS — API, web, and UI workspaces

npm run build --workspace=apps/api
PASS

APP_ENV=staging npm run build --workspace=apps/web
PASS — 36 routes generated

APP_ENV=production NODE_ENV=production NEXT_PUBLIC_API_URL=https://api.argyros.in/api NEXT_PUBLIC_SITE_URL=https://argyros.in ORDER_TOKEN_SECRET=<ephemeral-test-value> npm run build --workspace=apps/web
PASS — production configuration gate exercised with non-production test values

APP_ENV=staging LAUNCH_MODE=true npm run check:launch
PASS — 6/6 gates

npm test --workspace=apps/api -- --runInBand
PASS — 14 suites, 79 tests

npm run test:e2e --workspace=apps/web
PASS — 14 passed, 1 production-only assertion skipped

npm run test:e2e --workspace=apps/web -- --grep axe
PASS — homepage has no critical/serious axe violations

npx prisma validate --schema=packages/database/prisma/schema.prisma
PASS

npm run verify:deployment -- --local
PASS — 2 checks, 1 network probe skipped; no network requests made

git diff --check
PASS
```

The staging web build still logs expected API-unavailable fallback warnings when no local API is running. This is a build-environment limitation, not proof of deployed API health.

## Required deployment configuration

Set these in the correct hosting dashboards. Do not commit values:

### API

- `APP_ENV=production`
- `NODE_ENV=production`
- `DATABASE_URL`
- `WEB_ORIGIN=https://argyros.in`
- `WEB_ORIGINS=https://argyros.in`
- `JWT_SECRET`
- `ORDER_TOKEN_SECRET`
- `OWNER_EMAIL` — the exact owner email, normalized by the server; the matching database user must have role `ADMIN`
- `MFA_ENFORCEMENT` — set `true` after TOTP enrollment to require MFA for Owner Space
- `MFA_ENCRYPTION_KEY` — a random 32-byte base64 or 64-character hex key; required when MFA enforcement is enabled
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Web

- `APP_ENV=production`
- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://argyros.in`
- `NEXT_PUBLIC_API_URL=https://api.argyros.in/api`
- `ORDER_TOKEN_SECRET` — only if the web build/runtime still requires the validation gate; the browser must never receive it as a public variable

Before enabling live payments, confirm that the API and web environment values are configured in the same deployment that serves traffic. Use test credentials first.

## Still required before production launch

1. Set the exact owner email in the API hosting environment. The repository example intentionally contains `owner@example.com` and is not a real production value.
2. Deploy this local hardening change and verify the deployed commit SHA.
3. Run Razorpay test-mode checkout with success, cancellation, failure, retry, and duplicate callback cases.
4. Confirm API order lookup without a token returns `401`/`403` and never returns PII.
5. Confirm the deployed sitemap contains public URLs and the deployed robots file references `https://argyros.in/sitemap.xml`.
6. Confirm Vercel can reach the deployed API through `NEXT_PUBLIC_API_URL`.
7. Configure and test payment webhook signing secrets.
8. Run the browser suite against the actual staging deployment, not only the local fallback server.
9. Complete an actual PostgreSQL and private-object-storage restore drill using `docs/production-operations-runbook.md`.
10. Perform iPhone VoiceOver and physical-device Owner Space verification.
11. Run a Razorpay test-mode transaction and signed webhook replay test.
12. Resolve the production CI/local-package strategy if GitHub runners cannot access sibling `aeos-core`/`aeos-sdk` packages.

## External verification performed on 18 October 2026

The live endpoints were checked without credentials:

- `https://argyros-yw1l.vercel.app/api/version` returned `appEnv: production` but the deployed commit was `be86dee2...`, not this local hardening work.
- `https://argyros-yw1l.vercel.app/robots.txt` allows public crawling but advertises `https://argyros.in/sitemap.xml`.
- `https://argyros-yw1l.vercel.app/sitemap.xml` returned an empty URL set.
- `https://argyros.in/robots.txt` returned `Disallow: /`.
- `https://argyros.in/sitemap.xml` returned a Hostinger parked-domain page, not an XML sitemap.
- `https://api.argyros.in/api/health` could not be reached.

This proves the remaining work is an external deployment/DNS cutover blocker, not a local code blocker. Do not activate live payments or public canonical indexing until the hardened commit is deployed, `argyros.in` resolves to the intended web project, and `api.argyros.in` resolves to the intended API service.

## Release decision

**Local code:** materially safer, owner-security foundations implemented, and verified by repository/browser checks.  
**Live production:** not verified until the hardened commit is deployed and provider/domain tests above pass.  
**Live payments:** do not activate until provider test-mode verification passes.
