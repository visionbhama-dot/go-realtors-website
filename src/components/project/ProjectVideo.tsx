"use client";

import { useState } from "react";
import { Play } from "lucide-react";

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
