"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

// Waveform line positions (subtle background decoration)
const waveLines = [
  { top: "18%", animDelay: "0s", height: "1px", opacity: 0.04 },
  { top: "36%", animDelay: "1.2s", height: "1px", opacity: 0.035 },
  { top: "54%", animDelay: "0.6s", height: "1px", opacity: 0.04 },
  { top: "72%", animDelay: "1.8s", height: "1px", opacity: 0.03 },
];

export function Hero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const visualRef = useRef(null);
  const eyebrowRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const techLinesRef = useRef(null);

  const stats = [siteConfig.stats.years, siteConfig.stats.installations, siteConfig.stats.models];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        gsap.set([eyebrowRef.current, line1Ref.current, line2Ref.current, descRef.current, ctaRef.current, visualRef.current], { opacity: 1, y: 0, clipPath: "none" });
        if (statsRef.current?.children) gsap.set([...statsRef.current.children], { opacity: 1, y: 0 });
        return;
      }

      // Check if loader was shown
      const hasLoaded = sessionStorage.getItem("ats-loaded");
      const startDelay = hasLoaded ? 0.1 : 2.0;

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: startDelay,
      });

      // Set initial states
      gsap.set(eyebrowRef.current, { opacity: 0, y: 20, clipPath: "inset(0 0 100% 0)" });
      gsap.set([line1Ref.current, line2Ref.current], { opacity: 0, y: 70, clipPath: "inset(0 0 100% 0)" });
      gsap.set(descRef.current, { opacity: 0, y: 40 });
      gsap.set(ctaRef.current, { opacity: 0, y: 30 });
      gsap.set(visualRef.current, { opacity: 0, clipPath: "inset(0 100% 0 0)", scale: 1.02 });
      if (statsRef.current?.children) {
        gsap.set([...statsRef.current.children], { opacity: 0, y: 24, scale: 0.92 });
      }

      // Animation sequence
      tl
        // Eyebrow label
        .to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.75,
          ease: "power3.out",
        })
        // Heading line 1
        .to(line1Ref.current, {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.9,
          ease: "power4.out",
        }, "-=0.5")
        // Heading line 2 — slight offset
        .to(line2Ref.current, {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.9,
          ease: "power4.out",
        }, "-=0.7")
        // Description
        .to(descRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        }, "-=0.5")
        // CTA buttons
        .to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        }, "-=0.45")
        // Stats — stagger
        .to(statsRef.current?.children || [], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: "power3.out",
        }, "-=0.35")
        // Right visual — cinematic clip-path reveal
        .to(visualRef.current, {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
        }, 0.2);

      // Parallax on scroll
      gsap.to(contentRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(visualRef.current, {
        y: -70,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

      {/* Waveform background lines */}
      <div className="waveform-bg" ref={techLinesRef} aria-hidden="true">
        {waveLines.map((line, i) => (
          <div
            key={i}
            className="waveform-line"
            style={{
              top: line.top,
              opacity: line.opacity,
              animationDelay: line.animDelay,
              animationDuration: `${4 + i}s`,
              background: `linear-gradient(90deg, transparent 0%, var(--primary) 20%, var(--primary) 80%, transparent 100%)`,
            }}
          />
        ))}
      </div>

      {/* Top-right decorative accent */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top right, rgba(27,58,138,0.06) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center py-12 lg:py-16">

          {/* ─── Left Content ─── */}
          <div ref={contentRef}>
            {/* Eyebrow */}
            <div style={{ overflow: "hidden", marginBottom: "1.25rem" }}>
              <span
                ref={eyebrowRef}
                className="section-eyebrow"
                style={{ opacity: 0 }}
              >
                Professional Audio Engineering
              </span>
            </div>

            {/* Heading — line-by-line reveal */}
            <h1 style={{ marginBottom: "1.5rem" }}>
              <div style={{ overflow: "hidden" }}>
                <div
                  ref={line1Ref}
                  className="display-hero"
                  style={{ color: "var(--text)", opacity: 0 }}
                >
                  Engineering
                </div>
              </div>
              <div style={{ overflow: "hidden" }}>
                <div
                  ref={line2Ref}
                  className="display-hero"
                  style={{ opacity: 0 }}
                >
                  <span style={{ color: "var(--accent)" }}>Authority</span>
                  {" "}in Sound
                </div>
              </div>
            </h1>

            {/* Description */}
            <p
              ref={descRef}
              className="text-base md:text-lg leading-relaxed mb-9 max-w-lg"
              style={{ color: "var(--text-secondary)", opacity: 0, fontWeight: 400 }}
            >
              Professional power amplifiers, DSP processors, cinema-grade audio systems, and complete system integration — engineered for performance, reliability, and long-term operational excellence.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12" style={{ opacity: 0 }}>
              <Button href="/products" size="lg">
                Explore Products <ArrowRight size={17} className="btn-arrow" />
              </Button>
              <Button href="/about" variant="outline" size="lg">
                About Our Brand
              </Button>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex gap-10">
              {stats.map((stat, i) => (
                <div key={i} style={{ opacity: 0 }}>
                  <div
                    className="font-display"
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      color: "var(--primary)",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="tech-label mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right Visual ─── */}
          <div
            ref={visualRef}
            className="relative"
            style={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, var(--primary-deeper) 0%, var(--primary-dark) 50%, var(--primary) 100%)",
                minHeight: "460px",
              }}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-grid-dark opacity-100" />

              {/* Red accent glow — bottom right */}
              <div
                className="absolute bottom-0 right-0 pointer-events-none"
                style={{
                  width: "240px",
                  height: "240px",
                  background: "radial-gradient(circle, rgba(204,45,45,0.12) 0%, transparent 70%)",
                }}
              />
              {/* Blue glow — top left */}
              <div
                className="absolute top-0 left-0 pointer-events-none"
                style={{
                  width: "180px",
                  height: "180px",
                  background: "radial-gradient(circle, rgba(27,58,138,0.2) 0%, transparent 70%)",
                }}
              />

              {/* Tech horizontal lines */}
              <div className="absolute inset-x-0" style={{ top: "30%", opacity: 0.1 }}>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.3)", margin: "0 2rem" }} />
              </div>
              <div className="absolute inset-x-0" style={{ top: "70%", opacity: 0.06 }}>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.3)", margin: "0 2rem" }} />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full p-10 md:p-14" style={{ minHeight: "460px" }}>

                {/* Large ATS logo mark */}
                <div className="mb-8">
                  <img
                    src="/logo.png"
                    alt="ATS"
                    className=""
                    style={{
                      maxWidth: "200px",
                      height: "auto",
                      maxHeight: "80px",
                      objectFit: "contain",
                      opacity: 0.95,
                    }}
                  />
                </div>

                {/* Thin divider */}
                <div style={{ width: "40px", height: "1px", background: "rgba(204,45,45,0.7)", marginBottom: "1.5rem" }} />

                <h2
                  className="font-display mb-2"
                  style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em", opacity: 0.92 }}
                >
                  Professional Audio
                </h2>
                <p
                  className="tech-label"
                  style={{ color: "rgba(255,255,255,0.35)", marginBottom: "2rem" }}
                >
                  Amplification · DSP · Cinema · Integration
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap justify-center gap-2">
                  {["Amplifiers", "DSP", "Cinema", "Speakers", "AMC"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "0.3rem 0.75rem",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        borderRadius: "100px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Corner accent dots */}
                <div
                  className="absolute top-5 right-5 tech-dot"
                  style={{ animationDuration: "2.5s" }}
                  aria-hidden="true"
                />
                <div
                  className="absolute bottom-5 left-5 tech-dot"
                  style={{ animationDuration: "3.2s", animationDelay: "1s", background: "var(--primary)" }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Small floating stat card */}
            <div
              className="absolute -bottom-4 -left-4 hidden md:block"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "0.875rem 1.25rem",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <div className="tech-label" style={{ color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                Quality Tested
              </div>
              <div
                className="font-display"
                style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--primary)" }}
              >
                100%
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
