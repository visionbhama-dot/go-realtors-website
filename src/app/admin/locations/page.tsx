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
import { deleteRow, saveLocality } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Locations" };

const txt = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export default async function AdminLocationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("projects.read")) {
    return <EmptyState title="No access" description="Your role cannot view locations." />;
  }

  const sp = await searchParams;
  const editId = Array.isArray(sp.edit) ? sp.edit[0] : sp.edit;
  const canWrite = user.permissions.includes("projects.write");

  const sb = await getServerSupabase();
  const [{ data: rows }, { data: counts }] = await Promise.all([
    sb!.from("localities").select("*").order("sort_order").order("name"),
    sb!.from("projects").select("locality_name"),
  ]);

  const tally = new Map<string, number>();
  ((counts ?? []) as { locality_name: string }[]).forEach((p) =>
    tally.set(p.locality_name, (tally.get(p.locality_name) ?? 0) + 1),
  );

  const editing = editId ? (rows ?? []).find((r) => String(r.id) === editId) : null;

  return (
    <>
      <AdminHeader
        title="Locations & corridors"
        description="Micro-market guide pages at /locations/[slug]. Project records link to these by exact name match."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Panel padded={false}>
          {(rows ?? []).length === 0 ? (
            <EmptyState
              title="No locations yet"
              description="Run supabase/seed.sql to import the six corridor guides, or add one using the form."
            />
          ) : (
            <Table
              head={["Corridor", "City", "Price / sq.ft.", "Projects", "State", ""]}
              minWidth="46rem"
            >
              {(rows ?? []).map((l) => (
                <tr key={String(l.id)} className="hover:bg-ink-50/70">
                  <td className="px-4 py-3">
                    <p className="text-[0.8125rem] font-semibold text-ink-950">
                      {txt(l.name)}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.625rem] text-ink-400">
                      /locations/{txt(l.slug)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                    {txt(l.city)}
                  </td>
                  <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                    {txt(l.price_band) || "—"}
                  </td>
                  <td className="px-4 py-3 text-[0.8125rem] font-semibold tabular-nums text-ink-900">
                    {tally.get(txt(l.name)) ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={l.state === "published" ? "brand" : "warn"}>
                      {txt(l.state)}
                    </Pill>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {canWrite && (
                        <>
                          <Link
                            href={`/admin/locations?edit=${l.id}`}
                            className="btn btn-outline btn-sm"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" strokeWidth={2.3} />
                          </Link>
                          <InlineAction
                            action={deleteRow}
                            fields={{ table: "localities", id: String(l.id) }}
                            confirm={`Delete the ${txt(l.name)} corridor guide?`}
                            label={<Trash2 className="h-3.5 w-3.5" strokeWidth={2.3} />}
                            className="btn btn-outline btn-sm text-red-600 hover:border-red-300 hover:bg-red-50"
                            title="Delete"
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
            title={editing ? `Edit ${txt(editing.name)}` : "Add a location"}
            actions={
              editing ? (
                <Link href="/admin/locations" className="btn btn-outline btn-sm" title="Cancel">
                  <X className="h-3.5 w-3.5" strokeWidth={2.3} />
                </Link>
              ) : null
            }
          >
            <ActionForm
              key={editId ?? "new"}
              action={saveLocality}
              submitLabel={editing ? "Save location" : "Create location"}
              resetOnSuccess={!editing}
              redirectOnSuccess={editing ? "/admin/locations" : undefined}
            >
              {editing && <input type="hidden" name="id" value={String(editing.id)} />}
              <div className="space-y-4">
                <Field label="Name" required>
                  <input
                    name="name"
                    required
                    defaultValue={txt(editing?.name)}
                    className="field"
                    placeholder="Dwarka Expressway"
                  />
                </Field>
                <Field label="URL slug" hint="Leave blank to generate from the name.">
                  <input
                    name="slug"
                    defaultValue={txt(editing?.slug)}
                    className="field font-mono text-[0.8125rem]"
                  />
                </Field>
                <Field label="City">
                  <input
                    name="city"
                    defaultValue={txt(editing?.city) || "Gurugram"}
                    className="field"
                  />
                </Field>
                <Field label="Short blurb" hint="One line used on cards and in the mega-menu.">
                  <textarea
                    name="blurb"
                    rows={2}
                    defaultValue={txt(editing?.blurb)}
                    className="field resize-y"
                  />
                </Field>
                <Field
                  label="Full description"
                  hint="The main body of the corridor guide. Be specific about infrastructure and trade-offs."
                >
                  <textarea
                    name="description"
                    rows={7}
                    defaultValue={txt(editing?.description)}
                    className="field resize-y"
                  />
                </Field>
                <Field label="Highlights" hint="One per line.">
                  <textarea
                    name="highlights"
                    rows={5}
                    defaultValue={
                      Array.isArray(editing?.highlights)
                        ? (editing!.highlights as string[]).join("\n")
                        : ""
                    }
                    className="field resize-y"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Price band" hint="Keep it short, e.g. “₹11K - ₹18.5K”.">
                    <input
                      name="price_band"
                      defaultValue={txt(editing?.price_band)}
                      className="field"
                    />
                  </Field>
                  <Field label="Outlook">
                    <input
                      name="growth"
                      defaultValue={txt(editing?.growth)}
                      className="field"
                      placeholder="High appreciation potential"
                    />
                  </Field>
                </div>
                <Field label="Hero image">
                  <input
                    name="hero_image"
                    defaultValue={txt(editing?.hero_image)}
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
    </>
  );
}
