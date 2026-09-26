import Link from "next/link";
import { ArrowRight, Download, MoveUpRight } from "lucide-react";
import { forceDownload } from "@/lib/download";
import { ProductImage } from "./ProductImage";
import styles from "./CatalogProductCard.module.css";

export function CatalogProductCard({ product, basePath }) {
  const highlights = product.specs.slice(0, basePath === "/cinema" ? 3 : 4).map((spec) => spec.value || spec.label);
  return (
    <article className={styles.card}>
      <Link href={`${basePath}/${product.slug}`} className={styles.imageLink} aria-label={`View ${product.name}`}>
        <div className={styles.visual}>
          <span className={styles.visualGlow} />
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
          <ProductImage
            src={product.image}
            alt={product.name}
            model={product.model}
            imageClassName={styles.image}
            fallbackClassName={styles.placeholder}
          />
          <span className={styles.imageAction}><MoveUpRight size={18} /></span>
        </div>
      </Link>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{product.category}</span>
          {product.model && <span className={styles.model}>{product.model}</span>}
        </div>
        <Link href={`${basePath}/${product.slug}`} className={styles.titleLink}>
          <h2>{product.name}</h2>
        </Link>
        <p className={styles.description}>{product.description}</p>
        {highlights.length > 0 && (
          <div className={styles.highlights}>
            {highlights.map((highlight, index) => <span key={`${highlight}-${index}`}>{highlight}</span>)}
          </div>
        )}
        <div className={styles.footer}>
          <Link href={`${basePath}/${product.slug}`} className={styles.detailsLink}>
            View Details <ArrowRight size={16} />
          </Link>
          {product.pdf && (
            <button type="button" onClick={() => forceDownload(product.pdf, `${product.model || "product"}-datasheet.pdf`)} className={styles.download} aria-label={`Download ${product.model} datasheet`} title="Download Datasheet">
              <Download size={16} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
