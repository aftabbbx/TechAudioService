import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";
import { Film, Building, Wrench, ArrowRight } from "lucide-react";

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
    <>
      <section className="section-padding pb-0" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Services" }]} />
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text)" }}>
              Professional Audio & <span style={{ color: "var(--accent)" }}>System Integration</span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Engineered sound solutions designed for performance, reliability, and long-term operational excellence.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <AnimatedSection key={service.title} delay={index * 150}>
                <div className="bg-white rounded-xl border p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: "var(--border)" }}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(27,58,138,0.06)", color: "var(--primary)" }}>
                    <service.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>{service.title}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>{service.description}</p>
                  <ul className="space-y-2">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--accent)" }} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--primary-deeper)", color: "white" }}>
        <div className="container-custom">
          <AnimatedSection><SectionHeading title="Proven at Scale" light /></AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard value="25+" label="Years of Experience" light />
              <StatCard value="500+" label="Successful Installations" light />
              <StatCard value="100%" label="Quality Compliance" light />
              <StatCard value="24/7" label="Technical Support" light />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-custom">
          <AnimatedSection>
            <SectionHeading eyebrow="How We Work" title="Our Professional Process" subtitle="A structured approach to delivering exceptional audio systems." />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <AnimatedSection key={step.step} delay={index * 150}>
                <div className="relative p-6 rounded-xl border bg-white text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: "var(--border)" }}>
                  <div className="text-4xl font-bold mb-3 opacity-[0.08]" style={{ color: "var(--primary)" }}>{step.step}</div>
                  <h3 className="text-base font-bold mb-2" style={{ color: "var(--text)" }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-5" style={{ color: "var(--text)" }}>Need a Professional Audio Solution?</h2>
              <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>Let us design and implement a system that meets your exact requirements.</p>
              <Button href="/contact" size="lg">Request Consultation <ArrowRight size={18} /></Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
