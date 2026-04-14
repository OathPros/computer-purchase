"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Category, Product, Vendor } from "@/lib/catalog";

type CatalogueHomeProps = {
  products: Product[];
  categories: Category[];
  vendors: Vendor[];
};

type PriceRange = "all" | "under-500" | "500-1000" | "1000-1500" | "1500-plus";

const priceRanges: Array<{ id: PriceRange; label: string }> = [
  { id: "all", label: "All prices" },
  { id: "under-500", label: "Under $500" },
  { id: "500-1000", label: "$500–$1,000" },
  { id: "1000-1500", label: "$1,000–$1,500" },
  { id: "1500-plus", label: "$1,500+" }
];

function matchesPriceRange(price: number, range: PriceRange): boolean {
  if (range === "all") return true;
  if (range === "under-500") return price < 500;
  if (range === "500-1000") return price >= 500 && price <= 1000;
  if (range === "1000-1500") return price > 1000 && price <= 1500;
  return price > 1500;
}

export default function CatalogueHome({ products, categories, vendors }: CatalogueHomeProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>("all");
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeCategory !== "all" && product.categoryId !== activeCategory) return false;
      if (selectedBrand !== "all" && product.vendorId !== selectedBrand) return false;
      if (selectedPlatform !== "all" && product.platform !== selectedPlatform) return false;
      if (!matchesPriceRange(product.price, selectedPriceRange)) return false;
      return true;
    });
  }, [products, activeCategory, selectedBrand, selectedPlatform, selectedPriceRange]);

  const categoryMap = new Map(categories.map((category) => [category.id, category.label]));
  const vendorMap = new Map(vendors.map((vendor) => [vendor.id, vendor.label]));

  function addToRequest(productId: string) {
    setAddedProducts((previous) => new Set(previous).add(productId));
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-yorkRed">Computer Services Overview</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">York University computer purchase catalogue</h2>
        <p className="mt-3 max-w-3xl text-sm text-gray-700 md:text-base">
          Browse approved equipment, compare options, and build your request list for University purchasing support.
        </p>
        <div className="mt-6 grid gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-amber-900">Important notice</h3>
            <p className="mt-1 text-sm text-amber-900">
              Due to market volatility and global shortages, pricing may change. Submit a ticket to askIT@yorku.ca for a final quote and estimated delivery timeline.
            </p>
          </div>
          <div className="text-sm text-amber-900">
            <p><span className="font-semibold">Eligibility:</span> Current York University Faculty and Staff (University use only).</p>
            <p className="mt-1"><span className="font-semibold">Payment:</span> Departmental Cost Centre or Professional Expense Reimbursement (PER).</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Category tabs">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${activeCategory === "all" ? "border-yorkRed bg-yorkRed text-white" : "border-gray-300 bg-white text-gray-700"}`}
          >
            All items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${activeCategory === category.id ? "border-yorkRed bg-yorkRed text-white" : "border-gray-300 bg-white text-gray-700"}`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
          <h3 className="text-base font-semibold">Filter catalogue</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Brand</span>
              <select value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2">
                <option value="all">All brands</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>{vendor.label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Platform</span>
              <select value={selectedPlatform} onChange={(event) => setSelectedPlatform(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2">
                <option value="all">All platforms</option>
                <option value="Windows">Windows</option>
                <option value="macOS">macOS</option>
                <option value="Cross-platform">Cross-platform</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Price range</span>
              <select value={selectedPriceRange} onChange={(event) => setSelectedPriceRange(event.target.value as PriceRange)} className="w-full rounded-md border border-gray-300 px-3 py-2">
                {priceRanges.map((range) => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Browse approved products</h3>
          <p className="text-sm text-gray-600">{visibleProducts.length} item{visibleProducts.length === 1 ? "" : "s"}</p>
        </div>

        {!visibleProducts.length ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-lg font-medium text-gray-900">No products match the selected filters.</p>
            <p className="mt-2 text-sm text-gray-600">Try clearing one or more filters to see additional options.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => {
              const keySpecs = Object.entries(product.specs).slice(0, 3);
              const isAdded = addedProducts.has(product.id);
              return (
                <article key={product.id} className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 aspect-video rounded-lg bg-gray-100 p-3 text-sm text-gray-500">{product.image}</div>
                  <div className="mb-2 flex flex-wrap gap-2 text-xs font-medium text-gray-600">
                    <span className="rounded-full bg-gray-100 px-2 py-1">{vendorMap.get(product.vendorId) ?? product.vendorId}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-1">{product.platform}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-1">{categoryMap.get(product.categoryId) ?? product.categoryId}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                  <p className="mt-1 text-sm text-gray-600">{product.summary}</p>
                  <p className="mt-3 text-base font-semibold text-gray-900">From ${product.price.toLocaleString("en-CA")}</p>

                  <ul className="mt-3 space-y-1 text-sm text-gray-700">
                    {keySpecs.map(([label, value]) => (
                      <li key={label}>
                        <span className="font-medium">{label}:</span> {value}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex gap-2">
                    <Link href={`/products/${product.id}`} className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:border-yorkRed hover:text-yorkRed">
                      View details
                    </Link>
                    <button
                      type="button"
                      onClick={() => addToRequest(product.id)}
                      className={`rounded-md px-3 py-2 text-sm font-medium text-white ${isAdded ? "bg-green-700" : "bg-yorkRed hover:opacity-90"}`}
                    >
                      {isAdded ? "Added" : "Add to request"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-xl font-semibold">Buying advice</h3>
        <p className="mt-2 text-sm text-gray-700">For most users, a practical standard setup is recommended. Choose premium only if portability, durability, and frequent travel are priorities.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="rounded-lg bg-gray-50 p-4">
            <h4 className="font-semibold">Windows recommended setup</h4>
            <p className="mt-2 text-sm text-gray-700">Standard Windows laptop, conferencing monitor, standard monitor, wireless keyboard and mouse, and Dell WH1022 headset for shared spaces.</p>
          </article>
          <article className="rounded-lg bg-gray-50 p-4">
            <h4 className="font-semibold">Mac recommended setup</h4>
            <p className="mt-2 text-sm text-gray-700">MacBook, large conferencing monitor, wireless keyboard and mouse, and Dell WH1022 headset for shared spaces.</p>
          </article>
          <article className="rounded-lg bg-gray-50 p-4">
            <h4 className="font-semibold">Peripheral guidance</h4>
            <p className="mt-2 text-sm text-gray-700">Each setup should include one conferencing monitor and up to one additional standard monitor. A dock is not required with a conferencing monitor.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
