"use client";

import { useEffect, useState } from "react";

export function ProductImage({ src, alt, model, imageClassName, fallbackClassName }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className={fallbackClassName}><span>{model}</span></div>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={imageClassName}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
