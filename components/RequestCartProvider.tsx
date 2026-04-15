"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProductById } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import type { CartItem } from "@/lib/cart";

const STORAGE_KEY = "request-cart-v1";

type CartContextValue = {
  items: CartItem[];
  expandedItems: Array<CartItem & { product: Product }>;
  itemCount: number;
  estimatedTotal: number;
  addToRequest: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  toggleUpgrade: (productId: string, upgrade: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const RequestCartContext = createContext<CartContextValue | null>(null);

function sanitizeCart(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<CartItem>;
      return typeof candidate.productId === "string" && typeof candidate.quantity === "number";
    })
    .map((item) => ({
      productId: item.productId,
      quantity: Math.max(1, Math.floor(item.quantity)),
      selectedUpgrades: Array.isArray(item.selectedUpgrades)
        ? item.selectedUpgrades.filter((upgrade): upgrade is string => typeof upgrade === "string")
        : []
    }))
    .filter((item) => Boolean(getProductById(item.productId)));
}

export function RequestCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        const hydratedItems = sanitizeCart(parsed);
        setItems((current) => (current.length > 0 ? current : hydratedItems));
      }
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const expandedItems = useMemo(() => {
    return items
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter((item): item is CartItem & { product: Product } => item !== null);
  }, [items]);

  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const estimatedTotal = useMemo(() => expandedItems.reduce((total, item) => total + item.quantity * item.product.price, 0), [expandedItems]);

  function addToRequest(productId: string) {
    if (!getProductById(productId)) {
      return;
    }

    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { productId, quantity: 1, selectedUpgrades: [] }];
    });
  }

  function setQuantity(productId: string, quantity: number) {
    if (!Number.isFinite(quantity)) {
      return;
    }

    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity: Math.floor(quantity) } : item))
    );
  }

  function toggleUpgrade(productId: string, upgrade: string) {
    setItems((current) =>
      current.map((item) => {
        if (item.productId !== productId) return item;
        const hasUpgrade = item.selectedUpgrades.includes(upgrade);
        return {
          ...item,
          selectedUpgrades: hasUpgrade ? item.selectedUpgrades.filter((entry) => entry !== upgrade) : [...item.selectedUpgrades, upgrade]
        };
      })
    );
  }

  function removeItem(productId: string) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const value = {
    items,
    expandedItems,
    itemCount,
    estimatedTotal,
    addToRequest,
    setQuantity,
    toggleUpgrade,
    removeItem,
    clearCart
  };

  return <RequestCartContext.Provider value={value}>{children}</RequestCartContext.Provider>;
}

export function useRequestCart() {
  const context = useContext(RequestCartContext);
  if (!context) {
    throw new Error("useRequestCart must be used within RequestCartProvider");
  }
  return context;
}
