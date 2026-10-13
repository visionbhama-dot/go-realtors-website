import { getPosts } from "@/lib/repo/content";
import {
  getAllProjects,
  getDevelopers,
  getLocalities,
} from "@/lib/repo/projects";
import { STATUS_LABEL, priceRange } from "@/lib/utils";
import type { SearchItem } from "@/lib/search";

/**
 * Builds a compact client-side search index. The whole catalogue is small
 * (~60 records), so shipping it once and matching in the browser gives
 * instant results with no network round trip per keystroke.
 */
export async function buildSearchIndex(): Promise<SearchItem[]> {
  const [projects, developers, localities, posts] = await Promise.all([
    getAllProjects(),
    getDevelopers(),
    getLocalities(),
    getPosts(),
  ]);

  const items: SearchItem[] = [];

  for (const p of projects) {
    items.push({
      k: "project",
      t: p.name,
      s: `${p.sector}, ${p.locality} · ${p.configurationsLabel || p.propertyType}`,
      h: `/projects/${p.slug}`,
      i: p.images[0],
      m: priceRange(p.priceMin, p.priceMax),
      q: [
        p.name,
        p.developer,
        p.sector,
        p.locality,
        p.city,
        p.propertyType,
        p.configurationsLabel,
        STATUS_LABEL[p.status],
        p.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const d of developers) {
    items.push({
      k: "developer",
      t: d.name,
      s: d.specialities.slice(0, 2).join(" · ") || "Developer profile",
      h: `/developers/${d.slug}`,
      q: [d.name, d.short, d.headquarters, ...d.specialities]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const l of localities) {
    items.push({
      k: "locality",
      t: l.name,
      s: `${l.city} · ${l.priceBand} per sq.ft.`,
      h: `/locations/${l.slug}`,
      q: [l.name, l.city, l.blurb, l.growth].filter(Boolean).join(" ").toLowerCase(),
    });
  }

  for (const b of posts) {
    items.push({
      k: "post",
      t: b.title,
      s: `${b.category} · ${b.readMinutes} min read`,
      h: `/blog/${b.slug}`,
      q: [b.title, b.category, b.excerpt, ...b.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  return items;
}

export type { SearchItem, SearchKind } from "@/lib/search";
export { KIND_LABEL, rankSearch } from "@/lib/search";
