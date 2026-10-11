import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Star, Trash2, X } from "lucide-react";
import { ActionForm, InlineAction } from "@/components/admin/ActionForm";
import {
  AdminHeader,
  EmptyState,
  Field,
  Panel,
  Pill,
  Table,
} from "@/components/admin/ui";
import { deleteRow, saveTestimonial } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Testimonials" };

const txt = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("team.read")) {
    return <EmptyState title="No access" description="Your role cannot view testimonials." />;
  }

  const sp = await searchParams;
  const editId = Array.isArray(sp.edit) ? sp.edit[0] : sp.edit;
  const canWrite = user.permissions.includes("team.write");

  const sb = await getServerSupabase();
  const { data: rows } = await sb!
    .from("testimonials")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });

  const editing = editId ? (rows ?? []).find((r) => String(r.id) === editId) : null;

  return (
    <>
      <AdminHeader
        title="Testimonials"
        description="Client quotes shown in the homepage carousel. Only publish testimonials you have permission to use."
      />

      <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4">
        <p className="text-[0.8125rem] leading-relaxed text-amber-800">
          <strong className="font-bold text-amber-900">Note:</strong> the
          testimonials loaded by the seed script are illustrative placeholders
          written to show the design. Replace them with real, attributable client
          quotes before you promote the site, and keep written consent on file
          for each one.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Panel padded={false}>
          {(rows ?? []).length === 0 ? (
            <EmptyState
              icon={<Star className="h-5 w-5" strokeWidth={2} />}
              title="No testimonials yet"
              description="Add client quotes using the form. The homepage carousel hides itself if none are published."
            />
          ) : (
            <Table head={["Client", "Project", "Rating", "Quote", "State", ""]} minWidth="52rem">
              {(rows ?? []).map((t) => (
                <tr key={String(t.id)} className="align-top hover:bg-ink-50/70">
                  <td className="px-4 py-3">
                    <p className="text-[0.8125rem] font-semibold text-ink-950">
                      {txt(t.name)}
                    </p>
                    <p className="mt-0.5 text-[0.6875rem] text-ink-400">
                      {txt(t.location)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                    {txt(t.project_name) || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex items-center gap-0.5">
                      {Array.from({ length: Number(t.rating ?? 5) }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-brand-500 text-brand-500"
                          strokeWidth={2}
                        />
                      ))}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-sm line-clamp-2 text-[0.75rem] leading-relaxed text-ink-600">
                      {txt(t.quote)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={t.state === "published" ? "brand" : "warn"}>
                      {txt(t.state)}
                    </Pill>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {canWrite && (
                        <>
                          <Link
                            href={`/admin/testimonials?edit=${t.id}`}
                            className="btn btn-outline btn-sm"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" strokeWidth={2.3} />
                          </Link>
                          <InlineAction
                            action={deleteRow}
                            fields={{ table: "testimonials", id: String(t.id) }}
                            confirm="Delete this testimonial?"
                            label={<Trash2 className="h-3.5 w-3.5" strokeWidth={2.3} />}
                            className="btn btn-outline btn-sm text-red-600 hover:border-red-300 hover:bg-red-50"
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Panel>

        {canWrite && (
          <Panel
            title={editing ? "Edit testimonial" : "Add a testimonial"}
            actions={
              editing ? (
                <Link
                  href="/admin/testimonials"
                  className="btn btn-outline btn-sm"
                  title="Cancel"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.3} />
                </Link>
              ) : null
            }
          >
            <ActionForm
              key={editId ?? "new"}
              action={saveTestimonial}
              submitLabel={editing ? "Save testimonial" : "Add testimonial"}
              resetOnSuccess={!editing}
              redirectOnSuccess={editing ? "/admin/testimonials" : undefined}
            >
              {editing && <input type="hidden" name="id" value={String(editing.id)} />}
              <div className="space-y-4">
                <Field label="Client name" required>
                  <input
                    name="name"
                    required
                    defaultValue={txt(editing?.name)}
                    className="field"
                  />
                </Field>
                <Field label="Location" hint="e.g. “Sector 103, Gurugram” or “Dubai, UAE”.">
                  <input
                    name="location"
                    defaultValue={txt(editing?.location)}
                    className="field"
                  />
                </Field>
                <Field label="Project">
                  <input
                    name="project_name"
                    defaultValue={txt(editing?.project_name)}
                    className="field"
                  />
                </Field>
                <Field label="Quote" required hint="Specific quotes convert far better than generic praise.">
                  <textarea
                    name="quote"
                    rows={5}
                    required
                    defaultValue={txt(editing?.quote)}
                    className="field resize-y"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Rating">
                    <select
                      name="rating"
                      defaultValue={txt(editing?.rating ?? 5)}
                      className="field"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} star{r > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Sort order">
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={txt(editing?.sort_order ?? 0)}
                      className="field"
                    />
                  </Field>
                </div>
                <Field label="Photo URL">
                  <input
                    name="photo_url"
                    defaultValue={txt(editing?.photo_url)}
                    className="field font-mono text-[0.8125rem]"
                  />
                </Field>
                <Field label="State">
                  <select
                    name="state"
                    defaultValue={txt(editing?.state) || "published"}
                    className="field"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </Field>
              </div>
            </ActionForm>
          </Panel>
        )}
      </div>
    </>
  );
}
