import styles from "./BrandCarousel.module.css";

const brands = [
  { name: "Dolby Atmos", image: "/brands/dolby-atmos.svg" },
  { name: "A-Plus", image: "/brands/a-plus.svg" },
  { name: "JBL", image: "/brands/jbl.svg" },
  { name: "POPE Professional", image: "/brands/pope-professional.svg" },
  { name: "N-LABS", image: "/brands/n-labs.svg" },
];

function BrandGroup({ duplicate = false }) {
  return (
    <div className={styles.group} aria-hidden={duplicate || undefined}>
      {brands.map((brand) => (
        <div className={styles.logo} key={brand.name}>
          <img src={brand.image} alt={duplicate ? "" : brand.name} />
        </div>
      ))}
    </div>
  );
}

export function BrandCarousel() {
  return (
    <section className={`${styles.section} section-padding`} aria-labelledby="brand-carousel-title">
      <div className="container-custom">
        <header className={styles.header}>
          <h2 id="brand-carousel-title" className={styles.title}>Brands AAT works with</h2>
          <p className={styles.description}>
            Integration experience with leading audio brands for flexible, high-quality systems.
          </p>
        </header>

        <div className={styles.viewport} aria-label="Partner brands">
          <div className={styles.track}>
            <BrandGroup />
            <BrandGroup duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
