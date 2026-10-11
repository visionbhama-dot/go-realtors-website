"use server";

import { z } from "zod";
import { getAdminSupabase, getPublicSupabase } from "@/lib/supabase/server";

export type ActionResult = { ok: boolean; message: string };

const phoneRe = /^(\+?91[\s-]?)?[6-9]\d{9}$/;

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(90),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => phoneRe.test(v), "Enter a valid 10-digit Indian mobile number"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(1200).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  requirement: z.string().trim().max(120).optional().or(z.literal("")),
  projectSlug: z.string().trim().max(160).optional().or(z.literal("")),
  projectName: z.string().trim().max(160).optional().or(z.literal("")),
  source: z.string().trim().max(60).default("website"),
  sourcePath: z.string().trim().max(240).optional().or(z.literal("")),
  consent: z.coerce.boolean().optional(),
  /** honeypot — bots fill this, humans never see it */
  company: z.string().max(0).optional().or(z.literal("")),
});

export async function submitLead(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, message: first?.message ?? "Please check your details." };
  }
  const d = parsed.data;

  // Honeypot tripped — pretend success, store nothing.
  if (d.company) return { ok: true, message: "Thank you. We'll be in touch." };

  const sb = getAdminSupabase() ?? getPublicSupabase();
  if (!sb) {
    console.info("[lead] Supabase not configured, captured in logs only:", {
      name: d.name,
      phone: d.phone,
      project: d.projectName,
    });
    return {
      ok: true,
      message:
        "Thank you! Your enquiry has been received. An advisor will call you shortly.",
    };
  }

  let projectId: string | null = null;
  if (d.projectSlug) {
    const { data } = await sb
      .from("projects")
      .select("id")
      .eq("slug", d.projectSlug)
      .maybeSingle();
    projectId = (data?.id as string) ?? null;
  }

  const { error } = await sb.from("leads").insert({
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    message: d.message || null,
    budget: d.budget || null,
    requirement: d.requirement || null,
    project_id: projectId,
    project_name: d.projectName || null,
    source: d.source || "website",
    source_path: d.sourcePath || null,
    consent: d.consent ?? true,
  });

  if (error) {
    console.error("[lead] insert failed:", error.message);
    return {
      ok: false,
      message:
        "We could not save your enquiry right now. Please call us directly and we'll help immediately.",
    };
  }

  return {
    ok: true,
    message:
      "Thank you! Your enquiry has been received. An advisor will call you shortly.",
  };
}

/* ----------------------------------------------------- newsletter */
const subSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  source: z.string().trim().max(60).default("footer"),
});

export async function subscribe(formData: FormData): Promise<ActionResult> {
  const parsed = subSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]!.message };
  }

  const sb = getAdminSupabase() ?? getPublicSupabase();
  if (!sb) {
    return { ok: true, message: "You're on the list. Welcome aboard." };
  }

  const { error } = await sb
    .from("subscribers")
    .upsert(
      { email: parsed.data.email, source: parsed.data.source, is_active: true },
      { onConflict: "email" },
    );

  if (error) {
    console.error("[subscribe] failed:", error.message);
    return { ok: false, message: "Subscription failed. Please try again." };
  }
  return { ok: true, message: "You're on the list. Welcome aboard." };
}

/* ------------------------------------------------ job application */
const applySchema = z.object({
  name: z.string().trim().min(2).max(90),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  openingSlug: z.string().trim().max(120).optional().or(z.literal("")),
  coverNote: z.string().trim().max(2000).optional().or(z.literal("")),
  resumeUrl: z.string().trim().max(400).optional().or(z.literal("")),
});

export async function submitApplication(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = applySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "Please check the form and try again." };
  }
  const d = parsed.data;
  const sb = getAdminSupabase() ?? getPublicSupabase();
  if (!sb) {
    return { ok: true, message: "Application received. We'll be in touch." };
  }

  let openingId: string | null = null;
  if (d.openingSlug) {
    const { data } = await sb
      .from("job_openings")
      .select("id")
      .eq("slug", d.openingSlug)
      .maybeSingle();
    openingId = (data?.id as string) ?? null;
  }

  const { error } = await sb.from("job_applications").insert({
    opening_id: openingId,
    name: d.name,
    email: d.email,
    phone: d.phone || null,
    cover_note: d.coverNote || null,
    resume_url: d.resumeUrl || null,
  });

  if (error) {
    console.error("[apply] failed:", error.message);
    return { ok: false, message: "Could not submit application. Please email us." };
  }
  return {
    ok: true,
    message: "Application received. Our team will review and revert.",
  };
}
