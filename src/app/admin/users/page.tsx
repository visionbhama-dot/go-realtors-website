import { Fragment } from "react";
import { redirect } from "next/navigation";
import { Check, Minus, ShieldAlert, UserPlus } from "lucide-react";
import { ActionForm, InlineAction } from "@/components/admin/ActionForm";
import {
  AdminHeader,
  EmptyState,
  Field,
  Panel,
  Pill,
  Table,
} from "@/components/admin/ui";
import { inviteUser, setUserActive, updateUserRole } from "@/app/actions/admin";
import {
  ASSIGNABLE_ROLES,
  ROLE_DESCRIPTION,
  ROLE_LABEL,
  ROLE_PERMISSIONS,
  getCurrentUser,
} from "@/lib/auth";
import { hasServiceRole } from "@/lib/supabase/config";
import { getServerSupabase } from "@/lib/supabase/server";
import type { Permission, UserRole } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team & access" };

const PERMISSION_GROUPS: { label: string; permissions: Permission[] }[] = [
  {
    label: "Projects",
    permissions: ["projects.read", "projects.write", "projects.publish", "projects.delete"],
  },
  {
    label: "Leads",
    permissions: ["leads.read", "leads.write", "leads.assign", "leads.export"],
  },
  { label: "Content", permissions: ["blog.read", "blog.write", "blog.publish", "media.write"] },
  { label: "SEO", permissions: ["seo.read", "seo.write"] },
  { label: "People", permissions: ["team.read", "team.write", "users.read", "users.write"] },
  { label: "System", permissions: ["settings.write", "audit.read"] },
];

