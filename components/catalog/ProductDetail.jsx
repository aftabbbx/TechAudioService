import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductActions } from "./ProductActions";
import { ProductImage } from "./ProductImage";
import styles from "./ProductDetail.module.css";

export function ProductDetail({ product, basePath, related = [] }) {
  const isCinema = basePath === "/cinema";

  return (
    <main className={styles.page}>
      <div className={`container-custom ${styles.breadcrumb}`}>
        <Breadcrumb items={[{ label: isCinema ? "Cinema" : "Products", href: basePath }, { label: product.name }]} />
      </div>

      <section className={`container-custom ${styles.productHero}`}>
        <div className={styles.gallery}>
          <div className={styles.imageStage}>
            <div className={styles.imageHalo} />
            {product.badge && <span className={styles.badge}>{product.badge}</span>}
            <ProductImage
              src={product.image}
              alt={product.name}
              model={product.model}
              imageClassName={styles.productImage}
              fallbackClassName={styles.imagePlaceholder}
            />
          </div>
        </div>

        <div className={styles.summary}>
          <div className={styles.eyebrow}>{product.category}</div>
          {product.model && <div className={styles.model}>{product.model}</div>}
          <h1>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>

          <ProductActions product={product} />
        </div>
      </section>

      <section className={`container-custom ${styles.details}`}>
        <div className={styles.specPanel}>
          <div className={styles.specHeader}>Specifications</div>
          {product.specs.length ? product.specs.map((spec, index) => (
            <div className={`${styles.specRow} ${spec.label ? "" : styles.fullSpec}`} key={`${spec.label}-${index}`}>
              {spec.label && <span>{spec.label}</span>}<strong>{spec.value}</strong>
            </div>
          )) : null}
        </div>
      </section>
    </main>
  );
}
