"use client";

import { useMemo } from "react";
import { useRequestCart } from "@/components/RequestCartProvider";

type AddToRequestButtonProps = {
  productId: string;
  className?: string;
};

export default function AddToRequestButton({ productId, className }: AddToRequestButtonProps) {
  const { addToRequest, items } = useRequestCart();
  const quantityInCart = useMemo(
    () => items.find((item) => item.productId === productId)?.quantity ?? 0,
    [items, productId]
  );

  return (
    <button
      type="button"
      onClick={() => addToRequest(productId)}
      className={className ?? "rounded-md bg-yorkRed px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"}
    >
      {quantityInCart > 0 ? `Add to request list (${quantityInCart})` : "Add to request list"}
    </button>
  );
}