const PERMISSION_LABEL: Record<string, string> = {
  "projects.read": "View projects",
  "projects.write": "Create & edit projects",
  "projects.publish": "Publish projects",
  "projects.delete": "Delete projects",
  "leads.read": "View leads",
  "leads.write": "Update leads & notes",
  "leads.assign": "Assign leads",
  "leads.export": "Export leads",
  "blog.read": "View posts",
  "blog.write": "Write & edit posts",
  "blog.publish": "Publish posts",
  "media.write": "Upload media",
  "seo.read": "View SEO settings",
  "seo.write": "Edit SEO settings",
  "team.read": "View team profiles",
  "team.write": "Edit team & testimonials",
  "users.read": "View staff accounts",
  "users.write": "Invite & manage accounts",
  "settings.write": "Edit site settings",
  "audit.read": "View activity log",
};

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("users.read")) {
    return (
      <EmptyState
        title="No access"
        description="Only owners, administrators and managers can view staff accounts."
      />
    );
  }

  const canManage = user.permissions.includes("users.write");
  const sb = await getServerSupabase();
  const { data: rows } = await sb!
    .from("profiles")
    .select("id, email, full_name, role, job_title, phone, is_active, last_seen_at, created_at")
    .order("created_at");

  return (
    <>
      <AdminHeader
        title="Team & access"
        description="Create logins for your team and control exactly what each person can do. Permissions are enforced in the database, not just in this interface."
      />

      {canManage && !hasServiceRole && (
        <div className="mb-6 flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4">
          <ShieldAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-700" strokeWidth={2.2} />
          <div>
            <p className="text-[0.8125rem] font-bold text-amber-900">
              Service role key not configured
            </p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-amber-800">
              Accounts cannot be created from this screen until{" "}
              <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> is set.
              Until then, add users in Supabase &gt; Authentication &gt; Users; they
              will appear here automatically and you can set their role below.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Panel
            title="Staff accounts"
            description={`${(rows ?? []).length} ${(rows ?? []).length === 1 ? "account" : "accounts"}`}
            padded={false}
          >
            {(rows ?? []).length === 0 ? (
              <EmptyState
                title="No staff accounts yet"
                description="The first account created in Supabase automatically becomes the Owner."
              />
            ) : (
              <Table
                head={["Member", "Role", "Status", "Added", canManage ? "Actions" : ""]}
                minWidth="48rem"
              >
                {(rows ?? []).map((p) => {
                  const role = String(p.role) as UserRole;
                  const isSelf = String(p.id) === user.id;
                  const isOwner = role === "owner";
                  return (
                    <tr key={String(p.id)} className="align-top hover:bg-ink-50/70">
                      <td className="px-4 py-3">
                        <p className="text-[0.8125rem] font-semibold text-ink-950">
                          {String(p.full_name)}
                          {isSelf && (
                            <span className="ml-1.5 text-[0.6875rem] font-normal text-ink-400">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="text-[0.6875rem] text-ink-500">{String(p.email)}</p>
                        {p.job_title ? (
                          <p className="text-[0.6875rem] text-ink-400">
                            {String(p.job_title)}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        {canManage && !isSelf && !isOwner ? (
                          <ActionForm
                            action={updateUserRole}
                            submitLabel="Update"
                            submitClassName="btn btn-outline btn-sm"
                            pendingLabel="Saving…"
                            inlineFeedback={false}
                            className="space-y-2"
                          >
                            <input type="hidden" name="id" value={String(p.id)} />
                            <select
                              name="role"
                              defaultValue={role}
                              className="field h-8 py-0 text-[0.75rem]"
                            >
                              {ASSIGNABLE_ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {ROLE_LABEL[r]}
                                </option>
                              ))}
                            </select>
                          </ActionForm>
                        ) : (
                          <Pill tone={isOwner ? "brand" : "neutral"}>
                            {ROLE_LABEL[role] ?? role}
                          </Pill>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Pill tone={p.is_active ? "brand" : "danger"}>
                          {p.is_active ? "Active" : "Disabled"}
                        </Pill>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[0.75rem] text-ink-500">
                        {relativeTime(String(p.created_at))}
                      </td>
                      {canManage && (
                        <td className="px-4 py-3">
                          {!isSelf && !isOwner ? (
                            <InlineAction
                              action={setUserActive}
                              fields={{
                                id: String(p.id),
                                active: p.is_active ? "false" : "true",
                              }}
                              confirm={
                                p.is_active
                                  ? `Disable ${String(p.full_name)}'s access? They will be unable to sign in or read any data.`
                                  : undefined
                              }
                              label={p.is_active ? "Disable" : "Re-enable"}
                              className={
                                p.is_active
                                  ? "btn btn-outline btn-sm text-red-600 hover:border-red-300 hover:bg-red-50"
                                  : "btn btn-outline btn-sm"
                              }
                            />
                          ) : (
                            <span className="text-[0.75rem] text-ink-300">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </Table>
            )}
          </Panel>

          {/* permission matrix */}
          <Panel
            title="Permission matrix"
            description="What each role can do. Enforced by row-level security in Postgres."
            padded={false}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" style={{ minWidth: "52rem" }}>
                <thead>
                  <tr className="border-b border-ink-200 bg-ink-50/80">
                    <th className="px-4 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ink-500">
                      Capability
                    </th>
                    {(["owner", ...ASSIGNABLE_ROLES] as UserRole[]).map((r) => (
                      <th
                        key={r}
                        className="px-3 py-2.5 text-center text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ink-500"
                      >
                        {ROLE_LABEL[r]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {PERMISSION_GROUPS.map((g) => (
                    <Fragment key={g.label}>
                      <tr className="bg-ink-50/50">
                        <td
                          colSpan={7}
                          className="px-4 py-1.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-ink-500"
                        >
                          {g.label}
                        </td>
                      </tr>
                      {g.permissions.map((perm) => (
                        <tr key={perm}>
                          <td className="px-4 py-2 text-[0.8125rem] text-ink-700">
                            {PERMISSION_LABEL[perm] ?? perm}
                          </td>
                          {(["owner", ...ASSIGNABLE_ROLES] as UserRole[]).map((r) => (
                            <td key={r} className="px-3 py-2 text-center">
                              {ROLE_PERMISSIONS[r].includes(perm) ? (
                                <Check
                                  className="mx-auto h-4 w-4 text-brand-600"
                                  strokeWidth={2.6}
                                  aria-label="allowed"
                                />
                              ) : (
                                <Minus
                                  className="mx-auto h-3.5 w-3.5 text-ink-300"
                                  strokeWidth={2.6}
                                  aria-label="not allowed"
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          {canManage && (
            <Panel title="Invite a team member">
              <ActionForm
                action={inviteUser}
                submitLabel="Create account"
                submitClassName="btn btn-primary"
                resetOnSuccess
              >
                <div className="space-y-4">
                  <Field label="Full name" required>
                    <input name="fullName" required className="field" placeholder="Priya Sharma" />
                  </Field>
                  <Field label="Work email" required>
                    <input
                      name="email"
                      type="email"
                      required
                      className="field"
                      placeholder="priya@gorealtors.in"
                    />
                  </Field>
                  <Field label="Role" required hint="You can change this later.">
                    <select name="role" defaultValue="agent" className="field">
                      {ASSIGNABLE_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Job title">
                    <input name="jobTitle" className="field" placeholder="Senior Property Advisor" />
                  </Field>
                  <Field label="Mobile">
                    <input name="phone" className="field" />
                  </Field>
                  <Field
                    label="Temporary password"
                    required
                    hint="At least 10 characters. Share it securely and ask them to change it from My profile after signing in."
                  >
                    <input
                      name="password"
                      type="text"
                      required
                      minLength={10}
                      className="field font-mono text-[0.8125rem]"
                      placeholder="e.g. Gurugram-2026!"
                    />
                  </Field>
                </div>
              </ActionForm>
            </Panel>
          )}

          <Panel title="Role guide">
            <dl className="space-y-4">
              {(["owner", ...ASSIGNABLE_ROLES] as UserRole[]).map((r) => (
                <div key={r}>
                  <dt className="flex items-center gap-2 text-[0.8125rem] font-bold text-ink-900">
                    <UserPlus className="h-3.5 w-3.5 text-brand-600" strokeWidth={2.3} />
                    {ROLE_LABEL[r]}
                  </dt>
                  <dd className="mt-1 text-[0.75rem] leading-relaxed text-ink-600">
                    {ROLE_DESCRIPTION[r]}
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
