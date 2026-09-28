import { getProductCatalog } from "@/lib/catalog";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

function sitemapImage(image) {
  if (!image) return null;

  try {
    const url = new URL(image, `${SITE_URL}/`);
    if (url.protocol !== "https:" || /^(localhost|127\.0\.0\.1)$/i.test(url.hostname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export default async function sitemap() {
  // Keep Googlebot's sitemap request fast when the free Render API is waking up.
  const { products } = await getProductCatalog({ timeoutMs: 5000 });

  const staticPages = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/amplifier-engineering`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services/dsp-processing-solutions`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services/cinema-sound-systems`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services/professional-audio-integration`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const productPages = products.map((product) => {
    const image = sitemapImage(product.image);
    return {
      url: `${SITE_URL}/products/${product.slug}`,
      changeFrequency: "weekly",
      priority: 0.75,
      ...(image ? { images: [image] } : {}),
    };
  });

  return [...staticPages, ...productPages];
}
