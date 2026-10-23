"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission, type StaffUser } from "@/lib/auth";
import { getAdminSupabase, getServerSupabase } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";
import { slugify } from "@/lib/utils";

export type Result = { ok: boolean; message: string; id?: string };

const ok = (message: string, id?: string): Result => ({ ok: true, message, id });
const fail = (message: string): Result => ({ ok: false, message });

async function db() {
  const sb = await getServerSupabase();
  if (!sb) throw new Error("Supabase is not configured.");
  return sb;
}

/** Writes an entry to the immutable activity log. Never throws. */
async function audit(
  actor: StaffUser,
  action: string,
  entity: string,
  entityId: string | null,
  summary: string,
) {
  try {
    const sb = await db();
    await sb.from("audit_log").insert({
      actor_id: actor.id,
      actor_email: actor.email,
      action,
      entity,
      entity_id: entityId,
      summary,
    });
  } catch {
    // auditing must never block the operation itself
  }
}

/** Splits a textarea into a clean string array, one item per line. */
function lines(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function csv(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);
}

const str = (v: FormDataEntryValue | null) =>
  typeof v === "string" ? v.trim() : "";
const nullable = (v: FormDataEntryValue | null) => str(v) || null;
const num = (v: FormDataEntryValue | null) => {
  const s = str(v).replace(/[, ]/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};
const bool = (v: FormDataEntryValue | null) => str(v) === "on" || str(v) === "true";

function wrap(fn: () => Promise<Result>): Promise<Result> {
  return fn().catch((e: unknown) =>
    fail(e instanceof Error ? e.message : "Something went wrong."),
  );
}

/* ================================================================== *
 * PROJECTS
 * ================================================================== */
export async function saveProject(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("projects.write");
    const sb = await db();

    const id = str(formData.get("id")) || null;
    const name = str(formData.get("name"));
    if (!name) return fail("Project name is required.");

    const slug = slugify(str(formData.get("slug")) || name);
    if (!slug) return fail("Could not derive a valid URL slug.");

    const state = str(formData.get("state")) || "draft";
    if (state === "published" && !actor.permissions.includes("projects.publish")) {
      return fail("Your role can save drafts but cannot publish.");
    }

    // Gallery arrives as positional img_url / img_alt pairs from ImageManager,
    // which keeps blank alt entries aligned with their image. Older forms that
    // posted a newline-separated "images" textarea still work.
    const gallery = (() => {
      const urls = formData.getAll("img_url").map((v) => str(v)).filter(Boolean);
      if (urls.length === 0 && formData.has("images")) {
        const legacy = lines(formData.get("images"));
        return { urls: legacy, alts: legacy.map(() => "") };
      }
      const rawAlts = formData.getAll("img_alt");
      return {
        urls,
        alts: urls.map((_, i) => str(rawAlts[i] ?? null)),
      };
    })();

    // Plans (floor plan / master plan / unit plan …) — positional arrays from
    // the admin form, kept only where an image URL is present.
    const planImages = formData.getAll("plan_image").map((v) => str(v));
    const planTypes = formData.getAll("plan_type");
    const planTitles = formData.getAll("plan_title");
    const planSizes = formData.getAll("plan_size");
    const plans = planImages
      .map((image, i) => ({
        type: str(planTypes[i] ?? null) || "Floor Plan",
        title: str(planTitles[i] ?? null),
        size: str(planSizes[i] ?? null),
        image,
      }))
      .filter((p) => p.image);

    const payload = {
      slug,
      legacy_slug: nullable(formData.get("legacy_slug")),
      name,
      tagline: str(formData.get("tagline")),
      developer_name: str(formData.get("developer_name")),
      locality_name: str(formData.get("locality_name")),
      sector: nullable(formData.get("sector")),
      city: str(formData.get("city")) || "Gurugram",
      category: str(formData.get("category")) || "residential",
      property_type: nullable(formData.get("property_type")),
      status: str(formData.get("status")) || "under-construction",
      configurations_label: nullable(formData.get("configurations_label")),
      price_min: num(formData.get("price_min")),
      price_max: num(formData.get("price_max")),
      land_acres: num(formData.get("land_acres")),
      towers: num(formData.get("towers")),
      units: num(formData.get("units")),
      possession: nullable(formData.get("possession")),
      rera: nullable(formData.get("rera")),
      overview: lines(formData.get("overview")),
      highlights: lines(formData.get("highlights")),
      amenities: lines(formData.get("amenities")),
      why_invest: lines(formData.get("why_invest")),
      location_advantages: lines(formData.get("location_advantages")),
      floor_plan_note: nullable(formData.get("floor_plan_note")),
      plans,
      images: gallery.urls,
      image_alts: gallery.alts,
      brochure_url: nullable(formData.get("brochure_url")),
      video_url: nullable(formData.get("video_url")),
      map_embed_url: nullable(formData.get("map_embed_url")),
      is_featured: bool(formData.get("is_featured")),
      is_trending: bool(formData.get("is_trending")),
      sort_order: num(formData.get("sort_order")) ?? 0,
      state,
      seo_title: nullable(formData.get("seo_title")),
      seo_description: nullable(formData.get("seo_description")),
      seo_keywords: csv(formData.get("seo_keywords")),
      og_image: nullable(formData.get("og_image")),
      noindex: bool(formData.get("noindex")),
    };

    let projectId = id;

    if (id) {
      const { error } = await sb.from("projects").update(payload).eq("id", id);
      if (error) return fail(error.message);
    } else {
      const { data, error } = await sb
        .from("projects")
        .insert({ ...payload, created_by: actor.id })
        .select("id")
        .single();
      if (error) return fail(error.message);
      projectId = String(data.id);
    }

    if (!projectId) return fail("Could not determine the project id.");

    // --- configurations (replace set) ---
    const cfgTypes = formData.getAll("cfg_type").map((v) => str(v));
    const cfgAreas = formData.getAll("cfg_area");
    const cfgCarpet = formData.getAll("cfg_carpet");
    const cfgPrices = formData.getAll("cfg_price");

    await sb.from("project_configurations").delete().eq("project_id", projectId);
    const cfgRows = cfgTypes
      .map((t, i) => ({
        project_id: projectId!,
        unit_type: t,
        area_sqft: num(cfgAreas[i] ?? null),
        carpet_sqft: num(cfgCarpet[i] ?? null),
        price: str(cfgPrices[i] ?? null) || null,
        sort_order: i,
      }))
      .filter((r) => r.unit_type);
    if (cfgRows.length) {
      const { error } = await sb.from("project_configurations").insert(cfgRows);
      if (error) return fail(`Configurations: ${error.message}`);
    }

    // --- faqs (replace set) ---
    const qs = formData.getAll("faq_q").map((v) => str(v));
    const as = formData.getAll("faq_a").map((v) => str(v));
    await sb.from("project_faqs").delete().eq("project_id", projectId);
    const faqRows = qs
      .map((q, i) => ({
        project_id: projectId!,
        question: q,
        answer: as[i] ?? "",
        sort_order: i,
      }))
      .filter((r) => r.question && r.answer);
    if (faqRows.length) {
      const { error } = await sb.from("project_faqs").insert(faqRows);
      if (error) return fail(`FAQs: ${error.message}`);
    }

    await audit(
      actor,
      id ? "update" : "create",
      "project",
      projectId,
      `${id ? "Updated" : "Created"} project "${name}" (${state})`,
    );

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/sitemap.xml");

    return ok(
      id ? "Project saved." : "Project created.",
      projectId,
    );
  });
}

