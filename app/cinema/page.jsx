import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AutoRefresh } from "@/components/ui/AutoRefresh";
import { CinemaGrid } from "@/components/cinema/CinemaGrid";
import { cinemaProducts as staticCinemaProducts, cinemaCategories } from "@/data/cinemaProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "AudioTechServices | Digital Cinema Audio Solutions",
  description: "Complete cinema audio catalog — amplifiers, screen speakers, subwoofers, surrounds and DSP management for professional cinema environments.",
};

async function getCinemaProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const res = await fetch(`${apiUrl}/api/cinema`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("API unavailable");

    const data = await res.json();
    if (data.success && data.products?.length > 0) {
      return data.products.map((p) => ({
        id: p._id,
        model: p.model || p.slug,
        name: p.name,
        category: p.category,
        description: p.description,
        image: p.image?.url || "",
        badge: p.badge || undefined,
        specs: Array.isArray(p.specs) ? p.specs : [],
        pdf: p.pdf?.url || undefined,
      }));
    }
  } catch (error) {
    // Fallback
  }
  return staticCinemaProducts;
}

export default async function CinemaPage() {
  const products = await getCinemaProducts();

  return (
    <>
      <AutoRefresh interval={3000} />
      <section className="section-padding pb-0" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Cinema" }]} />
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text)" }}>
              Digital Cinema <span style={{ color: "var(--accent)" }}>Solutions</span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Complete cinema audio catalog — amplifiers, screen speakers, subwoofers, surrounds and DSP management.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <CinemaGrid products={products} categories={cinemaCategories} />
        </div>
      </section>
    </>
  );
}
