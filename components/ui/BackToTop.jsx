"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/components/providers/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export function BackToTop() {
  const btnRef = useRef(null);
  const lenisRef = useLenis();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    // Show/hide based on scroll position using ScrollTrigger
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "400px top",
      onToggle: (self) => {
        setIsVisible(self.isActive);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.start === "400px top") st.kill();
      });
    };
  }, []);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    gsap.to(btn, {
      opacity: isVisible ? 1 : 0,
      y: isVisible ? 0 : 20,
      scale: isVisible ? 1 : 0.8,
      duration: 0.4,
      ease: "power3.out",
      pointerEvents: isVisible ? "auto" : "none",
    });
  }, [isVisible]);

  const handleClick = () => {
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg focus-ring cursor-pointer"
      style={{
        backgroundColor: "var(--primary)",
        color: "var(--text-on-primary)",
        opacity: 0,
        pointerEvents: "none",
      }}
      aria-label="Back to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}
