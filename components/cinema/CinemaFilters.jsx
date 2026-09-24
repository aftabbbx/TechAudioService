"use client";

export function CinemaFilters({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
            activeCategory === category
              ? "text-white shadow-md"
              : "border hover:bg-[var(--surface-alt)]"
          }`}
          style={{
            backgroundColor: activeCategory === category ? "var(--accent)" : "var(--surface)",
            borderColor: activeCategory === category ? "transparent" : "var(--border)",
            color: activeCategory === category ? "white" : "var(--text-secondary)",
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
