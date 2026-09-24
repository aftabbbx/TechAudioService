import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";
import { Map } from "@/components/contact/Map";

export const metadata = {
  title: "AudioTechServices | Contact",
  description: "Contact AudioTechServices for professional audio consultations, system design, dealership enquiries, and technical support.",
};

export default function ContactPage() {
  return (
    <>
      <section className="section-padding pb-0" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Contact" }]} />
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text)" }}>
              Let&apos;s Talk <span style={{ color: "var(--accent)" }}>Sound</span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Reach out to our professional audio experts for consultations, system design, or dealership enquiries.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-16 lg:pb-24 pt-8 lg:pt-12" style={{ backgroundColor: "var(--background)" }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <AnimatedSection className="lg:col-span-2" direction="left">
              <ContactInfo />
            </AnimatedSection>

            {/* Form & Map */}
            <AnimatedSection className="lg:col-span-3" direction="right">
              <div className="space-y-8">
                <Map />
                <ContactForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
