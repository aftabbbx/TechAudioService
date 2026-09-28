import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  ArrowRight,
  AudioLines,
  Building2,
  Check,
  ChevronRight,
  Clapperboard,
  Cpu,
  MoveUpRight,
  Volume2,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { servicePages, getServicePage } from "@/data/servicePages";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import styles from "./ServiceDetail.module.css";

const serviceIcons = {
  amplifier: Volume2,
  dsp: Cpu,
  cinema: Clapperboard,
  integration: AudioLines,
};

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) return {};

  return buildPageMetadata({
    title: `${service.title} Services`,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

function jsonLd(data) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) notFound();

  const Icon = serviceIcons[service.icon] || Activity;
  const relatedServices = servicePages.filter((item) => item.slug !== service.slug);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      serviceType: service.title,
      description: service.description,
      url: `${SITE_URL}/services/${service.slug}`,
      provider: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
        { "@type": "ListItem", position: 3, name: service.title, item: `${SITE_URL}/services/${service.slug}` },
      ],
    },
  ];

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />

      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={`container-custom ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: service.title }]} />
            <p className={styles.eyebrow}><span />{service.eyebrow}</p>
            <h1>{service.title}</h1>
            <p className={styles.heroLead}>{service.summary}</p>
            <Link className={styles.heroLink} href="/contact">
              Discuss your project <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.soundPanel} aria-hidden="true">
            <div className={styles.soundRings} />
            <div className={styles.soundIcon}><Icon size={37} strokeWidth={1.45} /></div>
            <div className={styles.waveform}>
              {[22, 38, 58, 78, 43, 92, 55, 72, 36, 62, 88, 45, 68, 31, 51, 76, 39].map((height, index) => (
                <i key={index} style={{ "--bar-height": `${height}%`, "--bar-index": index }} />
              ))}
            </div>
            <span className={styles.panelCaption}>Audio, engineered with intent</span>
          </div>
        </div>
      </section>

      <section className={styles.overview}>
        <div className={`container-custom ${styles.overviewGrid}`}>
          <div className={styles.overviewIntro}>
            <p className={styles.sectionEyebrow}>The right system starts with the details</p>
            <h2>{service.focus}</h2>
            <p>{service.description}</p>
            <Link href="/services" className={styles.textLink}>
              Explore all services <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.coverageCard}>
            <div className={styles.coverageHeading}>
              <span className={styles.coverageIcon}><Icon size={19} aria-hidden="true" /></span>
              <div>
                <span className={styles.coverageKicker}>Service scope</span>
                <h3>What we can help with</h3>
              </div>
            </div>
            <ul>
              {service.details.map((detail) => (
                <li key={detail}><span><Check size={13} aria-hidden="true" /></span>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.outcomes}>
        <div className="container-custom">
          <div className={styles.outcomesHead}>
            <div>
              <p className={styles.sectionEyebrow}>Designed around your venue</p>
              <h2>A complete, considered approach</h2>
            </div>
            <p>Each project is shaped around its room, equipment and the people who operate it.</p>
          </div>
          <div className={styles.outcomeGrid}>
            {service.outcomes.map((outcome, index) => (
              <article className={styles.outcomeCard} key={outcome}>
                <span className={styles.outcomeNumber}>0{index + 1}</span>
                <span className={styles.outcomeMark}><Activity size={17} aria-hidden="true" /></span>
                <h3>{outcome}</h3>
              </article>
            ))}
          </div>
          <div className={styles.applications}>
            <div className={styles.applicationsLabel}><Building2 size={17} aria-hidden="true" />Suitable for</div>
            <div className={styles.applicationList}>
              {service.applications.map((application) => <span key={application}>{application}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.process}>
        <div className={`container-custom ${styles.processInner}`}>
          <div className={styles.processIntro}>
            <p className={styles.sectionEyebrow}>From brief to handover</p>
            <h2>Clarity at every stage.</h2>
            <p>We keep the work grounded in your requirements, with a practical path from initial review through commissioning.</p>
          </div>
          <div className={styles.processSteps}>
            {[
              { number: "01", title: "Understand", text: "Review your space, equipment and intended use." },
              { number: "02", title: "Engineer", text: "Plan the system and coordinate its components." },
              { number: "03", title: "Commission", text: "Install, tune and explain the finished system." },
            ].map((step) => (
              <article key={step.number} className={styles.processStep}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.related}>
        <div className="container-custom">
          <div className={styles.relatedHead}>
            <div><p className={styles.sectionEyebrow}>More from AudioTechServices</p><h2>Explore related services</h2></div>
            <Link href="/services" className={styles.textLink}>All services <ChevronRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={styles.relatedGrid}>
            {relatedServices.slice(0, 3).map((item) => {
              const RelatedIcon = serviceIcons[item.icon] || AudioLines;
              return (
                <Link className={styles.relatedCard} href={`/services/${item.slug}`} key={item.slug}>
                  <span className={styles.relatedIcon}><RelatedIcon size={19} aria-hidden="true" /></span>
                  <span className={styles.relatedTitle}>{item.shortTitle}</span>
                  <MoveUpRight size={16} aria-hidden="true" className={styles.relatedArrow} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`container-custom ${styles.ctaInner}`}>
          <div>
            <p className={styles.ctaEyebrow}>Let’s plan your next step</p>
            <h2>Make your audio system work as one.</h2>
            <p>Share your venue, requirements or existing setup with our team.</p>
          </div>
          <Link href="/contact" className={styles.ctaButton}>Talk to our team <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