export async function deleteProject(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("projects.delete");
    const sb = await db();
    const id = str(formData.get("id"));
    if (!id) return fail("Missing project id.");

    const { data: existing } = await sb
      .from("projects")
      .select("name, slug")
      .eq("id", id)
      .maybeSingle();

    const { error } = await sb.from("projects").delete().eq("id", id);
    if (error) return fail(error.message);

    await audit(
      actor,
      "delete",
      "project",
      id,
      `Deleted project "${existing?.name ?? id}"`,
    );
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return ok("Project deleted.");
  });
}

export async function setProjectState(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("projects.publish");
    const sb = await db();
    const id = str(formData.get("id"));
    const state = str(formData.get("state"));
    if (!id || !state) return fail("Missing project id or state.");

    const { error } = await sb.from("projects").update({ state }).eq("id", id);
    if (error) return fail(error.message);

    await audit(actor, "publish", "project", id, `Set project state to ${state}`);
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return ok(`Project ${state === "published" ? "published" : state}.`);
  });
}

/* ================================================================== *
 * DEVELOPERS & LOCALITIES
 * ================================================================== */
export async function saveDeveloper(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("projects.write");
    const sb = await db();
    const id = str(formData.get("id")) || null;
    const name = str(formData.get("name"));
    if (!name) return fail("Developer name is required.");

    const payload = {
      slug: slugify(str(formData.get("slug")) || name),
      name,
      short_name: nullable(formData.get("short_name")) ?? name,
      established: nullable(formData.get("established")),
      headquarters: nullable(formData.get("headquarters")),
      description: str(formData.get("description")),
      specialities: lines(formData.get("specialities")),
      website: nullable(formData.get("website")),
      logo_url: nullable(formData.get("logo_url")),
      sort_order: num(formData.get("sort_order")) ?? 0,
      state: str(formData.get("state")) || "published",
      seo_title: nullable(formData.get("seo_title")),
      seo_description: nullable(formData.get("seo_description")),
    };

    const query = id
      ? sb.from("developers").update(payload).eq("id", id)
      : sb.from("developers").insert(payload);
    const { error } = await query;
    if (error) return fail(error.message);

    await audit(actor, id ? "update" : "create", "developer", id, `Saved developer "${name}"`);
    revalidatePath("/developers");
    revalidatePath("/admin/developers");
    return ok("Developer saved.");
  });
}

