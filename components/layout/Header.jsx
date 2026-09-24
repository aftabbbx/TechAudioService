"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { gsap } from "gsap";
import { UtilityBar } from "./UtilityBar";
import { MobileMenu } from "./MobileMenu";
import { navigation } from "@/data/navigation";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Entrance animation on mount
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Set initial hidden state
      gsap.set(logoRef.current, { opacity: 0, y: -12 });
      if (navRef.current?.children) {
        gsap.set([...navRef.current.children], { opacity: 0, y: -10 });
      }
      if (menuBtnRef.current) {
        gsap.set(menuBtnRef.current, { opacity: 0, y: -10 });
      }

      const tl = gsap.timeline({ delay: 1.9 }); // After loader completes

      tl.to(
        logoRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      if (navRef.current?.children) {
        tl.to(
          [...navRef.current.children],
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
          "-=0.4"
        );
      }

      if (menuBtnRef.current) {
        tl.to(
          menuBtnRef.current,
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.4"
        );
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <UtilityBar />
      <header
        ref={headerRef}
        className={`sticky top-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "shadow-sm border-b"
            : "border-b"
        }`}
        style={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderColor: scrolled ? "var(--border)" : "var(--border-light)",
        }}
      >
        <div className="container-custom flex items-center justify-between h-16 md:h-[68px]">
          {/* Logo */}
          <Link
            href="/"
            ref={logoRef}
            className="flex items-center focus-ring group"
            aria-label="AudioTechServices Home"
          >
            <img
              src="/logo.png"
              alt="AudioTechServices Logo"
              style={{ maxHeight: "36px", width: "auto", maxWidth: "200px", objectFit: "contain" }}
              className="transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Nav */}
          <nav ref={navRef} className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link-brand relative px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-lg focus-ring ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                  }`}
                  style={{ letterSpacing: "0.005em" }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            ref={menuBtnRef}
            className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[var(--surface-alt)] transition-colors focus-ring cursor-pointer"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
    </>
  );
}
