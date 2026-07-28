// Serve right-sized, modern-format (WebP/AVIF), compressed images straight from
// Sanity's image CDN. Turns multi-MB PNG originals into tens of KB with no
// visible quality loss. No-op for non-Sanity URLs (leaves them untouched).
//
//   img(url)                 -> single optimized URL, 800px, q80
//   img(url, 700)            -> grid card
//   img(url, 1600, 82)       -> full-bleed hero, higher quality
//   imgSrcSet(url,[300,600]) -> responsive srcset ("…300w, …600w") for phones→laptops
export function img(url?: string | null, width = 800, quality = 80): string | undefined {
  if (!url) return undefined; // omit src entirely rather than pass "" (avoids a wasteful re-fetch)
  if (!url.includes('cdn.sanity.io')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}w=${width}&q=${quality}&auto=format&fit=max`;
}

// Build a responsive srcset so the browser picks the smallest size that still
// looks crisp for the device (small on phones, larger on retina laptops).
export function imgSrcSet(url?: string | null, widths: number[] = [400, 700, 1000], quality = 80): string | undefined {
  if (!url || !url.includes('cdn.sanity.io')) return undefined;
  return widths.map((w) => `${img(url, w, quality)} ${w}w`).join(', ');
}