export async function saveLocality(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("projects.write");
    const sb = await db();
    const id = str(formData.get("id")) || null;
    const name = str(formData.get("name"));
    if (!name) return fail("Location name is required.");

    const payload = {
      slug: slugify(str(formData.get("slug")) || name),
      name,
      city: str(formData.get("city")) || "Gurugram",
      blurb: str(formData.get("blurb")),
      description: str(formData.get("description")),
      highlights: lines(formData.get("highlights")),
      price_band: nullable(formData.get("price_band")),
      growth: nullable(formData.get("growth")),
      hero_image: nullable(formData.get("hero_image")),
      sort_order: num(formData.get("sort_order")) ?? 0,
      state: str(formData.get("state")) || "published",
      seo_title: nullable(formData.get("seo_title")),
      seo_description: nullable(formData.get("seo_description")),
    };

    const query = id
      ? sb.from("localities").update(payload).eq("id", id)
      : sb.from("localities").insert(payload);
    const { error } = await query;
    if (error) return fail(error.message);

    await audit(actor, id ? "update" : "create", "locality", id, `Saved location "${name}"`);
    revalidatePath("/locations");
    revalidatePath("/admin/locations");
    return ok("Location saved.");
  });
}

export async function deleteRow(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const table = str(formData.get("table"));
    const id = str(formData.get("id"));
    const allowed: Record<string, { perm: Parameters<typeof requirePermission>[0]; path: string }> = {
      developers: { perm: "projects.write", path: "/admin/developers" },
      localities: { perm: "projects.write", path: "/admin/locations" },
      blog_posts: { perm: "blog.write", path: "/admin/blog" },
      testimonials: { perm: "team.write", path: "/admin/testimonials" },
      team_members: { perm: "team.write", path: "/admin/team" },
      seo_pages: { perm: "seo.write", path: "/admin/seo" },
      redirects: { perm: "seo.write", path: "/admin/seo" },
      media: { perm: "media.write", path: "/admin/media" },
    };
    const cfg = allowed[table];
    if (!cfg) return fail("That record type cannot be deleted here.");
    if (!id) return fail("Missing record id.");

    const actor = await requirePermission(cfg.perm);
    const sb = await db();
    const { error } = await sb.from(table).delete().eq("id", id);
    if (error) return fail(error.message);

    await audit(actor, "delete", table, id, `Deleted ${table} record`);
    revalidatePath(cfg.path);
    return ok("Deleted.");
  });
}

