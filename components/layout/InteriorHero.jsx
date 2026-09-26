import { Breadcrumb } from "@/components/ui/Breadcrumb";
import styles from "./InteriorHero.module.css";

export function InteriorHero({ breadcrumb, title, accent, suffix = "", description }) {
  return (
    <section className={styles.hero}>
      <div className={styles.orbit} aria-hidden="true" />
      <div className={`container-custom ${styles.inner}`}>
        <div className={styles.content}>
          <div className={styles.breadcrumb}><Breadcrumb items={[{ label: breadcrumb }]} /></div>
          <h1>{title} <span>{accent}</span>{suffix}</h1>
          <p>{description}</p>
        </div>
        <div className={styles.soundMark} aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i />
        </div>
      </div>
    </section>
  );
}
