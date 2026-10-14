import { GENERATED_POSTS } from "@/data/blog.generated";
import { TEAM, TESTIMONIALS } from "@/data/content";
import { getPublicSupabase } from "@/lib/supabase/server";
import { initialsOf } from "@/lib/utils";
import type { BlogPost, SeoRecord, TeamMember, Testimonial } from "@/lib/types";

function arr(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]).filter(Boolean) : [];
}

/* ------------------------------------------------------------- blog */
export async function getPosts(): Promise<BlogPost[]> {
  const sb = getPublicSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("*")
      .eq("state", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });
    if (!error && data?.length) {
      return data.map((p) => ({
        slug: String(p.slug),
        title: String(p.title),
        excerpt: (p.excerpt as string) ?? "",
        category: (p.category_name as string) ?? "Insight",
        author: (p.author_name as string) ?? "GoRealtors",
        publishedAt: String(p.published_at).slice(0, 10),
        readMinutes: Number(p.read_minutes ?? 4),
        cover: (p.cover_image as string) ?? "",
        body: arr(p.body),
        tags: arr(p.tags),
      }));
    }
  }
  return GENERATED_POSTS;
}

export async function getPostBySlug(slug: string) {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getPostCategories() {
  const posts = await getPosts();
  const map = new Map<string, number>();
  posts.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export async function getRelatedPosts(post: BlogPost, limit = 3) {
  const posts = await getPosts();
  return posts
    .filter((p) => p.slug !== post.slug)
    .sort(
      (a, b) =>
        Number(b.category === post.category) -
        Number(a.category === post.category),
    )
    .slice(0, limit);
}

/* ------------------------------------------------------------- team */
export async function getTeam(): Promise<TeamMember[]> {
  const sb = getPublicSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("team_members")
      .select("*")
      .eq("state", "published")
      .order("sort_order");
    if (!error && data?.length) {
      return data.map((m) => ({
        slug: String(m.slug),
        name: String(m.name),
        role: (m.role_title as string) ?? "",
        bio: (m.bio as string) ?? "",
        focus: (m.focus as string) ?? "",
        email: (m.email as string) ?? undefined,
        phone: (m.phone as string) ?? undefined,
        photoUrl: (m.photo_url as string) ?? undefined,
        initials: initialsOf(String(m.name)),
      }));
    }
  }
  return TEAM;
}

/* ----------------------------------------------------- testimonials */
export async function getTestimonials(): Promise<Testimonial[]> {
  const sb = getPublicSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("testimonials")
      .select("*")
      .eq("state", "published")
      .order("sort_order");
    if (!error && data?.length) {
      return data.map((t) => ({
        name: String(t.name),
        location: (t.location as string) ?? "",
        project: (t.project_name as string) ?? "",
        quote: String(t.quote),
        rating: Number(t.rating ?? 5),
      }));
    }
  }
  return TESTIMONIALS;
}

/* -------------------------------------------------------------- SEO */
export async function getSeoForPath(path: string): Promise<SeoRecord | null> {
  const sb = getPublicSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("seo_pages")
    .select("*")
    .eq("path", path)
    .maybeSingle();
  if (!data) return null;
  return {
    path: String(data.path),
    label: String(data.label),
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    keywords: arr(data.keywords),
    ogImage: (data.og_image as string) ?? null,
    noindex: Boolean(data.noindex),
    canonical: (data.canonical as string) ?? null,
  };
}

/* --------------------------------------------------------- settings */
export async function getSettings(): Promise<Record<string, unknown>> {
  const sb = getPublicSupabase();
  if (!sb) return {};
  const { data } = await sb.from("settings").select("key, value");
  if (!data) return {};
  return Object.fromEntries(data.map((r) => [String(r.key), r.value]));
}

/* ----------------------------------------------------------- careers */
export type JobOpening = {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

export const FALLBACK_OPENINGS: JobOpening[] = [
  {
    slug: "senior-property-advisor",
    title: "Senior Property Advisor",
    department: "Sales",
    location: "Sector 83, Gurugram",
    employmentType: "Full-time",
    experience: "3-7 years",
    description:
      "Own client mandates end to end across Gurugram's luxury residential corridors — from discovery call through registry.",
    responsibilities: [
      "Run discovery calls and build comparison sheets for qualified buyers",
      "Conduct accompanied site visits across shortlisted projects",
      "Negotiate pricing, payment plans and charges with developer sales teams",
      "Maintain accurate pipeline hygiene in the internal CRM",
    ],
    requirements: [
      "3+ years selling primary residential real estate in the NCR",
      "Working knowledge of HARERA, carpet-area norms and loading",
      "Existing developer or channel-partner relationships preferred",
      "Fluent English and Hindi; own conveyance required",
    ],
  },
  {
    slug: "commercial-investment-analyst",
    title: "Commercial Investment Analyst",
    department: "Advisory",
    location: "Sector 83, Gurugram",
    employmentType: "Full-time",
    experience: "2-5 years",
    description:
      "Build the yield and exit models behind every commercial and SCO recommendation we make.",
    responsibilities: [
      "Model rental yield, exit cap and IRR for retail, office and SCO assets",
      "Assess footfall catchment and anchor-tenant mix",
      "Produce client-facing investment memos",
      "Track transacted rentals and capital values across corridors",
    ],
    requirements: [
      "Strong Excel and financial modelling skills",
      "Exposure to commercial real estate or REIT research",
      "CFA / MBA Finance / commerce background preferred",
      "Clear written communication for investor memos",
    ],
  },
  {
    slug: "digital-marketing-executive",
    title: "Digital Marketing Executive",
    department: "Marketing",
    location: "Sector 83, Gurugram",
    employmentType: "Full-time",
    experience: "1-4 years",
    description:
      "Run performance campaigns and the content engine that feeds our advisory pipeline.",
    responsibilities: [
      "Manage Meta and Google campaigns against cost-per-qualified-lead targets",
      "Publish project pages and market insights through the in-house CMS",
      "Own on-page SEO for project and locality landing pages",
      "Report funnel performance from impression to site visit",
    ],
    requirements: [
      "Hands-on experience with Meta Ads Manager and Google Ads",
      "Understanding of technical and on-page SEO",
      "Comfortable writing real estate copy in clear English",
      "Real estate or high-ticket lead-gen experience is a plus",
    ],
  },
];

export async function getOpenings(): Promise<JobOpening[]> {
  const sb = getPublicSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("job_openings")
      .select("*")
      .eq("state", "published")
      .order("sort_order");
    if (!error && data?.length) {
      return data.map((j) => ({
        slug: String(j.slug),
        title: String(j.title),
        department: (j.department as string) ?? "",
        location: (j.location as string) ?? "Gurugram",
        employmentType: (j.employment_type as string) ?? "Full-time",
        experience: (j.experience as string) ?? "",
        description: (j.description as string) ?? "",
        responsibilities: arr(j.responsibilities),
        requirements: arr(j.requirements),
      }));
    }
  }
  return FALLBACK_OPENINGS;
}
