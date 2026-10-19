import type { ImgHTMLAttributes } from "react";
import manifest from "../lib/generated-images.json";
import dimensionManifest from "../lib/generated-image-dimensions.json";

type Photo = { width: number; height: number; variants: { src: string; width: number; bytes: number }[] };
type Dimensions = { width: number; height: number };
const photos: Record<string, Photo> = manifest;
const dimensions: Record<string, Dimensions> = dimensionManifest;
type SiteImageProps = ImgHTMLAttributes<HTMLImageElement> & { original?: boolean };

export default function SiteImage({ src, alt, sizes = "(max-width: 1050px) 100vw, 50vw", loading, original = false, ...props }: SiteImageProps) {
  const photo = typeof src === "string" ? photos[src] : undefined;
  // Original artwork and full-resolution lightbox images keep their source URLs.
  if (!photo || original) {
    const size = typeof src === "string" ? dimensions[src] : undefined;
    return <img width={size?.width} height={size?.height} {...props} src={src} alt={alt} loading={loading} data-original-size="" />;
  }
  const fallback = photo.variants.find((variant) => variant.width >= 960) ?? photo.variants[photo.variants.length - 1];
  return <img {...props} src={fallback.src} alt={alt} width={photo.width} height={photo.height}
    srcSet={photo.variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ")}
    sizes={sizes} loading={loading ?? "lazy"} />;
}
