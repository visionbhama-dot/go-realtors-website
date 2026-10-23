import { GENERATED_PROJECTS } from "@/data/projects.generated";
import { DEVELOPERS, LOCALITIES } from "@/data/content";
import { getPublicSupabase } from "@/lib/supabase/server";
import type {
  Developer,
  Locality,
  Project,
  ProjectCategory,
  ProjectStatus,
} from "@/lib/types";

/* ------------------------------------------------------------------ *
 * Row mapping
 * ------------------------------------------------------------------ */
type Row = Record<string, unknown>;

function arr(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]).filter(Boolean) : [];
}

function mapProject(r: Row): Project {
  const cfgs = Array.isArray(r.project_configurations)
    ? (r.project_configurations as Row[])
    : [];
  const faqs = Array.isArray(r.project_faqs) ? (r.project_faqs as Row[]) : [];
  return {
    slug: String(r.slug),
    legacySlug: (r.legacy_slug as string) ?? null,
    name: String(r.name),
    tagline: (r.tagline as string) ?? "",
    developer: (r.developer_name as string) ?? "",
    sector: (r.sector as string) ?? "",
    locality: (r.locality_name as string) ?? "",
    city: (r.city as string) ?? "Gurugram",
    category: (r.category as ProjectCategory) ?? "residential",
    propertyType: (r.property_type as string) ?? "",
    status: (r.status as ProjectStatus) ?? "under-construction",
    configurationsLabel: (r.configurations_label as string) ?? "",
    featured: Boolean(r.is_featured),
    trending: Boolean(r.is_trending),
    priceMin: (r.price_min as number) ?? null,
    priceMax: (r.price_max as number) ?? null,
    landAcres: r.land_acres == null ? null : Number(r.land_acres),
    towers: (r.towers as number) ?? null,
    units: (r.units as number) ?? null,
    possession: (r.possession as string) ?? null,
    rera: (r.rera as string) ?? null,
    overview: arr(r.overview),
    highlights: arr(r.highlights),
    amenities: arr(r.amenities),
    whyInvest: arr(r.why_invest),
    locationAdvantages: arr(r.location_advantages),
    floorPlanNote: (r.floor_plan_note as string) ?? null,
    videoUrl: (r.video_url as string) ?? null,
    plans: Array.isArray(r.plans)
      ? (r.plans as Row[])
          .map((p) => ({
            type: String(p.type ?? "Floor Plan"),
            title: String(p.title ?? ""),
            image: String(p.image ?? ""),
            size: String(p.size ?? ""),
          }))
          .filter((p) => p.image)
      : [],
    images: arr(r.images),
    imageAlts: arr(r.image_alts),
    configurations: cfgs
      .slice()
      .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
      .map((c) => ({
        type: String(c.unit_type),
        areaSqft: Number(c.area_sqft ?? 0),
        price: (c.price as string) ?? "Price on Request",
      })),
    faqs: faqs
      .slice()
      .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
      .map((f) => ({
        question: String(f.question),
        answer: String(f.answer),
      })),
    seoTitle: (r.seo_title as string) || String(r.name),
    seoDescription: (r.seo_description as string) ?? "",
  };
}

const SELECT =
  "*, project_configurations(*), project_faqs(*)";

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */
export async function getAllProjects(): Promise<Project[]> {
  const sb = getPublicSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("projects")
      .select(SELECT)
      .eq("state", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!error && data?.length) return data.map(mapProject);
  }
  return GENERATED_PROJECTS;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const sb = getPublicSupabase();
  if (sb) {
    const { data } = await sb
      .from("projects")
      .select(SELECT)
      .or(`slug.eq.${slug},legacy_slug.eq.${slug}`)
      .eq("state", "published")
      .maybeSingle();
    if (data) return mapProject(data as Row);
  }
  return (
    GENERATED_PROJECTS.find(
      (p) => p.slug === slug || p.legacySlug === slug,
    ) ?? null
  );
}

export async function getDevelopers(): Promise<Developer[]> {
  const sb = getPublicSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("developers")
      .select("*")
      .eq("state", "published")
      .order("sort_order")
      .order("name");
    if (!error && data?.length) {
      return data.map((d) => ({
        slug: String(d.slug),
        name: String(d.name),
        short: (d.short_name as string) ?? String(d.name),
        established: (d.established as string) ?? null,
        headquarters: (d.headquarters as string) ?? "",
        description: (d.description as string) ?? "",
        specialities: arr(d.specialities),
      }));
    }
  }
  return DEVELOPERS;
}

