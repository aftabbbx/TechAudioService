import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { InteriorHero } from "@/components/layout/InteriorHero";
import { Signal, Thermometer, Plug, Music, Building2, Church, Presentation, ArrowRight, ShieldCheck } from "lucide-react";
import styles from "./About.module.css";

export const metadata = {
  title: "AudioTechServices | About Us",
  description: "Learn about AudioTechServices — professional audio engineering, amplifiers, DSP processing, and system integration.",
};

const philosophy = [
  { icon: Signal, title: "Pure Signal Integrity", description: "Every circuit path is optimized for minimal noise and distortion." },
  { icon: Thermometer, title: "Thermal Stability", description: "Advanced thermal management for sustained high-power operation." },
  { icon: Plug, title: "System Ready Design", description: "Standard interfaces for seamless professional integration." },
];

const industries = [
  { icon: Music, title: "Live Sound & Touring", description: "Road-tested reliability for touring professionals." },
  { icon: Building2, title: "Auditoriums & Theatres", description: "Premium installed sound for performance venues." },
  { icon: Church, title: "Houses of Worship", description: "Clear, reliable audio for congregational spaces." },
  { icon: Presentation, title: "Conference & PA Systems", description: "Professional audio for corporate environments." },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <InteriorHero
        breadcrumb="About"
        title="We Engineer"
        accent="Authority"
        suffix=" in Sound"
        description="Professional audio solutions built for power, precision, and reliability."
      />

      <section className={styles.metrics}>
        <div className={`container-custom ${styles.metricsInner}`}>
          <AnimatedSection>
            <div className={styles.metricsIntro}>
              <h2>Precision Engineering for Powerful Sound</h2>
              <p>
                Our products are born from deep expertise in professional power amplifiers, DSP processing, and system stability. Every design decision is validated through real-world testing, ensuring long-term performance in the most demanding environments.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className={styles.stats}>
              <StatCard value="10+" label="Years Expertise" light />
              <StatCard value="120+" label="Installations" light />
              <StatCard value="50+" label="Products" light />
              <StatCard value="100%" label="Quality Tested" light />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className={styles.philosophy}>
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeading eyebrow="Our Approach" title="Our Engineering Philosophy" subtitle="Every product embodies these core engineering principles." />
          </AnimatedSection>
          <div className={styles.philosophyGrid}>
            {philosophy.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 120}>
                <article className={styles.philosophyCard}>
                  <div className={styles.iconBox}><item.icon size={23} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.reach}>
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeading eyebrow="Our Reach" title="Trusted by Audio Professionals" subtitle="Deployed across diverse industries worldwide." />
          </AnimatedSection>
          <div className={styles.industryGrid}>
            {industries.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 100}>
                <article className={styles.industryCard}>
                  <div className={styles.iconBox}><item.icon size={23} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.quality}>
        <AnimatedSection>
          <div className={styles.qualityCard}>
            <div className={styles.qualityIcon}><ShieldCheck size={27} /></div>
            <h2>Our Commitment to Quality</h2>
            <p>
              Every product undergoes rigorous testing protocols — thermal cycling, signal integrity measurement, and extended burn-in — before it leaves our facility. We stand behind every unit with comprehensive warranty and responsive technical support.
            </p>
          </div>
        </AnimatedSection>
      </section>

      <section className={styles.cta}>
        <AnimatedSection>
          <div className={styles.ctaInner}>
            <h2>Experience Professional-Grade Audio</h2>
            <p>Connect with our engineering team to discuss your requirements.</p>
            <Button href="/contact" size="lg">Contact Our Team <ArrowRight size={18} /></Button>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}
