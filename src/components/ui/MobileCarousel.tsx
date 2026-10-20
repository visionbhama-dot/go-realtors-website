import { cn } from "@/lib/utils";

/**
 * Mobile-first swipe carousel that becomes a normal grid on larger screens.
 *
 * On phones the children lay out as a horizontal, snap-scrolling strip that
 * bleeds to the screen edges with the next card peeking in — the pattern used
 * by most Indian property portals. From the `sm` breakpoint up it collapses
 * back into whatever grid the caller passes via `grid`.
 *
 * It is CSS-only (no JS, no hydration cost) and styles its children through
 * `[&>*]` so existing markup does not need an extra wrapper element.
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
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        // --- mobile: edge-to-edge snap carousel ---
        "no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto scroll-pl-4 px-4 pb-1",
        "[&>*]:shrink-0 [&>*]:snap-start",
        PEEK[peek],
        gap,
        // --- sm and up: back to a grid ---
        "sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0 sm:[&>*]:w-auto",
        grid,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
