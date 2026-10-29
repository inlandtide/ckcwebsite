import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SiteImage from "./SiteImage";

type Photo = { src: string; alt: string; fallbackSrc: string; framed: boolean };

function PhotoFrame({ photo, visible, active, onReady, onFailure }: {
  photo: Photo; visible: boolean; active: boolean;
  onReady: (photo: Photo) => void; onFailure: (photo: Photo) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [loadVersion, setLoadVersion] = useState(0);
  const sources = useMemo(() => [
    { src: photo.src, original: false },
    { src: photo.src, original: true },
    ...(photo.fallbackSrc !== photo.src ? [
      { src: photo.fallbackSrc, original: false },
      { src: photo.fallbackSrc, original: true },
    ] : []),
  ], [photo.src, photo.fallbackSrc]);
  const source = sources[attempt];
  const recover = useCallback(() => {
    if (attempt + 1 < sources.length) setAttempt(attempt + 1);
    else if (active) onFailure(photo);
  }, [active, attempt, onFailure, photo, sources.length]);

  useEffect(() => {
    const image = container.current?.querySelector<HTMLImageElement>(".gallery-hero__image");
    if (!active || !image?.complete) return;
    if (image.naturalWidth === 0) { recover(); return; }
    let cancelled = false;
    // Cached/prerendered photos can finish before React attaches onLoad.
    // Decode the actual element before replacing the last good photo.
    const reveal = async () => {
      try { await image.decode?.(); } catch { /* A loaded image can still be usable. */ }
      if (!cancelled && image.complete && image.naturalWidth > 0) onReady(photo);
    };
    void reveal();
    // Ignore late responses from a category the visitor has already left.
    return () => { cancelled = true; };
  }, [active, attempt, loadVersion, onReady, photo, recover]);

  return <div ref={container}
    className={`gallery-hero__photo${visible ? " is-visible" : ""}${photo.framed ? " gallery-hero__photo--cabinetry" : ""}`}
    aria-hidden={!visible} data-gallery-cover={photo.src}>
    {photo.framed && <SiteImage key={`backdrop-${attempt}`} {...source} sizes="100vw" loading="eager"
      alt="" aria-hidden="true" className="gallery-hero__backdrop" />}
    <SiteImage key={attempt} {...source} sizes="100vw" loading="eager" fetchPriority="high"
      alt={photo.alt} className="gallery-hero__image" onLoad={() => setLoadVersion((value) => value + 1)} onError={recover} />
  </div>;
}

export default function GalleryHeroImage({ src, alt, fallbackSrc, framed = false }: {
  src: string; alt: string; fallbackSrc: string; framed?: boolean;
}) {
  const photo = useMemo(() => ({ src, alt, fallbackSrc, framed }), [src, alt, fallbackSrc, framed]);
  const [displayed, setDisplayed] = useState(photo);
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [retries, setRetries] = useState<Record<string, number>>({});
  const reveal = useCallback((loaded: Photo) => {
    if (loaded.src !== photo.src) return;
    setDisplayed(loaded);
    setReadySrc(loaded.src);
    setFailedSrc(null);
  }, [photo]);
  const fail = useCallback((failed: Photo) => {
    if (failed.src === photo.src) setFailedSrc(failed.src);
  }, [photo.src]);
  const frames = displayed.src === photo.src ? [photo] : [displayed, photo];
  const failed = failedSrc === photo.src;
  const pending = readySrc !== photo.src;

  return <>
    {frames.map((frame) => <PhotoFrame key={`${frame.src}:${retries[frame.src] ?? 0}`} photo={frame}
      visible={frame.src === displayed.src} active={frame.src === photo.src} onReady={reveal} onFailure={fail} />)}
    {pending && <div className="gallery-hero__loading" role="status">
      {failed ? <>Photo unavailable. <button type="button" onClick={() => { setFailedSrc(null); setRetries((values) => ({ ...values, [src]: (values[src] ?? 0) + 1 })); }}>Retry photo</button></>
        : "Loading project photo…"}
    </div>}
  </>;
}
