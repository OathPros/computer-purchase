import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import vendorsData from "@/data/vendors.json";

export type Product = {
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
  platform: "Windows" | "macOS" | "Cross-platform";
};

export type Category = { id: string; label: string };
export type Vendor = { id: string; label: string };

export const products = productsData as unknown as Product[];
export const categories = categoriesData as Category[];
export const vendors = vendorsData as Vendor[];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getCategoryLabel(categoryId: string): string {
  return categories.find((category) => category.id === categoryId)?.label ?? categoryId;
}

export function getVendorLabel(vendorId: string): string {
  return vendors.find((vendor) => vendor.id === vendorId)?.label ?? vendorId;
}
