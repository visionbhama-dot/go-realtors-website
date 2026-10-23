import { notFound, redirect } from "next/navigation";
import { AdminHeader, EmptyState } from "@/components/admin/ui";
import { ProjectForm, type ProjectFormValues } from "@/components/admin/ProjectForm";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit project" };

const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]).join("\n") : "");
const txt = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("projects.write")) {
    return (
      <EmptyState
        title="No access"
        description="Your role can view projects but not edit them."
      />
    );
  }

  const sb = await getServerSupabase();
  const [{ data: project }, devs, locs] = await Promise.all([
    sb!
      .from("projects")
      .select("*, project_configurations(*), project_faqs(*)")
      .eq("id", id)
      .maybeSingle(),
    sb!.from("developers").select("name").order("name"),
    sb!.from("localities").select("name").order("name"),
  ]);

  if (!project) notFound();

  const cfgs = (
    Array.isArray(project.project_configurations)
      ? (project.project_configurations as Record<string, unknown>[])
      : []
  )
    .slice()
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));

  const faqs = (
    Array.isArray(project.project_faqs)
      ? (project.project_faqs as Record<string, unknown>[])
      : []
  )
    .slice()
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));

  const initial: ProjectFormValues = {
    id: String(project.id),
    slug: txt(project.slug),
    legacy_slug: txt(project.legacy_slug),
    name: txt(project.name),
    tagline: txt(project.tagline),
    developer_name: txt(project.developer_name),
    locality_name: txt(project.locality_name),
    sector: txt(project.sector),
    city: txt(project.city),
    category: txt(project.category) || "residential",
    property_type: txt(project.property_type),
    status: txt(project.status) || "under-construction",
    configurations_label: txt(project.configurations_label),
    price_min: txt(project.price_min),
    price_max: txt(project.price_max),
    land_acres: txt(project.land_acres),
    towers: txt(project.towers),
    units: txt(project.units),
    possession: txt(project.possession),
    rera: txt(project.rera),
    overview: arr(project.overview),
    highlights: arr(project.highlights),
    amenities: arr(project.amenities),
    why_invest: arr(project.why_invest),
    location_advantages: arr(project.location_advantages),
    floor_plan_note: txt(project.floor_plan_note),
    gallery: (Array.isArray(project.images) ? (project.images as string[]) : []).map(
      (url, i) => ({
        url,
        alt:
          (Array.isArray(project.image_alts)
            ? ((project.image_alts as string[])[i] ?? "")
            : "") || "",
      }),
    ),
    brochure_url: txt(project.brochure_url),
    video_url: txt(project.video_url),
    map_embed_url: txt(project.map_embed_url),
    is_featured: Boolean(project.is_featured),
    is_trending: Boolean(project.is_trending),
    sort_order: txt(project.sort_order ?? 0),
    state: txt(project.state) || "draft",
    seo_title: txt(project.seo_title),
    seo_description: txt(project.seo_description),
    seo_keywords: Array.isArray(project.seo_keywords)
      ? (project.seo_keywords as string[]).join(", ")
      : "",
    og_image: txt(project.og_image),
    noindex: Boolean(project.noindex),
    configurations: cfgs.map((c) => ({
      unit_type: txt(c.unit_type),
      area_sqft: txt(c.area_sqft),
      carpet_sqft: txt(c.carpet_sqft),
      price: txt(c.price),
    })),
    plans: (Array.isArray(project.plans)
      ? (project.plans as Record<string, unknown>[])
      : []
    ).map((p) => ({
      type: txt(p.type) || "Floor Plan",
      title: txt(p.title),
      size: txt(p.size),
      image: txt(p.image),
    })),
    faqs: faqs.map((f) => ({
      question: txt(f.question),
      answer: txt(f.answer),
    })),
  };

  return (
    <>
      <AdminHeader
        title={initial.name}
        description={`Editing project record · ${initial.state} · last saved ${new Date(String(project.updated_at)).toLocaleString("en-IN")}`}
        back={{ href: "/admin/projects", label: "Back to projects" }}
      />
      <ProjectForm
        initial={initial}
        developers={(devs.data ?? []).map((d) => String(d.name))}
        localities={(locs.data ?? []).map((l) => String(l.name))}
        canPublish={user.permissions.includes("projects.publish")}
      />
    </>
  );
}
