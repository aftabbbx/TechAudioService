"use client";

import { useRef, useEffect } from "react";
import { Signal, Thermometer, Plug } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

gsap.registerPlugin(ScrollTrigger);

const dnaCards = [
  {
    number: "01",
    icon: Signal,
    title: "Pure Signal Integrity",
    description: "Every circuit path is optimized for minimal noise, distortion, and crosstalk — preserving the original signal from input to output.",
  },
  {
    number: "02",
    icon: Thermometer,
    title: "Thermal & Power Discipline",
    description: "Advanced thermal management and power supply architecture ensures stable operation under sustained, demanding conditions.",
  },
  {
    number: "03",
    icon: Plug,
    title: "Professional Integration",
    description: "Standard connectors, protocols, and control interfaces ensure seamless integration with existing professional audio infrastructure.",
  },
];

export function BrandDNA() {
  const cardsRef = useRef(null);

  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const cards = container.querySelectorAll(".dna-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      cards.forEach((card) => {
        const topAccent = card.querySelector(".card-top-accent");
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -8, boxShadow: "0 16px 48px rgba(27,58,138,0.13)", duration: 0.35, ease: "power3.out" });
          if (topAccent) gsap.to(topAccent, { scaleX: 1, duration: 0.4, ease: "power3.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, boxShadow: "0 2px 8px rgba(27,58,138,0.05)", duration: 0.35, ease: "power3.out" });
          if (topAccent) gsap.to(topAccent, { scaleX: 0, duration: 0.3, ease: "power3.in" });
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section-padding" style={{ backgroundColor: "var(--surface)" }}>
      <div className="container-custom">
        <AnimatedSection>
          <div className="mb-14">
            <span className="section-eyebrow">Our Foundation</span>
            <h2
              className="display-section"
              style={{ color: "var(--text)", marginBottom: "1rem" }}
            >
              Our Brand DNA
            </h2>
            <p className="text-base md:text-lg" style={{ color: "var(--text-secondary)", maxWidth: "36rem" }}>
              Not marketing promises — engineering principles.
            </p>
          </div>
        </AnimatedSection>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {dnaCards.map((card) => (
            <div
              key={card.title}
              className="dna-card card-premium group p-8 relative"
              style={{ opacity: 0 }}
            >
              {/* Number — large background */}
              <div className="card-number">{card.number}</div>
              {/* Top accent line */}
              <div className="card-top-accent" style={{ transform: "scaleX(0)", transformOrigin: "left" }} />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: "rgba(27,58,138,0.07)",
                  color: "var(--primary)",
                }}
              >
                <card.icon size={22} />
              </div>

              <h3
                className="font-display mb-3"
                style={{ fontSize: "1.1rem", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)" }}
              >
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
