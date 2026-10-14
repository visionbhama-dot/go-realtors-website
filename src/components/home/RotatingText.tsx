"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Typewriter effect for the emphasised tail of the hero headline: types a
 * word out character by character, holds, deletes, then moves to the next.
 */
export function RotatingText({
  words,
  className,
  typeSpeed = 85,
  deleteSpeed = 45,
  holdTime = 1400,
}: {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  holdTime?: number;
}) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "typing",
  );
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const current = words[wordIndex] ?? "";

    // honour reduced-motion: just show the full word, swap on hold
    if (reduceMotion.current) {
      setText(current);
      const id = setTimeout(
        () => setWordIndex((i) => (i + 1) % words.length),
        holdTime + 600,
      );
      return () => clearTimeout(id);
    }

    let id: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        id = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
      } else {
        id = setTimeout(() => setPhase("holding"), holdTime);
      }
    } else if (phase === "holding") {
      id = setTimeout(() => setPhase("deleting"), 200);
    } else {
      if (text.length > 0) {
        id = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
      } else {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase("typing");
        id = setTimeout(() => {}, 0);
      }
    }

    return () => clearTimeout(id);
  }, [text, phase, wordIndex, words, typeSpeed, deleteSpeed, holdTime]);

  return (
    <span className={className}>
      {text || "\u00A0"}
      <span
        aria-hidden
        className="ml-0.5 inline-block w-[2px] animate-pulse self-stretch bg-current align-middle"
        style={{ height: "0.9em" }}
      />
    </span>
  );
}
