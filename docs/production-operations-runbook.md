# Argyros 925 — Production Operations & Recovery Runbook

This runbook is for the owner and the person operating the production Vercel/Railway/PostgreSQL deployment. It contains procedures, not secrets. Never paste credentials, database URLs, webhook secrets, customer data, or recovery codes into this file.

## 1. Release gate

Before every production deployment:

1. Confirm the commit SHA and review the diff.
2. Confirm `APP_ENV=production` and `NODE_ENV=production` in the deployment environment.
3. Confirm the canonical values:
   - Web: `NEXT_PUBLIC_SITE_URL=https://argyros.in`
   - API: `WEB_ORIGIN=https://argyros.in`
   - Web API: `NEXT_PUBLIC_API_URL=https://api.argyros.in/api`
4. Confirm `OWNER_EMAIL` is the actual owner email, not the example value.
5. Confirm `MFA_ENCRYPTION_KEY` exists before enabling `MFA_ENFORCEMENT=true`.
6. Run the repository checks:

```text
npm ci
npm run db:generate
npm run lint
npm run typecheck
npm test
APP_ENV=staging LAUNCH_MODE=true npm run check:launch
```

7. Run web E2E against staging:

```text
BASE_URL=https://<staging-host> E2E_EXPECTED_ENV=staging npm run test:e2e
```

8. Deploy the database migration before application code when the migration is backward-compatible. For destructive migrations, use a two-release expand/contract sequence.
9. Verify `/health`, `/robots.txt`, `/sitemap.xml`, `/api/version`, login, Owner Space denial, checkout creation, and provider test-mode payment before enabling live traffic.

## 1A. Hosting cutover checklist

### Railway API

1. Open the Railway project that owns the API service; do not create a second service.
2. Confirm the service root is the repository root and the Railway config points to `apps/api/Dockerfile`.
3. Set the API variables from the deployment configuration section below. Use Railway’s secret fields for every secret.
4. Run the Prisma migration as a release step against the production database:

```text
npm run db:migrate:deploy
```

5. Confirm Railway health check `/api/health` returns success from the deployed service.
6. Confirm the deployment commit SHA matches the reviewed commit before routing traffic.

### Vercel web

1. Open the existing Vercel project for the Argyros storefront.
2. Confirm the project root is the repository root and the framework is Next.js.
3. Set `NEXT_PUBLIC_SITE_URL=https://argyros.in` and `NEXT_PUBLIC_API_URL=https://api.argyros.in/api` for Production.
4. Set `APP_ENV=production`, `NODE_ENV=production`, and `ORDER_TOKEN_SECRET` only in the Vercel environment settings; never expose the signing secret with a `NEXT_PUBLIC_` prefix.
5. Deploy the reviewed commit and record the deployment URL and commit SHA.
6. Confirm the canonical domain resolves to this Vercel project and the API domain resolves to Railway.

### Domain and provider activation order

Use this order to avoid a half-live checkout:

1. Deploy API with live application secrets but payment provider test keys.
2. Deploy web with the API URL and staging/preview indexing disabled.
3. Run the read-only deployment verifier against both deployed endpoints.
4. Run browser E2E against the deployed staging/preview URL.
5. Run a Razorpay test-mode checkout and signed webhook replay.
6. Complete the owner MFA enrollment and enable `MFA_ENFORCEMENT=true`.
7. Complete the database/object-storage restore drill.
8. Cut over DNS and canonical indexing only after all checks pass.
9. Replace test payment credentials with live credentials only after an owner-approved release record exists.

## 2. Deployment/environment verification

`npm run verify:deployment` is a read-only gate for non-secret deployment metadata. It
only reads `APP_ENV`, `NODE_ENV`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`,
`WEB_ORIGIN`, `WEB_ORIGINS`, and the optional public target URLs `BASE_URL` and
`API_BASE_URL`. It never loads `.env` files, enumerates the environment, reads
secret variables, prints environment values, or calls payment/database providers.

The verifier exits nonzero for missing or placeholder public variable names, invalid
URL shapes, a production origin that is not canonical, or a failed remote check.
Production canonical values are `https://argyros.in` for the web origin and
`https://api.argyros.in/api` for the API base. Remote checks are run only for target
variables that are explicitly supplied: `BASE_URL` checks `/robots.txt` and
`/sitemap.xml`; `API_BASE_URL` checks `/health`.

For a safe local check with no network requests (the same mode used by CI):

```bash
npm run verify:deployment -- --local
```

For a deployed staging environment, replace the angle-bracketed hosts with the
already-running staging web and API URLs. The URLs must be public HTTPS URLs; no
credentials belong in them:

```bash
APP_ENV=staging NODE_ENV=production \
NEXT_PUBLIC_SITE_URL=https://<staging-web-host> \
NEXT_PUBLIC_API_URL=https://<staging-api-host>/api \
WEB_ORIGIN=https://<staging-web-host> \
WEB_ORIGINS=https://<staging-web-host> \
BASE_URL=https://<staging-web-host> \
API_BASE_URL=https://<staging-api-host>/api \
npm run verify:deployment
```

For production, run the same read-only check against the canonical deployment:

```bash
APP_ENV=production NODE_ENV=production \
NEXT_PUBLIC_SITE_URL=https://argyros.in \
NEXT_PUBLIC_API_URL=https://api.argyros.in/api \
WEB_ORIGIN=https://argyros.in \
WEB_ORIGINS=https://argyros.in \
BASE_URL=https://argyros.in \
API_BASE_URL=https://api.argyros.in/api \
npm run verify:deployment
```

