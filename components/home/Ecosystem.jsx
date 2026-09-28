import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./Ecosystem.module.css";

const features = [
  "Multi-channel power amplifiers",
  "DSP processing",
  "Cinema & auditorium sound systems",
  "Touring-grade reliability",
];

export function Ecosystem() {
  return (
    <section className={`section-padding ${styles.section}`}>
      <div className="container-custom">
        <div className={styles.panel}>
          <div className={styles.intro}>
            <div className={styles.headingBlock}>
              <span className={styles.eyebrow}><span aria-hidden="true" />Product Ecosystem</span>
              <h2>Complete Professional <span>Audio Ecosystem</span></h2>
            </div>

            <div className={styles.descriptionBlock}>
              <p>
                Every product is designed to work together — amplification, processing, control and protection. A unified ecosystem that delivers consistent performance across every component.
              </p>
              <Button href="/products" className={styles.cta}>
                View Products <ArrowRight size={17} className="btn-arrow" />
              </Button>
            </div>
          </div>

          <ul className={styles.featureGrid}>
            {features.map((feature, index) => (
              <li key={feature}>
                <span className={styles.featureNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.featureBody}>
                  <span className={styles.featureIcon}><CheckCircle size={17} aria-hidden="true" /></span>
                  <span>{feature}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
