# Rovelle

Rovelle Jewels storefront and administration application built with Next.js 16, React 19, TypeScript, Tailwind CSS, MongoDB/Mongoose, Auth.js and Zustand.

The storefront includes editorial jewellery collections, catalog search and filters, product options, cart, wishlist, checkout, account and orders. The protected admin area includes products, categories, orders, coupons, sourcing and store settings.

## Run locally

Requires Node.js compatible with Next.js 16 and a MongoDB database.

```sh
npm ci
```

Copy `.env.example` to `.env` and configure your database connection and authentication secret. Configure other services only when needed. Real environment files, private business data, database backups and local diagnostic files are excluded from Git.

```sh
npm run dev
```

Open http://localhost:3000. For a production preview:

```sh
npm run build
npm start
```

## Checks

```sh
npm test
npm run lint
npm run build
```

Read-only browser QA is available in `scripts/check-rovelle-ui.cjs`. It requires Playwright and a running preview; configure `ROVELLE_QA_URL` and, when needed, `ROVELLE_QA_BROWSER`. Its original catalog assertions describe the audited database and must be adjusted for another database.

## Store configuration

An empty database has no published products or configured store settings. Add real products and configure the store through authorized administration. Jewellery collections stay empty until matching products are published.

Online payment verification remains closed. Coupons can be administered but are not integrated into checkout quoting. Contact links use configured email/WhatsApp; there is no contact-message storage service.

Historical sourcing research and catalog-release files live under the ignored `private/` directory. They are optional local inputs for research import and publishing scripts, and are not supplied in this repository. Restore your own reviewed input files locally before using those tools. Tests depending on these historical files skip when they are unavailable; the application and other security checks do not depend on them.

See [redesign and QA report](docs/ROVELLE-REDESIGN.md) and [campaign asset provenance](docs/ROVELLE-CAMPAIGN-ASSETS.md). Decorative campaign images are separate from actual product photography.
