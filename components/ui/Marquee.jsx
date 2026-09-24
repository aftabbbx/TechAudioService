const marqueeItems = [
  "AudioTechServices",
  "Professional Audio Engineering",
  "Power Amplification",
  "DSP Processing",
  "Cinema Sound Systems",
  "System Integration",
  "Installation & Support",
  "25+ Years of Excellence",
];

/**
 * Infinite horizontal marquee.
 * @param {boolean} reverse - Run in reverse direction
 * @param {boolean} dark - Use dark background variant (for footer edges)
 * @param {string} className - Additional class names
 */
export function Marquee({ reverse = false, dark = false, className = "" }) {
  // Duplicate items to create seamless loop
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div
      className={`marquee-wrapper ${dark ? "marquee-wrapper--dark" : ""} ${className}`}
      aria-hidden="true"
    >
      <div className={`marquee-track ${reverse ? "marquee-track--reverse" : ""}`}>
        {items.map((item, i) => (
          <div key={i} className="marquee-item">
            <span>{item}</span>
            <span className="marquee-separator" />
          </div>
        ))}
      </div>
    </div>
  );
}
