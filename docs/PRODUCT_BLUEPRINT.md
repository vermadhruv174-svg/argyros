# Argyros Product Blueprint — v1

## Product requirements

**Problem.** Jewellery shoppers need to judge style, quality and trust quickly on a small screen; generic storefronts make a premium purchase feel risky and exhausting. Argyros provides an easy, global-ready path to certified 925 silver pieces while making craftsmanship and gifting feel considered.

**Primary users.** Style-led shoppers; occasion-driven gift buyers; returning collectors; and catalog/fulfilment staff.

**Goals (first 90 days).**

- Reach 70% mobile product-detail-to-cart task completion and keep median product-page LCP below 2.5s.
- Deliver a guest checkout completion rate of 55%+ with clear duties, delivery, returns and purity signals.
- Enable staff to publish a product with variants, media, inventory and SEO metadata without engineering support.
- Achieve WCAG 2.2 AA for critical purchase journeys and indexable category/product pages.

**Non-goals for v1.** Marketplace sellers, custom CAD design, camera-based try-on, multi-warehouse routing and an open-ended AI stylist. These need specialist integrations and validation; the data model leaves room for them.

### Core user stories and acceptance criteria

| Priority | Story | Acceptance criteria |
|---|---|---|
| P0 | As a shopper, I can browse and filter pieces so I can find a suitable item quickly. | Categories, price, size, collection and availability filters work together; search is typo-tolerant; empty state gives a clear recovery action. |
| P0 | As a shopper, I can verify a piece before purchasing. | Product page exposes price, 925 purity, weight, size, stock, care, delivery and return information; selected variant updates availability and price. |
| P0 | As a guest, I can buy securely. | Cart persists for 30 days; address validation, shipping quote, tax/duty estimate and payment confirmation have accessible error states; an idempotency key prevents duplicate orders. |
| P0 | As an administrator, I can manage catalogue and fulfilment. | Role-gated dashboard can create drafts, publish products, edit stock, and progress order status with an audit event. |
| P1 | As a gift buyer, I can shop by recipient, occasion and budget. | Gift Finder maps answers to filterable product recommendations and shareable results. |
| P1 | As a returning shopper, I can keep a wishlist and view orders. | Logged-in customer can save products, manage addresses and access order tracking. |

**Success measurement.** Instrument `view_item`, `search`, `filter_applied`, `add_to_cart`, `begin_checkout`, `purchase`, and validation errors. Review funnel weekly; review conversion, repeat purchase and return rate at 30/60/90 days. Target 3% search-to-cart uplift and <2% checkout technical error rate.

## Information architecture

`Home → Shop (Women, Men, Gifts, New, Best Sellers) → Collection/Category → Search & filters → Product → Cart → Checkout → Confirmation`.

## Design system

- **Character:** quiet luxury: warm ivory canvas, graphite text, antique-gold accents, highly tactile photography.
- **Tokens:** `--ink #171717`, `--paper #F8F6F1`, `--silver #C5C7C7`, `--gold #A6814C`, `--line #DEDAD2`, `--success #246A4F`, `--wine #251C1B`. Use 8px spacing steps; max content width 1440px.
- **Type:** display serif (Cormorant Garamond) for editorial headings; Inter for controls and body copy. Minimum 16px body text, 44×44px touch targets, visible focus rings.
- **Components:** announcement bar, sticky header, image-first product card, filter sheet, product gallery, swatches/size chips, trust row, drawer cart.
- **Motion:** 160–240ms opacity/transform transitions; respect `prefers-reduced-motion`.

## Technical architecture

Next.js App Router serves SSR/ISR storefront pages, image optimization and schema markup. NestJS REST API handles catalogue data, queries PostgreSQL using Prisma. Redis for rate limits and caching infrastructure.

## Data model

`User 1—N Address, Order, WishlistItem`; `Product 1—N ProductVariant, ProductImage`; `Collection N—N ProductCollection`; `Cart 1—N CartItem`; `Order 1—N OrderItem, Payment, Fulfillment, OrderEvent`. Products contain `brandId String @default("argyros")` and soft-delete `deletedAt DateTime?`.
