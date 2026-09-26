import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";
import { Map } from "@/components/contact/Map";
import { InteriorHero } from "@/components/layout/InteriorHero";
import styles from "./Contact.module.css";

export const metadata = {
  title: "AudioTechServices | Contact",
  description: "Contact AudioTechServices for professional audio consultations, system design, dealership enquiries, and technical support.",
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <InteriorHero
        breadcrumb="Contact"
        title="Let's Talk"
        accent="Sound"
        description="Reach out to our professional audio experts for consultations, system design, or dealership enquiries."
      />

      <section className={styles.contactSection}>
        <div className={`container-custom ${styles.contactGrid}`}>
          <AnimatedSection className={styles.infoColumn} direction="left">
            <ContactInfo />
          </AnimatedSection>
          <AnimatedSection className={styles.mainColumn} direction="right">
            <div className={styles.formStack}>
              <Map />
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
