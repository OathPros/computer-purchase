"use client";

import { useMemo, useState } from "react";
import AddToRequestButton from "@/components/AddToRequestButton";
import ProductComparison from "@/components/ProductComparison";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import type { Category, Product, Vendor } from "@/lib/catalog";

type CatalogueHomeProps = {
  products: Product[];
  categories: Category[];
  vendors: Vendor[];
};

type PriceRange = "all" | "under-500" | "500-1000" | "1000-1500" | "1500-plus";
type SortOption = "recommended" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [selectedComparisonIds, setSelectedComparisonIds] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      if (activeCategory !== "all" && product.categoryId !== activeCategory) return false;
      if (selectedBrand !== "all" && product.vendorId !== selectedBrand) return false;
      if (selectedPlatform !== "all" && product.platform !== selectedPlatform) return false;
      if (!matchesPriceRange(product.price, selectedPriceRange)) return false;
      if (normalizedQuery) {
        const searchableText = `${product.name} ${product.summary} ${product.fullDescription}`.toLowerCase();
        if (!searchableText.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [products, activeCategory, selectedBrand, selectedPlatform, selectedPriceRange, searchQuery]);

  const visibleProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    if (sortOption === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  }, [filteredProducts, sortOption]);

  const comparedProducts = useMemo(() => {
    return selectedComparisonIds
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product));
  }, [products, selectedComparisonIds]);

  const isCompareLimitReached = selectedComparisonIds.length >= 3;

  function handleComparisonToggle(productId: string) {
    setSelectedComparisonIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, productId];
    });
  }

  function handleRemoveFromComparison(productId: string) {
    setSelectedComparisonIds((current) => current.filter((id) => id !== productId));
  }

  function clearFilters() {
    setActiveCategory("all");
    setSelectedBrand("all");
    setSelectedPlatform("all");
    setSelectedPriceRange("all");
    setSearchQuery("");
    setSortOption("recommended");
  }

  const categoryMap = new Map(categories.map((category) => [category.id, category.label]));
  const vendorMap = new Map(vendors.map((vendor) => [vendor.id, vendor.label]));
  const visibleVendorIds = useMemo(() => {
    return new Set(products.map((product) => product.vendorId));
  }, [products]);
  const availableVendors = useMemo(() => {
    return vendors.filter((vendor) => visibleVendorIds.has(vendor.id));
  }, [vendors, visibleVendorIds]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-yorkRed">Computer Services Overview</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">York University device request catalogue</h2>
        <p className="mt-3 max-w-3xl text-sm text-gray-700 md:text-base">
          Browse approved equipment, compare options, and build your request list for institutional review.
        </p>
        <div className="mt-6 grid gap-4 rounded-xl border border-amber-300 bg-amber-50 p-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-amber-950">Important notice</h3>
            <p className="mt-1 text-sm text-amber-950">
              Due to market volatility and global shortages, listed pricing may change. Contact askIT@yorku.ca for current pricing and delivery timing.
            </p>
          </div>
          <div className="text-sm text-amber-950">
            <p><span className="font-semibold">Eligibility:</span> Current York University Faculty and Staff (University use only).</p>
            <p className="mt-1"><span className="font-semibold">Fulfillment:</span> Final routing and approval follow University procurement processes.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="filter-heading">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Category tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${activeCategory === "all" ? "border-yorkRed bg-yorkRed text-white" : "border-gray-300 bg-white text-gray-800"}`}
          >
            All items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${activeCategory === category.id ? "border-yorkRed bg-yorkRed text-white" : "border-gray-300 bg-white text-gray-800"}`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 id="filter-heading" className="text-base font-semibold">Filter catalogue</h3>
            <button type="button" onClick={clearFilters} className="text-sm font-medium text-yorkRed underline-offset-2 hover:underline">
              Clear filters
            </button>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="text-sm md:col-span-2 xl:col-span-2">
              <span className="mb-1 block font-medium">Search</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search name or description"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Brand</span>
              <select value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900">
                <option value="all">All brands</option>
                {availableVendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>{vendor.label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Platform</span>
              <select value={selectedPlatform} onChange={(event) => setSelectedPlatform(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900">
                <option value="all">All platforms</option>
                <option value="Windows">Windows</option>
                <option value="macOS">macOS</option>
                <option value="Cross-platform">Cross-platform</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Price range</span>
              <select value={selectedPriceRange} onChange={(event) => setSelectedPriceRange(event.target.value as PriceRange)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900">
                {priceRanges.map((range) => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Sort</span>
              <select value={sortOption} onChange={(event) => setSortOption(event.target.value as SortOption)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900">
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <ProductComparison
        products={comparedProducts}
        vendorMap={vendorMap}
        categoryMap={categoryMap}
        onRemoveProduct={handleRemoveFromComparison}
        onClearAll={() => setSelectedComparisonIds([])}
      />

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xl font-semibold">Browse approved products</h3>
          <div className="text-right">
            <p className="text-sm text-gray-700">{visibleProducts.length} item{visibleProducts.length === 1 ? "" : "s"}</p>
            <p className="text-xs text-gray-600">Compare selected: {selectedComparisonIds.length}/3</p>
          </div>
        </div>

        {!visibleProducts.length ? (
          <div className="rounded-xl border border-dashed border-gray-400 bg-white p-8 text-center">
            <p className="text-lg font-medium text-gray-900">No products match your filters.</p>
            <p className="mt-2 text-sm text-gray-700">Clear one or more filters to view additional approved options.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => {
              const keySpecs = Object.entries(product.specs).slice(0, 3);
              return (
                <article key={product.id} className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                  <div className="mb-2 flex flex-wrap gap-2 text-xs font-medium text-gray-700">
                    <span className="rounded-full bg-gray-100 px-2 py-1">{vendorMap.get(product.vendorId) ?? product.vendorId}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-1">{product.platform}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-1">{categoryMap.get(product.categoryId) ?? product.categoryId}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                  <p className="mt-1 text-sm text-gray-700">{product.summary}</p>
                  <p className="mt-3 text-base font-semibold text-gray-900">From ${product.price.toLocaleString("en-CA")}</p>

                  <ul className="mt-3 space-y-1 text-sm text-gray-800">
                    {keySpecs.map(([label, value]) => (
                      <li key={label}>
                        <span className="font-medium">{label}:</span> {value}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/products/${product.id}`} className="rounded-md border border-gray-400 px-3 py-2 text-sm font-medium text-gray-800 hover:border-yorkRed hover:text-yorkRed">
                      View details
                    </Link>
                    <AddToRequestButton productId={product.id} />
                    <button
                      type="button"
                      onClick={() => handleComparisonToggle(product.id)}
                      disabled={isCompareLimitReached && !selectedComparisonIds.includes(product.id)}
                      className={`rounded-md border px-3 py-2 text-sm font-medium ${
                        selectedComparisonIds.includes(product.id)
                          ? "border-yorkRed bg-yorkRed text-white"
                          : "border-gray-400 text-gray-800 hover:border-yorkRed hover:text-yorkRed disabled:cursor-not-allowed disabled:opacity-50"
                      }`}
                    >
                      {selectedComparisonIds.includes(product.id) ? "Selected for compare" : "Compare"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {isCompareLimitReached ? (
          <p className="mt-3 text-sm text-amber-800" role="status">
            Comparison limit reached: remove one selected product to compare another.
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-xl font-semibold">Selection guidance</h3>
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
