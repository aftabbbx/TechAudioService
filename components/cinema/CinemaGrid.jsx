import { CatalogListing } from "@/components/catalog/CatalogListing";

export function CinemaGrid({ products, categories }) {
  return (
    <CatalogListing
      products={products}
      categories={categories}
      basePath="/cinema"
      emptyLabel="No cinema products found"
    />
  );
}
