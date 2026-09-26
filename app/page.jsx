import { Hero } from "@/components/home/Hero";
import { BrandDNA } from "@/components/home/BrandDNA";
import { BrandCarousel } from "@/components/home/BrandCarousel";
import { Ecosystem } from "@/components/home/Ecosystem";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { Industries } from "@/components/home/Industries";
import { CTA } from "@/components/home/CTA";
import { Marquee } from "@/components/ui/Marquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandDNA />
      <BrandCarousel />
      {/* Marquee — between BrandDNA and Ecosystem */}
      <div className="py-6" style={{ backgroundColor: "var(--surface-alt)", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <Marquee />
      </div>
      <Ecosystem />
      <ServicesOverview />
      <Industries />
      <CTA />
    </>
  );
}
