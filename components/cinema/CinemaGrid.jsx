"use client";

import { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CinemaFilters } from "./CinemaFilters";
import { CinemaProductModal } from "./CinemaProductModal";

export function CinemaGrid({ products, categories }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <>
      <div className="mb-8">
        <CinemaFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
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
                {product.image ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <div className="text-center" style={{ color: "var(--text-muted)" }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 opacity-30">
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <circle cx="12" cy="14" r="4" />
                        <line x1="12" y1="6" x2="12.01" y2="6" />
                      </svg>
                      <span className="text-xs font-medium opacity-30">{product.model}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                    {product.category}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>•</span>
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{product.model}</span>
                </div>

                <h3 className="text-base font-bold mb-2" style={{ color: "var(--text)" }}>{product.name}</h3>
                <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                  {product.description}
                </p>

                {/* Spec chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {product.specs.slice(0, 3).map((spec) => (
                    <span
                      key={spec.label}
                      className="px-2 py-0.5 text-[11px] font-medium rounded-md"
                      style={{ backgroundColor: "var(--surface-alt)", color: "var(--text-secondary)" }}
                    >
                      {spec.value}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-white transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg font-medium" style={{ color: "var(--text-muted)" }}>No cinema products found</p>
        </div>
      )}

      {selectedProduct && (
        <CinemaProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}
