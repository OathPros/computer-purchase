import type { Category, Vendor } from "@/lib/catalog";

type ProductFiltersProps = {
  categories: Category[];
  vendors: Vendor[];
};

export default function ProductFilters({ categories, vendors }: ProductFiltersProps) {
  return (
    <section className="mb-6 rounded-xl border bg-white p-4">
      <h2 className="mb-3 text-base font-semibold">Filter catalogue</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Category</span>
          <select className="w-full rounded-md border px-3 py-2">
            <option>All categories</option>
            {categories.map((category) => (
              <option key={category.id}>{category.label}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Vendor</span>
          <select className="w-full rounded-md border px-3 py-2">
            <option>All vendors</option>
            {vendors.map((vendor) => (
              <option key={vendor.id}>{vendor.label}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
