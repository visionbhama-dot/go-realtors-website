"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Connection = {
  saveData?: boolean;
  effectiveType?: string;
};

/**
 * Hero background: an art-directed poster image that is always painted first,
 * with a muted looping video layered over it once it can actually play.
 *
 * The video is deliberately opt-in at runtime rather than always-on:
 *  - `prefers-reduced-motion` users never get it,
 *  - phones on a metered/slow connection (saveData, 2g/3g) never get it,
 *  - phones that do get it are served a much smaller rendition.
 *
 * The poster is the video's own first frame, so the hand-off is invisible and
 * the layout never shifts. Framing is tuned per breakpoint because the source
 * is 16:9 and the hero is tall and narrow on a phone.
 */
export function HeroMedia({
  poster,
  src,
  srcSmall,
  alt,
}: {
  poster: string;
  src: string;
  srcSmall?: string;
  alt: string;
}) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const conn = (
      navigator as Navigator & { connection?: Connection }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|-)(2g|3g)$/.test(conn.effectiveType)) return;

    const small = window.innerWidth < 640;
    setVideoSrc(small && srcSmall ? srcSmall : src);
  }, [src, srcSmall]);

  // Some mobile browsers need an explicit play() once the source is attached.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoSrc) return;
    const tryPlay = () => void v.play().catch(() => {});
    tryPlay();
    v.addEventListener("loadeddata", tryPlay);
    return () => v.removeEventListener("loadeddata", tryPlay);
  }, [videoSrc]);

  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[38%_center] opacity-[0.75] sm:object-center sm:opacity-[0.6]"
      />

      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover object-[38%_center] transition-opacity duration-700 sm:object-center ${
            ready ? "opacity-[0.75] sm:opacity-[0.6]" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}
