"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function PageLoader() {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const lineRef = useRef(null);
  const progressBarRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on first visit per session
    const hasLoaded = sessionStorage.getItem("ats-loaded");
    if (hasLoaded) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      sessionStorage.setItem("ats-loaded", "1");
      return;
    }

    setShow(true);
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
          sessionStorage.setItem("ats-loaded", "1");
          document.body.style.overflow = "";
          // Brief delay before unmounting
          setTimeout(() => setShow(false), 100);
        },
      });

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
      clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="page-loader"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden="true"
    >
      {/* Logo */}
      <div ref={logoRef} className="loader-logo relative z-10 flex flex-col items-center gap-3">
        <img
          src="/uploads/home/ATS logo.svg"
          alt="AudioTechServices"
          width={180}
          height={46}
          style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
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
        style={{ bottom: "calc(50% - 60px)" }}
      />

      {/* Progress bar */}
      <div
        className="loader-progress"
        style={{ bottom: "calc(50% - 80px)" }}
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
          color: "rgba(255,255,255,0.18)",
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
