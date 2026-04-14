"use client";

import Link from "next/link";
import { useRequestCart } from "@/components/RequestCartProvider";

export default function RequestCartNavLink() {
  const { itemCount } = useRequestCart();

  return (
    <Link href="/cart" className="hover:text-yorkRed">
      Request cart{itemCount > 0 ? ` (${itemCount})` : ""}
    </Link>
  );
}
