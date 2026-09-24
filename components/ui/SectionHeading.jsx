export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = true,
  light = false,
}) {
  return (
    <div className={`mb-14 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <span
          className="section-eyebrow"
          style={{
            color: light ? "rgba(255,255,255,0.55)" : "var(--accent)",
            justifyContent: centered ? "center" : "flex-start",
            marginBottom: "1rem",
          }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className="display-section"
        style={{
          color: light ? "#FFFFFF" : "var(--text)",
          marginBottom: subtitle ? "1rem" : 0,
          maxWidth: centered ? "none" : "none",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-base md:text-lg max-w-2xl leading-relaxed"
          style={{
            color: light ? "rgba(255,255,255,0.5)" : "var(--text-secondary)",
            margin: centered ? "0 auto" : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
