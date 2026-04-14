# York University Computer Purchase Catalogue

A starter Next.js App Router project for browsing approved computer-related products and submitting structured purchase requests.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Local JSON catalogue (`data/*.json`) as source of truth

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
  products.schema.json
  categories.json
  vendors.json
lib/
  catalog.ts
  cart.ts
  email.ts
```

---

## Catalogue editing guide (for non-developers)

### 1) Where products are stored

All products are in:

- `data/products.json`

Supporting lookup lists are in:

- `data/categories.json` (valid category IDs)
- `data/vendors.json` (valid vendor IDs)

There is also a reference schema file:

- `data/products.schema.json`

Use this schema as a guide for allowed values and field meanings.

### 2) How to add a new product

1. Open `data/products.json`.
2. Copy an existing product object.
3. Paste it at the end of the array (before the final `]`).
4. Update all required fields.
5. Save and run the app to confirm it appears.

Checklist for a new product:

- Give it a **unique `id`** in kebab-case (example: `hp-elitebook-840-g11`).
- Set `categoryId` to an ID that exists in `data/categories.json`.
- Set `vendorId` to an ID that exists in `data/vendors.json`.
- Set `platform` to exactly one of:
  - `Windows`
  - `macOS`
  - `Cross-platform`
- Keep `price` as a number (no `$` sign, no commas).

### 3) How to retire a product using `status`

To hide a product from the catalogue without deleting it:

- Set `"status": "retired"` on the product.

To keep a product visible:

- Set `"status": "active"` (or omit `status`, which defaults to active).

Retiring instead of deleting preserves history and avoids breaking old links/references.

### 4) Required fields

These fields must be present and valid:

- `id` (string, unique)
- `name` (string)
- `categoryId` (string, must match `categories.json`)
- `vendorId` (string, must match `vendors.json`)
- `price` (number)
- `image` (string URL or image path)
- `summary` (string)
- `specs` (object of label/value pairs)
- `platform` (`Windows` | `macOS` | `Cross-platform`)

### 5) Optional fields

If omitted, these fall back safely in the app:

- `status` (`active` or `retired`, default: `active`)
- `fullDescription` (default: same as `summary`)
- `recommendedUseCases` (default: empty list)
- `notRecommendedFor` (default: empty list)
- `warranty` (default: `"Contact procurement for warranty details."`)
- `availabilityNotes` (default: `"Availability varies by supplier and term."`)
- `optionalUpgrades` (default: empty list)

### 6) How images should be added

You can provide either:

- A full URL, such as `https://...`, or
- A local path starting with `/`, such as `/images/elitebook-840.jpg`

Image tips:

- Prefer a clear product photo in landscape orientation.
- Avoid spaces in filenames.
- Keep naming consistent (for example, match product ID).
- Ensure URLs are publicly reachable.

### 7) Common mistakes that will break the catalogue

- Duplicate `id` values.
- `categoryId` not found in `categories.json`.
- `vendorId` not found in `vendors.json`.
- Invalid `platform` value (must match exactly).
- Invalid JSON syntax (missing comma, trailing comma, unmatched quotes/braces).
- Using text for `price` such as `"$1,299"` instead of `1299`.
- Setting list fields as strings instead of arrays.

### 8) Example product entry

```json
{
  "id": "hp-elitebook-840-g11",
  "name": "HP EliteBook 840 G11",
  "categoryId": "laptops",
  "vendorId": "hp",
  "price": 1649,
  "image": "https://example.com/images/hp-elitebook-840-g11.jpg",
  "summary": "Enterprise 14-inch laptop for daily faculty and staff workflows.",
  "fullDescription": "A durable business laptop with strong conferencing and security features.",
  "specs": {
    "Processor": "Intel Core Ultra 7",
    "Memory": "16 GB",
    "Storage": "512 GB SSD",
    "Display": "14-inch WUXGA"
  },
  "recommendedUseCases": [
    "Department standard laptop deployments",
    "Office productivity and collaboration"
  ],
  "notRecommendedFor": [
    "GPU-heavy rendering workloads"
  ],
  "warranty": "3-year onsite support",
  "availabilityNotes": "Usually available in 2-3 weeks during peak terms.",
  "optionalUpgrades": [
    "32 GB RAM",
    "1 TB SSD"
  ],
  "platform": "Windows",
  "status": "active"
}
```

---

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
