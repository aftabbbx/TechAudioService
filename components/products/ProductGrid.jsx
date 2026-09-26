import { CatalogListing } from "@/components/catalog/CatalogListing";

export function ProductGrid({ products, categories }) {
  return (
    <CatalogListing
      products={products}
      categories={categories}
      basePath="/products"
      emptyLabel="No products found"
      searchEnabled
    />
  );
}
