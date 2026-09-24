"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { gsap } from "gsap";
import { navigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function MobileMenu({ isOpen, onClose, pathname }) {
  const menuRef = useRef(null);
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const navItemsRef = useRef(null);

  // Accessibility keyboard trap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, onClose]);

  // GSAP animation for menu open/close
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panel = panelRef.current;
    const items = navItemsRef.current ? [...navItemsRef.current.querySelectorAll(".mobile-nav-item")] : [];

    if (prefersReduced) return;

    if (isOpen) {
      gsap.fromTo(
        panel,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.45, ease: "power4.out" }
      );
      gsap.fromTo(
        items,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power3.out", delay: 0.2 }
      );
    } else {
      gsap.to(panel, { x: "100%", opacity: 0, duration: 0.35, ease: "power3.in" });
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[998] transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(12,27,64,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed top-0 right-0 z-[999] h-full w-[300px] max-w-[85vw] shadow-2xl md:hidden"
        style={{
          backgroundColor: "var(--surface)",
          transform: "translateX(100%)",
          opacity: 0,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <img
            src="/logo.png"
            alt="AudioTechServices Logo"
            className="h-10 w-auto object-contain"
            style={{ maxHeight: "40px", maxWidth: "160px" }}
          />
          <button
            ref={closeRef}
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[var(--surface-alt)] transition-colors focus-ring cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-5" ref={menuRef}>
          <ul ref={navItemsRef} className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`mobile-nav-item block px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 focus-ring ${
                      isActive ? "text-white" : ""
                    }`}
                    style={{
                      backgroundColor: isActive ? "var(--primary-dark)" : undefined,
                      color: isActive ? "var(--text-on-primary)" : "var(--text)",
                      letterSpacing: "0.005em",
                      opacity: 0,
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer contact */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 border-t"
          style={{ borderColor: "var(--border-light)" }}
        >
          <p className="tech-label mb-1" style={{ color: "var(--text-muted)" }}>Get in touch</p>
          <p className="text-sm font-medium mt-2" style={{ color: "var(--text-secondary)" }}>
            {siteConfig.contact.email}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {siteConfig.contact.phone}
          </p>
        </div>
      </div>
    </>
  );
}
