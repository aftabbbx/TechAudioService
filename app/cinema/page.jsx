import { CatalogHero } from "@/components/catalog/CatalogHero";
import { CinemaGrid } from "@/components/cinema/CinemaGrid";
import { getCinemaCatalog } from "@/lib/catalog";
import { cinemaCategories } from "@/data/cinemaProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "AudioTechServices | Digital Cinema Audio Solutions",
  description: "Complete cinema audio catalog — amplifiers, screen speakers, subwoofers, surrounds and DSP management for professional cinema environments.",
};

export default async function CinemaPage() {
  const products = await getCinemaCatalog();

  return (
    <>
      <CatalogHero
        kind="cinema"
        breadcrumb="Cinema"
        title="Digital Cinema"
        accent="Solutions"
        description="Complete cinema audio catalog — amplifiers, screen speakers, subwoofers, surrounds and DSP management."
      />
      <main className="container-custom">
        <CinemaGrid products={products} categories={cinemaCategories} />
      </main>
    </>
  );
}
