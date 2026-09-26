"use client";

import Link from "next/link";
import { AlertCircle, Download, MessageSquare } from "lucide-react";
import { forceDownload } from "@/lib/download";
import styles from "./ProductDetail.module.css";

export function ProductActions({ product }) {
  return (
    <div className={styles.actions}>
      <Link href="/contact" className={styles.quote}><MessageSquare size={17} /> Request Quote</Link>
      {product.pdf ? (
        <button
          type="button"
          onClick={() => forceDownload(product.pdf, `${product.model || "product"}-datasheet.pdf`)}
          className={styles.datasheet}
        >
          <Download size={17} /> Download Datasheet
        </button>
      ) : (
        <button type="button" disabled className={styles.unavailable}><AlertCircle size={17} /> PDF Not Available</button>
      )}
    </div>
  );
}
