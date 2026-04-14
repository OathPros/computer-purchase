import CatalogueHome from "@/components/CatalogueHome";
import { categories, products, vendors } from "@/lib/catalog";

export default function HomePage() {
  return <CatalogueHome products={products} categories={categories} vendors={vendors} />;
}
