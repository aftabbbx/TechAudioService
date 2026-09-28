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
    let showTimeout;
    let animationTimeout;
    let watchdogTimeout;
    let hideTimeout;
    let timeline;
    let dismissed = false;

    // A hard refresh on iOS can restart a webview while its previous loader
    // animation is suspended. The page itself is already server-rendered, so
    // skip the intro on reload and reveal it immediately.
    const navigationType = window.performance?.getEntriesByType?.("navigation")?.[0]?.type;
    const legacyReload = window.performance?.navigation?.type === 1;
    if (navigationType === "reload" || legacyReload) {
      try {
        window.sessionStorage.setItem("ats-loaded-v2", "1");
      } catch {
        // Storage can be unavailable in private or embedded browser contexts.
      }
      return;
    }

    // Mark the session before animating so a refresh during the intro cannot
    // trap the visitor in the loader again.
    try {
      if (window.sessionStorage.getItem("ats-loaded-v2")) return;
      window.sessionStorage.setItem("ats-loaded-v2", "1");
    } catch {
      // Safari privacy modes can restrict storage. The visual watchdog below
      // still guarantees the page is revealed.
    }

    const isMobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const dismiss = (fade = true) => {
      if (dismissed) return;
      dismissed = true;
      timeline?.kill();

      const overlay = overlayRef.current;
      if (!fade || !overlay) {
        setShow(false);
        return;
      }

      try {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.25,
          ease: "power1.out",
          onComplete: () => setShow(false),
        });
        hideTimeout = setTimeout(() => setShow(false), 450);
      } catch {
        setShow(false);
      }
    };

    showTimeout = setTimeout(() => setShow(true), 0);

    // Wait for refs to be available after setState
    animationTimeout = setTimeout(() => {
      const overlay = overlayRef.current;
      const logo = logoRef.current;
      const line = lineRef.current;
      const bar = progressBarRef.current;

      if (!overlay || !logo) {
        dismiss();
        return;
      }

      timeline = gsap.timeline({ onComplete: () => dismiss(false) });

      if (isMobile) {
        gsap.set(logo, { opacity: 0, y: 12 });
        gsap.set(line, { scaleX: 0, opacity: 0, transformOrigin: "center" });
        gsap.set(bar, { scaleX: 0, transformOrigin: "left" });
        timeline.to(logo, { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" })
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
      timeline.to(logo, {
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

    // Covers interrupted animation frames and browser/webview quirks on iOS.
    watchdogTimeout = setTimeout(() => dismiss(), 4000);

    const handlePageShow = (event) => {
      if (event.persisted) dismiss(false);
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(animationTimeout);
      clearTimeout(watchdogTimeout);
      clearTimeout(hideTimeout);
      window.removeEventListener("pageshow", handlePageShow);
      timeline?.kill();
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
          src="/brand-logo.png"
          alt="AudioTechServices"
          width={491}
          height={230}
          sizes="(max-width: 600px) 180px, 250px"
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
