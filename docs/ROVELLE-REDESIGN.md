# Rovelle Jewels redesign

## Audit and implementation plan — 5 October 2026

This is the existing Next.js 16.2.12 App Router / React 19 application, not a second application. Styling uses Tailwind 4 plus global CSS; Lucide icons and the existing notification system are reusable. MongoDB/Mongoose stores products, categories, customers, orders, payments, settings, sourcing records, coupons and moderated reviews. Auth.js credentials and database-verified admin roles protect admin server actions. Zustand persists cart and wishlist in the existing `kiddio-bag-v2` storage key, which must be retained for existing shoppers.

Customer routes: homepage, products, product detail, categories, collection redirects, cart, wishlist, checkout, account and individual orders. Authentication routes: login, register, verification, password recovery and reset. Existing admin modules: dashboard, products/new/edit, categories, orders, coupons, sourcing/review and store settings. There are no customer-management, saved-address or media-management routes.

The live read-only audit found 32 products, 16 published products, six existing children’s categories, zero approved reviews, and no global settings record. No catalogue migration or database write is part of the visual redesign. Jewellery navigation is editorial; all existing products remain accessible through the catalog.

### Preserve

- API and server-action contracts, form field names, session handling, role enforcement, product publication checks and private-data projections.
- Variant-aware cart line identity, quantities, wishlist persistence, checkout pricing from the server, India address/pincode validation and order idempotency.
- COD gates, shipping fees/policies, payment statuses, supplier fulfillment workflows, sourcing approvals and margin review.
- Existing policy text, environment variables, SEO metadata and analytics helpers.

### Redesign order

1. Typography, ivory/champagne/espresso tokens, shared controls and accessible states.
2. Brand wordmark, sticky navigation, search, mobile dialogs and footer.
3. Editorial campaign homepage and real-data collection sections.
4. Responsive collection filters, product cards and product detail/gallery.
5. Cart, wishlist, checkout, account, orders, auth, story, contact, policy and error pages.
6. Separate professional admin shell, actual-data dashboard, product management and existing modules.
7. Type/lint/security/build checks, public API checks and browser responsive QA.

### Functional limits found before implementation

- Online payment verification intentionally fails closed. No working online payment flow will be implied or enabled.
- Coupon administration/validation exists, but order quoting does not apply coupons. A decorative coupon field would mislead shoppers; leave the checkout contract intact.
- Saved addresses, profile editing, newsletters, contact-message storage, social feeds and reels have no working backend. Do not invent modules or submit buttons that claim success.
- Only actual approved reviews may be shown. No ratings, testimonials, bestseller counts, low-stock counts or delivery/return guarantees are fabricated.
- Campaign art is decorative brand imagery and must never replace actual SKU photography.

## Validation

Completed 6 October 2026. The redesign is implemented in the existing application. Jewellery-only homepage and New Arrivals use honest empty collection states until real jewellery products are published. Shop All preserves the 16 published products. Existing MongoDB records were not edited or seeded during this work.

- Production build and TypeScript checks pass.
- ESLint passes with no errors. Eight existing warnings remain in database/auth/payment helpers and the analytics fallback image.
- All 17 automated security and regression checks pass, including private-data projections, validated checkout pricing, address/variant restrictions, fail-closed payment/auth behavior, idempotency, original sourcing categories, genuine compare prices and legacy cart compatibility. Order tests use isolated mocks, not the live database.
- Browser QA passes 130 responsive measurements: 13 customer routes at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 and 1600px. No horizontal overflow, broken images or browser exceptions were found.
- Interactive checks pass for mobile navigation and Escape, predictive search, mobile filters, required product options, add to bag, wishlist, quantity update, reload persistence, removal, checkout navigation, protected-route redirects and missing-product 404.
- Public cart, wishlist, search and recommendation APIs respond successfully without supplier/cost/internal fields. The disabled development seed endpoint returns 404.
- Desktop and mobile homepage/catalog screenshots and mobile cart/checkout screenshots were visually inspected. Campaign imagery is compressed WebP and remains separate from actual SKU images.

The source audit also fixed a missing Mongoose import in admin authorization, removed sensitive credential logging, retained private product values during editing, and preserved original sourcing publication categories. Cart additions treat missing and empty options as the same no-option selection, preserving older saved bags without migrating storage.

### Reproduce checks

From the project root:

```text
node node_modules/next/dist/bin/next build
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js src scripts/check-rovelle-ui.cjs
node tests/security.test.cjs
node scripts/check-rovelle-ui.cjs
```

Browser checks need Playwright available to Node. This environment uses the bundled runtime through `NODE_PATH`, `ROVELLE_QA_BROWSER` for its installed Chromium executable, and `ROVELLE_QA_URL=http://localhost:3011`. The script uses an isolated browser context and does not submit orders or change admin data. Detailed logs, the JSON report and screenshots are saved in `private/rovelle-qa/`.

### Remaining live verification

Authenticated admin CRUD, real registration/email verification, live COD order creation and logged-in order history were not exercised against production: no staging credentials were supplied and the audited database has no configured global store settings. Online payments remain closed as in the original application; coupon application, saved addresses and contact-message storage remain unavailable because their backend flows do not exist. These limits are represented honestly in the interface. A configured staging store and test credentials are required for those end-to-end checks.

The working preview runs locally at `http://localhost:3011`. This is a local preview, not a public deployment. Original source snapshots are preserved under `private/redesign-backup/src`. Campaign provenance is documented in `docs/ROVELLE-CAMPAIGN-ASSETS.md`.
