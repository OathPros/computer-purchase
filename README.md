# York University Computer Purchase Catalogue

A Next.js App Router project for York users to browse approved computer-related devices and accessories, add items to a request cart, and submit a structured purchase request summary for IT procurement review.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- JSON catalogue files in `data/` as the source of truth

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Current features

- Product catalogue cards and product details pages.
- Filters for category, brand, platform, and price.
- Search and sorting controls.
- Request cart with quantity and upgrade selections.
- Purchase request form and API payload generation.
- Email payload preparation for `lukegag2@gmail.ca` (no outbound email sending in this starter).

## Project structure

```text
app/
  page.tsx
  products/[id]/page.tsx
  cart/page.tsx
  api/submit-request/route.ts
components/
  AddToRequestButton.tsx
  CartPageClient.tsx
  CatalogueHome.tsx
  ProductComparison.tsx
  ProductImage.tsx
  RequestCartNavLink.tsx
  RequestCartProvider.tsx
data/
  products.json
  products.schema.json
  categories.json
  vendors.json
lib/
  catalog.ts
  cart.ts
  email.ts
```

## Catalogue editing guide

### Files to edit

- Products: `data/products.json`
- Categories: `data/categories.json`
- Vendors: `data/vendors.json`

### Product formats supported

The app supports both:

- Canonical fields (`categoryId`, `vendorId`, `summary`, `optionalUpgrades`, etc.), and
- Legacy source fields (`category`, `brand`, `shortDescription`, `options`, etc.), which are normalized in `lib/catalog.ts`.

Using canonical fields is recommended for consistency.

### Required product fields

Each product needs:

- `id` (unique string)
- `name` (string)
- `price` (number)
- `image` (string)
- `specs` (object of string key/value pairs)
- `platform` (`Windows`, `macOS`, or `Cross-platform`)

### Recommended fields

- `categoryId` (preferred) or `category` (legacy)
- `vendorId` (preferred) or `brand` (legacy)
- `summary` (preferred) or `shortDescription` (legacy)
- `fullDescription`
- `recommendedUseCases`
- `notRecommendedFor`
- `optionalUpgrades` (preferred) or `options` (legacy)
- `warranty`
- `availabilityNotes`
- `status` (`active` or `retired`)

### Add a product safely

1. Duplicate a similar product object in `data/products.json`.
2. Update fields and ensure `id` is unique.
3. If using `categoryId`/`vendorId`, make sure IDs exist in category/vendor files.
4. Keep `price` numeric (for example: `1299`, not `"$1,299"`).
5. Run:

   ```bash
   npm run build
   ```

## Request submission API

`POST /api/submit-request`

- Validates requester fields and requested items.
- Matches items against catalogue products.
- Builds structured email payload content addressed to `lukegag2@gmail.com`.
- Returns a structured summary response for UI confirmation.

This project currently **does not send** real email; it prepares the payload only.
