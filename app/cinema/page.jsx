import { CatalogHero } from "@/components/catalog/CatalogHero";
import { CinemaGrid } from "@/components/cinema/CinemaGrid";
import { getCinemaCatalog } from "@/lib/catalog";
import { cinemaCategories } from "@/data/cinemaProducts";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Cinema Audio Systems",
  description: "Explore cinema sound systems, screen channel speakers, surround speakers, subwoofers, cinema amplifiers and DSP management solutions.",
  path: "/cinema",
});

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
