"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";

/** Pulls the 11-char video id out of any common YouTube URL shape. */
function youTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtube\.com\/live\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  // bare id
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

/**
 * Click-to-load YouTube facade: ships only a thumbnail until the visitor
 * presses play, so an embedded video never blocks the page load. Falls back
 * to a plain link if the URL isn't a recognised YouTube URL.
 */
export function ProjectVideo({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const id = youTubeId(url);

  if (!id) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline"
      >
        <Play className="h-4 w-4" strokeWidth={2.3} />
        Watch the project video
      </a>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-ink-950">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={`${title} — walkthrough video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title} walkthrough video`}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube
              thumbnail facade; routing it through next/image would need the
              i.ytimg.com remote host and the optimizer for no benefit. */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt={`${title} walkthrough`}
            className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
            loading="lazy"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent"
          />
          <span className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-white shadow-rise transition-transform group-hover:scale-110">
            <Play className="ml-1 h-7 w-7 fill-white" strokeWidth={0} />
          </span>
          <span className="absolute bottom-3 left-4 text-[0.8125rem] font-bold text-white drop-shadow">
            Watch the walkthrough
          </span>
        </button>
      )}
    </div>
  );
}

/**
 * Compact "Watch walkthrough" button for the project banner. Opens the
 * YouTube walkthrough in a lightbox modal (so the dark banner stays clean),
 * and closes on overlay click or Escape. Falls back to a normal link when the
 * URL isn't a recognised YouTube URL.
 */
export function ProjectWalkthrough({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const id = youTubeId(url);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!id) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[0.8125rem] font-bold text-white backdrop-blur transition-colors hover:border-brand-400 hover:bg-brand-600"
      >
        <Play className="h-4 w-4 fill-white" strokeWidth={0} />
        Watch walkthrough
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 py-2 pl-2 pr-4 text-[0.8125rem] font-bold text-white backdrop-blur transition-colors hover:border-brand-400 hover:bg-brand-600"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600">
          <Play className="ml-0.5 h-3.5 w-3.5 fill-white" strokeWidth={0} />
        </span>
        Watch walkthrough
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} walkthrough video`}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-sm"
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute -top-11 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <div className="aspect-video overflow-hidden rounded-lg bg-black shadow-rise">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                title={`${title} — walkthrough video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
