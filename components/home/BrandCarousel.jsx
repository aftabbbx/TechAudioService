import Image from "next/image";
import styles from "./BrandCarousel.module.css";

const brands = [
  { name: "Dolby", image: "/uploads/home/untitled%20folder/Firefly%20%286%29.png", width: 1920, height: 1080 },
  { name: "N-LABS", image: "/uploads/home/untitled%20folder/Firefly%20%282%29.png", width: 1254, height: 1254 },
  { name: "JBL", image: "/uploads/home/untitled%20folder/Firefly%20%283%29.png", width: 1600, height: 900 },
  { name: "POPE Professional", image: "/uploads/home/untitled%20folder/Firefly%20%284%29.png", width: 659, height: 466 },
  { name: "A-Plus", image: "/uploads/home/untitled%20folder/Firefly%20%285%29.png", width: 1600, height: 533 },
];

function BrandGroup({ duplicate = false }) {
  return (
    <div className={styles.group} aria-hidden={duplicate || undefined}>
      {brands.map((brand) => (
        <div className={styles.logo} key={brand.name}>
          <Image
            src={brand.image}
            alt={duplicate ? "" : brand.name}
            width={brand.width}
            height={brand.height}
            sizes="(max-width: 640px) 168px, 240px"
            quality={80}
          />
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
