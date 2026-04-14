import Link from "next/link";
import type { Product } from "@/lib/catalog";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 aspect-video rounded-lg bg-gray-100 p-3 text-sm text-gray-500">{product.image}</div>
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mb-3 mt-1 text-sm text-gray-600">{product.summary}</p>
      <p className="mb-4 text-base font-medium">${product.price.toFixed(2)}</p>
      <div className="flex gap-2">
        <Link href={`/products/${product.id}`} className="rounded-md border px-3 py-2 text-sm font-medium hover:border-yorkRed hover:text-yorkRed">
          View details
        </Link>
        <button type="button" className="rounded-md bg-yorkRed px-3 py-2 text-sm font-medium text-white hover:opacity-90">
          Add to request
        </button>
      </div>
    </article>
  );
}
