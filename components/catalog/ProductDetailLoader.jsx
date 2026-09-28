"use client";

import { useEffect, useState } from "react";
import { ProductDetail } from "./ProductDetail";
import { normalizeProductApiItem } from "@/lib/catalog";
import { getApiBaseUrl } from "@/lib/api-url";
import styles from "./ProductDetailLoader.module.css";

export function ProductDetailLoader({ basePath, slug, initialProduct = null }) {
  const [product, setProduct] = useState(initialProduct);
  const [loadState, setLoadState] = useState(initialProduct ? "ready" : "loading");

  useEffect(() => {
    if (initialProduct) return undefined;
    let cancelled = false;
    const loadProduct = async () => {
      try {
        const apiUrl = getApiBaseUrl();
        const response = await fetch(
          `${apiUrl}/api/products/${encodeURIComponent(slug)}`,
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

        if (!data.success || !data.product) {
          setLoadState("not-found");
          return;
        }
        setProduct(normalizeProductApiItem(data.product, apiUrl));
        setLoadState("ready");
      } catch {
        if (!cancelled) setLoadState("error");
      }
    };

    loadProduct();
    return () => { cancelled = true; };
  }, [initialProduct, slug]);

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
