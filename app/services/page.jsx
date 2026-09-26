import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { InteriorHero } from "@/components/layout/InteriorHero";
import { Film, Building, Wrench, ArrowRight, Check } from "lucide-react";
import styles from "./Services.module.css";

export const metadata = {
  title: "AudioTechServices | Professional Audio Services",
  description: "Professional audio services — cinema & theatre audio, commercial installations, maintenance & AMC, system design, and technical support.",
};

const mainServices = [
  {
    icon: Film, title: "Cinema & Theatre Audio",
    description: "Complete cinema audio solutions from screen speakers and subwoofers to surround systems and DSP management.",
    points: ["Screen channel speaker systems", "Surround & immersive audio", "DSP speaker management", "Amplification systems"],
  },
  {
    icon: Building, title: "Commercial Installations",
    description: "Professional audio systems for auditoriums, convention centres, houses of worship, and corporate environments.",
    points: ["System design & engineering", "Speaker & amplifier installation", "Network audio infrastructure", "Control system integration"],
  },
  {
    icon: Wrench, title: "Maintenance & AMC",
    description: "Comprehensive annual maintenance contracts and responsive technical support for installed audio systems.",
    points: ["Preventive maintenance visits", "24/7 emergency support", "Firmware & software updates", "Performance optimization"],
  },
];

const processSteps = [
  { step: "01", title: "Consultation", description: "Understanding your requirements, venue acoustics, and performance objectives." },
  { step: "02", title: "Design", description: "Precision system design including speaker placement, amplifier sizing, and DSP configuration." },
  { step: "03", title: "Implementation", description: "Professional installation, wiring, commissioning, and system tuning." },
  { step: "04", title: "Support", description: "Ongoing maintenance, technical support, and system optimization." },
];

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <InteriorHero
        breadcrumb="Services"
        title="Professional Audio &"
        accent="System Integration"
        description="Engineered sound solutions designed for performance, reliability, and long-term operational excellence."
      />

      <section className={styles.services}>
        <div className="container-custom">
          <div className={styles.serviceGrid}>
            {mainServices.map((service, index) => (
              <AnimatedSection key={service.title} delay={index * 100}>
                <article className={styles.serviceCard}>
                  <div className={styles.serviceCardTop}>
                    <div className={styles.serviceIcon}><service.icon size={23} /></div>
                    <span className={styles.serviceNumber}>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h2>{service.title}</h2>
                  <p className={styles.serviceDescription}>{service.description}</p>
                  <ul>
                    {service.points.map((point) => (
                      <li key={point}><span><Check size={12} /></span>{point}</li>
                    ))}
                  </ul>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.metrics}>
        <div className="container-custom">
          <AnimatedSection><SectionHeading title="Proven at Scale" light /></AnimatedSection>
          <AnimatedSection delay={150}>
            <div className={styles.stats}>
              <StatCard value="10+" label="Years of Experience" light />
              <StatCard value="120+" label="Successful Installations" light />
              <StatCard value="100%" label="Quality Compliance" light />
              <StatCard value="24/7" label="Technical Support" light />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className={styles.process}>
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeading eyebrow="How We Work" title="Our Professional Process" subtitle="A structured approach to delivering exceptional audio systems." />
          </AnimatedSection>
          <div className={styles.processGrid}>
            {processSteps.map((step, index) => (
              <AnimatedSection key={step.step} delay={index * 100}>
                <article className={styles.processCard}>
                  <div className={styles.stepNumber}>{step.step}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <AnimatedSection>
          <div className={styles.ctaInner}>
            <h2>Need a Professional Audio Solution?</h2>
            <p>Let us design and implement a system that meets your exact requirements.</p>
            <Button href="/contact" size="lg">Request Consultation <ArrowRight size={18} /></Button>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}
