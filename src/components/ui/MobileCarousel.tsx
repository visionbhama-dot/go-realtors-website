"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile-first swipe carousel that becomes a normal grid on larger screens.
 *
 * On phones the children lay out as a horizontal, snap-scrolling strip that
 * bleeds to the screen edges with the next card peeking in — the pattern used
 * by most Indian property portals. From the `sm` breakpoint up it collapses
 * back into whatever grid the caller passes via `grid`.
 *
 * Layout is pure CSS; the only JS is a small affordance layer that shows
 * tap-to-scroll chevrons while there is more content in that direction, so a
 * visitor can tell the row scrolls instead of having to guess.
 *
 * Children are styled through `[&>*]` so existing markup needs no wrapper.
 */

/** How much of the viewport each card occupies while swiping. */
const PEEK = {
  /** tiny tiles — e.g. circular property-type thumbs */
  xs: "[&>*]:w-[30%]",
  sm: "[&>*]:w-[44%]",
  md: "[&>*]:w-[62%]",
  lg: "[&>*]:w-[74%]",
  xl: "[&>*]:w-[86%]",
} as const;

export function MobileCarousel({
  children,
  grid,
  peek = "md",
  gap = "gap-4",
  as: Tag = "div",
  arrows = false,
  className,
}: {
  children: React.ReactNode;
  /** Desktop grid classes, e.g. "sm:grid-cols-2 lg:grid-cols-4". */
  grid: string;
  peek?: keyof typeof PEEK;
  /** Gap utility applied in both modes, e.g. "gap-5". */
  gap?: string;
  /** Render as a list when the content is semantically a list. */
  as?: "div" | "ul" | "ol";
  /**
   * Opt in to tap-to-scroll chevrons on mobile. Off by default — the peeking
   * next card is usually hint enough, and chevrons on every row is noise.
   */
  arrows?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // `max > 4` filters out sub-pixel rounding on the grid breakpoints, where
    // the row does not actually scroll.
    setCanPrev(max > 4 && el.scrollLeft > 4);
    setCanNext(max > 4 && el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);

    // Cards can be added or swapped after mount (filter chips, "show more"),
    // which changes scrollWidth without resizing the track itself.
    const mo = new MutationObserver(() => {
      for (const child of Array.from(el.children)) ro.observe(child);
      sync();
    });
    mo.observe(el, { childList: true });

    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
      mo.disconnect();
    };
  }, [sync]);

  /** Scrolls by exactly one card, including the gap. */
  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gapPx = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const step = first
      ? first.getBoundingClientRect().width + gapPx
      : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrowBase =
    "absolute top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-ink-200 bg-white/95 text-ink-800 shadow-card backdrop-blur transition-colors hover:bg-brand-600 hover:text-white active:scale-95 sm:hidden";

  return (
    <div className={cn("relative", className)}>
      <Tag
        ref={ref as React.Ref<never>}
        className={cn(
          // --- mobile: edge-to-edge snap carousel ---
          "no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto scroll-pl-4 px-4 pb-1",
          "[&>*]:shrink-0 [&>*]:snap-start",
          PEEK[peek],
          gap,
          // --- sm and up: back to a grid ---
          "sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0 sm:[&>*]:w-auto",
          grid,
        )}
      >
        {children}
      </Tag>

      {arrows && canPrev && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => nudge(-1)}
          className={cn(arrowBase, "left-0")}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
      )}

      {arrows && canNext && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => nudge(1)}
          className={cn(arrowBase, "right-0")}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
        </button>
      )}
    </div>
  );
}
