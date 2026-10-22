"use client";

import Link from "next/link";
import { LiveSearch } from "@/components/search/LiveSearch";
import type { SearchItem } from "@/lib/search";

const TABS = [
  { id: "residential", label: "Residential", href: "/projects?category=residential" },
  { id: "commercial", label: "Commercial", href: "/projects?category=commercial" },
  { id: "all", label: "All Projects", href: "/projects" },
] as const;

/**
 * Simple hero search — a single prominent search bar with type-ahead, plus a
 * Residential / Commercial / All toggle beneath it, mirroring the reference.
 */
export function HeroSearch({ searchIndex }: { searchIndex: SearchItem[] }) {
  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.href}
            className="whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[0.8125rem] font-bold text-white backdrop-blur transition-colors hover:border-brand-400 hover:bg-brand-600 sm:px-5"
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="rounded-md bg-white p-2 shadow-rise">
        <LiveSearch
          index={searchIndex}
          placeholder="Search by project, location or developer"
          inputClassName="h-13 border-transparent bg-white pl-11 text-[0.9375rem] focus:shadow-none"
        />
      </div>
    </div>
  );
}
