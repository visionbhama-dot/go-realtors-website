"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Continuously auto-advancing carousel (left to right) with manual arrows and
 * dots. Used for the market-insights strip and other "keep moving" sections.
 *
 * Autoplay pauses while the pointer is over the track and resumes on leave, so
 * a reader is never yanked off the card they are looking at. Respects
 * prefers-reduced-motion by not starting autoplay at all.
 */
export function AutoCarousel({
  children,
  gap = "gap-6",
  delay = 3800,
  controls = true,
  className,
}: {
  children: React.ReactNode;
  gap?: string;
  delay?: number;
  controls?: boolean;
  className?: string;
}) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  // Memoised so a re-render doesn't hand Embla a brand-new plugin instance
  // every time, which would otherwise tear down and re-init the carousel.
  const plugins = useMemo(
    () =>
      reduced
        ? []
        : [
            Autoplay({
              delay,
              stopOnMouseEnter: true,
              stopOnInteraction: false,
            }),
          ],
    [reduced, delay],
  );

  const [ref, embla] = useEmblaCarousel(
    { align: "start", loop: true, containScroll: "trimSnaps" },
    plugins,
  );

  const [snaps, setSnaps] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);

  const sync = useCallback(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    sync();
    embla.on("select", sync).on("reInit", sync);
  }, [embla, sync]);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={ref}>
        <div className={cn("flex", gap)}>{children}</div>
      </div>

      {controls && snaps.length > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          {/* dots */}
          <div className="flex items-center gap-1.5">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === selected}
                onClick={() => embla?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === selected
                    ? "w-6 bg-brand-600"
                    : "w-1.5 bg-ink-300 hover:bg-ink-400",
                )}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => embla?.scrollPrev()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => embla?.scrollNext()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Slide wrapper — keeps the flex-basis logic in one place. */
export function AutoSlide({
  children,
  slide = "basis-[86%] sm:basis-1/2 lg:basis-1/3",
  className,
}: {
  children: React.ReactNode;
  slide?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 shrink-0 grow-0", slide, className)}>
      {children}
    </div>
  );
}
