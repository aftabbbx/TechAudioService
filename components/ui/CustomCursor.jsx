"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  'a[href], button:not(:disabled), [role="button"], input, textarea, select, [contenteditable="true"], .cursor-hover-target';
const TEXT_ENTRY_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const WAVE_BARS = [0.72, 1.08, 0.84, 1.3, 0.9, 1.15, 0.68];

export function CustomCursor() {
  const cursorRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const idleRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const animate = () => {
      const position = positionRef.current;
      const target = targetRef.current;
      position.x += (target.x - position.x) * 0.24;
      position.y += (target.y - position.y) * 0.24;
      cursor.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;

      if (Math.abs(target.x - position.x) > 0.15 || Math.abs(target.y - position.y) > 0.15) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        position.x = target.x;
        position.y = target.y;
        cursor.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
        frameRef.current = null;
      }
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      const target = event.target instanceof Element ? event.target : null;
      const textEntry = target?.closest(TEXT_ENTRY_SELECTOR);
      if (textEntry) {
        document.body.classList.remove("custom-cursor-active");
        cursor.classList.remove("cursor-visible", "cursor-hover", "cursor-click");
        cursor.style.setProperty("--cursor-tempo", ".72s");
        cursor.style.setProperty("--cursor-scale", "1");
        cursor.style.setProperty("--cursor-spectrum-scale", "1");
        clearTimeout(idleRef.current);
        return;
      }

      const deltaX = event.clientX - targetRef.current.x;
      const deltaY = event.clientY - targetRef.current.y;
      const energy = Math.min(1, Math.hypot(deltaX, deltaY) / 34);
      targetRef.current = { x: event.clientX, y: event.clientY };
      document.body.classList.add("custom-cursor-active");
      cursor.classList.add("cursor-visible");
      cursor.style.setProperty("--cursor-tempo", `${(0.82 - energy * 0.48).toFixed(2)}s`);
      cursor.style.setProperty("--cursor-scale", (1 + energy * 0.12).toFixed(2));
      cursor.style.setProperty("--cursor-spectrum-scale", (1 + energy * 0.3).toFixed(2));
      clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => {
        cursor.style.setProperty("--cursor-tempo", ".72s");
        cursor.style.setProperty("--cursor-scale", "1");
        cursor.style.setProperty("--cursor-spectrum-scale", "1");
      }, 110);
      const interactive = target?.closest(INTERACTIVE_SELECTOR);
      const label = cursor.querySelector(".cursor-label");
      cursor.classList.toggle("cursor-hover", Boolean(interactive));
      if (interactive) {
        label.textContent =
          interactive.getAttribute("data-cursor-label") ||
          (interactive.matches('a[href]') ? "OPEN" : "SELECT");
      } else {
        label.textContent = "";
      }
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(animate);
    };

    const onPointerDown = () => cursor.classList.add("cursor-click");
    const onPointerUp = () => cursor.classList.remove("cursor-click");
    const onPointerLeave = () => {
      document.body.classList.remove("custom-cursor-active");
      cursor.classList.remove("cursor-visible", "cursor-hover", "cursor-click");
      cursor.style.setProperty("--cursor-tempo", ".72s");
      cursor.style.setProperty("--cursor-scale", "1");
      cursor.style.setProperty("--cursor-spectrum-scale", "1");
      clearTimeout(idleRef.current);
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      clearTimeout(idleRef.current);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <div className="cursor-orbit"><span className="cursor-beacon" /></div>
      <div className="cursor-spectrum">
        {WAVE_BARS.map((peak, index) => (
          <i key={index} style={{ "--bar-peak": peak }} />
        ))}
      </div>
      <span className="cursor-label" />
    </div>
  );
}
