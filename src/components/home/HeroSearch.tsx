"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "all", label: "All Projects" },
] as const;

const BUDGETS = [
  { label: "Any budget", min: "", max: "" },
  { label: "Under ₹1.5 Cr", min: "", max: "15000000" },
  { label: "₹1.5 Cr - ₹3 Cr", min: "15000000", max: "30000000" },
  { label: "₹3 Cr - ₹5 Cr", min: "30000000", max: "50000000" },
  { label: "₹5 Cr - ₹10 Cr", min: "50000000", max: "100000000" },
  { label: "Above ₹10 Cr", min: "100000000", max: "" },
];

export function HeroSearch({
  localities,
  propertyTypes,
}: {
  localities: { slug: string; name: string }[];
  propertyTypes: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("residential");
  const [locality, setLocality] = useState("");
  const [ptype, setPtype] = useState("");
  const [budget, setBudget] = useState("0");
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tab !== "all") params.set("category", tab);
    if (locality) params.set("locality", locality);
    if (ptype) params.set("propertyType", ptype);
    if (q.trim()) params.set("q", q.trim());
    const b = BUDGETS[Number(budget)]!;
    if (b.min) params.set("minPrice", b.min);
    if (b.max) params.set("maxPrice", b.max);
    router.push(`/projects?${params.toString()}`);
  }

  return (
    <div className="w-full">
      {/* tabs */}
      <div className="flex gap-1" role="tablist" aria-label="Search category">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-t-sm px-4 py-2.5 text-[0.8125rem] font-bold transition-colors sm:px-5",
              tab === t.id
                ? "bg-white text-ink-950"
                : "bg-ink-950/45 text-white/75 backdrop-blur hover:bg-ink-950/60 hover:text-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* panel */}
      <form
        onSubmit={submit}
        className="rounded-b-sm rounded-tr-sm bg-white p-3 shadow-rise sm:p-4"
      >
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
              strokeWidth={2.2}
            />
            <label htmlFor="hero-q" className="sr-only">
              Search projects
            </label>
            <input
              id="hero-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Project, developer or sector…"
              className="field h-11 pl-9"
            />
          </div>

          <div>
            <label htmlFor="hero-loc" className="sr-only">
              Location
            </label>
            <select
              id="hero-loc"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="field h-11"
            >
              <option value="">All locations</option>
              {localities.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="hero-type" className="sr-only">
              Property type
            </label>
            <select
              id="hero-type"
              value={ptype}
              onChange={(e) => setPtype(e.target.value)}
              className="field h-11"
            >
              <option value="">All property types</option>
              {propertyTypes.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="hero-budget" className="sr-only">
              Budget
            </label>
            <select
              id="hero-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="field h-11"
            >
              {BUDGETS.map((b, i) => (
                <option key={b.label} value={String(i)}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary h-11 px-6">
            <Search className="h-4 w-4" strokeWidth={2.4} />
            Search
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-ink-100 pt-3 text-[0.75rem]">
          <span className="inline-flex items-center gap-1.5 font-semibold text-ink-400">
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2.2} />
            Popular
          </span>
          {[
            { label: "Dwarka Expressway", href: "/locations/dwarka-expressway" },
            { label: "Golf Course Road", href: "/locations/golf-course-road" },
            { label: "SCO Plots", href: "/projects?propertyType=sco-plots" },
            { label: "New Launches", href: "/projects?status=new-launch" },
            { label: "Under ₹3 Cr", href: "/projects?maxPrice=30000000" },
          ].map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="rounded-full border border-ink-200 px-2.5 py-1 font-medium text-ink-600 transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
            >
              {p.label}
            </a>
          ))}
        </div>
      </form>
    </div>
  );
}
