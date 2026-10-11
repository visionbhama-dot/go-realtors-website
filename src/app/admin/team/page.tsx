import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
import { ActionForm, InlineAction } from "@/components/admin/ActionForm";
import {
  AdminHeader,
  EmptyState,
  Field,
  Panel,
  Pill,
  Table,
} from "@/components/admin/ui";
import { deleteRow, saveTeamMember } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team profiles" };

const txt = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("team.read")) {
    return <EmptyState title="No access" description="Your role cannot view team profiles." />;
  }

  const sp = await searchParams;
  const editId = Array.isArray(sp.edit) ? sp.edit[0] : sp.edit;
  const canWrite = user.permissions.includes("team.write");

  const sb = await getServerSupabase();
  const { data: rows } = await sb!
    .from("team_members")
    .select("*")
    .order("sort_order")
    .order("name");

  const editing = editId ? (rows ?? []).find((r) => String(r.id) === editId) : null;

  return (
    <>
      <AdminHeader
        title="Team profiles"
        description="Public advisor profiles shown on /team. These are separate from staff logins — a person can have one, both or neither."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Panel padded={false}>
          {(rows ?? []).length === 0 ? (
            <EmptyState
              title="No public profiles yet"
              description="Add the advisors you want shown on the public team page. The /team page also displays a recruiting card linking to /careers."
            />
          ) : (
            <Table head={["Name", "Role", "Contact", "State", ""]} minWidth="42rem">
              {(rows ?? []).map((m) => (
                <tr key={String(m.id)} className="align-top hover:bg-ink-50/70">
                  <td className="px-4 py-3">
                    <p className="text-[0.8125rem] font-semibold text-ink-950">
                      {txt(m.name)}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.625rem] text-ink-400">
                      {txt(m.slug)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                    {txt(m.role_title) || "—"}
                    {m.focus ? (
                      <p className="mt-0.5 text-[0.6875rem] text-ink-400">
                        {txt(m.focus)}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[0.75rem] text-ink-600">
                    {txt(m.phone) || "—"}
                    <p className="text-[0.6875rem] text-ink-400">{txt(m.email)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={m.state === "published" ? "brand" : "warn"}>
                      {txt(m.state)}
                    </Pill>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {canWrite && (
                        <>
                          <Link
                            href={`/admin/team?edit=${m.id}`}
                            className="btn btn-outline btn-sm"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" strokeWidth={2.3} />
                          </Link>
                          <InlineAction
                            action={deleteRow}
                            fields={{ table: "team_members", id: String(m.id) }}
                            confirm={`Remove ${txt(m.name)} from the public team page?`}
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
            title={editing ? `Edit ${txt(editing.name)}` : "Add a team profile"}
            actions={
              editing ? (
                <Link href="/admin/team" className="btn btn-outline btn-sm" title="Cancel">
                  <X className="h-3.5 w-3.5" strokeWidth={2.3} />
                </Link>
              ) : null
            }
          >
            <ActionForm
              key={editId ?? "new"}
              action={saveTeamMember}
              submitLabel={editing ? "Save profile" : "Create profile"}
              resetOnSuccess={!editing}
              redirectOnSuccess={editing ? "/admin/team" : undefined}
            >
              {editing && <input type="hidden" name="id" value={String(editing.id)} />}
              <div className="space-y-4">
                <Field label="Full name" required>
                  <input
                    name="name"
                    required
                    defaultValue={txt(editing?.name)}
                    className="field"
                  />
                </Field>
                <Field label="Role title">
                  <input
                    name="role_title"
                    defaultValue={txt(editing?.role_title)}
                    className="field"
                    placeholder="Senior Property Advisor"
                  />
                </Field>
                <Field label="URL slug" hint="Leave blank to generate from the name.">
                  <input
                    name="slug"
                    defaultValue={txt(editing?.slug)}
                    className="field font-mono text-[0.8125rem]"
                  />
                </Field>
                <Field label="Bio" hint="Two or three sentences. Specific beats generic.">
                  <textarea
                    name="bio"
                    rows={5}
                    defaultValue={txt(editing?.bio)}
                    className="field resize-y"
                  />
                </Field>
                <Field label="Focus areas">
                  <input
                    name="focus"
                    defaultValue={txt(editing?.focus)}
                    className="field"
                    placeholder="Luxury residential, commercial investment, NRI mandates"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email">
                    <input name="email" defaultValue={txt(editing?.email)} className="field" />
                  </Field>
                  <Field label="Phone">
                    <input name="phone" defaultValue={txt(editing?.phone)} className="field" />
                  </Field>
                </div>
                <Field label="Photo URL" hint="Square image recommended. Initials are shown if blank.">
                  <input
                    name="photo_url"
                    defaultValue={txt(editing?.photo_url)}
                    className="field font-mono text-[0.8125rem]"
                  />
                </Field>
                <Field label="LinkedIn">
                  <input
                    name="linkedin"
                    defaultValue={txt(editing?.linkedin)}
                    className="field"
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
              </div>
            </ActionForm>
          </Panel>
        )}
      </div>
    </>
  );
}
