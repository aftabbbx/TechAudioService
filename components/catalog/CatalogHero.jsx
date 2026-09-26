import { Headphones } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import styles from "./CatalogHero.module.css";

export function CatalogHero({ kind, breadcrumb, title, accent, description }) {
  const cinema = kind === "cinema";

  return (
    <section className={`${styles.hero} ${cinema ? styles.cinema : ""}`}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container-custom ${styles.inner}`}>
        <div className={styles.copy}>
          <div className={styles.breadcrumb}><Breadcrumb items={[{ label: breadcrumb }]} /></div>
          <h1>{title} <span>{accent}</span></h1>
          <p>{description}</p>
        </div>
        <div className={styles.signal} aria-hidden="true">
          <div className={styles.signalRing} />
          <div className={styles.signalCore}><Headphones size={66} strokeWidth={1.1} /></div>
        </div>
      </div>
    </section>
  );
}
