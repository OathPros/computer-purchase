import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/catalog";

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return <p className="rounded-lg border bg-white p-6 text-sm text-gray-600">No products match the selected filters.</p>;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
