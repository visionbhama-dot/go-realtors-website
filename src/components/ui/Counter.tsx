"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a stat up to its final value the first time it scrolls into view.
 *
 * Values on this site are authored as display strings ("2,400+", "₹1,850 Cr",
 * "21"), so rather than forcing the caller to split them apart we parse out the
 * first number, animate that, and re-insert it between whatever prefix and
 * suffix it came with. If there is no number to animate the string is rendered
 * untouched, which keeps it safe for values like "6-9%".
 */
export function Counter({
  value,
  duration = 1400,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const match = value.match(/-?[\d,]*\d/);
  const target = match ? Number(match[0].replace(/,/g, "")) : null;
  const grouped = match ? /,/.test(match[0]) : false;
  const prefix = match ? value.slice(0, match.index) : "";
  const suffix = match ? value.slice(match.index! + match[0].length) : "";

  // `null` means "not animating" — render the real value. The server and the
  // first client render both land here, so the final number is in the HTML for
  // crawlers and for anyone without JS, and we only drop to 0 once we know we
  // are about to animate it.
  const [shown, setShown] = useState<number | null>(null);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (target === null || started.current) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        started.current = true;
        setShown(0);

        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // easeOutCubic — fast start, gentle settle
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(Math.round(target * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        cleanup = () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cleanup?.();
    };
  }, [target, duration]);

  if (target === null) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {(shown ?? target).toLocaleString(grouped ? "en-IN" : "en-US", {
        useGrouping: grouped,
      })}
      {suffix}
    </span>
  );
}
