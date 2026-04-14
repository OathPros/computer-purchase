import CartDrawer from "@/components/CartDrawer";
import ProductComparison from "@/components/ProductComparison";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import { categories, products, vendors } from "@/lib/catalog";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Approved computer products</h2>
        <p className="mt-2 max-w-3xl text-sm text-gray-700">
          Browse institutional devices and accessories, then add items to your request cart.
        </p>
      </section>
      <ProductFilters categories={categories} vendors={vendors} />
      <ProductGrid products={products} />
      <div className="grid gap-6 lg:grid-cols-2">
        <CartDrawer />
        <ProductComparison products={products.slice(0, 2)} />
      </div>
    </div>
  );
}
