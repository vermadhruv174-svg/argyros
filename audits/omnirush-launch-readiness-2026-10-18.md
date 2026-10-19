# Argyros Launch Readiness Review

**Review date:** 2026-10-18  
**Reviewer:** OmniRush.ai launch team  
**Public preview:** https://argyros-yw1l.vercel.app/  
**Working branch:** `omnirush/argyros-launch-readiness`

## Executive status

The preview storefront is materially complete and presents a coherent 15-piece made-to-order catalogue. The local repository passes typecheck, lint, the strict launch gate, deployment-shape verification, and the existing API test suite. It is **not yet cleared for production cutover** because deployment configuration, live payment verification, canonical-domain checks, and end-to-end checkout evidence still need to be completed by the owner/operator.

No application source files were changed during this review. The only change on this branch is this audit record.

## Verified public-site observations

- Homepage renders the Argyros positioning, 925 sterling claims, made-to-order promise, gifting flow, heritage story, policies, and concierge contact path.
- `/collections/the-first-edition` resolves and lists the 15-piece collection.
- `/shop` resolves and reports 15 pieces found.
- `/products/nova-halo-ring` resolves with price, size selection, production timeline, returns/exchange copy, and Add to Bag controls.
- `/checkout` resolves to the checkout shell. A complete checkout still requires a controlled cart and provider test-mode run.
- `/robots.txt` disallows `/api/` and `/admin`, which is appropriate for a preview/staging deployment.
- Preview `/sitemap.xml` returns an empty URL set. This is consistent with the repository's `APP_ENV` gate for non-production environments; the canonical production domain must return the populated sitemap before launch.
- Shipping, returns, privacy, terms, and grievance pages are present and contain India-specific business/support disclosures.

## Highest-priority launch gates

### P0 — Must be proven before live traffic

1. **Canonical production cutover**
   - Confirm the production web domain and API domain are live and resolve to the intended Vercel/Railway services.
   - Verify `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `WEB_ORIGIN`, and `WEB_ORIGINS` match the canonical domains.
   - Verify production robots and sitemap behavior after `APP_ENV=production`.

2. **Payment and webhook proof**
   - Run a provider test-mode checkout against staging.
   - Verify signed webhook delivery, idempotency, order/payment state transitions, and failure handling.
   - Only then replace test credentials with live credentials under an owner-approved release record.

3. **Database migration and backup proof**
   - Run `npm run db:migrate:deploy` against the intended production database.
   - Confirm daily backups, retention, and an isolated restore drill.

4. **Owner security configuration**
   - Set non-placeholder production secrets.
   - Confirm `OWNER_EMAIL` is the real owner account.
   - Complete MFA enrollment before enabling `MFA_ENFORCEMENT=true`.

### P1 — Complete before launch or immediately after an explicit soft launch

- Run deployed browser E2E against staging/preview with a seeded cart and provider test mode.
- Verify order confirmation, tracking, support, and concierge paths from a customer perspective.
- Confirm analytics and error monitoring are receiving events without leaking payment or customer data.
- Confirm the final catalogue imagery, copy, price, GST, weight, hallmark, size, and delivery claims are commercially accurate.
- Confirm mobile layouts at 320, 390, 430, and desktop widths.

## Local verification evidence

All commands were run from `D:\AEOS\argyros` without contacting payment or production providers:

```text
npm run typecheck                         PASS
npm test -- --runInBand                   PASS — 14 suites, 79 tests
npm run lint                              PASS
npm run check:launch                      PASS — 6/6 gates
npm run verify:deployment -- --local      PASS — 2 passed, 1 skipped
git diff --check                          no whitespace errors; existing line-ending warnings only
```

The repository has extensive pre-existing uncommitted changes. This branch was created to isolate follow-up work; no reset, stash, commit, push, or destructive operation was performed.

## Antigravity collaboration protocol

- Treat `D:\AEOS\argyros` as the source of truth only after the owner confirms it is the active Antigravity project, which has now been confirmed for this work.
- Keep OmniRush changes on `omnirush/argyros-launch-readiness` until reviewed.
- Do not reset, clean, or overwrite existing working-tree changes.
- One agent owns each file set; agents must not edit the same file concurrently.
- Require a focused diff, the exact verification command, and a handoff note before merging any change back into the Antigravity flow.
- OmniRush has no verified direct Antigravity control integration in the current runtime; collaboration is via the shared repository/branch and explicit handoff, not an assumed agent-to-agent channel.

## Recommended next implementation slice

1. Run the launch checklist against the actual staging environment, not only local mode.
2. Add or finish a deterministic staging checkout E2E that stops before any real charge.
3. Verify the production-domain sitemap/robots/canonical metadata after deployment configuration is complete.
4. Review the resulting evidence with the owner, then make only the smallest code fixes exposed by those checks.
