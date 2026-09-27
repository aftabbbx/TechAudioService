import { Hero } from "@/components/home/Hero";
import { BrandDNA } from "@/components/home/BrandDNA";
import { BrandCarousel } from "@/components/home/BrandCarousel";
import { Ecosystem } from "@/components/home/Ecosystem";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { Industries } from "@/components/home/Industries";
import { CTA } from "@/components/home/CTA";
import { Marquee } from "@/components/ui/Marquee";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata, siteStructuredData } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Pro Audio Systems & Cinema Sound",
  description: "Explore professional audio systems, cinema sound, amplifiers, DSP processing, installation and support from AudioTechServices in India and the UK.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={siteStructuredData()} />
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
