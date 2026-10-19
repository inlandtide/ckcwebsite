import type { ImgHTMLAttributes } from "react";
import manifest from "../lib/generated-images.json";

type Photo = { width: number; height: number; variants: { src: string; width: number; bytes: number }[] };
const photos: Record<string, Photo> = manifest;

export default function SiteImage({ src, alt, sizes = "(max-width: 1050px) 100vw, 50vw", loading, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const photo = typeof src === "string" ? photos[src] : undefined;
  // Unlisted assets (including original logos) retain their existing delivery.
  if (!photo) return <img src={src} alt={alt} loading={loading} {...props} />;
  const fallback = photo.variants.find((variant) => variant.width >= 960) ?? photo.variants[photo.variants.length - 1];
  return <img {...props} src={fallback.src} alt={alt} width={photo.width} height={photo.height}
    srcSet={photo.variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ")}
    sizes={sizes} loading={loading ?? "lazy"} />;
}
