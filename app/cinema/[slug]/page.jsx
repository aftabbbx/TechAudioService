import { ProductDetailLoader } from "@/components/catalog/ProductDetailLoader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "AudioTechServices | Digital Cinema Audio Solutions",
};

export default async function CinemaProductDetailsPage({ params }) {
  const { slug } = await params;
  return <ProductDetailLoader basePath="/cinema" slug={slug} />;
}
