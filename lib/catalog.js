import { cache } from "react";

export function catalogSlug(value) {
  return String(value || "item")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatUrl(url, apiUrl) {
  if (url && typeof url === "object") url = url.url;
  if (!url) return "";
  if (typeof url !== "string") return "";
  return url.startsWith("/uploads/") ? `${apiUrl}${url}` : url;
}

function normalizeSpecs(specs) {
  if (!Array.isArray(specs)) return [];
  return specs.map((spec) => typeof spec === "string"
    ? { label: "", value: spec }
    : { label: spec.label || "Specification", value: spec.value || "" });
}

export async function getProductCatalog({ timeoutMs = 0 } = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const controller = timeoutMs > 0 ? new AbortController() : null;
  const timeout = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;
  try {
    const requestOptions = {
      next: { revalidate: 30 },
      ...(controller ? { signal: controller.signal } : {}),
    };
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch(`${apiUrl}/api/products`, requestOptions),
      fetch(`${apiUrl}/api/categories`, requestOptions),
    ]);
    if (!productsResponse.ok) throw new Error("Product catalog unavailable");

    const data = await productsResponse.json();
    const categoryData = categoriesResponse.ok ? await categoriesResponse.json() : null;
    const products = (Array.isArray(data.products) ? data.products : [])
      .map((item) => normalizeProductApiItem(item, apiUrl));

    const categoryNames = [
      "All",
      ...new Set([
        ...(Array.isArray(categoryData?.categories) ? categoryData.categories : []),
        ...products.map((item) => item.category).filter(Boolean),
      ]),
    ];

    return { products, categories: categoryNames };
  } catch {
    return { products: [], categories: ["All"] };
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export const getProductBySlug = cache(async (slug) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const response = await fetch(`${apiUrl}/api/products/${encodeURIComponent(slug)}`, { next: { revalidate: 30 } });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success && data.product ? normalizeProductApiItem(data.product, apiUrl) : null;
  } catch {
    return null;
  }
});

export function normalizeProductApiItem(item, apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") {
  return {
    id: item._id || item.id,
    slug: item.slug || catalogSlug(item.model || item.sku || item.name),
    model: item.model || item.sku || "",
    sku: item.sku || item.model || "",
    mpn: item.model || "",
    brand: typeof item.brand === "string" ? item.brand : item.brand?.name || "",
    name: item.name,
    category: item.category || "Audio",
    description: item.description || "",
    image: formatUrl(item.image, apiUrl),
    badge: item.badge || "",
    specs: normalizeSpecs(item.specs),
    pdf: formatUrl(item.pdf, apiUrl),
    featured: Boolean(item.featured),
    price: item.price || 0,
  };
}
