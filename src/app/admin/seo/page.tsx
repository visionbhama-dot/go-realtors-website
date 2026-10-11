import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, Globe2, Pencil, Trash2, X } from "lucide-react";
import { ActionForm, InlineAction } from "@/components/admin/ActionForm";
import {
  AdminHeader,
  EmptyState,
  Field,
  Panel,
  Pill,
  Table,
} from "@/components/admin/ui";
import { deleteRow, saveRedirect, saveSeo } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "SEO manager" };

const txt = (v: unknown) => (v === null || v === undefined ? "" : String(v));

/** Routes whose metadata is overridable from here. */
const MANAGED_ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "Homepage" },
  { path: "/projects", label: "Project directory" },
  { path: "/residential", label: "Residential landing" },
  { path: "/commercial", label: "Commercial landing" },
  { path: "/locations", label: "Locations index" },
  { path: "/developers", label: "Developers index" },
  { path: "/services", label: "Services index" },
  { path: "/blog", label: "Blog index" },
  { path: "/about", label: "About us" },
  { path: "/team", label: "Our team" },
  { path: "/contact", label: "Contact" },
  { path: "/careers", label: "Careers" },
  { path: "/faqs", label: "FAQs" },
  { path: "/compare", label: "Compare tool" },
  { path: "/tools/emi-calculator", label: "EMI calculator" },
  { path: "/privacy-policy", label: "Privacy policy" },
  { path: "/terms", label: "Terms of use" },
  { path: "/disclaimer", label: "Disclaimer" },
];

