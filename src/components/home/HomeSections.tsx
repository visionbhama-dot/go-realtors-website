import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { NavIcon, type NavIconKey } from "@/components/layout/navIcons";
import { CitySkyline } from "@/components/home/CitySkyline";
import {
  CURATED_COLLECTIONS,
  FEATURED_CITIES,
  PROPERTY_TYPE_TILES,
} from "@/data/content";

/* ---------------------------------------------------------------- *
 * Browse by property type — circular image thumbnails in a row.
 * Deliberately distinct from the rectangular Curated Collection tiles.
 * ---------------------------------------------------------------- */
export function PropertyTypeStrip() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-8">
      {PROPERTY_TYPE_TILES.map((t, i) => (
        <li key={t.label}>
          <Link
            href={t.href}
            className="group flex flex-col items-center gap-3 text-center"
          >
            <span className="relative block aspect-square w-full max-w-[7rem] overflow-hidden rounded-full ring-2 ring-ink-200 ring-offset-2 transition-all group-hover:ring-brand-500">
              <Image
                src={t.image}
                alt={t.label}
                fill
                sizes="7rem"
                priority={i < 4}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-ink-950/15 transition-colors group-hover:bg-brand-900/25"
              />
              <span className="absolute bottom-1.5 right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-card backdrop-blur transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <NavIcon name={t.icon as NavIconKey} className="h-3.5 w-3.5" />
              </span>
            </span>
            <span className="text-[0.8125rem] font-bold leading-tight text-ink-800 transition-colors group-hover:text-brand-700">
              {t.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- *
 * Curated collections — image tiles (reference screenshot 1)
 * ---------------------------------------------------------------- */
export function CuratedCollections() {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
      {CURATED_COLLECTIONS.map((c, i) => (
        <Link
          key={c.label}
          href={c.href}
          className="group relative isolate flex aspect-[4/3] w-[72%] shrink-0 snap-start items-end overflow-hidden rounded-lg bg-ink-900 sm:w-auto sm:shrink"
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
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 xl:grid-cols-6">
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
            className="group w-[62%] shrink-0 snap-start overflow-hidden rounded-lg border border-ink-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lift sm:w-auto sm:shrink"
          >
            <div
              className={`relative flex h-32 items-end overflow-hidden bg-gradient-to-br ${city.gradient} p-3`}
            >
              {city.image ? (
                <>
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1280px) 33vw, 16rem"
                    className="object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent"
                  />
                </>
              ) : (
                <>
                  <div aria-hidden className="absolute inset-0 grain opacity-30" />
                  <CitySkyline
                    variant={city.art}
                    className="absolute inset-x-0 bottom-0 h-20 w-full text-white/25"
                  />
                </>
              )}
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
