"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP + ScrollTrigger powered AnimatedSection.
 * Drop-in replacement for the old IntersectionObserver version.
 *
 * Props:
 *  - direction: "up" | "left" | "right" | "down" (default: "up")
 *  - delay: seconds (default: 0)
 *  - duration: seconds (default: 0.8)
 *  - distance: px (default: 60)
 *  - stagger: seconds – if children should stagger (default: 0)
 *  - scrub: boolean – tie animation to scroll position (default: false)
 *  - once: boolean – play only once (default: true)
 */
export function AnimatedSection({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 60,
  stagger = 0,
  scrub = false,
  once = true,
  as: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      return;
    }

    // Determine initial offsets
    const fromVars = { opacity: 0 };
    switch (direction) {
      case "up":    fromVars.y = distance; break;
      case "down":  fromVars.y = -distance; break;
      case "left":  fromVars.x = -distance; break;
      case "right": fromVars.x = distance; break;
    }

    const toVars = {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay: typeof delay === "number" && delay > 10 ? delay / 1000 : delay, // backward compat: old API used ms
      ease: "power3.out",
      stagger: stagger || 0,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        end: "bottom 20%",
        toggleActions: once ? "play none none none" : "play reverse play reverse",
        scrub: scrub ? 1 : false,
      },
    };

    // Set initial state
    gsap.set(el, fromVars);

    const tween = gsap.to(el, toVars);

    return () => {
      tween.kill();
      tween.scrollTrigger?.kill();
    };
  }, [direction, delay, duration, distance, stagger, scrub, once]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
