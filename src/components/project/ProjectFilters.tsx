"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Filter, RotateCcw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FacetOption = { slug: string; name: string; count: number };

export type Facets = {
  localities: FacetOption[];
  developers: FacetOption[];
  propertyTypes: FacetOption[];
  statuses: FacetOption[];
};

const BUDGET_STEPS = [
  { label: "Under ₹1.5 Cr", min: "", max: "15000000" },
  { label: "₹1.5 - ₹3 Cr", min: "15000000", max: "30000000" },
  { label: "₹3 - ₹5 Cr", min: "30000000", max: "50000000" },
  { label: "₹5 - ₹10 Cr", min: "50000000", max: "100000000" },
  { label: "₹10 Cr +", min: "100000000", max: "" },
];

const BHKS = ["2", "3", "4", "5"];

export function ProjectFilters({
  facets,
  total,
  showing,
  children,
}: {
  facets: Facets;
  total: number;
  showing: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function update(mutate: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `/projects?${qs}` : "/projects", { scroll: false });
  }

  const set = (key: string, value: string | null) =>
    update((p) => (value ? p.set(key, value) : p.delete(key)));

  const toggle = (key: string, value: string) =>
    update((p) => (p.get(key) === value ? p.delete(key) : p.set(key, value)));

  const budgetActive = (b: (typeof BUDGET_STEPS)[number]) =>
    (params.get("minPrice") ?? "") === b.min &&
    (params.get("maxPrice") ?? "") === b.max;

  const activeChips: { label: string; clear: () => void }[] = [];
  const addChip = (key: string, prefix: string, lookup?: FacetOption[]) => {
    const v = params.get(key);
    if (!v) return;
    const name = lookup?.find((o) => o.slug === v)?.name ?? v;
    activeChips.push({
      label: `${prefix}: ${name}`,
      clear: () => set(key, null),
    });
  };
  addChip("category", "Type");
  addChip("locality", "Location", facets.localities);
  addChip("developer", "Developer", facets.developers);
  addChip("status", "Stage", facets.statuses);
  addChip("propertyType", "Asset", facets.propertyTypes);
  addChip("bhk", "Config");
  if (params.get("q")) {
    activeChips.push({
      label: `Search: ${params.get("q")}`,
      clear: () => set("q", null),
    });
  }
  const budget = BUDGET_STEPS.find(budgetActive);
  if (budget) {
    activeChips.push({
      label: `Budget: ${budget.label}`,
      clear: () =>
        update((p) => {
          p.delete("minPrice");
          p.delete("maxPrice");
        }),
    });
  }

  const panel = (
    <div className="space-y-7">
      {/* search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          set("q", q.trim() || null);
          setOpen(false);
        }}
      >
        <FilterLabel>Search</FilterLabel>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            strokeWidth={2.2}
          />
          <label htmlFor="flt-q" className="sr-only">
            Search projects
          </label>
          <input
            id="flt-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Project, developer, sector"
            className="field pl-9"
          />
        </div>
      </form>

      <Group label="Category">
        <div className="flex flex-wrap gap-2">
          {[
            { slug: "residential", name: "Residential" },
            { slug: "commercial", name: "Commercial" },
          ].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => toggle("category", c.slug)}
              className={cn(
                "chip",
                params.get("category") === c.slug && "chip-active",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </Group>

      <Group label="Budget">
        <div className="flex flex-wrap gap-2">
          {BUDGET_STEPS.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() =>
                update((p) => {
                  if (budgetActive(b)) {
                    p.delete("minPrice");
                    p.delete("maxPrice");
                    return;
                  }
                  if (b.min) p.set("minPrice", b.min);
                  else p.delete("minPrice");
                  if (b.max) p.set("maxPrice", b.max);
                  else p.delete("maxPrice");
                })
              }
              className={cn("chip", budgetActive(b) && "chip-active")}
            >
              {b.label}
            </button>
          ))}
        </div>
      </Group>

      <Group label="Configuration">
        <div className="flex flex-wrap gap-2">
          {BHKS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => toggle("bhk", b)}
              className={cn("chip", params.get("bhk") === b && "chip-active")}
            >
              {b} BHK
            </button>
          ))}
        </div>
      </Group>

      <Group label="Construction stage">
        <ul className="space-y-1">
          {facets.statuses.map((s) => (
            <FacetRow
              key={s.slug}
              option={s}
              active={params.get("status") === s.slug}
              onClick={() => toggle("status", s.slug)}
            />
          ))}
        </ul>
      </Group>

      <Group label="Location">
        <ul className="space-y-1">
          {facets.localities.map((l) => (
            <FacetRow
              key={l.slug}
              option={l}
              active={params.get("locality") === l.slug}
              onClick={() => toggle("locality", l.slug)}
            />
          ))}
        </ul>
      </Group>

      <Group label="Asset type">
        <ul className="space-y-1">
          {facets.propertyTypes.map((t) => (
            <FacetRow
              key={t.slug}
              option={t}
              active={params.get("propertyType") === t.slug}
              onClick={() => toggle("propertyType", t.slug)}
            />
          ))}
        </ul>
      </Group>

      <Group label="Developer">
        <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {facets.developers.map((d) => (
            <FacetRow
              key={d.slug}
              option={d}
              active={params.get("developer") === d.slug}
              onClick={() => toggle("developer", d.slug)}
            />
          ))}
        </ul>
      </Group>
    </div>
  );

  return (
    <>
      {/* ---- mobile toolbar ---- */}
      <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-outline btn-sm"
        >
          <Filter className="h-4 w-4" strokeWidth={2.2} />
          Filters
          {activeChips.length > 0 && (
            <span className="ml-0.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-600 px-1 text-[0.625rem] font-bold text-white">
              {activeChips.length}
            </span>
          )}
        </button>
        <SortSelect value={params.get("sort") ?? ""} onChange={(v) => set("sort", v || null)} />
      </div>

      {/* ---- active chips + desktop sort ---- */}
      <div className="mb-6 flex flex-col gap-3 border-b border-ink-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[0.8125rem] text-ink-600">
            Showing{" "}
            <strong className="font-bold text-ink-950">{showing}</strong> of{" "}
            <strong className="font-bold text-ink-950">{total}</strong> projects
          </p>
          {activeChips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={c.clear}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 bg-brand-50 px-2.5 py-1 text-[0.75rem] font-semibold text-brand-800 transition-colors hover:border-brand-500"
            >
              {c.label}
              <X className="h-3 w-3" strokeWidth={2.8} />
            </button>
          ))}
          {activeChips.length > 1 && (
            <button
              type="button"
              onClick={() => router.push("/projects", { scroll: false })}
              className="inline-flex items-center gap-1 text-[0.75rem] font-bold text-ink-500 hover:text-ink-950"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={2.6} />
              Clear all
            </button>
          )}
        </div>
        <div className="hidden lg:block">
          <SortSelect
            value={params.get("sort") ?? ""}
            onChange={(v) => set("sort", v || null)}
          />
        </div>
      </div>

      {/* ---- layout: desktop sidebar + results ---- */}
      <div className="lg:grid lg:grid-cols-[17rem_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="card sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-[0.9375rem] font-bold">
                Refine results
              </h2>
              {activeChips.length > 0 && (
                <button
                  type="button"
                  onClick={() => router.push("/projects", { scroll: false })}
                  className="text-[0.75rem] font-bold text-brand-700 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>

      {/* ---- mobile drawer ---- */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-950/60"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(22rem,90vw)] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-ink-200 px-4 py-3">
              <h2 className="font-display text-base font-bold">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-ink-200"
              >
                <X className="h-4 w-4" strokeWidth={2.3} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{panel}</div>
            <div className="flex gap-2 border-t border-ink-200 p-3">
              <button
                type="button"
                onClick={() => router.push("/projects", { scroll: false })}
                className="btn btn-outline flex-1"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn-primary flex-1"
              >
                Show {showing} results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-500">
      {children}
    </p>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-ink-100 pt-5">
      <FilterLabel>{label}</FilterLabel>
      {children}
    </div>
  );
}

function FacetRow({
  option,
  active,
  onClick,
}: {
  option: FacetOption;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-[0.8125rem] transition-colors",
          active
            ? "bg-brand-50 font-bold text-brand-800"
            : "text-ink-700 hover:bg-ink-50",
        )}
      >
        <span className="truncate">{option.name}</span>
        <span
          className={cn(
            "shrink-0 text-[0.6875rem] font-semibold tabular-nums",
            active ? "text-brand-700" : "text-ink-400",
          )}
        >
          {option.count}
        </span>
      </button>
    </li>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort"
        className="shrink-0 text-[0.75rem] font-semibold text-ink-500"
      >
        Sort
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field h-9 w-auto py-0 text-[0.8125rem]"
      >
        <option value="">Recommended</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name">Name: A to Z</option>
      </select>
    </div>
  );
}
