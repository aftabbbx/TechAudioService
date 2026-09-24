import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Signal, Thermometer, Plug, Music, Building2, Church, Presentation, ArrowRight, ShieldCheck } from "lucide-react";

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
    <>
      <section className="section-padding pb-0" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <Breadcrumb items={[{ label: "About" }]} />
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text)" }}>
              We Engineer <span style={{ color: "var(--accent)" }}>Authority</span> in Sound
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Professional audio solutions built for power, precision, and reliability.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-16 lg:pb-24 pt-8 lg:pt-12" style={{ backgroundColor: "var(--primary-deeper)", color: "white" }}>
        <div className="container-custom">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Precision Engineering for Powerful Sound</h2>
              <p className="text-base leading-relaxed opacity-70">
                Our products are born from deep expertise in professional power amplifiers, DSP processing, and system stability. Every design decision is validated through real-world testing, ensuring long-term performance in the most demanding environments.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard value="20+" label="Years Expertise" light />
              <StatCard value="1000+" label="Installations" light />
              <StatCard value="50+" label="Products" light />
              <StatCard value="100%" label="Quality Tested" light />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeading eyebrow="Our Approach" title="Our Engineering Philosophy" subtitle="Every product embodies these core engineering principles." />
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {philosophy.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 150}>
                <div className="group p-8 rounded-xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full" style={{ borderColor: "var(--border)" }}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(27,58,138,0.06)", color: "var(--primary)" }}>
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeading eyebrow="Our Reach" title="Trusted by Audio Professionals" subtitle="Deployed across diverse industries worldwide." />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 120}>
                <div className="group p-6 rounded-xl border bg-white text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: "var(--border)" }}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(27,58,138,0.06)", color: "var(--primary)" }}>
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-base font-bold mb-1" style={{ color: "var(--text)" }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-custom">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto rounded-xl border p-8 md:p-12 text-center" style={{ borderColor: "var(--border)", backgroundColor: "white" }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(27,58,138,0.06)", color: "var(--primary)" }}>
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>Our Commitment to Quality</h3>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                Every product undergoes rigorous testing protocols — thermal cycling, signal integrity measurement, and extended burn-in — before it leaves our facility. We stand behind every unit with comprehensive warranty and responsive technical support.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-5" style={{ color: "var(--text)" }}>Experience Professional-Grade Audio</h2>
              <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>Connect with our engineering team to discuss your requirements.</p>
              <Button href="/contact" size="lg">Contact Our Team <ArrowRight size={18} /></Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
