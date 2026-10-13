/**
 * Client-safe search primitives: types, labels and the ranking function.
 * Deliberately free of any server-only imports (no repo, no next/headers) so
 * client components can use it. The index itself is built in search-index.ts.
 */
export type SearchKind = "project" | "developer" | "locality" | "post";

export type SearchItem = {
  /** entity kind, drives the grouping and icon in the dropdown */
  k: SearchKind;
  /** display title */
  t: string;
  /** supporting line */
  s: string;
  /** destination */
  h: string;
  /** thumbnail, projects only */
  i?: string;
  /** right-aligned meta, e.g. price */
  m?: string;
  /** lowercased haystack the matcher runs against */
  q: string;
};

export const KIND_LABEL: Record<SearchKind, string> = {
  project: "Projects",
  locality: "Locations",
  developer: "Developers",
  post: "Insights",
};

/** Ranks index entries against a query. Exported so the UI and tests agree. */
export function rankSearch(
  index: SearchItem[],
  query: string,
  limit = 12,
): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored: { item: SearchItem; score: number }[] = [];

  for (const item of index) {
    // every term must appear somewhere, so "godrej 103" narrows correctly
    if (!terms.every((t) => item.q.includes(t))) continue;

    const title = item.t.toLowerCase();
    let score = 0;

    if (title === q) score += 100;
    else if (title.startsWith(q)) score += 60;
    else if (title.includes(q)) score += 40;
    else if (item.q.includes(q)) score += 20;

    // word-boundary starts score higher than mid-word hits
    for (const t of terms) {
      if (new RegExp(`\\b${escapeRe(t)}`).test(title)) score += 8;
      else if (title.includes(t)) score += 4;
      if (new RegExp(`\\b${escapeRe(t)}`).test(item.q)) score += 2;
    }

    // projects are what people are usually looking for
    if (item.k === "project") score += 6;
    else if (item.k === "locality") score += 3;

    // prefer shorter titles on equal relevance
    score -= Math.min(title.length / 40, 2);

    scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
