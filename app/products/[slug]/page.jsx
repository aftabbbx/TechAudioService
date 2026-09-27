import { ProductDetailLoader } from "@/components/catalog/ProductDetailLoader";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProductBySlug } from "@/lib/catalog";
import { buildPageMetadata, productStructuredData } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product could not be found in the AudioTechServices catalog.",
      robots: { index: false, follow: true },
      alternates: { canonical: `/products/${slug}` },
    };
  }

  return buildPageMetadata({
    title: `${product.name}${product.model ? ` (${product.model})` : ""}`,
    description: product.description || `${product.name} by AudioTechServices. Request product details, pricing and professional audio system support.`,
    path: `/products/${slug}`,
    image: product.image,
  });
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <>
      {product && <JsonLd data={productStructuredData(product, `/products/${slug}`)} />}
      <ProductDetailLoader basePath="/products" slug={slug} initialProduct={product} />
    </>
  );
}
