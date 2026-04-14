import type { Product } from "@/lib/catalog";

export type CartItem = {
  productId: string;
  quantity: number;
};

export type RequesterDetails = {
  fullName: string;
  email: string;
  department: string;
  notes?: string;
};

export type PurchaseRequest = {
  requester: RequesterDetails;
  items: Array<CartItem & { product: Product }>;
};

export function createCartItem(productId: string, quantity = 1): CartItem {
  return { productId, quantity };
}
