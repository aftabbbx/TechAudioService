"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CatalogProductCard } from "./CatalogProductCard";
import { normalizeCinemaApiItem, normalizeProductApiItem } from "@/lib/catalog";
import { getApiBaseUrl } from "@/lib/api-url";
import styles from "./CatalogListing.module.css";

export function CatalogListing({ products, categories, basePath, emptyLabel = "No products found", searchEnabled = false }) {
  const [catalogProducts, setCatalogProducts] = useState(products);
  const [categoryOptions, setCategoryOptions] = useState(categories);
  const [loadState, setLoadState] = useState(products.length ? "ready" : "loading");
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return catalogProducts.filter((product) => {
      const categoryMatch = activeCategory === "All" || product.category === activeCategory;
      const searchMatch = !normalized || [product.name, product.model, product.category, product.description]
        .some((value) => String(value || "").toLowerCase().includes(normalized));
      return categoryMatch && searchMatch;
    });
  }, [catalogProducts, activeCategory, query]);

  useEffect(() => {
    let cancelled = false;
    const cinema = basePath === "/cinema";

    const loadCatalog = async () => {
      try {
        const apiUrl = getApiBaseUrl();
        const response = await fetch(`${apiUrl}${cinema ? "/api/cinema" : "/api/products"}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Catalog request failed");
        const data = await response.json();
        if (!data.success || !Array.isArray(data.products)) throw new Error("Catalog response was invalid");
        if (cancelled) return;

        const normalize = cinema ? normalizeCinemaApiItem : normalizeProductApiItem;
        const liveProducts = data.products.map((item) => normalize(item, apiUrl));
        setCatalogProducts(liveProducts);
        setLoadState("ready");

        if (!cinema) {
          const categoryResponse = await fetch(`${apiUrl}/api/categories`, { cache: "no-store" });
          const categoryData = categoryResponse.ok ? await categoryResponse.json() : null;
          if (!cancelled) {
            setCategoryOptions(["All", ...new Set([
              ...(Array.isArray(categoryData?.categories) ? categoryData.categories : []),
              ...liveProducts.map((product) => product.category).filter(Boolean),
            ])]);
          }
        }
      } catch {
        if (!cancelled) {
          setCatalogProducts([]);
          setCategoryOptions(["All"]);
          setLoadState("error");
        }
      }
    };

    loadCatalog();
    return () => { cancelled = true; };
  }, [basePath, categories]);

  return (
    <section className={styles.section} id="catalog">
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter by category">
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              className={`${styles.filter} ${activeCategory === category ? styles.activeFilter : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {searchEnabled && <label className={styles.search}>
          <Search size={17} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." aria-label="Search products" />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
        </label>}
      </div>

      {loadState === "loading" ? (
        <div className={styles.empty} role="status">Loading products…</div>
      ) : loadState === "error" ? (
        <div className={styles.empty} role="alert">Products could not be loaded. Please try again in a moment.</div>
      ) : filteredProducts.length ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => <CatalogProductCard key={product.id} product={product} basePath={basePath} />)}
        </div>
      ) : (
        <div className={styles.empty}>
          <span>{emptyLabel}</span>
          {basePath !== "/cinema" && <p>Try adjusting your search or filter criteria.</p>}
        </div>
      )}
    </section>
  );
}
