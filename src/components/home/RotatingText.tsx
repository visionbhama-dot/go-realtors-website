"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const current = words[wordIndex] ?? "";
    let id: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        // add one more character
        id = setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          typeSpeed,
        );
      } else {
        // whole word typed — pause before deleting
        id = setTimeout(() => setPhase("deleting"), holdTime);
      }
    } else {
      // deleting
      if (text.length > 0) {
        id = setTimeout(
          () => setText(current.slice(0, text.length - 1)),
          deleteSpeed,
        );
      } else {
        // move to the next word and start typing again
        setWordIndex((i) => (i + 1) % words.length);
        setPhase("typing");
        id = setTimeout(() => {}, 60);
      }
    }

    return () => clearTimeout(id);
  }, [text, phase, wordIndex, words, typeSpeed, deleteSpeed, holdTime]);

  return (
    <span className={className}>
      {text || "\u00A0"}
      <span
        aria-hidden
        className="ml-1 inline-block w-[3px] translate-y-[0.08em] animate-caret rounded-sm bg-current align-middle"
        style={{ height: "0.95em" }}
      />
    </span>
  );
}
