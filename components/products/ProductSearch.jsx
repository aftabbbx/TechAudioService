"use client";

import { Search } from "lucide-react";

export function ProductSearch({ value, onChange }) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2"
        style={{ color: "var(--text-muted)" }}
      />
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        style={{
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
        aria-label="Search products"
      />
    </div>
  );
}
