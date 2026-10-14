import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { NavIcon, type NavIconKey } from "@/components/layout/navIcons";
import {
  CURATED_COLLECTIONS,
  FEATURED_CITIES,
  PROPERTY_TYPE_TILES,
} from "@/data/content";

/* ---------------------------------------------------------------- *
 * Browse by property type — the icon strip (reference image 1)
 * ---------------------------------------------------------------- */
export function PropertyTypeStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {PROPERTY_TYPE_TILES.map((t) => (
        <Link
          key={t.label}
          href={t.href}
          className="group flex flex-col items-center justify-start gap-3 rounded-lg border border-ink-200 bg-white px-3 py-5 text-center transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-lift"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
            <NavIcon name={t.icon as NavIconKey} className="h-5.5 w-5.5" />
          </span>
          <span className="text-[0.8125rem] font-bold leading-tight text-ink-800 group-hover:text-brand-800">
            {t.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Curated collections — image tiles (reference screenshot 1)
 * ---------------------------------------------------------------- */
export function CuratedCollections() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CURATED_COLLECTIONS.map((c, i) => (
        <Link
          key={c.label}
          href={c.href}
          className="group relative isolate flex aspect-[4/3] items-end overflow-hidden rounded-lg bg-ink-900"
        >
          <Image
            src={c.image}
            alt={c.label}
            fill
            sizes="(max-width:1024px) 50vw, 25vw"
            priority={i < 4}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent transition-colors group-hover:from-ink-950/90"
          />
          <div className="relative flex w-full items-center justify-between gap-2 p-4">
            <span className="font-display text-[1.0625rem] font-bold text-white drop-shadow">
              {c.label}
            </span>
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors group-hover:bg-brand-600">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Featured cities (reference image 4)
 * ---------------------------------------------------------------- */
export function FeaturedCities({
  cityCounts,
}: {
  cityCounts: Record<string, number>;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {FEATURED_CITIES.map((city) => {
        const count = city.matchCity ? (cityCounts[city.matchCity] ?? 0) : 0;
        const href =
          count > 0
            ? `/projects?q=${encodeURIComponent(city.name)}`
            : "/contact";
        return (
          <Link
            key={city.name}
            href={href}
            className="group overflow-hidden rounded-lg border border-ink-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div
              className={`relative flex h-28 items-end bg-gradient-to-br ${city.gradient} p-3`}
            >
              <div aria-hidden className="absolute inset-0 grain opacity-40" />
              <span className="relative font-display text-[1.0625rem] font-bold text-white drop-shadow">
                {city.name}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-[0.75rem] font-semibold text-brand-700">
                {count > 0
                  ? `${count} ${count === 1 ? "project" : "projects"}`
                  : "Request options"}
              </span>
              <ArrowRight
                className="h-3.5 w-3.5 text-ink-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600"
                strokeWidth={2.4}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
