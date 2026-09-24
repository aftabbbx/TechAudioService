"use client";

import { useEffect, useRef } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export function Toast({ message, type = "success", onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, 4000);
    return () => clearTimeout(timerRef.current);
  }, [onClose]);

  return (
    <div className={`admin-toast admin-toast--${type}`} role="alert">
      {type === "success" ? (
        <CheckCircle size={18} style={{ color: "#22C55E", flexShrink: 0 }} />
      ) : (
        <XCircle size={18} style={{ color: "#CC2D2D", flexShrink: 0 }} />
      )}
      <span>{message}</span>
      <button className="admin-toast-close" onClick={onClose} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}