export async function updateMediaAlt(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("media.write");
    const sb = await db();
    const id = str(formData.get("id"));
    if (!id) return fail("Missing media id.");

    const { error } = await sb
      .from("media")
      .update({
        alt_text: nullable(formData.get("alt_text")),
        folder: str(formData.get("folder")) || "general",
      })
      .eq("id", id);
    if (error) return fail(error.message);

    await audit(actor, "update", "media", id, "Updated media alt text");
    revalidatePath("/admin/media");
    return ok("Saved.");
  });
}

/* ================================================================== *
 * BLOG
 * ================================================================== */
export async function savePost(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("blog.write");
    const sb = await db();
    const id = str(formData.get("id")) || null;
    const title = str(formData.get("title"));
    if (!title) return fail("Post title is required.");

    const state = str(formData.get("state")) || "draft";
    if (state === "published" && !actor.permissions.includes("blog.publish")) {
      return fail("Your role can save drafts but cannot publish posts.");
    }

    const body = (str(formData.get("body")) || "")
      .split(/\n{2,}/)
      .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean);

    const words = body.join(" ").split(/\s+/).filter(Boolean).length;

    const payload = {
      slug: slugify(str(formData.get("slug")) || title),
      title,
      excerpt: str(formData.get("excerpt")),
      category_name: str(formData.get("category_name")) || "Market Insight",
      author_name: str(formData.get("author_name")) || actor.fullName,
      author_id: actor.id,
      cover_image: nullable(formData.get("cover_image")),
      body,
      tags: csv(formData.get("tags")),
      read_minutes: num(formData.get("read_minutes")) ?? Math.max(3, Math.round(words / 210)),
      is_featured: bool(formData.get("is_featured")),
      state,
      published_at: str(formData.get("published_at"))
        ? new Date(str(formData.get("published_at"))).toISOString()
        : new Date().toISOString(),
      seo_title: nullable(formData.get("seo_title")),
      seo_description: nullable(formData.get("seo_description")),
      seo_keywords: csv(formData.get("seo_keywords")),
      og_image: nullable(formData.get("og_image")),
      noindex: bool(formData.get("noindex")),
    };

    const query = id
      ? sb.from("blog_posts").update(payload).eq("id", id)
      : sb.from("blog_posts").insert(payload);
    const { error } = await query;
    if (error) return fail(error.message);

    await audit(actor, id ? "update" : "create", "blog_post", id, `Saved post "${title}" (${state})`);
    revalidatePath("/blog");
    revalidatePath(`/blog/${payload.slug}`);
    revalidatePath("/admin/blog");
    return ok("Post saved.");
  });
}

/* ================================================================== *
 * LEADS
 * ================================================================== */
