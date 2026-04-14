# York University Computer Purchase Catalogue

A starter Next.js App Router project for browsing approved computer-related products and submitting structured purchase requests.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Local JSON catalog (`data/*.json`) as source of truth

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

## Project structure

```text
app/
  page.tsx
  products/[id]/page.tsx
  cart/page.tsx
  api/submit-request/route.ts
components/
  ProductCard.tsx
  ProductGrid.tsx
  ProductFilters.tsx
  CartDrawer.tsx
  ProductComparison.tsx
data/
  products.json
  categories.json
  vendors.json
lib/
  catalog.ts
  cart.ts
  email.ts
```

## Updating the catalogue

Edit JSON files in `data/`:

- `products.json`: all product cards and detail page fields
- `categories.json`: options used for category labels and filters
- `vendors.json`: options used for vendor labels and filters

Each product in `products.json` should include:

- `id` (unique slug, used in product detail URL)
- `name`
- `categoryId` (must match `categories.json`)
- `vendorId` (must match `vendors.json`)
- `price`
- `image` (currently placeholder text)
- `summary`
- `specs` (key/value object displayed on detail page)

## Request submission API (placeholder)

`POST /api/submit-request` accepts requester details and cart items, enriches items with catalogue data, and returns the structured request payload.

No real email is sent yet. The route currently prepares an email-style payload addressed to `lukegag2@gmail.com`.

Example request body:

```json
{
  "requester": {
    "fullName": "Alex Example",
    "email": "alex@yorku.ca",
    "department": "Faculty of Science",
    "notes": "Please prioritize for lab deployment."
  },
  "items": [
    { "productId": "dell-latitude-7450", "quantity": 2 }
  ]
}
```
