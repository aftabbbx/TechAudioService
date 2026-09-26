import { cinemaProducts as staticCinemaProducts } from "@/data/cinemaProducts";

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

export async function getProductCatalog() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch(`${apiUrl}/api/products`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/categories`, { cache: "no-store" }),
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
  }
}

export function normalizeStaticCinemaProduct(item) {
  return {
    ...item,
    slug: item.slug || catalogSlug(item.model || item.id),
    specs: normalizeSpecs(item.specs),
  };
}

export function normalizeProductApiItem(item, apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") {
  return {
    id: item._id || item.id,
    slug: item.slug || catalogSlug(item.model || item.sku || item.name),
    model: item.model || item.sku || "",
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

export function normalizeCinemaApiItem(item, apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") {
  return {
    id: item._id || item.id,
    slug: item.slug || catalogSlug(item.model || item.name),
    model: item.model || "",
    name: item.name,
    category: item.category || "Cinema Audio",
    description: item.description || "",
    image: formatUrl(item.image, apiUrl),
    badge: item.badge || "",
    specs: normalizeSpecs(item.specs),
    pdf: formatUrl(item.pdf, apiUrl),
  };
}

export async function getCinemaCatalog() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const response = await fetch(`${apiUrl}/api/cinema`, { cache: "no-store" });
    if (!response.ok) throw new Error("Cinema catalog unavailable");
    const data = await response.json();
    if (data.success && Array.isArray(data.products) && data.products.length > 0) {
      return data.products.map((item) => normalizeCinemaApiItem(item, apiUrl));
    }
  } catch {
    // Use the bundled catalog when the API is unavailable.
  }

  return staticCinemaProducts.map(normalizeStaticCinemaProduct);
}