export async function updateLead(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("leads.write");
    const sb = await db();
    const id = str(formData.get("id"));
    if (!id) return fail("Missing lead id.");

    const assignedTo = str(formData.get("assigned_to"));
    const patch: Record<string, unknown> = {
      status: str(formData.get("status")) || "new",
      priority: str(formData.get("priority")) || "medium",
      budget: nullable(formData.get("budget")),
      requirement: nullable(formData.get("requirement")),
      follow_up_at: str(formData.get("follow_up_at"))
        ? new Date(str(formData.get("follow_up_at"))).toISOString()
        : null,
    };

    if (actor.permissions.includes("leads.assign")) {
      patch.assigned_to = assignedTo || null;
    }

    const { error } = await sb.from("leads").update(patch).eq("id", id);
    if (error) return fail(error.message);

    await audit(actor, "update", "lead", id, `Lead moved to ${patch.status}`);
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${id}`);
    return ok("Lead updated.");
  });
}

export async function addLeadNote(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("leads.write");
    const sb = await db();
    const leadId = str(formData.get("lead_id"));
    const note = str(formData.get("note"));
    if (!leadId || !note) return fail("A note cannot be empty.");

    const { error } = await sb.from("lead_notes").insert({
      lead_id: leadId,
      author_id: actor.id,
      author_name: actor.fullName,
      note,
    });
    if (error) return fail(error.message);

    revalidatePath(`/admin/leads/${leadId}`);
    return ok("Note added.");
  });
}

export async function exportLeadsCsv(): Promise<{
  ok: boolean;
  message: string;
  csv?: string;
}> {
  try {
    const actor = await requirePermission("leads.export");
    const sb = await db();
    const { data, error } = await sb
      .from("leads")
      .select(
        "created_at, name, phone, email, project_name, requirement, budget, status, priority, source, source_path, message",
      )
      .order("created_at", { ascending: false });
    if (error) return { ok: false, message: error.message };

    const headers = [
      "Received",
      "Name",
      "Phone",
      "Email",
      "Project",
      "Requirement",
      "Budget",
      "Status",
      "Priority",
      "Source",
      "Page",
      "Message",
    ];
    const esc = (v: unknown) =>
      `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

    const rows = (data ?? []).map((r) =>
      [
        r.created_at,
        r.name,
        r.phone,
        r.email,
        r.project_name,
        r.requirement,
        r.budget,
        r.status,
        r.priority,
        r.source,
        r.source_path,
        r.message,
      ]
        .map(esc)
        .join(","),
    );

    await audit(actor, "export", "lead", null, `Exported ${rows.length} leads to CSV`);
    return {
      ok: true,
      message: `${rows.length} leads exported.`,
      csv: [headers.map(esc).join(","), ...rows].join("\n"),
    };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Export failed.",
    };
  }
}

/* ================================================================== *
 * TEAM PROFILES & TESTIMONIALS
 * ================================================================== */
export async function saveTeamMember(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("team.write");
    const sb = await db();
    const id = str(formData.get("id")) || null;
    const name = str(formData.get("name"));
    if (!name) return fail("Name is required.");

    const payload = {
      slug: slugify(str(formData.get("slug")) || name),
      name,
      role_title: str(formData.get("role_title")),
      bio: str(formData.get("bio")),
      focus: nullable(formData.get("focus")),
      email: nullable(formData.get("email")),
      phone: nullable(formData.get("phone")),
      photo_url: nullable(formData.get("photo_url")),
      linkedin: nullable(formData.get("linkedin")),
      sort_order: num(formData.get("sort_order")) ?? 0,
      state: str(formData.get("state")) || "published",
    };

    const query = id
      ? sb.from("team_members").update(payload).eq("id", id)
      : sb.from("team_members").insert(payload);
    const { error } = await query;
    if (error) return fail(error.message);

    await audit(actor, id ? "update" : "create", "team_member", id, `Saved team profile "${name}"`);
    revalidatePath("/team");
    revalidatePath("/admin/team");
    return ok("Team profile saved.");
  });
}

