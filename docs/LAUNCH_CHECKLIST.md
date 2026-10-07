# 🚀 Argyros — Pre-Launch Checklist

## ✅ Automated (Already Done)
- [x] Rate limiting (20/s, 200/min, 10 auth/min)
- [x] Helmet HTTP security headers
- [x] CSP headers in Next.js
- [x] JSON-LD product schema
- [x] OG metadata on product pages
- [x] Skip-to-content accessibility link
- [x] Google Analytics 4 component
- [x] Vercel deployment config
- [x] Railway Dockerfile + config
- [x] .env.example with all prod vars documented

## 🔲 You Must Do — Technical
- [ ] Run `npm run db:migrate` on production DB after deploy
- [ ] Set all env vars in Vercel dashboard (web)
- [ ] Set all env vars in Railway dashboard (API)
- [ ] Replace Stripe test keys with live keys
- [ ] Generate strong JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Register Stripe webhook in Stripe dashboard → `https://api.argyros.in/api/payments/webhook`
  - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Create GA4 property → get `G-XXXXXXXXXX` measurement ID
- [ ] Buy domain (`argyros.in` or `argyros.store`)
  - Recommended: GoDaddy, Namecheap, or Google Domains
  - `argyros.in` — most on-brand for an Indian luxury brand
- [ ] Point domain DNS to Vercel (web) + Railway/Fly.io (API)
- [ ] Enable Vercel Analytics
- [ ] Enable Vercel Speed Insights

## 🔲 You Must Do — Business
- [ ] Product photography: clean white/paper background, macro shots, lifestyle shots
  - Minimum: 3 images per product (front, detail, lifestyle)
- [ ] Write real product descriptions (replace seed data copy)
- [ ] Update seed script with real product names, slugs, prices
- [ ] Set up Instagram: @argyros925 (or similar)
- [ ] Create first 10 posts before any pre-sale announcement
- [ ] Set up Shiprocket account → get API keys for future shipping integration
- [ ] Promote one admin user in DB:
  ```sql
  UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
  ```

## 🔲 Post-Launch (Week 1)
- [ ] Stripe test: place a real test order end-to-end
- [ ] Confirm webhook firing in Stripe dashboard
- [ ] Confirm order confirmation email received (once email is wired)
- [ ] Check Lighthouse score (target: ≥ 90 mobile)
- [ ] Submit sitemap to Google Search Console: `https://argyros.in/sitemap.xml`
- [ ] Monitor error logs on Railway
- [ ] Monitor real user metrics in Vercel Analytics

## 🔲 Near-Term (Month 1)
- [ ] Wire transactional email (Resend): order confirmation, shipping notification
- [ ] Add customer wishlist to account page
- [ ] Wire Shiprocket API for tracking number auto-fill
- [ ] Add a real OmniRoute provider (OpenAI/Gemini) for Gift Finder
  - Register in AeosService with `client.router.registerProvider(openAiProvider)`
- [ ] Add `PricingAuditAgent` — flag suspicious checkout price mismatches
