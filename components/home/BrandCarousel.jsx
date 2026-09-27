import styles from "./BrandCarousel.module.css";

const brands = [
  { name: "Dolby", image: "/uploads/home/untitled%20folder/Firefly%20%286%29.png" },
  { name: "N-LABS", image: "/uploads/home/untitled%20folder/Firefly%20%282%29.png" },
  { name: "JBL", image: "/uploads/home/untitled%20folder/Firefly%20%283%29.png" },
  { name: "POPE Professional", image: "/uploads/home/untitled%20folder/Firefly%20%284%29.png" },
  { name: "A-Plus", image: "/uploads/home/untitled%20folder/Firefly%20%285%29.png" },
];

function BrandGroup({ duplicate = false }) {
  return (
    <div className={styles.group} aria-hidden={duplicate || undefined}>
      {brands.map((brand) => (
        <div className={styles.logo} key={brand.name}>
          <img src={brand.image} alt={duplicate ? "" : brand.name} loading="lazy" decoding="async" />
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
          <h2 id="brand-carousel-title" className={styles.title}>
            Brands <span className={styles.atsBlack}>ATS</span> works with
          </h2>
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
