"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn, imageAlt } from "@/lib/utils";

export function ProjectGallery({
  images,
  imageAlts = [],
  name,
  sector,
  city,
}: {
  images: string[];
  imageAlts?: string[];
  name: string;
  sector?: string | null;
  city?: string | null;
}) {
  const list = images.length ? images : ["/brand/placeholder.svg"];
  const altFor = (i: number) =>
    imageAlt({ name, sector, city, imageAlts }, i, list.length);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) =>
      setActive((i) => (i + dir + list.length) % list.length),
    [list.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-[1fr_7rem]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-ink-900">
          <Image
            src={list[active]!}
            alt={altFor(active)}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 60vw"
            className="object-cover"
          />
          {list.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink-950/55 text-white backdrop-blur transition-colors hover:bg-ink-950/80"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink-950/55 text-white backdrop-blur transition-colors hover:bg-ink-950/80"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-sm bg-ink-950/60 px-3 py-1.5 text-[0.75rem] font-bold text-white backdrop-blur transition-colors hover:bg-ink-950/85"
          >
            <Expand className="h-3.5 w-3.5" strokeWidth={2.4} />
            View full size
          </button>
          <span className="absolute bottom-3 left-3 rounded-sm bg-ink-950/60 px-2.5 py-1.5 text-[0.75rem] font-bold text-white backdrop-blur tabular-nums">
            {active + 1} / {list.length}
          </span>
          <p className="absolute right-3 top-3 rounded-sm bg-ink-950/50 px-2 py-1 text-[0.5625rem] font-bold uppercase tracking-wider text-white/80 backdrop-blur">
            Artistic impression
          </p>
        </div>

        {list.length > 1 && (
          <div className="flex gap-2 overflow-x-auto sm:max-h-[26rem] sm:flex-col sm:overflow-y-auto">
            {list.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}: ${altFor(i)}`}
                aria-current={i === active}
                className={cn(
                  "relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-sm border-2 bg-ink-100 transition-all sm:w-full",
                  i === active
                    ? "border-brand-600 opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="7rem"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-ink-950/96">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-[0.8125rem] font-semibold">
              {name}{" "}
              <span className="text-white/50 tabular-nums">
                · {active + 1} / {list.length}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close gallery"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" strokeWidth={2.3} />
            </button>
          </div>
          <div className="relative flex-1">
            <Image
              src={list[active]!}
              alt={altFor(active)}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {list.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={2.4} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
