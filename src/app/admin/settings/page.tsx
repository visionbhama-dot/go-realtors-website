import { redirect } from "next/navigation";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminHeader, EmptyState, Field, Panel } from "@/components/admin/ui";
import { saveSettings } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Site settings" };

type SettingDef = {
  name: string;
  label: string;
  hint?: string;
  fallback?: string;
  type?: "text" | "textarea" | "url" | "email";
  rows?: number;
};

const GROUPS: { group: string; title: string; description: string; fields: SettingDef[] }[] = [
  {
    group: "home",
    title: "Homepage content",
    description:
      "The headline, search prompt and section titles on the public homepage. Leave a field blank to use the built-in default.",
    fields: [
      {
        name: "hero_prefix",
        label: "Hero headline (first line)",
        hint: "Static first line, kept on one line on mobile — keep it short.",
        fallback: "Discover properties in",
      },
      {
        name: "hero_words",
        label: "Hero rotating words",
        type: "textarea",
        rows: 6,
        hint: "One phrase per line. These type out one after another under the headline (e.g. Gurugram, New Delhi).",
        fallback:
          "Gurugram\nNew Delhi\nDwarka Expressway\nGolf Course Road\nNoida\npopular localities",
      },
      {
        name: "hero_subheading",
        label: "Hero sub-heading",
        type: "textarea",
        rows: 2,
        fallback:
          "Explore property opportunities across Gurugram with clear information, thoughtful comparisons, and guidance tailored to your requirements.",
      },
      { name: "types_title", label: "Property types — title", fallback: "Start With the Kind of Property You Need" },
      {
        name: "types_desc",
        label: "Property types — description",
        type: "textarea",
        rows: 2,
        fallback:
          "Choose a property category to narrow your search and focus on opportunities relevant to your goals.",
      },
      {
        name: "curated_title",
        label: "Curated collections — title",
        fallback: "Prime properties, grouped for you",
      },
      {
        name: "curated_desc",
        label: "Curated collections — description",
        type: "textarea",
        rows: 2,
        fallback:
          "Hand-picked shortlists based on how people actually search — stage, budget and format.",
      },
      {
        name: "trending_title",
        label: "Featured projects — title",
        fallback: "Explore Selected Projects",
      },
      {
        name: "trending_desc",
        label: "Featured projects — description",
        type: "textarea",
        rows: 2,
        fallback:
          "Review a focused selection of projects and compare the details that matter to you. Availability, pricing and terms can change, so confirm current information before making a decision.",
      },
      {
        name: "cities_title",
        label: "Featured cities — title",
        fallback: "Find your home in the city of your choice",
      },
      {
        name: "cities_desc",
        label: "Featured cities — description",
        type: "textarea",
        rows: 2,
        fallback:
          "We're rooted in Gurugram and Delhi today, and expanding across India's major property markets. Tell us where you're looking and we'll source it.",
      },
      {
        name: "city_images",
        label: "Featured city images",
        type: "textarea",
        rows: 7,
        hint:
          "One city per line as “City = image URL”, e.g. Mumbai = https://…/mumbai.jpg. " +
          "Upload the photo under Media first, then paste its URL here. Cities left out keep the built-in illustrated artwork. Only use images you own or are licensed to use.",
      },
      { name: "why_title", label: "Why buy with us — title", fallback: "Why buy with us?" },
      {
        name: "why_desc",
        label: "Why buy with us — description",
        type: "textarea",
        rows: 2,
        fallback:
          "The things that make GoRealtors a genuine advisory, not another listing desk.",
      },
    ],
  },
  {
    group: "contact",
    title: "Contact details",
    description:
      "Used in the header, footer, contact page, schema markup and every call-to-action on the site.",
    fields: [
      { name: "phone", label: "Primary phone", fallback: SITE.phoneDisplay },
      {
        name: "phone_raw",
        label: "Phone (dial format)",
        hint: "Used in tel: links. Include the country code, no spaces.",
        fallback: SITE.phone,
      },
      {
        name: "whatsapp",
        label: "WhatsApp number",
        hint: "Digits only, with country code, e.g. 919560627388.",
        fallback: SITE.whatsapp,
      },
      { name: "email", label: "Primary email", type: "email", fallback: SITE.email },
      { name: "address_line1", label: "Address line 1", fallback: SITE.address.line1 },
      { name: "address_line2", label: "Address line 2", fallback: SITE.address.line2 },
      { name: "city", label: "City", fallback: SITE.address.city },
      { name: "state", label: "State", fallback: SITE.address.state },
      { name: "postal_code", label: "PIN code", fallback: SITE.address.postalCode },
      { name: "hours", label: "Office hours", fallback: SITE.hours },
    ],
  },
  {
    group: "social",
    title: "Social profiles",
    description: "Linked from the header, footer and contact page, and emitted as sameAs in schema.",
    fields: [
      { name: "instagram", label: "Instagram", type: "url", fallback: SITE.social.instagram },
      { name: "facebook", label: "Facebook", type: "url", fallback: SITE.social.facebook },
      { name: "linkedin", label: "LinkedIn", type: "url", fallback: SITE.social.linkedin },
      { name: "youtube", label: "YouTube", type: "url", fallback: SITE.social.youtube },
    ],
  },
  {
    group: "brand",
    title: "Brand & messaging",
    description: "Headline copy and the trust statistics shown on the homepage hero.",
    fields: [
      { name: "tagline", label: "Tagline", fallback: SITE.tagline },
      {
        name: "description",
        label: "Default site description",
        type: "textarea",
        rows: 3,
        hint: "Fallback meta description for any page without its own.",
        fallback: SITE.description,
      },
      { name: "rera_label", label: "RERA label", fallback: SITE.rera },
      { name: "stat_units", label: "Stat — families advised", fallback: SITE.stats.unitsAdvised },
      { name: "stat_gmv", label: "Stat — transaction value", fallback: SITE.stats.gmv },
      { name: "stat_developers", label: "Stat — developer partners", fallback: SITE.stats.developers },
      { name: "stat_years", label: "Stat — years in market", fallback: SITE.stats.years },
    ],
  },
  {
    group: "analytics",
    title: "Analytics & verification",
    description:
      "Paste IDs only, not full script tags. Leave blank to disable a given integration.",
    fields: [
      { name: "ga4_id", label: "Google Analytics 4 measurement ID", hint: "e.g. G-XXXXXXXXXX" },
      { name: "gtm_id", label: "Google Tag Manager container ID", hint: "e.g. GTM-XXXXXXX" },
      { name: "meta_pixel_id", label: "Meta Pixel ID", hint: "Digits only" },
      {
        name: "search_console",
        label: "Google Search Console verification",
        hint: "The content value of the google-site-verification meta tag",
      },
      { name: "ads_conversion_id", label: "Google Ads conversion ID" },
    ],
  },
  {
    group: "leads",
    title: "Lead handling",
    description: "Where enquiry notifications go and how new leads are routed.",
    fields: [
      {
        name: "notify_emails",
        label: "Notification recipients",
        hint: "Comma-separated email addresses to alert on a new enquiry.",
        fallback: SITE.email,
      },
      {
        name: "auto_reply",
        label: "Auto-reply message",
        type: "textarea",
        rows: 3,
        fallback:
          "Thank you for contacting GoRealtors. An advisor will call you within one working day with a shortlist that matches your brief.",
      },
    ],
  },
];

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("settings.write")) {
    return (
      <EmptyState
        title="No access"
        description="Only owners, administrators and managers can edit site settings."
      />
    );
  }

  const sb = await getServerSupabase();
  const { data } = await sb!.from("settings").select("key, value");
  const current = new Map(
    (data ?? []).map((r) => [String(r.key), r.value as unknown]),
  );

  const valueOf = (group: string, name: string, fallback?: string) => {
    const v = current.get(`${group}.${name}`);
    if (typeof v === "string") return v;
    if (v !== null && v !== undefined && typeof v !== "object") return String(v);
    return fallback ?? "";
  };

  return (
    <>
      <AdminHeader
        title="Site settings"
        description="Global configuration consumed across the public website. Changes take effect immediately after saving."
      />

      <ActionForm
        action={saveSettings}
        submitLabel="Save all settings"
        submitClassName="btn btn-primary"
      >
        <div className="space-y-6">
          {GROUPS.map((g) => (
            <Panel key={g.group} title={g.title} description={g.description}>
              <div className="grid gap-4 sm:grid-cols-2">
                {g.fields.map((f) => (
                  <Field
                    key={f.name}
                    label={f.label}
                    hint={f.hint}
                    className={f.type === "textarea" ? "sm:col-span-2" : undefined}
                  >
                    {f.type === "textarea" ? (
                      <textarea
                        name={`setting:${g.group}:${f.name}`}
                        rows={f.rows ?? 3}
                        defaultValue={valueOf(g.group, f.name, f.fallback)}
                        className="field resize-y"
                      />
                    ) : (
                      <input
                        name={`setting:${g.group}:${f.name}`}
                        type={f.type === "email" ? "email" : "text"}
                        defaultValue={valueOf(g.group, f.name, f.fallback)}
                        className="field"
                      />
                    )}
                  </Field>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      </ActionForm>

      <Panel className="mt-6" title="Environment">
        <dl className="divide-y divide-ink-100 text-[0.8125rem]">
          {[
            ["Public site URL", SITE.url],
            [
              "Supabase project",
              (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "not set").replace(
                /^https?:\/\//,
                "",
              ),
            ],
            [
              "Service role key",
              process.env.SUPABASE_SERVICE_ROLE_KEY ? "configured" : "not set",
            ],
            ["Signed in as", `${user.email} (${user.role})`],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-wrap justify-between gap-3 py-2.5">
              <dt className="text-ink-500">{k}</dt>
              <dd className="break-all font-mono text-[0.75rem] font-semibold text-ink-900">
                {v}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 rounded-sm bg-ink-50 p-3 text-[0.6875rem] leading-relaxed text-ink-500">
          Environment variables are set in Vercel &gt; Project &gt; Settings &gt;
          Environment Variables, not here. Changing them requires a redeploy.
        </p>
      </Panel>
    </>
  );
}
