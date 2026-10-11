import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { InlineAction } from "@/components/admin/ActionForm";
import {
  AdminHeader,
  EmptyState,
  Panel,
  Pill,
  Table,
} from "@/components/admin/ui";
import { deleteRow } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { formatDate, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog posts" };

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("blog.read")) {
    return <EmptyState title="No access" description="Your role cannot view blog posts." />;
  }

  const sp = await searchParams;
  const state = Array.isArray(sp.state) ? sp.state[0] : sp.state;
  const canWrite = user.permissions.includes("blog.write");

  const sb = await getServerSupabase();
  let query = sb!
    .from("blog_posts")
    .select(
      "id, slug, title, category_name, author_name, state, published_at, read_minutes, is_featured, updated_at",
    )
    .order("published_at", { ascending: false });
  if (state) query = query.eq("state", state);

  const { data: rows } = await query;

  return (
    <>
      <AdminHeader
        title="Market insights"
        description="Blog posts published at /blog. Each post carries its own meta title, description and keywords."
        actions={
          canWrite ? (
            <Link href="/admin/blog/new" className="btn btn-primary btn-sm">
              <Plus className="h-4 w-4" strokeWidth={2.4} />
              New post
            </Link>
          ) : null
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { label: "All", href: "/admin/blog", active: !state },
          { label: "Published", href: "/admin/blog?state=published", active: state === "published" },
          { label: "Drafts", href: "/admin/blog?state=draft", active: state === "draft" },
          { label: "Archived", href: "/admin/blog?state=archived", active: state === "archived" },
        ].map((f) => (
          <Link key={f.href} href={f.href} className={f.active ? "chip chip-active" : "chip"}>
            {f.label}
          </Link>
        ))}
      </div>

      <Panel padded={false}>
        {(rows ?? []).length === 0 ? (
          <EmptyState
            icon={<FileText className="h-5 w-5" strokeWidth={2} />}
            title="No posts found"
            description="Run supabase/seed.sql to import the existing 13 articles, or write a new one."
            action={
              canWrite ? (
                <Link href="/admin/blog/new" className="btn btn-primary btn-sm">
                  <Plus className="h-4 w-4" strokeWidth={2.4} />
                  Write a post
                </Link>
              ) : null
            }
          />
        ) : (
          <Table
            head={["Title", "Category", "Author", "Published", "Read", "State", ""]}
            minWidth="56rem"
          >
            {(rows ?? []).map((p) => (
              <tr key={String(p.id)} className="hover:bg-ink-50/70">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/blog/${p.id}`}
                    className="text-[0.8125rem] font-semibold text-ink-950 hover:text-brand-700"
                  >
                    {String(p.title)}
                  </Link>
                  <p className="mt-0.5 font-mono text-[0.625rem] text-ink-400">
                    /blog/{String(p.slug)}
                  </p>
                </td>
                <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                  {String(p.category_name)}
                </td>
                <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                  {String(p.author_name)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[0.75rem] text-ink-600">
                  {formatDate(String(p.published_at))}
                  <p className="text-[0.625rem] text-ink-400">
                    edited {relativeTime(String(p.updated_at))}
                  </p>
                </td>
                <td className="px-4 py-3 text-[0.75rem] text-ink-600">
                  {String(p.read_minutes)} min
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <Pill tone={p.state === "published" ? "brand" : "warn"}>
                      {String(p.state)}
                    </Pill>
                    {p.is_featured ? <Pill tone="info">Featured</Pill> : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    {canWrite && (
                      <Link
                        href={`/admin/blog/${p.id}`}
                        className="btn btn-outline btn-sm"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={2.3} />
                      </Link>
                    )}
                    {p.state === "published" && (
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="btn btn-outline btn-sm"
                        title="View on site"
                      >
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.3} />
                      </Link>
                    )}
                    {canWrite && (
                      <InlineAction
                        action={deleteRow}
                        fields={{ table: "blog_posts", id: String(p.id) }}
                        confirm={`Delete "${String(p.title)}" permanently?`}
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
    </>
  );
}
