"use client";

import { Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product, onViewDetails }) {
  return (
    <div
      className="group bg-white rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: "var(--surface-alt)" }}>
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge text={product.badge} variant="accent" />
          </div>
        )}
        <div className="w-full h-full flex items-center justify-center p-8">
          <div
            className="w-full h-full rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ backgroundColor: "var(--surface-alt)" }}
          >
            <div className="text-center" style={{ color: "var(--text-muted)" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 opacity-40">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <circle cx="12" cy="14" r="4" />
                <line x1="12" y1="6" x2="12.01" y2="6" />
              </svg>
              <span className="text-xs font-medium opacity-40">{product.model}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--accent)" }}>
            {product.category}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>•</span>
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {product.model}
          </span>
        </div>

        <h3 className="text-base font-bold mb-2" style={{ color: "var(--text)" }}>
          {product.name}
        </h3>

        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
          {product.description}
        </p>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.specs.slice(0, 4).map((spec) => (
            <span
              key={spec}
              className="px-2 py-0.5 text-[11px] font-medium rounded-md"
              style={{
                backgroundColor: "var(--surface-alt)",
                color: "var(--text-secondary)",
              }}
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: "var(--accent)",
              color: "white",
            }}
          >
            <Eye size={16} />
            View Details
          </button>
          {product.pdf && (
            <a
              href={product.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors hover:bg-[var(--surface-alt)]"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              aria-label={`Download ${product.model} datasheet`}
              title="Download Datasheet"
            >
              <Download size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
