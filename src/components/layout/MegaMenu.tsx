"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavIcon, type NavIconKey } from "./navIcons";
import { cn } from "@/lib/utils";

export type NavChild = {
  label: string;
  href: string;
  /** the muted explanatory line under the bold label */
  description?: string;
  icon?: NavIconKey;
  /** right-aligned count */
  note?: string;
};

export type MegaColumn = {
  heading: string;
  items: NavChild[];
  viewAll?: { label: string; href: string };
  /**
   * list  — icon tile + bold label + description (the default)
   * tiles — icon above label in a card grid, for picking a place
   * links — compact text links in two columns, for long tails
   */
  layout?: "list" | "tiles" | "links";
  /** column span in the 12-unit panel grid */
  span?: number;
};

export type HeaderNavItem = {
  label: string;
  href: string;
  mega?: MegaColumn[];
  /** total panel width in rem; defaults to something sensible */
  width?: number;
};

export function MegaPanel({
  columns,
  width,
  onNavigate,
}: {
  columns: MegaColumn[];
  width?: number;
  onNavigate?: () => void;
}) {
  const totalSpan = columns.reduce((n, c) => n + (c.span ?? 4), 0);

  return (
    <div
      className="reveal overflow-hidden rounded-lg border border-ink-200 bg-white shadow-rise"
      style={{ width: `min(${width ?? 52}rem, 94vw)` }}
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${totalSpan}, minmax(0,1fr))` }}
      >
        {columns.map((col) => (
          <div
            key={col.heading}
            className="border-r border-ink-100 p-6 last:border-r-0"
            style={{ gridColumn: `span ${col.span ?? 4}` }}
          >
            <p className="mb-4 text-[0.75rem] font-bold tracking-tight text-ink-500">
              {col.heading}
            </p>

            {col.layout === "tiles" ? (
              <TileGrid items={col.items} onNavigate={onNavigate} />
            ) : col.layout === "links" ? (
              <LinkList items={col.items} onNavigate={onNavigate} />
            ) : (
              <RichList items={col.items} onNavigate={onNavigate} />
            )}

            {col.viewAll && (
              <Link
                href={col.viewAll.href}
                onClick={onNavigate}
                className="mt-4 inline-flex items-center gap-1.5 border-t border-ink-100 pt-4 text-[0.8125rem] font-bold text-brand-700 transition-colors hover:text-brand-800"
              >
                {col.viewAll.label}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Icon tile + bold label + description. The PropTiger-style default. */
function RichList({
  items,
  onNavigate,
}: {
  items: NavChild[];
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item.href + item.label}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="group flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-brand-50"
          >
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-600 transition-colors group-hover:border-brand-400 group-hover:bg-brand-600 group-hover:text-white">
              <NavIcon name={item.icon} className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-display text-[0.9375rem] font-bold leading-snug text-ink-950 transition-colors group-hover:text-brand-800">
                  {item.label}
                </span>
                {item.note && (
                  <span className="shrink-0 rounded-sm bg-ink-100 px-1.5 py-0.5 text-[0.625rem] font-bold tabular-nums text-ink-600 transition-colors group-hover:bg-brand-200 group-hover:text-brand-900">
                    {item.note}
                  </span>
                )}
              </span>
              {item.description && (
                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-500">
                  {item.description}
                </span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Icon above label in a bordered card. For picking a corridor. */
function TileGrid({
  items,
  onNavigate,
}: {
  items: NavChild[];
  onNavigate?: () => void;
}) {
  return (
    <ul className="grid grid-cols-3 gap-2.5">
      {items.map((item) => (
        <li key={item.href + item.label}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="group flex h-full flex-col items-center justify-start gap-2 rounded-md border border-ink-200 bg-ink-50/60 px-2 py-3.5 text-center transition-all hover:border-brand-400 hover:bg-brand-50"
          >
            <NavIcon
              name={item.icon}
              className="h-6 w-6 text-ink-500 transition-colors group-hover:text-brand-700"
            />
            <span className="font-display text-[0.8125rem] font-bold leading-tight text-ink-950 transition-colors group-hover:text-brand-800">
              {item.label}
            </span>
            {item.note && (
              <span className="text-[0.6875rem] font-semibold tabular-nums text-ink-400">
                {item.note}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Compact two-column text links for long tails. */
function LinkList({
  items,
  onNavigate,
}: {
  items: NavChild[];
  onNavigate?: () => void;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
      {items.map((item) => (
        <li key={item.href + item.label}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="block truncate rounded-sm py-1.5 text-[0.8125rem] font-medium text-ink-600 transition-colors hover:text-brand-700"
            title={item.label}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Mobile accordion body — same data, stacked. */
export function MegaMobile({
  columns,
  onNavigate,
}: {
  columns: MegaColumn[];
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-4 pb-2">
      {columns.map((col) => (
        <div key={col.heading}>
          <p className="px-2 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink-400">
            {col.heading}
          </p>

          {col.layout === "tiles" ? (
            <ul className="grid grid-cols-2 gap-2 px-1">
              {col.items.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="flex flex-col items-center gap-1.5 rounded-md border border-ink-200 bg-ink-50/60 px-2 py-3 text-center"
                  >
                    <NavIcon name={item.icon} className="h-5 w-5 text-ink-500" />
                    <span className="text-[0.75rem] font-bold leading-tight text-ink-950">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : col.layout === "links" ? (
            <ul className="grid grid-cols-2 gap-x-3 px-2">
              {col.items.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="block truncate py-1.5 text-[0.8125rem] text-ink-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-0.5">
              {col.items.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="flex items-start gap-2.5 rounded-md px-2 py-2 hover:bg-brand-50"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-ink-200 text-ink-600">
                      <NavIcon name={item.icon} className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.8125rem] font-bold leading-snug text-ink-950">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="mt-0.5 block text-[0.75rem] leading-snug text-ink-500">
                          {item.description}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {col.viewAll && (
            <Link
              href={col.viewAll.href}
              onClick={onNavigate}
              className={cn(
                "mt-1.5 inline-flex items-center gap-1 px-2 text-[0.75rem] font-bold text-brand-700",
              )}
            >
              {col.viewAll.label}
              <ArrowRight className="h-3 w-3" strokeWidth={2.6} />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
