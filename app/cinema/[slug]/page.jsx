import { ProductDetailLoader } from "@/components/catalog/ProductDetailLoader";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCinemaProductBySlug } from "@/lib/catalog";
import { breadcrumbStructuredData, buildPageMetadata, productStructuredData } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getCinemaProductBySlug(slug);

  if (!product) {
    return {
      title: "Cinema Product Not Found",
      description: "This cinema audio product could not be found in the AudioTechServices catalog.",
      robots: { index: false, follow: true },
      alternates: { canonical: `/cinema/${slug}` },
    };
  }

  return buildPageMetadata({
    title: `${product.name}${product.model ? ` (${product.model})` : ""}`,
    description: product.description || `${product.name} cinema audio equipment from AudioTechServices. Request product details and system support.`,
    path: `/cinema/${slug}`,
    image: product.image,
  });
}

export default async function CinemaProductDetailsPage({ params }) {
  const { slug } = await params;
  const product = await getCinemaProductBySlug(slug);

  return (
    <>
      {product && <JsonLd data={productStructuredData(product, `/cinema/${slug}`)} />}
      {product && <JsonLd data={breadcrumbStructuredData({
        section: "Cinema",
        sectionPath: "/cinema",
        item: { name: product.name, path: `/cinema/${slug}` },
      })} />}
      <ProductDetailLoader basePath="/cinema" slug={slug} initialProduct={product} />
    </>
  );
}
