"use client";

import { useEffect, useRef } from "react";
import { X, Download, MessageSquare } from "lucide-react";

export function ProductModal({ product, onClose }) {
  const modalRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("modal-open");
    closeRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-up"
      >
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left - Image */}
          <div
            className="flex items-center justify-center p-10 md:p-14 min-h-[280px]"
            style={{ backgroundColor: "var(--surface-alt)" }}
          >
            <div className="text-center" style={{ color: "var(--text-muted)" }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-30">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <circle cx="12" cy="14" r="4" />
                <line x1="12" y1="6" x2="12.01" y2="6" />
              </svg>
              <p className="text-sm font-medium opacity-40">{product.model}</p>
            </div>
          </div>

          {/* Right - Details */}
          <div className="p-8 md:p-10">
            <span
              className="inline-block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--accent)" }}
            >
              {product.category}
            </span>
            <h2 className="text-sm font-mono mb-1" style={{ color: "var(--text-muted)" }}>
              {product.model}
            </h2>
            <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
              {product.name}
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
              {product.description}
            </p>

            {/* Specs Table */}
            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>
                Specifications
              </h4>
              <div className="space-y-0 border rounded-lg overflow-hidden" style={{ borderColor: "var(--border)" }}>
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="px-4 py-2.5 text-sm flex items-center"
                    style={{
                      backgroundColor: i % 2 === 0 ? "var(--surface-alt)" : "white",
                      color: "var(--text)",
                    }}
                  >
                    {spec}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg text-white transition-all duration-200"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <MessageSquare size={16} />
                Request Quote
              </a>
              {product.pdf && (
                <a
                  href={product.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border transition-all duration-200 hover:bg-[var(--surface-alt)]"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <Download size={16} />
                  Download Datasheet
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