export async function getLocalities(): Promise<Locality[]> {
  const sb = getPublicSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("localities")
      .select("*")
      .eq("state", "published")
      .order("sort_order")
      .order("name");
    if (!error && data?.length) {
      return data.map((l) => ({
        slug: String(l.slug),
        name: String(l.name),
        city: (l.city as string) ?? "Gurugram",
        blurb: (l.blurb as string) ?? "",
        description: (l.description as string) ?? "",
        highlights: arr(l.highlights),
        priceBand: (l.price_band as string) ?? "",
        growth: (l.growth as string) ?? "",
      }));
    }
  }
  return LOCALITIES;
}

/* ------------------------------------------------------------------ *
 * Derived collections
 * ------------------------------------------------------------------ */
export async function getFeaturedProjects(limit = 6) {
  const all = await getAllProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getTrendingProjects(limit = 8) {
  const all = await getAllProjects();
  const t = all.filter((p) => p.trending);
  return (t.length ? t : all).slice(0, limit);
}

export async function getProjectsByCategory(
  category: ProjectCategory,
  limit?: number,
) {
  const all = await getAllProjects();
  const list = all.filter((p) => p.category === category);
  return limit ? list.slice(0, limit) : list;
}

export async function getSimilarProjects(project: Project, limit = 3) {
  const all = await getAllProjects();
  const score = (p: Project) =>
    (p.locality === project.locality ? 3 : 0) +
    (p.category === project.category ? 2 : 0) +
    (p.developer === project.developer ? 2 : 0) +
    (p.status === project.status ? 1 : 0);
  return all
    .filter((p) => p.slug !== project.slug)
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}

/** Counts used by nav menus, locality cards and developer cards. */
export async function getFacetCounts() {
  const all = await getAllProjects();
  const byLocality = new Map<string, number>();
  const byDeveloper = new Map<string, number>();
  const byStatus = new Map<string, number>();
  const byCategory = new Map<string, number>();
  for (const p of all) {
    byLocality.set(p.locality, (byLocality.get(p.locality) ?? 0) + 1);
    byDeveloper.set(p.developer, (byDeveloper.get(p.developer) ?? 0) + 1);
    byStatus.set(p.status, (byStatus.get(p.status) ?? 0) + 1);
    byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + 1);
  }
  return { total: all.length, byLocality, byDeveloper, byStatus, byCategory };
}

/* ------------------------------------------------------------------ *
 * Filtering (used by /projects and /search)
 * ------------------------------------------------------------------ */
export type ProjectFilters = {
  q?: string;
  category?: string;
  locality?: string;
  developer?: string;
  status?: string;
  propertyType?: string;
  bhk?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
};

export function filterProjects(all: Project[], f: ProjectFilters): Project[] {
  let out = all.slice();

  if (f.q) {
    const q = f.q.toLowerCase().trim();
    out = out.filter((p) =>
      [
        p.name,
        p.developer,
        p.locality,
        p.sector,
        p.propertyType,
        p.configurationsLabel,
        p.city,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  if (f.category) out = out.filter((p) => p.category === f.category);
  if (f.locality) out = out.filter((p) => slug(p.locality) === f.locality);
  if (f.developer) out = out.filter((p) => slug(p.developer) === f.developer);
  if (f.status) out = out.filter((p) => p.status === f.status);
  if (f.propertyType)
    out = out.filter((p) => slug(p.propertyType) === f.propertyType);
  if (f.bhk) {
    const want = f.bhk.replace(/\D/g, "");
    out = out.filter(
      (p) =>
        p.configurations.some((c) => c.type.replace(/\D/g, "") === want) ||
        p.configurationsLabel.includes(want),
    );
  }
  if (f.minPrice) out = out.filter((p) => (p.priceMin ?? 0) >= f.minPrice!);
  if (f.maxPrice)
    out = out.filter((p) => p.priceMin !== null && p.priceMin <= f.maxPrice!);

  switch (f.sort) {
    case "price-asc":
      out.sort((a, b) => (a.priceMin ?? Infinity) - (b.priceMin ?? Infinity));
      break;
    case "price-desc":
      out.sort((a, b) => (b.priceMin ?? -1) - (a.priceMin ?? -1));
      break;
    case "name":
      out.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      out.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Number(b.trending) - Number(a.trending) ||
          a.name.localeCompare(b.name),
      );
  }
  return out;
}

function slug(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export { slug as toSlug };