Record the command, commit, environment, timestamp, and pass/fail summary in the
release evidence. Store only the verifier output; it is designed to contain names,
routes, and statuses rather than values.

## 3. Backup policy

The PostgreSQL provider must provide:

- Automated daily backups with a documented retention period.
- Point-in-time recovery where available.
- Encrypted backup storage.
- Access limited to the owner/operator.
- A restore test at least monthly and before major schema changes.

The object-storage bucket for bespoke uploads must separately provide versioning or a documented retention policy. Database backups do not automatically preserve private uploaded files.

Record each backup drill with:

| Field | Value |
|---|---|
| Drill date/time IST |  |
| Backup or snapshot ID |  |
| Source environment |  |
| Isolated restore target |  |
| Migration version |  |
| Restore duration |  |
| Row/checksum verification |  |
| Object-storage verification |  |
| Result | PASS / FAIL |
| Operator |  |
| Follow-up |  |

## 4. Restore drill procedure

1. Announce a maintenance exercise; do not restore over production.
2. Create an isolated PostgreSQL database or provider restore target.
3. Restore the selected snapshot or point-in-time image.
4. Run `npm run db:migrate:deploy` against the isolated target only if the backup predates the current migration.
5. Run `npm run audit:db` against the isolated target.
6. Verify:
   - product count and active catalogue
   - order count and latest order status
   - payment rows do not contain raw card or CVV data
   - refresh-token hashes exist and raw token columns do not exist after migration
   - audit events are readable and append-only
   - bespoke references and image URLs exist
7. Restore a small sample of private object files using signed URLs.
8. Run the staging E2E suite against the restored target if the environment can be safely connected.
9. Record the result and destroy the isolated restore target after evidence is captured.

## 5. Owner account recovery

### Lost session or device

1. Open Owner Space → Security.
2. Revoke the lost device or use “Revoke all sessions”.
3. Change the owner password through the configured identity process.
4. Re-enroll MFA only from a trusted device if the authenticator is unavailable.
5. Verify that the lost access token receives `401` and that Owner Space receives `403` for non-owner accounts.

### Lost authenticator

1. Do not disable MFA by editing a database row directly.
2. Use the documented break-glass identity/provider recovery process.
3. Temporarily set the deployment security flag only through an approved change, with a start/end time and audit record.
4. Rotate `MFA_ENCRYPTION_KEY` only with a planned re-enrollment procedure; changing it without decrypting/re-encrypting existing secrets will invalidate enrolled MFA.
5. Re-enroll MFA, revoke all sessions, and restore enforcement.

## 6. Payment incident response

### Symptoms

- Razorpay/Stripe webhook failures.
- Orders stuck in `CONFIRMED` or `PENDING`.
- Provider says paid but Argyros says unpaid.
- Duplicate or unexpected payment events.
- Customer sees a payment failure.

### Procedure

1. Pause live checkout through the deployment feature flag or provider dashboard if double charging is suspected.
2. Do not mark orders `PAID` manually from the database.
3. Identify the order number, provider reference, and correlation/request ID without posting customer PII in chat.
4. Inspect provider dashboard and webhook delivery history.
5. Verify signature, amount, currency, provider order association, capture state, and internal payment row.
6. Replay a webhook only through the provider’s signed retry mechanism or a controlled test harness.
7. Check idempotency and order events before retrying.
8. If a refund is needed, use the Owner Space approval flow and capture the reason.
9. Notify the customer with a generic status update; never send provider secrets or internal stack traces.
10. Record the incident, exact affected orders, containment, provider reference, and resolution.

## 7. Compromised owner session

1. Revoke all sessions from a trusted device or provider console.
2. Rotate `JWT_SECRET` only with a planned all-session invalidation window.
3. Rotate `ORDER_TOKEN_SECRET` only with awareness that existing deed links will be invalidated.
4. Rotate payment/webhook secrets through the provider and hosting consoles.
5. Review Owner Space audit events for unexpected product, stock, order, approval, or export changes.
6. Preserve logs and audit evidence before deleting or redeploying anything.
7. Notify affected customers only after the scope is understood and legal/privacy advice is obtained.
8. Create a post-incident review with root cause, timeline, controls added, and verification evidence.

## 8. Bad deployment rollback

1. Confirm the failing commit and preserve its deployment URL/logs.
2. If checkout, authentication, or privacy is affected, disable the affected feature or route first.
3. Roll back the web and API to the last verified commit as a coordinated pair.
4. Do not roll back the database if the new migration is irreversible. Use the expand/contract recovery plan.
5. Re-run health, E2E, sitemap, login, Owner Space denial, and payment test-mode checks.
6. Re-open traffic only when the results are recorded.

## 9. Privacy and evidence rules

- Never log passwords, bearer tokens, refresh tokens, cookies, MFA codes, card data, CVVs, webhook secrets, full shipping addresses, or private uploaded files.
- Use synthetic `.invalid` emails and test order numbers in E2E.
- Store reports and screenshots without customer PII.
- Treat live production output as untrusted until independently verified.
- Every release claim must identify the commit, environment, command, timestamp, and artifact.

## 10. Monthly owner checklist

- [ ] Restore drill completed and recorded.
- [ ] Owner MFA enabled and tested.
- [ ] Unknown sessions revoked.
- [ ] Payment webhook delivery reviewed.
- [ ] Failed and pending orders reconciled.
- [ ] Audit log reviewed for unusual actions.
- [ ] Dependency and secret scans run.
- [ ] Production sitemap and robots verified.
- [ ] iPhone VoiceOver and keyboard checks sampled.
- [ ] Incident contacts and provider accounts still accessible.
