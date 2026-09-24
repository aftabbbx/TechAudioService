import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products, productCategories } from "@/data/products";

export const metadata = {
  title: "AudioTechServices | Professional Audio Products",
  description: "Browse our complete range of professional audio products — amplifiers, DSP processors, speakers, subwoofers, and speaker management systems.",
};

export default function ProductsPage() {
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