export async function saveTestimonial(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("team.write");
    const sb = await db();
    const id = str(formData.get("id")) || null;
    const name = str(formData.get("name"));
    const quote = str(formData.get("quote"));
    if (!name || !quote) return fail("Client name and quote are both required.");

    const payload = {
      name,
      location: nullable(formData.get("location")),
      project_name: nullable(formData.get("project_name")),
      quote,
      rating: Math.min(5, Math.max(1, num(formData.get("rating")) ?? 5)),
      photo_url: nullable(formData.get("photo_url")),
      sort_order: num(formData.get("sort_order")) ?? 0,
      state: str(formData.get("state")) || "published",
    };

    const query = id
      ? sb.from("testimonials").update(payload).eq("id", id)
      : sb.from("testimonials").insert(payload);
    const { error } = await query;
    if (error) return fail(error.message);

    await audit(actor, id ? "update" : "create", "testimonial", id, `Saved testimonial from ${name}`);
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return ok("Testimonial saved.");
  });
}

/* ================================================================== *
 * SEO
 * ================================================================== */
export async function saveSeo(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("seo.write");
    const sb = await db();
    const path = str(formData.get("path"));
    if (!path.startsWith("/")) return fail("Path must start with a forward slash.");

    const payload = {
      path,
      label: str(formData.get("label")) || path,
      title: str(formData.get("title")),
      description: str(formData.get("description")),
      keywords: csv(formData.get("keywords")),
      og_image: nullable(formData.get("og_image")),
      canonical: nullable(formData.get("canonical")),
      noindex: bool(formData.get("noindex")),
    };

    const { error } = await sb
      .from("seo_pages")
      .upsert(payload, { onConflict: "path" });
    if (error) return fail(error.message);

    await audit(actor, "update", "seo_page", path, `Updated SEO for ${path}`);
    revalidatePath(path);
    revalidatePath("/admin/seo");
    return ok("SEO settings saved.");
  });
}

export async function saveRedirect(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("seo.write");
    const sb = await db();
    const source = str(formData.get("source"));
    const destination = str(formData.get("destination"));
    if (!source.startsWith("/") || !destination.startsWith("/")) {
      return fail("Source and destination must both start with a forward slash.");
    }
    const { error } = await sb.from("redirects").upsert(
      { source, destination, permanent: bool(formData.get("permanent")) },
      { onConflict: "source" },
    );
    if (error) return fail(error.message);

    await audit(actor, "create", "redirect", source, `${source} → ${destination}`);
    revalidatePath("/admin/seo");
    return ok("Redirect saved.");
  });
}

/* ================================================================== *
 * SETTINGS
 * ================================================================== */
export async function saveSettings(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("settings.write");
    const sb = await db();

    const rows: { key: string; value: unknown; group_name: string }[] = [];
    for (const [key, raw] of formData.entries()) {
      if (!key.startsWith("setting:")) continue;
      const [, group, name] = key.split(":");
      if (!group || !name) continue;
      rows.push({
        key: `${group}.${name}`,
        value: typeof raw === "string" ? raw.trim() : "",
        group_name: group,
      });
    }
    if (rows.length === 0) return fail("Nothing to save.");

    const { error } = await sb.from("settings").upsert(rows, { onConflict: "key" });
    if (error) return fail(error.message);

    await audit(actor, "update", "settings", null, `Updated ${rows.length} settings`);
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return ok("Settings saved.");
  });
}

/* ================================================================== *
 * USERS & ROLES
 * ================================================================== */
const inviteSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  fullName: z.string().trim().min(2, "Enter the person's full name").max(90),
  role: z.enum(["admin", "manager", "agent", "editor", "viewer"]),
  password: z
    .string()
    .min(10, "Temporary password must be at least 10 characters")
    .max(72),
  jobTitle: z.string().trim().max(80).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
});

