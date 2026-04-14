"use client";

import Link from "next/link";
import { useRequestCart } from "@/components/RequestCartProvider";

export default function RequestCartNavLink() {
  const { itemCount } = useRequestCart();

  return (
    <Link href="/cart" className="rounded-sm hover:text-yorkRed" aria-label={`Request list${itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`}>
      Request list{itemCount > 0 ? ` (${itemCount})` : ""}
    </Link>
  );
}
