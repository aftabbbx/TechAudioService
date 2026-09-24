import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        <li>
          <Link href="/" className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors focus-ring">
            <Home size={14} />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight size={14} className="opacity-50" />
            {item.href ? (
              <Link href={item.href} className="hover:text-[var(--accent)] transition-colors focus-ring">
                {item.label}
              </Link>
            ) : (
              <span style={{ color: "var(--text)" }} className="font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
