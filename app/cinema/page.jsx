import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CinemaGrid } from "@/components/cinema/CinemaGrid";
import { cinemaProducts, cinemaCategories } from "@/data/cinemaProducts";

export const metadata = {
  title: "AudioTechServices | Digital Cinema Audio Solutions",
  description: "Complete cinema audio catalog — amplifiers, screen speakers, subwoofers, surrounds and DSP management for professional cinema environments.",
};

export default function CinemaPage() {
  return (
    <>
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
          <CinemaGrid products={cinemaProducts} categories={cinemaCategories} />
        </div>
      </section>
    </>
  );
}
