"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { ProjectCard } from "@/components/project/ProjectCard";
import type { Project } from "@/lib/types";

/**
 * Horizontal carousel of trending projects led by an intro card — the
 * "Best Sellers" pattern from the reference, in our theme.
 */
export function TrendingProjects({ projects }: { projects: Project[] }) {
  const [ref, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    sync();
    embla.on("select", sync).on("reInit", sync);
  }, [embla, sync]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={ref}>
        <div className="flex gap-5">
          {/* intro / best sellers card */}
          <div className="w-[17rem] shrink-0">
            <div className="flex h-full flex-col justify-between rounded-lg border border-brand-200 bg-brand-50/60 p-6">
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-600 text-white">
                  <Building2 className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <h3 className="mt-4 font-display text-[1.25rem] font-bold leading-tight">
                  Best sellers in Gurugram
                </h3>
                <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-600">
                  The projects our advisors are closing most this quarter —
                  shortlisted on developer delivery record, carpet-area
                  efficiency and realistic possession, not on who is
                  advertising hardest.
                </p>
              </div>
              <Link href="/projects" className="btn btn-primary btn-sm mt-6 w-fit">
                View all projects
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
              </Link>
            </div>
          </div>

          {projects.map((p) => (
            <div key={p.slug} className="w-[20rem] shrink-0">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>

      {/* arrows */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => embla?.scrollPrev()}
          disabled={!canPrev}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:bg-transparent disabled:hover:text-ink-700"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => embla?.scrollNext()}
          disabled={!canNext}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:bg-transparent disabled:hover:text-ink-700"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
