import { getCinemaCatalog, getProductCatalog } from "@/lib/catalog";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const [{ products }, cinemaProducts] = await Promise.all([
    getProductCatalog(),
    getCinemaCatalog(),
  ]);

  const staticPages = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/cinema`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const productPages = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
    ...(product.image?.startsWith("https://") ? { images: [product.image] } : {}),
  }));

  const cinemaPages = cinemaProducts.map((product) => ({
    url: `${SITE_URL}/cinema/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
    ...(product.image?.startsWith("https://") ? { images: [product.image] } : {}),
  }));

  return [...staticPages, ...productPages, ...cinemaPages];
}
