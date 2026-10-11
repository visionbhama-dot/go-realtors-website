import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { InlineAction } from "@/components/admin/ActionForm";
import {
  AdminHeader,
  EmptyState,
  Panel,
  Pill,
  Table,
} from "@/components/admin/ui";
import { deleteProject, setProjectState } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { STATUS_LABEL, priceRange, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Projects" };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("projects.read")) {
    return (
      <EmptyState
        title="No access"
        description="Your role does not include permission to view projects."
      />
    );
  }

  const sp = await searchParams;
  const state = one(sp.state) ?? "";
  const category = one(sp.category) ?? "";
  const q = one(sp.q) ?? "";

  const sb = await getServerSupabase();
  let query = sb!
    .from("projects")
    .select(
      "id, slug, name, developer_name, locality_name, sector, category, status, state, price_min, price_max, is_featured, is_trending, updated_at",
    )
    .order("updated_at", { ascending: false });

  if (state) query = query.eq("state", state);
  if (category) query = query.eq("category", category);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  const rows = data ?? [];

  const canWrite = user.permissions.includes("projects.write");
  const canPublish = user.permissions.includes("projects.publish");
  const canDelete = user.permissions.includes("projects.delete");

  const filters = [
    { label: "All", href: "/admin/projects", active: !state && !category },
    { label: "Published", href: "/admin/projects?state=published", active: state === "published" },
    { label: "Drafts", href: "/admin/projects?state=draft", active: state === "draft" },
    { label: "Archived", href: "/admin/projects?state=archived", active: state === "archived" },
    { label: "Residential", href: "/admin/projects?category=residential", active: category === "residential" },
    { label: "Commercial", href: "/admin/projects?category=commercial", active: category === "commercial" },
  ];

  return (
    <>
      <AdminHeader
        title="Projects"
        description="Every residential and commercial project on the website. Edit pricing, configurations, content, gallery and per-page SEO."
        actions={
          canWrite ? (
            <Link href="/admin/projects/new" className="btn btn-primary btn-sm">
              <Plus className="h-4 w-4" strokeWidth={2.4} />
              New project
            </Link>
          ) : null
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={f.active ? "chip chip-active" : "chip"}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <form action="/admin/projects" className="flex gap-2">
          <label htmlFor="pq" className="sr-only">
            Search projects
          </label>
          <input
            id="pq"
            name="q"
            defaultValue={q}
            placeholder="Search by name…"
            className="field h-9 w-full sm:w-56"
          />
          <button type="submit" className="btn btn-outline btn-sm">
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-[0.8125rem] text-red-700">
          {error.message}
        </div>
      )}

      <Panel padded={false}>
        {rows.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-5 w-5" strokeWidth={2} />}
            title="No projects found"
            description={
              q || state || category
                ? "No projects match those filters."
                : "Run supabase/seed.sql to import the existing 21 projects, or create one from scratch."
            }
            action={
              canWrite ? (
                <Link href="/admin/projects/new" className="btn btn-primary btn-sm">
                  <Plus className="h-4 w-4" strokeWidth={2.4} />
                  Add project
                </Link>
              ) : null
            }
          />
        ) : (
          <Table
            head={[
              "Project",
              "Developer",
              "Location",
              "Price from",
              "Stage",
              "State",
              "Flags",
              "Updated",
              "",
            ]}
            minWidth="68rem"
          >
            {rows.map((p) => (
              <tr key={String(p.id)} className="align-top hover:bg-ink-50/70">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="text-[0.8125rem] font-semibold text-ink-950 hover:text-brand-700"
                  >
                    {String(p.name)}
                  </Link>
                  <p className="mt-0.5 font-mono text-[0.625rem] text-ink-400">
                    /{String(p.slug)}
                  </p>
                </td>
                <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                  {(p.developer_name as string) || "—"}
                </td>
                <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                  {[p.sector, p.locality_name].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[0.8125rem] font-semibold text-ink-900">
                  {priceRange(
                    p.price_min as number | null,
                    p.price_max as number | null,
                  )}
                </td>
                <td className="px-4 py-3 text-[0.75rem] text-ink-600">
                  {STATUS_LABEL[String(p.status)] ?? String(p.status)}
                </td>
                <td className="px-4 py-3">
                  <Pill
                    tone={
                      p.state === "published"
                        ? "brand"
                        : p.state === "draft"
                          ? "warn"
                          : "neutral"
                    }
                  >
                    {String(p.state)}
                  </Pill>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.is_featured ? <Pill tone="info">Featured</Pill> : null}
                    {p.is_trending ? <Pill tone="info">Trending</Pill> : null}
                    {!p.is_featured && !p.is_trending ? (
                      <span className="text-[0.75rem] text-ink-300">—</span>
                    ) : null}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[0.75rem] text-ink-500">
                  {relativeTime(String(p.updated_at))}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-start justify-end gap-1.5">
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="btn btn-outline btn-sm"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={2.3} />
                    </Link>
                    {p.state === "published" && (
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="btn btn-outline btn-sm"
                        title="View on site"
                      >
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.3} />
                      </Link>
                    )}
                    {canPublish && (
                      <InlineAction
                        action={setProjectState}
                        fields={{
                          id: String(p.id),
                          state: p.state === "published" ? "draft" : "published",
                        }}
                        label={p.state === "published" ? "Unpublish" : "Publish"}
                        className="btn btn-outline btn-sm"
                      />
                    )}
                    {canDelete && (
                      <InlineAction
                        action={deleteProject}
                        fields={{ id: String(p.id) }}
                        confirm={`Delete "${String(p.name)}" permanently? This also removes its configurations and FAQs and cannot be undone.`}
                        label={<Trash2 className="h-3.5 w-3.5" strokeWidth={2.3} />}
                        className="btn btn-outline btn-sm text-red-600 hover:border-red-300 hover:bg-red-50"
                        title="Delete"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>

      <p className="mt-4 text-[0.75rem] text-ink-500">
        Showing {rows.length} {rows.length === 1 ? "project" : "projects"}.
      </p>
    </>
  );
}
