"use client";

import { useEffect, useState } from "react";
import { ProductDetail } from "./ProductDetail";
import { cinemaProducts as staticCinemaProducts } from "@/data/cinemaProducts";
import {
  normalizeCinemaApiItem,
  normalizeProductApiItem,
  normalizeStaticCinemaProduct,
} from "@/lib/catalog";
import { getApiBaseUrl } from "@/lib/api-url";
import styles from "./ProductDetailLoader.module.css";

export function ProductDetailLoader({ basePath, slug }) {
  const cinema = basePath === "/cinema";
  const [product, setProduct] = useState(() => cinema
    ? staticCinemaProducts.map(normalizeStaticCinemaProduct).find((item) => item.slug === slug) || null
    : null);
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    const loadProduct = async () => {
      setProduct(null);
      setLoadState("loading");
      try {
        const apiUrl = getApiBaseUrl();
        const response = await fetch(
          `${apiUrl}${cinema ? "/api/cinema" : `/api/products/${encodeURIComponent(slug)}`}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          if (response.status === 404) {
            if (!cancelled) setLoadState("not-found");
            return;
          }
          throw new Error("Product request failed");
        }
        const data = await response.json();
        if (cancelled) return;

        if (cinema) {
          if (!Array.isArray(data.products)) throw new Error("Product response was invalid");
          const products = data.products.map((item) => normalizeCinemaApiItem(item, apiUrl));
          const match = products.find((item) => item.slug === slug);
          setProduct(match || null);
          setLoadState(match ? "ready" : "not-found");
        } else {
          if (!data.success || !data.product) {
            setLoadState("not-found");
            return;
          }
          setProduct(normalizeProductApiItem(data.product, apiUrl));
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) setLoadState("error");
      }
    };

    loadProduct();
    return () => { cancelled = true; };
  }, [basePath, cinema, slug]);

  if (loadState === "loading") {
    return (
      <main className={styles.loading} aria-hidden="true">
        <div className="container-custom">
          <div className={styles.skeletonHero}><div /><div /></div>
          <div className={styles.skeletonSpecs} />
        </div>
      </main>
    );
  }

  if (loadState !== "ready" || !product) {
    return (
      <main className={styles.loading}>
        <div className="container-custom" role={loadState === "error" ? "alert" : undefined}>
          <p>{loadState === "error" ? "Product could not be loaded. Please try again." : "Product not found."}</p>
        </div>
      </main>
    );
  }

  return <ProductDetail product={product} basePath={basePath} />;
}
