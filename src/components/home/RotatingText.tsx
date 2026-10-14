"use client";

import { useEffect, useState } from "react";

/**
 * Cycles through a list of words with a soft fade/slide — used for the
 * emphasised tail of the hero headline, like the reference site.
 */
export function RotatingText({
  words,
  className,
  interval = 2200,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(() => {
      // fade out, swap, fade in
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 280);
      return () => clearTimeout(swap);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="relative inline-block align-bottom">
      {/* reserve width with the longest word so the layout doesn't jump */}
      <span aria-hidden className="invisible whitespace-nowrap">
        {words.reduce((a, b) => (a.length >= b.length ? a : b), "")}
      </span>
      <span
        aria-live="polite"
        className={`absolute inset-0 whitespace-nowrap transition-all duration-300 ease-out ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-1.5 opacity-0"
        } ${className ?? ""}`}
      >
        {words[index]}
      </span>
    </span>
  );
}
