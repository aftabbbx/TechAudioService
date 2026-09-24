import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products as staticProducts, productCategories } from "@/data/products";

export const metadata = {
  title: "AudioTechServices | Professional Audio Products",
  description: "Browse our complete range of professional audio products — amplifiers, DSP processors, speakers, subwoofers, and speaker management systems.",
};

/**
 * Fetch active products from the Express API.
 * Maps MongoDB document fields → the exact shape ProductCard expects.
 * Falls back gracefully to static data if the API is unavailable.
 */
async function getProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const res = await fetch(`${apiUrl}/api/products`, {
      next: { revalidate: 60 }, // ISR — revalidate every 60 seconds
      cache: "no-store",
    });
    if (!res.ok) throw new Error("API unavailable");

    const data = await res.json();
    if (data.success && data.products?.length > 0) {
      // Map API shape → ProductCard shape (same as data/products.js)
      return data.products.map((p) => ({
        id: p._id,
        model: p.model || p.sku,                    // model number (e.g. "DCA4000")
        name: p.name,
        category: p.category,
        description: p.description,
        image: p.image?.url || "",                   // Cloudinary URL or local /public path
        badge: p.badge || undefined,
        specs: Array.isArray(p.specs) ? p.specs : [],
        pdf: p.pdf?.url || undefined,               // Cloudinary URL or local /public path
        featured: p.featured,
        price: p.price || 0,
      }));
    }
  } catch {
    // Silently fall back to the static hardcoded data
  }
  return staticProducts;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <section className="section-padding pb-0" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Products" }]} />
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text)" }}>
              Professional Audio <span style={{ color: "var(--accent)" }}>Products</span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Engineered for performance, built for reliability. Browse our complete product range.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <ProductGrid products={products} categories={productCategories} />
        </div>
      </section>
    </>
  );
}
