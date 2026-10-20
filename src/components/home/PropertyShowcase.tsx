"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, LayoutGrid, Rows3 } from "lucide-react";
import { ProjectCard } from "@/components/project/ProjectCard";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = {
  id: string;
  label: string;
  match: (p: Project) => boolean;
};

const FILTERS: Filter[] = [
  { id: "all", label: "All properties", match: () => true },
  {
    id: "residential",
    label: "Residential",
    match: (p) => p.category === "residential",
  },
  {
    id: "commercial",
    label: "Commercial",
    match: (p) => p.category === "commercial",
  },
  {
    id: "new-launch",
    label: "New launches",
    match: (p) => p.status === "new-launch",
  },
  {
    id: "sco",
    label: "SCO plots",
    match: (p) => /sco/i.test(p.propertyType),
  },
  {
    id: "under-3cr",
    label: "Under ₹3 Cr",
    match: (p) => p.priceMin !== null && p.priceMin < 30000000,
  },
  {
    id: "luxury",
    label: "₹5 Cr +",
    match: (p) => p.priceMin !== null && p.priceMin >= 50000000,
  },
];

const PAGE = 6;

/**
 * One section covering the whole catalogue — residential, commercial, SCO and
 * everything else mixed together, narrowed by chips rather than split across
 * separate sections.
 */
export function PropertyShowcase({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("all");
  const [layout, setLayout] = useState<"grid" | "rows">("grid");
  const [shown, setShown] = useState(PAGE);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    FILTERS.forEach((f) => map.set(f.id, projects.filter(f.match).length));
    return map;
  }, [projects]);

  const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0]!;

  const results = useMemo(() => {
    // Interleave residential and commercial on the "all" tab so the section
    // reads as one mixed catalogue rather than two blocks stuck together.
    const list = projects.filter(active.match);
    if (filter !== "all") return list;

    const res = list.filter((p) => p.category === "residential");
    const com = list.filter((p) => p.category === "commercial");
    const mixed: Project[] = [];
    let i = 0;
    while (i < res.length || i < com.length) {
      if (res[i * 2]) mixed.push(res[i * 2]!);
      if (res[i * 2 + 1]) mixed.push(res[i * 2 + 1]!);
      if (com[i]) mixed.push(com[i]!);
      i += 1;
      if (mixed.length >= list.length) break;
    }
    // anything missed by the interleave walk
    list.forEach((p) => {
      if (!mixed.includes(p)) mixed.push(p);
    });
    return mixed;
  }, [projects, active, filter]);

  const visible = results.slice(0, shown);

  const pick = (id: string) => {
    setFilter(id);
    setShown(PAGE);
  };

  return (
    <div>
      {/* filter chips + layout toggle */}
      <div className="mt-8 flex flex-col gap-4 border-y border-ink-200 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="-mx-1 flex gap-2 overflow-x-auto px-1 no-scrollbar"
          role="tablist"
          aria-label="Filter properties"
        >
          {FILTERS.map((f) => {
            const n = counts.get(f.id) ?? 0;
            if (n === 0) return null;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => pick(f.id)}
                className={cn(
                  "shrink-0 whitespace-nowrap",
                  filter === f.id ? "chip chip-active" : "chip",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "tabular-nums",
                    filter === f.id ? "text-white/60" : "text-ink-400",
                  )}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-1 lg:flex">
          <span className="mr-1 text-[0.6875rem] font-semibold text-ink-400">
            View
          </span>
          {(
            [
              { id: "grid", Icon: LayoutGrid, label: "Grid view" },
              { id: "rows", Icon: Rows3, label: "List view" },
            ] as const
          ).map(({ id, Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setLayout(id)}
              aria-label={label}
              aria-pressed={layout === id}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-sm border transition-colors",
                layout === id
                  ? "border-ink-950 bg-ink-950 text-white"
                  : "border-ink-200 text-ink-500 hover:border-ink-400",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.2} />
            </button>
          ))}
        </div>
      </div>

      {/* results */}
      {visible.length === 0 ? (
        <p className="py-14 text-center text-[0.875rem] text-ink-500">
          Nothing in this category right now.
        </p>
      ) : (
        <MobileCarousel
          // The view toggle is desktop-only, so on a phone this is always the
          // card layout and always swipes; the toggle just picks which grid it
          // relaxes into from `sm` up.
          grid={
            layout === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-1"
          }
          peek="lg"
          gap={layout === "grid" ? "gap-6" : "gap-6 lg:gap-5"}
          className="mt-8"
        >
          {visible.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              priority={i < 3}
              layout={layout === "rows" ? "row" : "grid"}
            />
          ))}
        </MobileCarousel>
      )}

      {/* footer actions */}
      <div className="mt-9 flex flex-col items-center gap-4">
        {shown < results.length && (
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="btn btn-outline btn-lg"
          >
            Show {Math.min(PAGE, results.length - shown)} more
            <span className="text-ink-400">
              ({shown} of {results.length})
            </span>
          </button>
        )}
        <Link
          href={
            filter === "residential"
              ? "/projects?category=residential"
              : filter === "commercial"
                ? "/projects?category=commercial"
                : "/projects"
          }
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-brand-700 hover:underline"
        >
          Open the full directory with filters
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </Link>
      </div>
    </div>
  );
}
