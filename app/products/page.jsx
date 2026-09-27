import { CatalogHero } from "@/components/catalog/CatalogHero";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getProductCatalog } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Professional Audio Products",
  description: "Browse professional power amplifiers, DSP processors, speakers, subwoofers and audio accessories engineered for commercial sound systems.",
  path: "/products",
});

export default async function ProductsPage() {
  const { products, categories } = await getProductCatalog();

  return (
    <>
      <CatalogHero
        kind="products"
        breadcrumb="Products"
        title="Professional Audio"
        accent="Products"
        description="Engineered for performance, built for reliability. Browse our complete product range."
      />
      <main className="container-custom">
        <ProductGrid products={products} categories={categories} />
      </main>
    </>
  );
}
