"use client";

import { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { services } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

export function ServicesOverview() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const cards = grid.querySelectorAll(".service-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 70, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
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
        const topAccent = card.querySelector(".card-top-accent");
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -8, boxShadow: "0 16px 48px rgba(27,58,138,0.12)", duration: 0.35, ease: "power3.out" });
          if (topAccent) gsap.to(topAccent, { scaleX: 1, duration: 0.4, ease: "power3.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, boxShadow: "0 2px 8px rgba(27,58,138,0.04)", duration: 0.35, ease: "power3.out" });
          if (topAccent) gsap.to(topAccent, { scaleX: 0, duration: 0.3, ease: "power3.in" });
        });
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="section-padding"
      style={{
        backgroundColor: "var(--primary-deeper)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid on dark bg */}
      <div className="absolute inset-0 bg-grid-dark opacity-100 pointer-events-none" />
      {/* Accent glow */}
      <div
        className="absolute -bottom-32 -right-32 pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(204,45,45,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container-custom relative">
        <AnimatedSection>
          <div className="mb-14">
            <span className="section-eyebrow" style={{ color: "rgba(204,45,45,0.8)" }}>What We Do</span>
            <h2
              className="display-section mb-4"
              style={{ color: "#FFFFFF" }}
            >
              What We Deliver
            </h2>
            <p className="text-base md:text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
              From concept to long-term performance.
            </p>
          </div>
        </AnimatedSection>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="service-card group relative overflow-hidden"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                opacity: 0,
                transition: "border-color 0.35s ease",
              }}
            >
              {/* Number background */}
              <div
                className="card-number"
                style={{
                  color: "#FFFFFF",
                  opacity: 0.04,
                  position: "absolute",
                  top: "0.75rem",
                  right: "1rem",
                  fontSize: "3.5rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Top accent */}
              <div
                className="card-top-accent"
                style={{
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
                }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <service.icon size={21} />
              </div>

              <h3
                className="font-display mb-2"
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                  color: "#FFFFFF",
                  opacity: 0.9,
                }}
              >
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                {service.description}
              </p>

              {/* Bottom arrow */}
              <div
                className="mt-5 flex items-center gap-1.5 transition-all duration-300 group-hover:gap-2.5"
                style={{ color: "rgba(204,45,45,0.7)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}
              >
                <span style={{ textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.65rem" }}>Learn More</span>
                <ArrowRight size={12} style={{ transition: "transform 0.3s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
