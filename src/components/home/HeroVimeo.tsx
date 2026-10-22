"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed Vimeo background video for the hero.
 *
 * An <iframe> cannot use object-fit, and the Vimeo player letterboxes the clip
 * if the frame is not 16:9 — so to get a true "cover" background we measure the
 * hero and size the iframe to the larger-than-container 16:9 box, centred, with
 * the overflow clipped by the hero's overflow-hidden. A ResizeObserver keeps it
 * correct across resize and orientation changes.
 *
 * Vimeo's `background=1` gives a chromeless, muted, looping autoplay player.
 * The clip's own still frame sits behind it as an instant/blocked-playback
 * fallback, so the hero always looks intentional.
 */

const VIMEO_SRC =
  "https://player.vimeo.com/video/1237901016?background=1&autoplay=1&muted=1&loop=1&autopause=0&dnt=1";

const RATIO = 16 / 9;

export function HeroVimeo() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Cover math: fill the hero, overflow the other axis, never letterbox.
  let w = box.w;
  let h = box.h;
  if (box.w > 0 && box.h > 0) {
    if (box.w / box.h > RATIO) {
      w = box.w;
      h = box.w / RATIO;
    } else {
      h = box.h;
      w = box.h * RATIO;
    }
  }

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-ink-950"
    >
      {/* Still frame from the clip: shown before the video loads, if playback is
          blocked, and for reduced-motion visitors. The video sits on top. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/hero-vimeo-poster.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {box.w > 0 && (
        <iframe
          src={VIMEO_SRC}
          title="Background video"
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 border-0"
          style={{ width: `${Math.ceil(w)}px`, height: `${Math.ceil(h)}px` }}
        />
      )}
    </div>
  );
}
