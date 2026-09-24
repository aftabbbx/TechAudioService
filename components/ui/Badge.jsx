export function Badge({ text, variant = "primary" }) {
  const styles = {
    primary: "bg-[var(--primary)] text-white",
    accent: "bg-[var(--accent)] text-white",
    dark: "bg-[var(--primary-dark)] text-white",
  };

  return (
    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${styles[variant]}`}>
      {text}
    </span>
  );
}
