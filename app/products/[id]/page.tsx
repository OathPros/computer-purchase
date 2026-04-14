import Link from "next/link";
import AddToRequestButton from "@/components/AddToRequestButton";
import { getCategoryLabel, getProductById, getVendorLabel } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return (
      <article className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Product not found</h2>
        <p className="mt-2 text-sm text-gray-600">
          We couldn&apos;t find a catalogue item with ID <span className="font-mono">{id}</span>. It may have been removed or the link may be incorrect.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:border-yorkRed hover:text-yorkRed">
            Back to catalogue
          </Link>
          <Link href="/cart" className="rounded-md bg-yorkRed px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Open request cart
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="space-y-6">
      <section className="grid gap-6 rounded-xl border bg-white p-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-gray-50">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{product.name}</h2>
          <p className="mt-1 text-sm text-gray-600">{getVendorLabel(product.vendorId)}</p>
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <p><span className="font-medium">Category:</span> {getCategoryLabel(product.categoryId)}</p>
            <p><span className="font-medium">Platform:</span> {product.platform}</p>
            <p className="sm:col-span-2 text-lg font-semibold text-gray-900">${product.price.toLocaleString("en-CA")}</p>
          </div>
          <p className="mt-4 text-sm text-gray-700">{product.summary}</p>
          <AddToRequestButton productId={product.id} className="mt-6 rounded-md bg-yorkRed px-4 py-2 text-sm font-medium text-white hover:opacity-90" />
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="text-lg font-semibold">Product overview</h3>
        <p className="mt-2 text-sm text-gray-700">{product.fullDescription}</p>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-3 text-lg font-semibold">Full specifications</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <tbody>
              {Object.entries(product.specs).map(([label, value]) => (
                <tr key={label} className="border-t first:border-t-0">
                  <th scope="row" className="w-48 py-3 pr-4 text-left font-medium text-gray-900">{label}</th>
                  <td className="py-3 text-gray-700">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-lg font-semibold">Recommended use cases</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            {product.recommendedUseCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-lg font-semibold">Not recommended for</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            {product.notRecommendedFor.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-lg font-semibold">Warranty</h3>
          <p className="mt-2 text-sm text-gray-700">{product.warranty}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-lg font-semibold">Availability notes</h3>
          <p className="mt-2 text-sm text-gray-700">{product.availabilityNotes}</p>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="text-lg font-semibold">Optional upgrades</h3>
        {product.optionalUpgrades.length ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            {product.optionalUpgrades.map((upgrade) => (
              <li key={upgrade}>{upgrade}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-700">No optional upgrades are currently listed for this product.</p>
        )}
      </section>
    </article>
  );
}
