"use client";

import { useMemo, useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
};

function createFallbackDataUri(label: string): string {
  const text = label.replace(/[<&>"]/g, "").slice(0, 60);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#f3f4f6'/><stop offset='100%' stop-color='#e5e7eb'/></linearGradient></defs><rect width='800' height='450' fill='url(#g)'/><rect x='220' y='115' width='360' height='200' rx='12' fill='#d1d5db'/><rect x='260' y='330' width='280' height='16' rx='8' fill='#9ca3af'/><text x='400' y='390' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='#374151'>${text}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function ProductImage({ src, alt, className }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const fallbackSrc = useMemo(() => createFallbackDataUri(alt), [alt]);

  return (
    <img
      src={hasError ? fallbackSrc : src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
