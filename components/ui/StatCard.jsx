export function StatCard({ value, label, light = false }) {
  return (
    <div className="text-center">
      <div
        className="text-3xl md:text-4xl font-bold mb-1"
        style={{ color: light ? "#FFFFFF" : "var(--accent)" }}
      >
        {value}
      </div>
      <div
        className="text-sm font-medium uppercase tracking-wider"
        style={{ color: light ? "rgba(255,255,255,0.7)" : "var(--text-secondary)" }}
      >
        {label}
      </div>
    </div>
  );
}
