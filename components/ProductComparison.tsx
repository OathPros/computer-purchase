import type { Product } from "@/lib/catalog";

type ProductComparisonProps = {
  products: Product[];
};

export default function ProductComparison({ products }: ProductComparisonProps) {
  return (
    <section className="rounded-xl border bg-white p-4">
      <h2 className="mb-2 text-base font-semibold">Product comparison (placeholder)</h2>
      <p className="text-sm text-gray-600">
        Compare up to three products by key specs. Selected count: {products.length}
      </p>
    </section>
  );
}
