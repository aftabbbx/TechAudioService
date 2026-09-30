import { ProductDetailLoader } from "@/components/catalog/ProductDetailLoader";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";
import { getProductBySlug } from "@/lib/catalog";
import { breadcrumbStructuredData, buildPageMetadata, productStructuredData } from "@/lib/seo";

export const revalidate = 30;

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

  const brandPrefix = product.brand
    && product.brand.toLowerCase() !== siteConfig.name.toLowerCase()
    && !product.name.toLowerCase().includes(product.brand.toLowerCase())
    ? `${product.brand} `
    : "";
  const title = `${brandPrefix}${product.name}${product.model ? ` (${product.model})` : ""}`;

  return buildPageMetadata({
    title,
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
      {product && <JsonLd data={breadcrumbStructuredData({
        section: "Products",
        sectionPath: "/products",
        item: { name: product.name, path: `/products/${slug}` },
      })} />}
      <ProductDetailLoader key={slug} basePath="/products" slug={slug} initialProduct={product} />
    </>
  );
}
