export type ProductStatus = "active" | "inactive" | "retired";

export interface Product {
  id: string;
  status: ProductStatus;
  name: string;
  brand: string;
  category: string;
  platform: string;
  audience: string;
  shortDescription: string;
  image: string;
  price: number;
  currency: string;
  specs: Record<string, string>;
  tags: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
  options: string[];
  warranty: string;
  availabilityNotes: string;
}

export interface ProductCatalog {
  catalogVersion: string;
  currency: string;
  products: Product[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const REQUIRED_PRODUCT_FIELDS: Array<keyof Product> = [
  "id",
  "status",
  "name",
  "brand",
  "category",
  "platform",
  "audience",
  "shortDescription",
  "image",
  "price",
  "currency",
  "specs",
  "tags",
  "recommendedFor",
  "notRecommendedFor",
  "options",
  "warranty",
  "availabilityNotes"
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isStringMap(value: unknown): value is Record<string, string> {
  return isObject(value) && Object.values(value).every((item) => typeof item === "string");
}

export function validateProduct(product: unknown, index?: number): ValidationResult {
  const label = typeof index === "number" ? `products[${index}]` : "product";
  const errors: string[] = [];

  if (!isObject(product)) {
    return { valid: false, errors: [`${label} must be an object.`] };
  }

  for (const field of REQUIRED_PRODUCT_FIELDS) {
    if (!(field in product)) {
      errors.push(`${label}.${field} is required.`);
    }
  }

  if (typeof product.id !== "string" || product.id.trim() === "") {
    errors.push(`${label}.id must be a non-empty string.`);
  }

  if (!["active", "inactive", "retired"].includes(String(product.status))) {
    errors.push(`${label}.status must be one of: active, inactive, retired.`);
  }

  const requiredStringFields: Array<keyof Product> = [
    "name",
    "brand",
    "category",
    "platform",
    "audience",
    "shortDescription",
    "image",
    "currency",
    "warranty",
    "availabilityNotes"
  ];

  for (const field of requiredStringFields) {
    const value = product[field];
    if (typeof value !== "string" || value.trim() === "") {
      errors.push(`${label}.${field} must be a non-empty string.`);
    }
  }

  if (typeof product.price !== "number" || Number.isNaN(product.price) || product.price < 0) {
    errors.push(`${label}.price must be a non-negative number.`);
  }

  if (!isStringMap(product.specs)) {
    errors.push(`${label}.specs must be an object of key/value strings.`);
  }

  const stringArrayFields: Array<keyof Product> = ["tags", "recommendedFor", "notRecommendedFor", "options"];
  for (const field of stringArrayFields) {
    if (!isStringArray(product[field])) {
      errors.push(`${label}.${field} must be a list of strings.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateCatalog(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isObject(data)) {
    return { valid: false, errors: ["catalog must be an object."] };
  }

  if (typeof data.catalogVersion !== "string" || data.catalogVersion.trim() === "") {
    errors.push("catalogVersion must be a non-empty string.");
  }

  if (typeof data.currency !== "string" || data.currency.trim() === "") {
    errors.push("currency must be a non-empty string.");
  }

  if (!Array.isArray(data.products)) {
    errors.push("products must be an array.");
  } else {
    const ids = new Set<string>();

    data.products.forEach((product, index) => {
      const result = validateProduct(product, index);
      errors.push(...result.errors);

      if (isObject(product) && typeof product.id === "string") {
        if (ids.has(product.id)) {
          errors.push(`products[${index}].id must be unique.`);
        }
        ids.add(product.id);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

export function parseCatalog(data: unknown): ProductCatalog {
  const result = validateCatalog(data);
  if (!result.valid) {
    throw new Error(`Invalid catalog data:\n- ${result.errors.join("\n- ")}`);
  }
  return data as ProductCatalog;
}
