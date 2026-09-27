"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export function PageLoader() {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const lineRef = useRef(null);
  const progressBarRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on first visit per session
    const hasLoaded = sessionStorage.getItem("ats-loaded-v2");
    if (hasLoaded) return;

    const isMobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      sessionStorage.setItem("ats-loaded-v2", "1");
      return;
    }

    const showTimeout = setTimeout(() => setShow(true), 0);
    document.body.style.overflow = "hidden";

    // Wait for refs to be available after setState
    const timeout = setTimeout(() => {
      const overlay = overlayRef.current;
      const logo = logoRef.current;
      const line = lineRef.current;
      const bar = progressBarRef.current;

      if (!overlay || !logo) return;

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("ats-loaded-v2", "1");
          document.body.style.overflow = "";
          // Brief delay before unmounting
          setTimeout(() => setShow(false), 100);
        },
      });

      if (isMobile) {
        gsap.set(logo, { opacity: 0, y: 12 });
        gsap.set(line, { scaleX: 0, opacity: 0, transformOrigin: "center" });
        gsap.set(bar, { scaleX: 0, transformOrigin: "left" });
        tl.to(logo, { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" })
          .to(line, { scaleX: 1, opacity: 1, duration: 0.28, ease: "power2.out" }, "-=0.18")
          .to(bar, { scaleX: 1, duration: 0.3, ease: "power1.inOut" }, "-=0.08")
          .to(logo, { opacity: 0, y: -8, duration: 0.22, ease: "power1.in" }, "+=0.08")
          .to(overlay, { yPercent: -100, duration: 0.4, ease: "power2.inOut" }, "-=0.08");
        return;
      }

      // 0.0s — Initial state set
      gsap.set(logo, { opacity: 0, y: 28, filter: "blur(8px)" });
      gsap.set(line, { width: 0, opacity: 0 });
      gsap.set(bar, { width: "0%" });

      // 0.2s — Logo reveals
      tl.to(logo, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power4.out",
        delay: 0.2,
      })

      // 0.5s — Thin line extends
      .to(line, {
        width: "200px",
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.2")

      // 0.8s — Progress bar fills
      .to(bar, {
        width: "100%",
        duration: 0.45,
        ease: "power2.inOut",
      }, "-=0.1")

      // 1.1s — Logo exits upward
      .to(logo, {
        opacity: 0,
        y: -32,
        filter: "blur(4px)",
        duration: 0.45,
        ease: "power3.in",
      }, "+=0.1")

      // 1.2s — Line fades
      .to(line, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      }, "<")

      // 1.3s — Overlay slides up and off
        .to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.65,
        ease: "power4.inOut",
      }, "-=0.15");

    }, 50);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="page-loader"
      style={{ clipPath: "inset(0 0 0% 0)", willChange: "transform" }}
      aria-hidden="true"
    >
      {/* Logo */}
      <div ref={logoRef} className="loader-logo relative z-10 flex flex-col items-center gap-3">
        <Image
          src="/logo.png"
          alt="AudioTechServices"
          width={1329}
          height={1183}
          sizes="220px"
          quality={82}
          priority
          className="loader-logo-image"
        />
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
          <div className="tech-dot" style={{ animationDelay: "0s" }} />
          <div className="tech-dot" style={{ animationDelay: "0.3s" }} />
          <div className="tech-dot" style={{ animationDelay: "0.6s" }} />
        </div>
      </div>

      {/* Thin accent line below logo */}
      <div
        ref={lineRef}
        className="loader-line"
      />

      {/* Progress bar */}
      <div
        className="loader-progress"
      >
        <div ref={progressBarRef} className="loader-progress-bar" />
      </div>

      {/* Subtle tech label */}
      <div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(0,0,0,0.3)",
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily: "var(--font-sans)",
          whiteSpace: "nowrap",
        }}
      >
        Professional Audio Engineering
      </div>
    </div>
  );
}
