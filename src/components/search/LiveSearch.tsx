"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  ChevronUp,
  CornerDownLeft,
  FileText,
  MapPin,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import {
  KIND_LABEL,
  rankSearch,
  type SearchItem,
  type SearchKind,
} from "@/lib/search";
import { cn } from "@/lib/utils";

const ICON: Record<SearchKind, React.ReactNode> = {
  project: <Building2 className="h-3.5 w-3.5" strokeWidth={2.2} />,
  locality: <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />,
  developer: <UsersRound className="h-3.5 w-3.5" strokeWidth={2.2} />,
  post: <FileText className="h-3.5 w-3.5" strokeWidth={2.2} />,
};

const QUICK = [
  { label: "New launches", href: "/projects?status=new-launch" },
  { label: "Under ₹3 Cr", href: "/projects?maxPrice=30000000" },
  { label: "3 BHK", href: "/projects?bhk=3" },
  { label: "SCO plots", href: "/projects?propertyType=sco-plots" },
  { label: "Dwarka Expressway", href: "/locations/dwarka-expressway" },
];

/**
 * Debounced type-ahead over the bundled search index. Matching happens in the
 * browser so results appear on the same frame as the keystroke.
 */
export function LiveSearch({
  index,
  variant = "inline",
  placeholder = "Search projects, developers, sectors…",
  autoFocus = false,
  onClose,
  className,
  inputClassName,
}: {
  index: SearchItem[];
  variant?: "inline" | "overlay";
  placeholder?: string;
  autoFocus?: boolean;
  onClose?: () => void;
  className?: string;
  inputClassName?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const [raw, setRaw] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // debounce keeps the match work off every single keystroke
  useEffect(() => {
    const id = setTimeout(() => setQuery(raw), 90);
    return () => clearTimeout(id);
  }, [raw]);

  const results = useMemo(
    () => rankSearch(index, query, variant === "overlay" ? 14 : 8),
    [index, query, variant],
  );

  const grouped = useMemo(() => {
    const order: SearchKind[] = ["project", "locality", "developer", "post"];
    const map = new Map<SearchKind, SearchItem[]>();
    results.forEach((r) => {
      const list = map.get(r.k) ?? [];
      list.push(r);
      map.set(r.k, list);
    });
    return order
      .filter((k) => map.has(k))
      .map((k) => ({ kind: k, items: map.get(k)! }));
  }, [results]);

  // flat list in render order, so arrow keys match what the eye sees
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // close on outside click (inline variant only — overlay has its own backdrop)
  useEffect(() => {
    if (variant !== "inline") return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [variant]);

  const go = (href: string) => {
    setOpen(false);
    setRaw("");
    onClose?.();
    router.push(href);
  };

  const submit = () => {
    if (flat[active]) go(flat[active]!.h);
    else if (raw.trim()) go(`/projects?q=${encodeURIComponent(raw.trim())}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      if (raw) setRaw("");
      else onClose?.();
      setOpen(false);
    }
  };

  const showPanel =
    (open || variant === "overlay") &&
    (query.trim().length >= 2 || variant === "overlay");

  const hasQuery = query.trim().length >= 2;

  let runningIndex = -1;

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          strokeWidth={2.2}
        />
        <label htmlFor={listId} className="sr-only">
          Search the site
        </label>
        <input
          id={listId}
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={`${listId}-results`}
          aria-autocomplete="list"
          autoComplete="off"
          value={raw}
          placeholder={placeholder}
          onChange={(e) => {
            setRaw(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn(
            "field h-11 pl-10 pr-9",
            variant === "overlay" && "h-14 text-base",
            inputClassName,
          )}
        />
        {raw && (
          <button
            type="button"
            onClick={() => {
              setRaw("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-900"
          >
            <X className="h-4 w-4" strokeWidth={2.4} />
          </button>
        )}
      </div>

      {showPanel && (
        <div
          id={`${listId}-results`}
          role="listbox"
          className={cn(
            "z-50 overflow-hidden rounded-md border border-ink-200 bg-white shadow-rise",
            variant === "inline"
              ? // widen past a narrow grid cell so titles are not cramped
                "absolute left-0 top-full mt-2 w-[min(26rem,calc(100vw-2rem))] min-w-full"
              : "mt-3",
          )}
        >
          {!hasQuery ? (
            <div className="p-4">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-ink-400">
                Popular searches
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    onClick={() => onClose?.()}
                    className="chip"
                  >
                    {q.label}
                  </Link>
                ))}
              </div>
              <p className="mt-4 border-t border-ink-100 pt-3 text-[0.75rem] text-ink-500">
                Type at least two characters to search {index.length} projects,
                corridors, developers and articles.
              </p>
            </div>
          ) : flat.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-[0.875rem] font-semibold text-ink-900">
                No matches for &ldquo;{query}&rdquo;
              </p>
              <p className="mx-auto mt-1.5 max-w-xs text-[0.75rem] leading-relaxed text-ink-500">
                Try a sector number, a developer name or a corridor — or browse
                the full directory.
              </p>
              <Link
                href="/projects"
                onClick={() => onClose?.()}
                className="btn btn-outline btn-sm mt-4"
              >
                Browse all projects
              </Link>
            </div>
          ) : (
            <>
              <div className="max-h-[22rem] overflow-y-auto py-1.5">
                {grouped.map((group) => (
                  <div key={group.kind}>
                    <p className="px-3 py-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-ink-400">
                      {KIND_LABEL[group.kind]}
                    </p>
                    {group.items.map((item) => {
                      runningIndex += 1;
                      const idx = runningIndex;
                      const isActive = idx === active;
                      return (
                        <button
                          key={item.h}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => go(item.h)}
                          className={cn(
                            "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                            isActive ? "bg-brand-50" : "hover:bg-ink-50",
                          )}
                        >
                          {item.i ? (
                            <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded-sm bg-ink-100">
                              <Image
                                src={item.i}
                                alt=""
                                fill
                                sizes="3rem"
                                className="object-cover"
                              />
                            </span>
                          ) : (
                            <span
                              className={cn(
                                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm",
                                isActive
                                  ? "bg-brand-600 text-white"
                                  : "bg-ink-100 text-ink-500",
                              )}
                            >
                              {ICON[item.k]}
                            </span>
                          )}

                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block truncate text-[0.8125rem] font-semibold",
                                isActive ? "text-brand-900" : "text-ink-900",
                              )}
                            >
                              {item.t}
                            </span>
                            <span className="block truncate text-[0.6875rem] text-ink-500">
                              {item.s}
                            </span>
                          </span>

                          {item.m && (
                            <span className="shrink-0 text-[0.75rem] font-bold tabular-nums text-ink-700">
                              {item.m}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(`/projects?q=${encodeURIComponent(query)}`)}
                className="flex w-full items-center justify-between gap-2 border-t border-ink-100 bg-ink-50/70 px-3 py-2.5 text-[0.75rem] font-bold text-brand-700 transition-colors hover:bg-brand-50"
              >
                <span className="inline-flex items-center gap-1.5">
                  See all results for &ldquo;{query}&rdquo;
                  <ArrowRight className="h-3 w-3" strokeWidth={2.6} />
                </span>
                <span className="inline-flex items-center gap-1 text-[0.625rem] font-semibold text-ink-400">
                  <CornerDownLeft className="h-3 w-3" strokeWidth={2.4} />
                  Enter
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/** Header search: icon button that opens a centred overlay. */
export function SearchTrigger({ index }: { index: SearchItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        title="Search (Ctrl+K)"
        className="hidden h-9 w-9 items-center justify-center rounded-sm border border-ink-200 text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950 lg:inline-flex"
      >
        <Search className="h-4 w-4" strokeWidth={2.2} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 top-0 mx-auto w-full max-w-2xl px-4 pt-[12vh]">
            <div className="reveal">
              <LiveSearch
                index={index}
                variant="overlay"
                autoFocus
                placeholder="Search projects, developers, sectors, articles…"
                onClose={() => setOpen(false)}
                inputClassName="shadow-rise"
              />
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.6875rem] text-white/50">
                Press
                <kbd className="rounded border border-white/20 px-1 font-sans">
                  Esc
                </kbd>
                to close ·
                <kbd className="inline-flex items-center rounded border border-white/20 px-1">
                  <ChevronUp className="h-3 w-3" strokeWidth={2.6} />
                </kbd>
                <kbd className="inline-flex items-center rounded border border-white/20 px-1">
                  <ChevronDown className="h-3 w-3" strokeWidth={2.6} />
                </kbd>
                to navigate
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
