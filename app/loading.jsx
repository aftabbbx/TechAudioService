export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Loading...
        </p>
      </div>
    </div>
  );
}
