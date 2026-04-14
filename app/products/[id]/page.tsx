import { notFound } from "next/navigation";
import { getCategoryLabel, getProductById, getVendorLabel } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <p className="mt-2 text-sm text-gray-600">{product.summary}</p>
      </div>
      <div className="rounded-xl border bg-white p-4">
        <dl className="grid gap-2 text-sm md:grid-cols-2">
          <div>
            <dt className="font-medium">Category</dt>
            <dd>{getCategoryLabel(product.categoryId)}</dd>
          </div>
          <div>
            <dt className="font-medium">Vendor</dt>
            <dd>{getVendorLabel(product.vendorId)}</dd>
          </div>
          <div>
            <dt className="font-medium">Price</dt>
            <dd>${product.price.toFixed(2)}</dd>
          </div>
        </dl>
      </div>
      <section className="rounded-xl border bg-white p-4">
        <h3 className="mb-3 text-lg font-semibold">Specifications</h3>
        <dl className="grid gap-2 text-sm md:grid-cols-2">
          {Object.entries(product.specs).map(([label, value]) => (
            <div key={label}>
              <dt className="font-medium">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
