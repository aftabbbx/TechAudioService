"use client";

import { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        content.querySelector(".cta-eyebrow"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
      .fromTo(
        content.querySelector("h2"),
        { opacity: 0, y: 50, clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power4.out" },
        "-=0.3"
      )
      .fromTo(
        content.querySelector("p"),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        content.querySelector(".cta-btn"),
        { opacity: 0, y: 20, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );

      // Tech line reveal
      const techLine = content.querySelector(".cta-tech-line");
      if (techLine) {
        gsap.fromTo(techLine,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: "var(--primary-deeper)" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-dark pointer-events-none" />

      {/* Top accent glow — left */}
      <div
        className="absolute -top-24 -left-24 pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(27,58,138,0.35) 0%, transparent 70%)",
        }}
      />
      {/* Bottom accent glow — right */}
      <div
        className="absolute -bottom-24 -right-24 pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(204,45,45,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Thin horizontal line — top */}
      <div
        className="cta-tech-line absolute top-0 left-0 right-0"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(204,45,45,0.4) 30%, rgba(27,58,138,0.5) 70%, transparent 100%)",
          transformOrigin: "left",
        }}
      />

      <div className="container-custom relative">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center">

          <span
            className="cta-eyebrow section-eyebrow"
            style={{
              justifyContent: "center",
              color: "rgba(204,45,45,0.75)",
              marginBottom: "1.5rem",
              opacity: 0,
            }}
          >
            Get Started
          </span>

          <h2
            className="display-section mb-6"
            style={{ color: "#FFFFFF", opacity: 0 }}
          >
            Let&apos;s Engineer Sound<br />
            <span style={{ color: "var(--accent)" }}>That Performs</span>
          </h2>

          <p
            className="text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.5)", opacity: 0 }}
          >
            Speak with our technical experts and build a system that delivers clarity, power and reliability.
          </p>

          <div className="cta-btn" style={{ opacity: 0 }}>
            <Button href="/contact" size="lg">
              Contact Our Team
              <ArrowRight size={18} className="btn-arrow" />
            </Button>
          </div>

          {/* Bottom tech decoration */}
          <div
            className="mt-16 flex items-center justify-center gap-4 opacity-20"
          >
            <div style={{ height: "1px", width: "60px", background: "rgba(255,255,255,0.3)" }} />
            <div className="tech-dot" />
            <div style={{ height: "1px", width: "60px", background: "rgba(255,255,255,0.3)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
