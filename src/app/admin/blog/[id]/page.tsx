import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminHeader, EmptyState, Field, Panel } from "@/components/admin/ui";
import { savePost } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit post" };

const txt = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export default async function BlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("blog.write")) {
    return (
      <EmptyState
        title="No access"
        description="Your role can read blog posts but not edit them."
      />
    );
  }

  const sb = await getServerSupabase();
  const post = isNew
    ? null
    : (await sb!.from("blog_posts").select("*").eq("id", id).maybeSingle()).data;

  if (!isNew && !post) notFound();

  const canPublish = user.permissions.includes("blog.publish");
  const bodyText = Array.isArray(post?.body)
    ? (post!.body as string[]).join("\n\n")
    : "";

  return (
    <>
      <AdminHeader
        title={isNew ? "New post" : txt(post?.title)}
        description={
          isNew
            ? "Write a market insight. Separate paragraphs with a blank line."
            : `Editing post · ${txt(post?.state)}`
        }
        back={{ href: "/admin/blog", label: "Back to posts" }}
      />

      <ActionForm
        action={savePost}
        submitLabel={isNew ? "Create post" : "Save changes"}
        redirectOnSuccess={isNew ? "/admin/blog" : undefined}
        secondary={
          <>
            <Link href="/admin/blog" className="btn btn-outline">
              Cancel
            </Link>
            {!isNew && post?.state === "published" && (
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="btn btn-outline"
              >
                View on site
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.3} />
              </Link>
            )}
          </>
        }
      >
        {!isNew && <input type="hidden" name="id" value={String(post!.id)} />}

        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-6">
            <Panel title="Article">
              <div className="space-y-4">
                <Field label="Title" required>
                  <input
                    name="title"
                    required
                    defaultValue={txt(post?.title)}
                    className="field"
                    placeholder="Why Dwarka Expressway pricing re-rated in 2026"
                  />
                </Field>
                <Field label="URL slug" hint="Leave blank to generate from the title.">
                  <input
                    name="slug"
                    defaultValue={txt(post?.slug)}
                    className="field font-mono text-[0.8125rem]"
                  />
                </Field>
                <Field
                  label="Excerpt"
                  hint="Shown on cards and used as the meta description fallback. 150-230 characters."
                >
                  <textarea
                    name="excerpt"
                    rows={3}
                    defaultValue={txt(post?.excerpt)}
                    className="field resize-y"
                    maxLength={400}
                  />
                </Field>
                <Field
                  label="Body"
                  required
                  hint="Separate each paragraph with a blank line. Reading time is calculated automatically if left unset."
                >
                  <textarea
                    name="body"
                    rows={22}
                    required
                    defaultValue={bodyText}
                    className="field resize-y leading-relaxed"
                    placeholder={"First paragraph.\n\nSecond paragraph."}
                  />
                </Field>
              </div>
            </Panel>

            <Panel title="Search engine settings">
              <div className="space-y-4">
                <Field label="Meta title" hint="50-60 characters. Falls back to the post title.">
                  <input
                    name="seo_title"
                    defaultValue={txt(post?.seo_title)}
                    className="field"
                    maxLength={70}
                  />
                </Field>
                <Field label="Meta description" hint="140-160 characters. Falls back to the excerpt.">
                  <textarea
                    name="seo_description"
                    rows={3}
                    defaultValue={txt(post?.seo_description)}
                    className="field resize-y"
                    maxLength={320}
                  />
                </Field>
                <Field label="Focus keywords" hint="Comma separated.">
                  <input
                    name="seo_keywords"
                    defaultValue={
                      Array.isArray(post?.seo_keywords)
                        ? (post!.seo_keywords as string[]).join(", ")
                        : ""
                    }
                    className="field"
                  />
                </Field>
                <Field label="Open Graph image" hint="Defaults to the cover image.">
                  <input
                    name="og_image"
                    defaultValue={txt(post?.og_image)}
                    className="field font-mono text-[0.8125rem]"
                  />
                </Field>
                <label className="flex items-start gap-3 rounded-sm border border-ink-200 p-3.5">
                  <input
                    type="checkbox"
                    name="noindex"
                    defaultChecked={Boolean(post?.noindex)}
                    className="mt-0.5 h-4 w-4 accent-brand-600"
                  />
                  <span className="text-[0.8125rem] font-semibold text-ink-900">
                    Hide this post from search engines
                  </span>
                </label>
              </div>
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel title="Publishing">
              <div className="space-y-4">
                <Field
                  label="State"
                  hint={canPublish ? undefined : "Your role can save drafts only."}
                >
                  <select
                    name="state"
                    defaultValue={txt(post?.state) || "draft"}
                    className="field"
                  >
                    <option value="draft">Draft</option>
                    {canPublish && <option value="published">Published</option>}
                    <option value="archived">Archived</option>
                  </select>
                </Field>
                <Field label="Publish date">
                  <input
                    name="published_at"
                    type="date"
                    defaultValue={
                      post?.published_at
                        ? String(post.published_at).slice(0, 10)
                        : new Date().toISOString().slice(0, 10)
                    }
                    className="field"
                  />
                </Field>
                <label className="flex items-start gap-3 rounded-sm border border-ink-200 p-3.5">
                  <input
                    type="checkbox"
                    name="is_featured"
                    defaultChecked={Boolean(post?.is_featured)}
                    className="mt-0.5 h-4 w-4 accent-brand-600"
                  />
                  <span className="text-[0.8125rem] font-semibold text-ink-900">
                    Feature this post
                  </span>
                </label>
              </div>
            </Panel>

            <Panel title="Metadata">
              <div className="space-y-4">
                <Field label="Category">
                  <input
                    name="category_name"
                    defaultValue={txt(post?.category_name) || "Market Insight"}
                    list="cat-list"
                    className="field"
                  />
                  <datalist id="cat-list">
                    {[
                      "Market Insight",
                      "Investment",
                      "Project Spotlight",
                      "Buyer Guide",
                      "Advisory",
                      "Commercial",
                    ].map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Author">
                  <input
                    name="author_name"
                    defaultValue={txt(post?.author_name) || user.fullName}
                    className="field"
                  />
                </Field>
                <Field label="Cover image" hint="Path or full URL. Recommended 1600×900.">
                  <input
                    name="cover_image"
                    defaultValue={txt(post?.cover_image)}
                    className="field font-mono text-[0.8125rem]"
                  />
                </Field>
                <Field label="Tags" hint="Comma separated.">
                  <input
                    name="tags"
                    defaultValue={
                      Array.isArray(post?.tags)
                        ? (post!.tags as string[]).join(", ")
                        : ""
                    }
                    className="field"
                  />
                </Field>
                <Field label="Reading time (min)" hint="Leave blank to calculate from word count.">
                  <input
                    name="read_minutes"
                    type="number"
                    defaultValue={txt(post?.read_minutes)}
                    className="field"
                  />
                </Field>
              </div>
            </Panel>
          </aside>
        </div>
      </ActionForm>
    </>
  );
}
