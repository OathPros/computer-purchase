import type { Product } from "@/lib/catalog";

type ProductComparisonProps = {
  products: Product[];
  vendorMap: Map<string, string>;
  categoryMap: Map<string, string>;
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
};

type ComparisonField = {
  label: string;
  getValue: (product: Product) => string;
};

const comparisonFields: ComparisonField[] = [
  {
    label: "Price",
    getValue: (product) => `$${product.price.toLocaleString("en-CA")}`
  },
  {
    label: "Brand",
    getValue: (product) => product.vendorId
  },
  {
    label: "Category",
    getValue: (product) => product.categoryId
  },
  {
    label: "Platform",
    getValue: (product) => product.platform
  },
  {
    label: "Processor",
    getValue: (product) => product.specs.processor ?? "—"
  },
  {
    label: "Memory",
    getValue: (product) => product.specs.memory ?? "—"
  },
  {
    label: "Storage",
    getValue: (product) => product.specs.storage ?? "—"
  },
  {
    label: "Display",
    getValue: (product) => product.specs.display ?? "—"
  },
  {
    label: "Warranty",
    getValue: (product) => product.warranty
  },
  {
    label: "Recommended use cases",
    getValue: (product) => product.recommendedUseCases.join(", ") || "—"
  }
];

export default function ProductComparison({
  products,
  vendorMap,
  categoryMap,
  onRemoveProduct,
  onClearAll
}: ProductComparisonProps) {
  if (!products.length) {
    return (
      <section className="rounded-xl border border-dashed border-gray-300 bg-white p-6">
        <h3 className="text-xl font-semibold">Compare products</h3>
        <p className="mt-2 text-sm text-gray-600">
          Select up to 3 products from the catalogue to compare price, specs, warranty, and recommended use cases.
        </p>
      </section>
    );
  }

  const withLabels = products.map((product) => ({
    ...product,
    brandLabel: vendorMap.get(product.vendorId) ?? product.vendorId,
    categoryLabel: categoryMap.get(product.categoryId) ?? product.categoryId
  }));

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">Compare products</h3>
          <p className="mt-1 text-sm text-gray-600">{products.length} of 3 selected</p>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:border-yorkRed hover:text-yorkRed"
        >
          Clear comparison
        </button>
      </div>

      <div className="mt-4 hidden overflow-x-auto lg:block">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-48 py-3 pr-3 font-semibold text-gray-900">Feature</th>
              {withLabels.map((product) => (
                <th key={product.id} className="min-w-72 px-3 py-3 align-top font-semibold text-gray-900">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="mt-1 text-xs font-medium text-gray-600">{product.brandLabel}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveProduct(product.id)}
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:border-yorkRed hover:text-yorkRed"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFields.map((field) => (
              <tr key={field.label} className="border-b border-gray-100 last:border-b-0">
                <th scope="row" className="py-3 pr-3 font-medium text-gray-900">{field.label}</th>
                {withLabels.map((product) => (
                  <td key={`${field.label}-${product.id}`} className="px-3 py-3 text-gray-700">
                    {field.label === "Brand"
                      ? product.brandLabel
                      : field.label === "Category"
                        ? product.categoryLabel
                        : field.getValue(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-4 lg:hidden">
        {withLabels.map((product) => (
          <article key={product.id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <p className="text-xs text-gray-600">{product.brandLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveProduct(product.id)}
                className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700"
              >
                Remove
              </button>
            </div>
            <dl className="space-y-2 text-sm">
              {comparisonFields.map((field) => (
                <div key={`${field.label}-${product.id}`} className="grid grid-cols-3 gap-2">
                  <dt className="col-span-1 font-medium text-gray-900">{field.label}</dt>
                  <dd className="col-span-2 text-gray-700">
                    {field.label === "Brand"
                      ? product.brandLabel
                      : field.label === "Category"
                        ? product.categoryLabel
                        : field.getValue(product)}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
