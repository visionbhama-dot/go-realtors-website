import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CRORE = 10000000;
const LAKH = 100000;

/** 36100000 -> "₹3.61 Cr" ; 8334000 -> "₹83.34 L" */
export function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Price on Request";
  }
  if (value >= CRORE) {
    const n = value / CRORE;
    return `₹${trimNum(n)} Cr`;
  }
  if (value >= LAKH) {
    const n = value / LAKH;
    return `₹${trimNum(n)} L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

function trimNum(n: number) {
  return n
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");
}

export function priceRange(
  min: number | null | undefined,
  max: number | null | undefined,
): string {
  if (!min && !max) return "Price on Request";
  if (min && max && max > min) return `${formatINR(min)} - ${formatINR(max)}`;
  return `${formatINR(min ?? max)}*`;
}

export function formatArea(sqft: number) {
  return `${sqft.toLocaleString("en-IN")} sq.ft.`;
}

/**
 * Alt text for a project gallery image. Uses the editor-supplied description
 * when there is one, otherwise falls back to a generated sentence so the
 * image is never announced as unlabelled.
 */
export function imageAlt(
  project: {
    name: string;
    sector?: string | null;
    city?: string | null;
    imageAlts?: string[];
  },
  index: number,
  total?: number,
): string {
  const supplied = project.imageAlts?.[index]?.trim();
  if (supplied) return supplied;

  const place = [project.sector, project.city].filter(Boolean).join(", ");
  const position = total && total > 1 ? ` — image ${index + 1} of ${total}` : "";
  return `${project.name}${place ? `, ${place}` : ""} — artistic impression${position}`;
}

/** Indian digit grouping for raw counts */
export function formatCount(n: number) {
  return n.toLocaleString("en-IN");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export const STATUS_LABEL: Record<string, string> = {
  "new-launch": "New Launch",
  "under-construction": "Under Construction",
  "ready-to-move": "Ready to Move",
  "sold-out": "Sold Out",
};

export const STATUS_TONE: Record<string, string> = {
  "new-launch": "bg-brand-600 text-white",
  "under-construction": "bg-amber-500 text-white",
  "ready-to-move": "bg-emerald-700 text-white",
  "sold-out": "bg-ink-400 text-white",
};

export const LEAD_STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  "site-visit": "Site Visit",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

export const LEAD_STATUS_TONE: Record<string, string> = {
  new: "bg-sky-50 text-sky-700 border-sky-200",
  contacted: "bg-indigo-50 text-indigo-700 border-indigo-200",
  qualified: "bg-violet-50 text-violet-700 border-violet-200",
  "site-visit": "bg-amber-50 text-amber-700 border-amber-200",
  negotiation: "bg-orange-50 text-orange-700 border-orange-200",
  won: "bg-brand-50 text-brand-700 border-brand-200",
  lost: "bg-ink-100 text-ink-600 border-ink-200",
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

/** EMI for principal p, annual rate r (%), tenure years y */
export function calcEmi(p: number, r: number, y: number) {
  const n = y * 12;
  const i = r / 12 / 100;
  if (i === 0) return p / n;
  const emi = (p * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  return emi;
}
