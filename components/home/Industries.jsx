"use client";

import { useRef, useEffect } from "react";
import { Film, Building2, Music, Church } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  { icon: Film, title: "Cinema Halls", description: "Premium cinema audio experiences" },
  { icon: Building2, title: "Auditoriums", description: "Large venue sound systems" },
  { icon: Music, title: "Live Concerts", description: "Touring-grade live sound" },
  { icon: Church, title: "Houses of Worship", description: "Clear, reliable audio" },
];

export function Industries() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const cards = grid.querySelectorAll(".industry-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          clipPath: "inset(100% 0 0% 0)",
          y: 40,
        },
        {
          opacity: 1,
          clipPath: "inset(0% 0 0% 0)",
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -6,
            borderColor: "rgba(255,255,255,0.18)",
            backgroundColor: "rgba(255,255,255,0.07)",
            duration: 0.3,
            ease: "power2.out",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            borderColor: "rgba(255,255,255,0.08)",
            backgroundColor: "rgba(255,255,255,0.03)",
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section-padding" style={{ backgroundColor: "var(--surface)" }}>
      <div className="container-custom">
        <AnimatedSection>
          <div className="mb-14 text-center">
            <span className="section-eyebrow" style={{ justifyContent: "center" }}>Our Reach</span>
            <h2
              className="display-section mb-4"
              style={{ color: "var(--text)" }}
            >
              Trusted Where Failure<br />Is Not an Option
            </h2>
            <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Deployed in mission-critical environments across industries.
            </p>
          </div>
        </AnimatedSection>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((item) => (
            <div
              key={item.title}
              className="industry-card group text-center"
              style={{
                padding: "2.5rem 1.5rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                opacity: 0,
                clipPath: "inset(100% 0 0% 0)",
                cursor: "default",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: "rgba(27,58,138,0.07)",
                  color: "var(--primary)",
                }}
              >
                <item.icon size={24} />
              </div>
              <h3
                className="font-display mb-1"
                style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.015em", color: "var(--text)" }}
              >
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
