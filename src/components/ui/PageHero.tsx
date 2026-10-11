import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  tone = "dark",
}: {
  items: Crumb[];
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-[0.75rem]">
        <li>
          <Link
            href="/"
            className={cn(
              "transition-colors",
              light
                ? "text-ink-500 hover:text-brand-700"
                : "text-white/55 hover:text-brand-400",
            )}
          >
            Home
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={c.label + i} className="flex items-center gap-1">
            <ChevronRight
              className={cn(
                "h-3 w-3",
                light ? "text-ink-300" : "text-white/30",
              )}
              strokeWidth={2.4}
              aria-hidden
            />
            {c.href ? (
              <Link
                href={c.href}
                className={cn(
                  "transition-colors",
                  light
                    ? "text-ink-500 hover:text-brand-700"
                    : "text-white/55 hover:text-brand-400",
                )}
              >
                {c.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "font-semibold",
                  light ? "text-ink-900" : "text-white",
                )}
                aria-current="page"
              >
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  image = "/brand/band-residential.jpg",
  stats,
  children,
  size = "default",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  image?: string;
  stats?: { value: string; label: string }[];
  children?: React.ReactNode;
  size?: "default" | "compact";
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/92 to-ink-950/55"
      />
      <div
        className={cn(
          "shell relative",
          size === "compact" ? "py-10 lg:py-12" : "py-12 lg:py-16",
        )}
      >
        <Breadcrumbs items={crumbs} />
        <div className="mt-5 max-w-3xl">
          {eyebrow && <span className="eyebrow eyebrow-light">{eyebrow}</span>}
          <h1
            className={cn(
              "mt-3 font-display font-extrabold leading-[1.12] text-white",
              size === "compact"
                ? "text-[1.75rem] sm:text-[2.125rem]"
                : "text-[2rem] sm:text-[2.5rem] lg:text-[3rem]",
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/65 sm:text-base">
              {description}
            </p>
          )}
        </div>

        {stats && stats.length > 0 && (
          <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/12 pt-7 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-[1.5rem] font-extrabold leading-none text-white sm:text-[1.75rem]">
                    {s.value}
                  </span>
                  <span className="mt-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {children}
      </div>
    </section>
  );
}
