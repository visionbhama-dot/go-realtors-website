"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Faq } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  faqs,
  defaultOpen = 0,
  className,
}: {
  faqs: Faq[];
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className={cn("divide-y divide-ink-200 border-y border-ink-200", className)}>
      {faqs.map((faq, i) => {
        const expanded = open === i;
        return (
          <div key={faq.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="flex w-full items-start justify-between gap-4 py-5 text-left"
              >
                <span
                  className={cn(
                    "font-display text-[0.9375rem] font-bold leading-snug transition-colors sm:text-base",
                    expanded ? "text-brand-800" : "text-ink-900",
                  )}
                >
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border transition-colors",
                    expanded
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-ink-300 text-ink-500",
                  )}
                >
                  {expanded ? (
                    <Minus className="h-3.5 w-3.5" strokeWidth={2.6} />
                  ) : (
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
                  )}
                </span>
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                expanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-10 text-[0.875rem] leading-relaxed text-ink-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
