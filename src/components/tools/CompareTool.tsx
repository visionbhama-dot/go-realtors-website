"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import type { Project } from "@/lib/types";
import { STATUS_LABEL, formatArea, priceRange } from "@/lib/utils";

const MAX = 3;

export function CompareTool({ projects }: { projects: Project[] }) {
  const [picked, setPicked] = useState<string[]>(
    projects.slice(0, 2).map((p) => p.slug),
  );
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () =>
      picked
        .map((s) => projects.find((p) => p.slug === s))
        .filter((p): p is Project => Boolean(p)),
    [picked, projects],
  );

  const available = useMemo(() => {
    const q = query.toLowerCase().trim();
    return projects
      .filter((p) => !picked.includes(p.slug))
      .filter((p) =>
        q
          ? `${p.name} ${p.developer} ${p.sector} ${p.locality}`
              .toLowerCase()
              .includes(q)
          : true,
      );
  }, [projects, picked, query]);

  const add = (slug: string) =>
    setPicked((prev) => (prev.length >= MAX ? prev : [...prev, slug]));
  const remove = (slug: string) =>
    setPicked((prev) => prev.filter((s) => s !== slug));

  const rows: { label: string; get: (p: Project) => string }[] = [
    { label: "Developer", get: (p) => p.developer },
    { label: "Location", get: (p) => `${p.sector}, ${p.locality}` },
    { label: "City", get: (p) => p.city },
    {
      label: "Category",
      get: (p) => (p.category === "commercial" ? "Commercial" : "Residential"),
    },
    { label: "Asset type", get: (p) => p.propertyType },
    { label: "Status", get: (p) => STATUS_LABEL[p.status] ?? p.status },
    { label: "Configurations", get: (p) => p.configurationsLabel || "On request" },
    { label: "Starting price", get: (p) => priceRange(p.priceMin, p.priceMax) },
    {
      label: "Smallest unit",
      get: (p) =>
        p.configurations.length
          ? formatArea(Math.min(...p.configurations.map((c) => c.areaSqft)))
          : "On request",
    },
    {
      label: "Largest unit",
      get: (p) =>
        p.configurations.length
          ? formatArea(Math.max(...p.configurations.map((c) => c.areaSqft)))
          : "On request",
    },
    {
      label: "Indicative rate",
      get: (p) => {
        if (!p.priceMin || !p.configurations.length) return "On request";
        const area = Math.min(...p.configurations.map((c) => c.areaSqft));
        if (!area) return "On request";
        return `₹${Math.round(p.priceMin / area).toLocaleString("en-IN")} / sq.ft.`;
      },
    },
    {
      label: "Land area",
      get: (p) => (p.landAcres ? `${p.landAcres} acres` : "On request"),
    },
    { label: "Towers", get: (p) => (p.towers ? String(p.towers) : "On request") },
    {
      label: "Total units",
      get: (p) => (p.units ? p.units.toLocaleString("en-IN") : "On request"),
    },
    { label: "Possession", get: (p) => p.possession ?? "On request" },
    { label: "RERA", get: (p) => (p.rera ? "Registered" : "Ask us") },
    {
      label: "Amenities listed",
      get: (p) => String(p.amenities.length || "—"),
    },
  ];

  return (
    <div>
      {/* selected strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: MAX }).map((_, i) => {
          const p = selected[i];
          if (p) {
            return (
              <div key={p.slug} className="card relative overflow-hidden">
                <button
                  type="button"
                  onClick={() => remove(p.slug)}
                  aria-label={`Remove ${p.name} from comparison`}
                  className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink-950/70 text-white backdrop-blur transition-colors hover:bg-ink-950"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.6} />
                </button>
                <div className="relative aspect-[16/10] bg-ink-100">
                  <Image
                    src={p.images[0] ?? "/brand/placeholder.svg"}
                    alt={p.name}
                    fill
                    sizes="(max-width:640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-brand-700">
                    {p.developer}
                  </p>
                  <h3 className="mt-1 font-display text-[0.9375rem] font-bold leading-snug">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="hover:text-brand-700"
                    >
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[0.75rem] text-ink-500">
                    {p.sector}, {p.locality}
                  </p>
                </div>
              </div>
            );
          }
          return (
            <div
              key={`slot-${i}`}
              className="flex min-h-[14rem] flex-col items-center justify-center rounded-md border-2 border-dashed border-ink-300 bg-ink-50/50 p-5 text-center"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-400 shadow-card">
                <Plus className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <p className="mt-3 text-[0.8125rem] font-semibold text-ink-600">
                Add a project
              </p>
              <p className="mt-1 text-[0.75rem] text-ink-400">
                Pick from the list below
              </p>
            </div>
          );
        })}
      </div>

      {/* picker */}
      {picked.length < MAX && (
        <div className="card mt-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[0.9375rem] font-bold">
              Add to comparison
              <span className="ml-2 font-sans text-[0.75rem] font-semibold text-ink-400">
                {picked.length} of {MAX} selected
              </span>
            </h2>
            <label htmlFor="cmp-search" className="sr-only">
              Search projects
            </label>
            <input
              id="cmp-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="field h-9 w-full sm:w-64"
            />
          </div>
          <div className="mt-4 flex max-h-56 flex-wrap gap-2 overflow-y-auto">
            {available.length === 0 ? (
              <p className="text-[0.8125rem] text-ink-500">
                No projects match that search.
              </p>
            ) : (
              available.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => add(p.slug)}
                  className="chip hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
                >
                  <Plus className="h-3 w-3" strokeWidth={2.8} />
                  {p.name}
                  <span className="text-ink-400">· {p.sector}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* table */}
      {selected.length === 0 ? (
        <div className="card mt-8 p-12 text-center">
          <h2 className="font-display text-lg font-bold">
            Select at least one project
          </h2>
          <p className="mt-2 text-[0.875rem] text-ink-600">
            Add up to three projects above to see them side by side.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-md border border-ink-200">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Project comparison table</caption>
            <thead>
              <tr className="bg-ink-950 text-white">
                <th
                  scope="col"
                  className="sticky left-0 z-10 min-w-[9.5rem] bg-ink-950 px-4 py-3 text-[0.6875rem] font-bold uppercase tracking-wider"
                >
                  Parameter
                </th>
                {selected.map((p) => (
                  <th
                    key={p.slug}
                    scope="col"
                    className="min-w-[11rem] px-4 py-3 text-[0.75rem] font-bold"
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-white" : "bg-ink-50/60"}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 px-4 py-3 text-[0.75rem] font-bold uppercase tracking-wider text-ink-500 ${
                      i % 2 === 0 ? "bg-white" : "bg-ink-50/60"
                    }`}
                  >
                    {row.label}
                  </th>
                  {selected.map((p) => (
                    <td
                      key={p.slug}
                      className="px-4 py-3 text-[0.8125rem] font-medium text-ink-800"
                    >
                      {row.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-white">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-white px-4 py-4 text-[0.75rem] font-bold uppercase tracking-wider text-ink-500"
                >
                  Details
                </th>
                {selected.map((p) => (
                  <td key={p.slug} className="px-4 py-4">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="btn btn-outline btn-sm"
                    >
                      View project
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-5 rounded-md bg-ink-50 p-4 text-[0.6875rem] leading-relaxed text-ink-500">
        Indicative rate is derived by dividing the starting price by the
        smallest listed unit area, which is a super-area figure. It is useful
        for rough comparison only — actual carpet-area rates differ by project
        depending on loading, and two projects with the same super-area rate can
        differ by 20% in usable space. Ask us for the carpet-area comparison
        before deciding.
      </p>
    </div>
  );
}
