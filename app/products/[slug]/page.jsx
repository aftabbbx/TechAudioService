import { ProductDetailLoader } from "@/components/catalog/ProductDetailLoader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "AudioTechServices | Professional Audio Products",
};

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  return <ProductDetailLoader basePath="/products" slug={slug} />;
}