export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("seo.read")) {
    return <EmptyState title="No access" description="Your role cannot view SEO settings." />;
  }

  const sp = await searchParams;
  const editPath = Array.isArray(sp.path) ? sp.path[0] : sp.path;
  const canWrite = user.permissions.includes("seo.write");

  const sb = await getServerSupabase();
  const [{ data: records }, { data: redirects }] = await Promise.all([
    sb!.from("seo_pages").select("*").order("path"),
    sb!.from("redirects").select("*").order("source").limit(100),
  ]);

  const byPath = new Map(
    (records ?? []).map((r) => [String(r.path), r as Record<string, unknown>]),
  );
  const editing = editPath ? byPath.get(editPath) : null;
  const editingLabel =
    MANAGED_ROUTES.find((r) => r.path === editPath)?.label ?? editPath ?? "";

  return (
    <>
      <AdminHeader
        title="SEO manager"
        description="Override the meta title, description, keywords, canonical URL and social image for every page on the site. Project and blog SEO is managed on each record."
        actions={
          <Link href="/sitemap.xml" target="_blank" className="btn btn-outline btn-sm">
            View sitemap
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.3} />
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_23rem]">
        <div className="space-y-6">
          <Panel
            title="Page metadata"
            description="Pages without a saved override use the defaults coded into each route."
            padded={false}
          >
            <Table head={["Page", "Meta title", "Length", "Index", ""]} minWidth="48rem">
              {MANAGED_ROUTES.map((route) => {
                const rec = byPath.get(route.path);
                const title = txt(rec?.title);
                const len = title.length;
                return (
                  <tr key={route.path} className="align-top hover:bg-ink-50/70">
                    <td className="px-4 py-3">
                      <p className="text-[0.8125rem] font-semibold text-ink-950">
                        {route.label}
                      </p>
                      <p className="mt-0.5 font-mono text-[0.625rem] text-ink-400">
                        {route.path}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {title ? (
                        <p className="max-w-md text-[0.8125rem] text-ink-700">{title}</p>
                      ) : (
                        <span className="text-[0.75rem] italic text-ink-400">
                          Using route default
                        </span>
                      )}
                      {rec?.description ? (
                        <p className="mt-1 max-w-md line-clamp-2 text-[0.6875rem] text-ink-500">
                          {txt(rec.description)}
                        </p>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {title ? (
                        <Pill
                          tone={len >= 40 && len <= 62 ? "brand" : len > 62 ? "danger" : "warn"}
                        >
                          {len} chars
                        </Pill>
                      ) : (
                        <span className="text-[0.75rem] text-ink-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={rec?.noindex ? "danger" : "brand"}>
                        {rec?.noindex ? "noindex" : "index"}
                      </Pill>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        {canWrite && (
                          <Link
                            href={`/admin/seo?path=${encodeURIComponent(route.path)}`}
                            className="btn btn-outline btn-sm"
                            title="Edit metadata"
                          >
                            <Pencil className="h-3.5 w-3.5" strokeWidth={2.3} />
                          </Link>
                        )}
                        <Link
                          href={route.path}
                          target="_blank"
                          className="btn btn-outline btn-sm"
                          title="View page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.3} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </Table>
          </Panel>

          <Panel
            title="Redirects"
            description="Point retired URLs at live ones. Project URLs from the previous WordPress site are already redirected in next.config.ts."
            padded={false}
          >
            {(redirects ?? []).length === 0 ? (
              <EmptyState
                icon={<Globe2 className="h-5 w-5" strokeWidth={2} />}
                title="No custom redirects"
                description="Add one using the form if you retire a URL."
              />
            ) : (
              <Table head={["From", "To", "Type", ""]} minWidth="36rem">
                {(redirects ?? []).map((r) => (
                  <tr key={String(r.id)} className="hover:bg-ink-50/70">
                    <td className="px-4 py-2.5 font-mono text-[0.75rem] text-ink-800">
                      {txt(r.source)}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[0.75rem] text-ink-800">
                      {txt(r.destination)}
                    </td>
                    <td className="px-4 py-2.5">
                      <Pill tone="neutral">{r.permanent ? "301" : "302"}</Pill>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {canWrite && (
                        <InlineAction
                          action={deleteRow}
                          fields={{ table: "redirects", id: String(r.id) }}
                          label={<Trash2 className="h-3.5 w-3.5" strokeWidth={2.3} />}
                          className="btn btn-outline btn-sm text-red-600 hover:border-red-300 hover:bg-red-50"
                          confirm="Remove this redirect?"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </Panel>
        </div>

        <aside className="space-y-6">
          {canWrite && (
            <Panel
              title={editing || editPath ? `Edit: ${editingLabel}` : "Select a page to edit"}
              actions={
                editPath ? (
                  <Link href="/admin/seo" className="btn btn-outline btn-sm" title="Cancel">
                    <X className="h-3.5 w-3.5" strokeWidth={2.3} />
                  </Link>
                ) : null
              }
            >
              {editPath ? (
                <ActionForm
                  key={editPath}
                  action={saveSeo}
                  submitLabel="Save metadata"
                  redirectOnSuccess="/admin/seo"
                >
                  <input type="hidden" name="path" value={editPath} />
                  <input type="hidden" name="label" value={editingLabel} />
                  <div className="space-y-4">
                    <Field
                      label="Meta title"
                      hint="Aim for 40-62 characters. Google truncates beyond roughly 580 pixels."
                    >
                      <input
                        name="title"
                        defaultValue={txt(editing?.title)}
                        className="field"
                        maxLength={80}
                      />
                    </Field>
                    <Field label="Meta description" hint="Aim for 140-160 characters.">
                      <textarea
                        name="description"
                        rows={4}
                        defaultValue={txt(editing?.description)}
                        className="field resize-y"
                        maxLength={320}
                      />
                    </Field>
                    <Field label="Focus keywords" hint="Comma separated.">
                      <input
                        name="keywords"
                        defaultValue={
                          Array.isArray(editing?.keywords)
                            ? (editing!.keywords as string[]).join(", ")
                            : ""
                        }
                        className="field"
                      />
                    </Field>
                    <Field
                      label="Canonical URL"
                      hint="Only set this if the page duplicates another. Leave blank otherwise."
                    >
                      <input
                        name="canonical"
                        defaultValue={txt(editing?.canonical)}
                        className="field font-mono text-[0.8125rem]"
                      />
                    </Field>
                    <Field label="Open Graph image" hint="Recommended 1200×630.">
                      <input
                        name="og_image"
                        defaultValue={txt(editing?.og_image)}
                        className="field font-mono text-[0.8125rem]"
                      />
                    </Field>
                    <label className="flex items-start gap-3 rounded-sm border border-ink-200 p-3.5">
                      <input
                        type="checkbox"
                        name="noindex"
                        defaultChecked={Boolean(editing?.noindex)}
                        className="mt-0.5 h-4 w-4 accent-brand-600"
                      />
                      <span>
                        <span className="block text-[0.8125rem] font-semibold text-ink-900">
                          Hide from search engines
                        </span>
                        <span className="mt-0.5 block text-[0.6875rem] text-ink-500">
                          Adds a noindex directive to this page.
                        </span>
                      </span>
                    </label>
                  </div>
                </ActionForm>
              ) : (
                <p className="text-[0.8125rem] leading-relaxed text-ink-600">
                  Click the pencil icon on any row to override that page&apos;s
                  metadata. Project and blog post SEO lives on each individual
                  record, under the SEO tab of the editor.
                </p>
              )}
            </Panel>
          )}

          {canWrite && (
            <Panel title="Add a redirect">
              <ActionForm action={saveRedirect} submitLabel="Add redirect" resetOnSuccess>
                <div className="space-y-4">
                  <Field label="From path" required hint="Must start with a forward slash.">
                    <input
                      name="source"
                      required
                      className="field font-mono text-[0.8125rem]"
                      placeholder="/old-project-page"
                    />
                  </Field>
                  <Field label="To path" required>
                    <input
                      name="destination"
                      required
                      className="field font-mono text-[0.8125rem]"
                      placeholder="/projects/new-project-slug"
                    />
                  </Field>
                  <label className="flex items-center gap-3 rounded-sm border border-ink-200 p-3.5">
                    <input
                      type="checkbox"
                      name="permanent"
                      defaultChecked
                      className="h-4 w-4 accent-brand-600"
                    />
                    <span className="text-[0.8125rem] font-semibold text-ink-900">
                      Permanent (301)
                    </span>
                  </label>
                </div>
              </ActionForm>
            </Panel>
          )}

          <Panel title="SEO checklist">
            <ul className="space-y-2.5 text-[0.75rem] leading-relaxed text-ink-600">
              {[
                "Every project page already emits Residence, BreadcrumbList and FAQPage structured data.",
                "The homepage emits RealEstateAgent and WebSite schema with a SearchAction.",
                "sitemap.xml regenerates hourly and includes every project, corridor, developer, service and post.",
                "robots.txt blocks /admin, /api and /search from indexing.",
                "Add your Google Search Console and Analytics IDs under Site settings.",
                "Keep meta titles unique — duplicates across project pages dilute rankings.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-600"
                  />
                  {t}
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </>
  );
}
