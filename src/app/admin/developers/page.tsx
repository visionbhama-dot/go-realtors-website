import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { ActionForm, InlineAction } from "@/components/admin/ActionForm";
import {
  AdminHeader,
  EmptyState,
  Field,
  Panel,
  Pill,
  Table,
} from "@/components/admin/ui";
import { deleteRow, saveDeveloper } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Developers" };

const txt = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export default async function AdminDevelopersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("projects.read")) {
    return <EmptyState title="No access" description="Your role cannot view developers." />;
  }

  const sp = await searchParams;
  const editId = Array.isArray(sp.edit) ? sp.edit[0] : sp.edit;
  const canWrite = user.permissions.includes("projects.write");

  const sb = await getServerSupabase();
  const [{ data: rows }, { data: counts }] = await Promise.all([
    sb!.from("developers").select("*").order("sort_order").order("name"),
    sb!.from("projects").select("developer_name"),
  ]);

  const tally = new Map<string, number>();
  ((counts ?? []) as { developer_name: string }[]).forEach((p) =>
    tally.set(p.developer_name, (tally.get(p.developer_name) ?? 0) + 1),
  );

  const editing = editId
    ? (rows ?? []).find((r) => String(r.id) === editId)
    : null;

  return (
    <>
      <AdminHeader
        title="Developers"
        description="Developer profile pages at /developers/[slug]. Project records link to these by exact name match."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Panel padded={false}>
          {(rows ?? []).length === 0 ? (
            <EmptyState
              title="No developers yet"
              description="Run supabase/seed.sql to import the 18 existing developer profiles, or add one using the form."
            />
          ) : (
            <Table head={["Developer", "HQ", "Projects", "State", ""]} minWidth="40rem">
              {(rows ?? []).map((d) => (
                <tr key={String(d.id)} className="hover:bg-ink-50/70">
                  <td className="px-4 py-3">
                    <p className="text-[0.8125rem] font-semibold text-ink-950">
                      {txt(d.name)}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.625rem] text-ink-400">
                      /developers/{txt(d.slug)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                    {txt(d.headquarters) || "—"}
                  </td>
                  <td className="px-4 py-3 text-[0.8125rem] font-semibold tabular-nums text-ink-900">
                    {tally.get(txt(d.name)) ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={d.state === "published" ? "brand" : "warn"}>
                      {txt(d.state)}
                    </Pill>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {canWrite && (
                        <Link
                          href={`/admin/developers?edit=${d.id}`}
                          className="btn btn-outline btn-sm"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={2.3} />
                        </Link>
                      )}
                      {canWrite && (
                        <InlineAction
                          action={deleteRow}
                          fields={{ table: "developers", id: String(d.id) }}
                          confirm={`Delete the ${txt(d.name)} profile? Projects referencing it will keep the developer name but lose the linked profile page.`}
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

        {canWrite && (
          <Panel
            title={editing ? `Edit ${txt(editing.name)}` : "Add a developer"}
            actions={
              editing ? (
                <Link
                  href="/admin/developers"
                  className="btn btn-outline btn-sm"
                  title="Cancel editing"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.3} />
                </Link>
              ) : null
            }
          >
            <ActionForm
              key={editId ?? "new"}
              action={saveDeveloper}
              submitLabel={editing ? "Save developer" : "Create developer"}
              resetOnSuccess={!editing}
              redirectOnSuccess={editing ? "/admin/developers" : undefined}
            >
              {editing && <input type="hidden" name="id" value={String(editing.id)} />}
              <div className="space-y-4">
                <Field label="Name" required>
                  <input
                    name="name"
                    required
                    defaultValue={txt(editing?.name)}
                    className="field"
                    placeholder="Godrej Properties"
                  />
                </Field>
                <Field label="Short name" hint="Used in compact UI, e.g. footer links.">
                  <input
                    name="short_name"
                    defaultValue={txt(editing?.short_name)}
                    className="field"
                    placeholder="Godrej"
                  />
                </Field>
                <Field label="URL slug" hint="Leave blank to generate from the name.">
                  <input
                    name="slug"
                    defaultValue={txt(editing?.slug)}
                    className="field font-mono text-[0.8125rem]"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Established">
                    <input
                      name="established"
                      defaultValue={txt(editing?.established)}
                      className="field"
                      placeholder="1990"
                    />
                  </Field>
                  <Field label="Headquarters">
                    <input
                      name="headquarters"
                      defaultValue={txt(editing?.headquarters)}
                      className="field"
                      placeholder="Mumbai, Maharashtra"
                    />
                  </Field>
                </div>
                <Field label="Description" hint="Two or three sentences on track record and positioning.">
                  <textarea
                    name="description"
                    rows={5}
                    defaultValue={txt(editing?.description)}
                    className="field resize-y"
                  />
                </Field>
                <Field label="Specialities" hint="One per line.">
                  <textarea
                    name="specialities"
                    rows={3}
                    defaultValue={
                      Array.isArray(editing?.specialities)
                        ? (editing!.specialities as string[]).join("\n")
                        : ""
                    }
                    className="field resize-y"
                  />
                </Field>
                <Field label="Website">
                  <input name="website" defaultValue={txt(editing?.website)} className="field" />
                </Field>
                <Field label="Logo URL">
                  <input
                    name="logo_url"
                    defaultValue={txt(editing?.logo_url)}
                    className="field font-mono text-[0.8125rem]"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Sort order">
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={txt(editing?.sort_order ?? 0)}
                      className="field"
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
                <Field label="Meta title">
                  <input name="seo_title" defaultValue={txt(editing?.seo_title)} className="field" />
                </Field>
                <Field label="Meta description">
                  <textarea
                    name="seo_description"
                    rows={2}
                    defaultValue={txt(editing?.seo_description)}
                    className="field resize-y"
                  />
                </Field>
              </div>
            </ActionForm>
          </Panel>
        )}
      </div>

      {canWrite && !editing && (
        <p className="mt-4 flex items-center gap-1.5 text-[0.75rem] text-ink-500">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
          Use the form to add a new developer, or click the pencil on any row to
          edit it.
        </p>
      )}
    </>
  );
}
