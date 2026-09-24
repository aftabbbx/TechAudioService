export function Container({ children, className = "" }) {
  return <div className={`container-custom ${className}`}>{children}</div>;
}
