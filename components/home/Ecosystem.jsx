"use client";

import { useRef, useEffect } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const features = [
  "Multi-channel power amplifiers",
  "DSP processing",
  "Cinema & auditorium sound systems",
  "Touring-grade reliability",
];

export function Ecosystem() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set([imageRef.current], { opacity: 1, clipPath: "inset(0 0 0% 0)" });
      return;
    }

    const ctx = gsap.context(() => {
      // Cinematic clip-path image reveal
      gsap.fromTo(
        imageRef.current,
        {
          opacity: 0,
          clipPath: "inset(100% 0 0% 0)",
          scale: 1.05,
        },
        {
          opacity: 1,
          clipPath: "inset(0% 0 0% 0)",
          scale: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );

      // Feature list items — stagger from right
      const items = listRef.current?.querySelectorAll(".feature-item") || [];
      gsap.fromTo(
        items,
        { opacity: 0, x: 32 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding" style={{ backgroundColor: "var(--background)" }}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Cinematic Visual Panel */}
          <div
            ref={imageRef}
            className="relative image-reveal-wrapper"
            style={{ opacity: 0, clipPath: "inset(100% 0 0% 0)" }}
          >
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                background: "linear-gradient(145deg, var(--primary-deeper) 0%, var(--primary-dark) 55%, var(--primary) 100%)",
                minHeight: "420px",
              }}
            >
              {/* Grid pattern */}
              <div className="absolute inset-0 bg-grid-dark" />

              {/* Decorative lines */}
              <div className="absolute inset-x-8" style={{ top: "25%", height: "1px", background: "rgba(255,255,255,0.07)" }} />
              <div className="absolute inset-x-8" style={{ top: "75%", height: "1px", background: "rgba(255,255,255,0.05)" }} />
              <div className="absolute inset-y-8" style={{ left: "35%", width: "1px", background: "rgba(255,255,255,0.06)" }} />

              {/* Accent glow */}
              <div
                className="absolute top-0 right-0"
                style={{
                  width: "200px",
                  height: "200px",
                  background: "radial-gradient(circle, rgba(204,45,45,0.1) 0%, transparent 70%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-10 md:p-14 text-white" style={{ minHeight: "420px" }}>
                {/* Amplifier icon */}
                <div
                  className="mb-6 flex items-center justify-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "var(--radius-xl)",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <circle cx="12" cy="14" r="4" />
                    <line x1="12" y1="6" x2="12" y2="6.01" />
                    <line x1="9" y1="8" x2="9" y2="8.01" />
                    <line x1="15" y1="8" x2="15" y2="8.01" />
                  </svg>
                </div>

                <h3
                  className="font-display mb-1"
                  style={{ fontSize: "1.375rem", fontWeight: 600, letterSpacing: "-0.02em", opacity: 0.9 }}
                >
                  Professional Amplifier
                </h3>
                <p className="tech-label" style={{ color: "rgba(255,255,255,0.35)", marginBottom: "2rem" }}>
                  DCA Series · Precision Engineered
                </p>

                {/* Frequency bars — audio visual */}
                <div className="flex items-end gap-1" style={{ height: "32px" }}>
                  {[8, 14, 20, 28, 24, 32, 18, 26, 16, 22, 30, 12].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: "3px",
                        height: `${h}px`,
                        borderRadius: "2px",
                        background: i % 3 === 0 ? "var(--accent)" : "rgba(255,255,255,0.2)",
                        opacity: 0.7,
                        animation: `waveformPulse ${1.5 + (i % 3) * 0.4}s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Corner dot */}
                <div className="tech-dot absolute bottom-5 right-5" style={{ animationDuration: "2.8s" }} />
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <AnimatedSection direction="right">
            <span className="section-eyebrow">Product Ecosystem</span>
            <h2
              className="display-section mb-5"
              style={{ color: "var(--text)" }}
            >
              Complete Professional Audio Ecosystem
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
              Every product is designed to work together — amplification, processing, control and protection. A unified ecosystem that delivers consistent performance across every component.
            </p>

            <ul ref={listRef} className="space-y-4 mb-9">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="feature-item flex items-center gap-3.5"
                  style={{ opacity: 0 }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(27,58,138,0.08)" }}
                  >
                    <CheckCircle size={14} style={{ color: "var(--primary)" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--text)", letterSpacing: "0.01em" }}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button href="/products">
              View Products <ArrowRight size={17} className="btn-arrow" />
            </Button>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
