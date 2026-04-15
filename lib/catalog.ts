import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import vendorsData from "@/data/vendors.json";

export type ProductStatus = "active" | "retired";
export type ProductPlatform = "Windows" | "macOS" | "Cross-platform";

export type Category = {
  id: string;
  label: string;
};

export type Vendor = {
  id: string;
  label: string;
};

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  vendorId: string;
  price: number;
  image: string;
  summary: string;
  fullDescription: string;
  specs: Record<string, string>;
  recommendedUseCases: string[];
  notRecommendedFor: string[];
  warranty: string;
  availabilityNotes: string;
  optionalUpgrades: string[];
  platform: ProductPlatform;
  status: ProductStatus;
}

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

type LegacyProductInput = {
  id: string;
  name: string;
  category?: string;
  categoryId?: string;
  brand?: string;
  vendorId?: string;
  price: number;
  image: string;
  shortDescription?: string;
  summary?: string;
  specs: Record<string, string>;
  recommendedFor?: string[];
  recommendedUseCases?: string[];
  fullDescription?: string;
  notRecommendedFor?: string[];
  options?: string[];
  optionalUpgrades?: string[];
  warranty?: string;
  availabilityNotes?: string;
  platform: ProductPlatform;
  status?: ProductStatus;
};

type ProductCatalog = {
  catalogVersion: string;
  currency: string;
  products: LegacyProductInput[];
};

const categories = categoriesData as Category[];
const vendors = vendorsData as Vendor[];
const categoryLabelToId = new Map(categories.map((category) => [category.label.toLowerCase(), category.id]));
const vendorLabelToId = new Map(vendors.map((vendor) => [vendor.label.toLowerCase(), vendor.id]));

function fallbackId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCategoryId(product: LegacyProductInput): string {
  if (product.categoryId) return product.categoryId;

  const category = (product.category ?? "").trim().toLowerCase();
  const fromLabel = categoryLabelToId.get(category);
  if (fromLabel) return fromLabel;

  if (category.includes("laptop") || category.includes("notebook")) return "laptops";
  if (category.includes("desktop")) return "desktops";
  if (category.includes("monitor") || category.includes("display")) return "monitors";
  if (category.includes("peripheral")) return "peripherals";
  if (category.includes("accessor")) return "accessories";

  return fallbackId(product.category ?? "unknown");
}

function normalizeProduct(product: LegacyProductInput): Product {
  const categoryId = normalizeCategoryId(product);
  const vendorId = product.vendorId ?? vendorLabelToId.get((product.brand ?? "").toLowerCase()) ?? fallbackId(product.brand ?? "unknown");

  return {
    id: product.id,
    name: product.name,
    categoryId,
    vendorId,
    price: product.price,
    image: product.image,
    summary: product.summary ?? product.shortDescription ?? "No summary provided.",
    fullDescription: product.fullDescription ?? product.summary ?? product.shortDescription ?? "No summary provided.",
    specs: product.specs,
    recommendedUseCases: product.recommendedUseCases ?? product.recommendedFor ?? [],
    notRecommendedFor: product.notRecommendedFor ?? [],
    warranty: product.warranty ?? "Contact procurement for warranty details.",
    availabilityNotes: product.availabilityNotes ?? "Availability varies by supplier and term.",
    optionalUpgrades: product.optionalUpgrades ?? product.options ?? [],
    platform: product.platform,
    status: product.status ?? "active"
  };
}

const rawCatalog = productsData as ProductCatalog;
export const products = rawCatalog.products.map(normalizeProduct).filter((product) => product.status !== "retired");
export { categories, vendors };

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getVendorLabel(vendorId: string): string {
  return vendors.find((vendor) => vendor.id === vendorId)?.label ?? vendorId;
}

export function getCategoryLabel(categoryId: string): string {
  return categories.find((category) => category.id === categoryId)?.label ?? categoryId;
}

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

  const requiredFields = ["id", "name", "price", "image", "specs", "platform"] as const;
  for (const field of requiredFields) {
    if (!(field in product)) {
      errors.push(`${label}.${field} is required.`);
    }
  }

  if (typeof product.id !== "string" || product.id.trim() === "") {
    errors.push(`${label}.id must be a non-empty string.`);
  }

  if (typeof product.name !== "string" || product.name.trim() === "") {
    errors.push(`${label}.name must be a non-empty string.`);
  }

  if (typeof product.price !== "number" || Number.isNaN(product.price) || product.price < 0) {
    errors.push(`${label}.price must be a non-negative number.`);
  }

  if (typeof product.image !== "string" || product.image.trim() === "") {
    errors.push(`${label}.image must be a non-empty string.`);
  }

  if (!isStringMap(product.specs)) {
    errors.push(`${label}.specs must be an object of key/value strings.`);
  }

  if (!["Windows", "macOS", "Cross-platform"].includes(String(product.platform))) {
    errors.push(`${label}.platform must be one of: Windows, macOS, Cross-platform.`);
  }

  if (product.status !== undefined && !["active", "retired"].includes(String(product.status))) {
    errors.push(`${label}.status must be one of: active, retired.`);
  }

  if (product.categoryId !== undefined && typeof product.categoryId !== "string") {
    errors.push(`${label}.categoryId must be a string when provided.`);
  }

  if (product.vendorId !== undefined && typeof product.vendorId !== "string") {
    errors.push(`${label}.vendorId must be a string when provided.`);
  }

  if (product.optionalUpgrades !== undefined && !isStringArray(product.optionalUpgrades)) {
    errors.push(`${label}.optionalUpgrades must be a list of strings.`);
  }

  if (product.options !== undefined && !isStringArray(product.options)) {
    errors.push(`${label}.options must be a list of strings.`);
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