export async function inviteUser(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("users.write");

    const parsed = inviteSchema.safeParse({
      email: formData.get("email"),
      fullName: formData.get("fullName"),
      role: formData.get("role"),
      password: formData.get("password"),
      jobTitle: formData.get("jobTitle"),
      phone: formData.get("phone"),
    });
    if (!parsed.success) return fail(parsed.error.issues[0]!.message);
    const d = parsed.data;

    const admin = getAdminSupabase();
    if (!admin) {
      return fail(
        "SUPABASE_SERVICE_ROLE_KEY is not configured, so accounts cannot be created from here. Add the key to your environment, or create the user in Supabase → Authentication → Users.",
      );
    }

    const { data: created, error: authError } =
      await admin.auth.admin.createUser({
        email: d.email,
        password: d.password,
        email_confirm: true,
        user_metadata: { full_name: d.fullName, role: d.role },
      });
    if (authError) return fail(authError.message);
    const newId = created.user?.id;
    if (!newId) return fail("Account was not created.");

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: newId,
        email: d.email,
        full_name: d.fullName,
        role: d.role,
        job_title: d.jobTitle || null,
        phone: d.phone || null,
        is_active: true,
      },
      { onConflict: "id" },
    );
    if (profileError) return fail(profileError.message);

    await audit(
      actor,
      "create",
      "user",
      newId,
      `Invited ${d.email} as ${d.role}`,
    );
    revalidatePath("/admin/users");
    return ok(
      `${d.fullName} can now sign in with the temporary password you set. Ask them to change it from My profile.`,
    );
  });
}

export async function updateUserRole(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("users.write");
    const sb = await db();
    const id = str(formData.get("id"));
    const role = str(formData.get("role")) as UserRole;
    if (!id || !role) return fail("Missing user id or role.");

    if (id === actor.id) return fail("You cannot change your own role.");
    if (role === "owner") {
      return fail(
        "Ownership cannot be granted from here. Change the role directly in the database if a transfer is genuinely required.",
      );
    }

    const { data: target } = await sb
      .from("profiles")
      .select("role, email")
      .eq("id", id)
      .maybeSingle();
    if (target?.role === "owner" && actor.role !== "owner") {
      return fail("Only the owner can modify the owner account.");
    }

    const { error } = await sb.from("profiles").update({ role }).eq("id", id);
    if (error) return fail(error.message);

    await audit(
      actor,
      "update",
      "user",
      id,
      `Changed role of ${target?.email ?? id} to ${role}`,
    );
    revalidatePath("/admin/users");
    return ok("Role updated.");
  });
}

export async function setUserActive(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const actor = await requirePermission("users.write");
    const sb = await db();
    const id = str(formData.get("id"));
    const active = str(formData.get("active")) === "true";
    if (!id) return fail("Missing user id.");
    if (id === actor.id) return fail("You cannot deactivate your own account.");

    const { data: target } = await sb
      .from("profiles")
      .select("role, email")
      .eq("id", id)
      .maybeSingle();
    if (target?.role === "owner") return fail("The owner account cannot be deactivated.");

    const { error } = await sb
      .from("profiles")
      .update({ is_active: active })
      .eq("id", id);
    if (error) return fail(error.message);

    await audit(
      actor,
      "update",
      "user",
      id,
      `${active ? "Reactivated" : "Deactivated"} ${target?.email ?? id}`,
    );
    revalidatePath("/admin/users");
    return ok(active ? "Account reactivated." : "Account deactivated.");
  });
}

export async function updateOwnProfile(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const sb = await db();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return fail("Not signed in.");

    const fullName = str(formData.get("fullName"));
    if (!fullName) return fail("Your name cannot be empty.");

    const { error } = await sb
      .from("profiles")
      .update({
        full_name: fullName,
        phone: nullable(formData.get("phone")),
        job_title: nullable(formData.get("jobTitle")),
      })
      .eq("id", user.id);
    if (error) return fail(error.message);

    revalidatePath("/admin/profile");
    return ok("Profile updated.");
  });
}

export async function changeOwnPassword(formData: FormData): Promise<Result> {
  return wrap(async () => {
    const sb = await db();
    const password = str(formData.get("password"));
    const confirm = str(formData.get("confirm"));
    if (password.length < 10) {
      return fail("Choose a password of at least 10 characters.");
    }
    if (password !== confirm) return fail("The two passwords do not match.");

    const { error } = await sb.auth.updateUser({ password });
    if (error) return fail(error.message);
    return ok("Password changed.");
  });
}
