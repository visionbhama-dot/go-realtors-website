"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { cn, initialsOf } from "@/lib/utils";

export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [ref, embla] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (embla) setIndex(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect).on("reInit", onSelect);
  }, [embla, onSelect]);

  return (
    <div>
      <div className="overflow-hidden" ref={ref}>
        <div className="flex">
          {items.map((t) => (
            <div
              key={t.name + t.project}
              className="w-full shrink-0 grow-0 basis-full pr-5 md:basis-1/2 lg:basis-1/3"
            >
              <figure className="flex h-full flex-col border border-white/12 bg-white/[0.04] p-6">
                <Quote
                  className="h-7 w-7 shrink-0 text-brand-500"
                  strokeWidth={2}
                  aria-hidden
                />
                <div className="mt-3 flex gap-0.5" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < t.rating
                          ? "fill-brand-400 text-brand-400"
                          : "text-white/25",
                      )}
                      strokeWidth={2}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-white/80">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[0.8125rem] font-bold text-white">
                    {initialsOf(t.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.875rem] font-bold text-white">
                      {t.name}
                    </span>
                    <span className="block truncate text-[0.75rem] text-white/50">
                      {t.project} · {t.location}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <div className="flex gap-1.5">
          {items.map((t, i) => (
            <button
              key={t.name + i}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => embla?.scrollTo(i)}
              className={cn(
                "h-1 rounded-full transition-all",
                i === index ? "w-7 bg-brand-500" : "w-3 bg-white/25 hover:bg-white/40",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => embla?.scrollPrev()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 text-white transition-colors hover:border-brand-500 hover:bg-brand-600"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => embla?.scrollNext()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 text-white transition-colors hover:border-brand-500 hover:bg-brand-600"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
