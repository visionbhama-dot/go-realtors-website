import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminHeader, Field, Panel, Pill } from "@/components/admin/ui";
import { addLeadNote, updateLead } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { WHATSAPP_LINK } from "@/lib/site";
import { LEAD_STATUS_LABEL, formatDateTime, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lead detail" };

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const sb = await getServerSupabase();
  const [{ data: lead }, { data: notes }, { data: staff }] = await Promise.all([
    sb!.from("leads").select("*").eq("id", id).maybeSingle(),
    sb!
      .from("lead_notes")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    sb!
      .from("profiles")
      .select("id, full_name, role")
      .eq("is_active", true)
      .order("full_name"),
  ]);

  if (!lead) notFound();

  const canWrite = user.permissions.includes("leads.write");
  const canAssign = user.permissions.includes("leads.assign");
  const phone = String(lead.phone);
  const waMessage = `Hi ${String(lead.name).split(" ")[0]}, this is GoRealtors following up on your enquiry${
    lead.project_name ? ` about ${String(lead.project_name)}` : ""
  }.`;

  return (
    <>
      <AdminHeader
        title={String(lead.name)}
        description={`Enquiry received ${formatDateTime(String(lead.created_at))} from ${String(lead.source)}`}
        back={{ href: "/admin/leads", label: "Back to leads" }}
        actions={
          <>
            <a href={`tel:${phone}`} className="btn btn-outline btn-sm">
              <Phone className="h-3.5 w-3.5" strokeWidth={2.3} />
              Call
            </a>
            <a
              href={WHATSAPP_LINK(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.3} />
              WhatsApp
            </a>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_21rem]">
        <div className="space-y-6">
          <Panel title="Enquiry details">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {[
                ["Name", String(lead.name)],
                ["Mobile", phone],
                ["Email", (lead.email as string) || "Not provided"],
                ["Project of interest", (lead.project_name as string) || "General enquiry"],
                ["Stated requirement", (lead.requirement as string) || "—"],
                ["Budget", (lead.budget as string) || "—"],
                ["Source", String(lead.source)],
                ["Submitted from", (lead.source_path as string) || "—"],
                ["Consent given", lead.consent ? "Yes" : "No"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                    {k}
                  </dt>
                  <dd className="mt-0.5 break-words text-[0.875rem] font-medium text-ink-900">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            {lead.message ? (
              <div className="mt-6 border-t border-ink-100 pt-5">
                <p className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                  Message
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-[0.875rem] leading-relaxed text-ink-700">
                  {String(lead.message)}
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2 border-t border-ink-100 pt-5">
              <a href={`tel:${phone}`} className="btn btn-outline btn-sm">
                <Phone className="h-3.5 w-3.5" strokeWidth={2.3} />
                {phone}
              </a>
              {lead.email ? (
                <a
                  href={`mailto:${lead.email}`}
                  className="btn btn-outline btn-sm"
                >
                  <Mail className="h-3.5 w-3.5" strokeWidth={2.3} />
                  Email
                </a>
              ) : null}
              {lead.project_name ? (
                <Link href="/admin/projects" className="btn btn-outline btn-sm">
                  Open project
                </Link>
              ) : null}
            </div>
          </Panel>

          {canWrite && (
            <Panel title="Add a call note" description="Visible to everyone with lead access.">
              <ActionForm
                action={addLeadNote}
                submitLabel="Save note"
                submitClassName="btn btn-dark"
                resetOnSuccess
              >
                <input type="hidden" name="lead_id" value={String(lead.id)} />
                <textarea
                  name="note"
                  rows={3}
                  required
                  placeholder="Spoke at 4pm — wants 3 BHK under ₹3.5 Cr on Dwarka Expressway, site visit Saturday."
                  className="field resize-y"
                />
              </ActionForm>
            </Panel>
          )}

          <Panel title="Activity" padded={false}>
            {(notes ?? []).length === 0 ? (
              <p className="px-5 py-8 text-center text-[0.8125rem] text-ink-500">
                No notes logged yet.
              </p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {(notes ?? []).map((n) => (
                  <li key={String(n.id)} className="px-5 py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[0.8125rem] font-bold text-ink-900">
                        {(n.author_name as string) || "Team member"}
                      </p>
                      <p className="shrink-0 text-[0.6875rem] text-ink-400">
                        {relativeTime(String(n.created_at))}
                      </p>
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap text-[0.8125rem] leading-relaxed text-ink-700">
                      {String(n.note)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Pipeline">
            {canWrite ? (
              <ActionForm action={updateLead} submitLabel="Update lead">
                <input type="hidden" name="id" value={String(lead.id)} />
                <div className="space-y-4">
                  <Field label="Stage">
                    <select
                      name="status"
                      defaultValue={String(lead.status)}
                      className="field"
                    >
                      {Object.entries(LEAD_STATUS_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Priority">
                    <select
                      name="priority"
                      defaultValue={String(lead.priority)}
                      className="field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </Field>

                  <Field
                    label="Assigned advisor"
                    hint={canAssign ? undefined : "Your role cannot reassign leads."}
                  >
                    <select
                      name="assigned_to"
                      defaultValue={(lead.assigned_to as string) ?? ""}
                      disabled={!canAssign}
                      className="field disabled:opacity-60"
                    >
                      <option value="">Unassigned</option>
                      {(staff ?? []).map((s) => (
                        <option key={String(s.id)} value={String(s.id)}>
                          {String(s.full_name)}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Budget">
                    <input
                      name="budget"
                      defaultValue={(lead.budget as string) ?? ""}
                      className="field"
                    />
                  </Field>

                  <Field label="Requirement">
                    <input
                      name="requirement"
                      defaultValue={(lead.requirement as string) ?? ""}
                      className="field"
                    />
                  </Field>

                  <Field label="Follow up on">
                    <input
                      name="follow_up_at"
                      type="date"
                      defaultValue={
                        lead.follow_up_at
                          ? String(lead.follow_up_at).slice(0, 10)
                          : ""
                      }
                      className="field"
                    />
                  </Field>
                </div>
              </ActionForm>
            ) : (
              <div className="space-y-3">
                <Pill tone="info">
                  {LEAD_STATUS_LABEL[String(lead.status)] ?? String(lead.status)}
                </Pill>
                <p className="text-[0.8125rem] text-ink-500">
                  Your role has read-only access to leads.
                </p>
              </div>
            )}
          </Panel>

          <Panel title="Attribution">
            <dl className="divide-y divide-ink-100 text-[0.8125rem]">
              {[
                ["Received", formatDateTime(String(lead.created_at))],
                ["Form source", String(lead.source)],
                ["Landing path", (lead.source_path as string) || "—"],
                ["Lead ID", String(lead.id).slice(0, 8)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 py-2">
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="truncate text-right font-semibold text-ink-900">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        </aside>
      </div>
    </>
  );
}
