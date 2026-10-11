import { redirect } from "next/navigation";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminHeader, Field, Panel, Pill } from "@/components/admin/ui";
import { changeOwnPassword, updateOwnProfile } from "@/app/actions/admin";
import {
  ROLE_DESCRIPTION,
  ROLE_LABEL,
  getCurrentUser,
} from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "My profile" };

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

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <>
      <AdminHeader
        title="My profile"
        description="Update your details and change your password."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Panel title="Your details">
            <ActionForm action={updateOwnProfile} submitLabel="Save details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required className="sm:col-span-2">
                  <input
                    name="fullName"
                    required
                    defaultValue={user.fullName}
                    className="field"
                  />
                </Field>
                <Field label="Job title">
                  <input
                    name="jobTitle"
                    defaultValue={user.jobTitle ?? ""}
                    className="field"
                    placeholder="Senior Property Advisor"
                  />
                </Field>
                <Field label="Mobile">
                  <input name="phone" defaultValue={user.phone ?? ""} className="field" />
                </Field>
                <Field
                  label="Email"
                  className="sm:col-span-2"
                  hint="Your sign-in email cannot be changed here. Ask an administrator if it needs updating."
                >
                  <input value={user.email} disabled className="field opacity-60" />
                </Field>
              </div>
            </ActionForm>
          </Panel>

          <Panel
            title="Change password"
            description="Choose at least 10 characters. You will stay signed in on this device."
          >
            <ActionForm
              action={changeOwnPassword}
              submitLabel="Change password"
              submitClassName="btn btn-dark"
              resetOnSuccess
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="New password" required>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={10}
                    autoComplete="new-password"
                    className="field"
                  />
                </Field>
                <Field label="Confirm new password" required>
                  <input
                    name="confirm"
                    type="password"
                    required
                    minLength={10}
                    autoComplete="new-password"
                    className="field"
                  />
                </Field>
              </div>
            </ActionForm>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Access level">
            <Pill tone="brand">{ROLE_LABEL[user.role]}</Pill>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-600">
              {ROLE_DESCRIPTION[user.role]}
            </p>
            <p className="mt-4 text-[0.6875rem] text-ink-400">
              Only an administrator can change your role.
            </p>
          </Panel>

          <Panel title={`Your permissions (${user.permissions.length})`}>
            <ul className="space-y-1.5">
              {user.permissions.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2 text-[0.75rem] text-ink-700"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-600"
                  />
                  {PERMISSION_LABEL[p] ?? p}
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </>
  );
}
