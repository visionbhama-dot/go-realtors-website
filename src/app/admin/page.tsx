import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  FileText,
  MessageSquareQuote,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { SetupScreen } from "@/components/admin/SetupScreen";
import {
  AdminHeader,
  EmptyState,
  Panel,
  Pill,
  StatCard,
  Table,
} from "@/components/admin/ui";
import { getCurrentUser } from "@/lib/auth";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { getServerSupabase } from "@/lib/supabase/server";
import { LEAD_STATUS_LABEL, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!isSupabaseConfigured) {
    return (
      <SetupScreen
        hasUrl={Boolean(SUPABASE_URL)}
        hasAnon={Boolean(SUPABASE_ANON_KEY)}
        hasService={Boolean(SUPABASE_SERVICE_KEY)}
      />
    );
  }

  const user = await getCurrentUser();
  const sb = await getServerSupabase();
  if (!user || !sb) {
    return (
      <SetupScreen
        hasUrl={Boolean(SUPABASE_URL)}
        hasAnon={Boolean(SUPABASE_ANON_KEY)}
        hasService={Boolean(SUPABASE_SERVICE_KEY)}
      />
    );
  }

  const canLeads = user.permissions.includes("leads.read");

  const [counts, recentLeads, recentProjects, statusRows] = await Promise.all([
    sb.from("dashboard_counts").select("*").maybeSingle(),
    canLeads
      ? sb
          .from("leads")
          .select("id, name, phone, project_name, status, source, created_at")
          .order("created_at", { ascending: false })
          .limit(8)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
    sb
      .from("projects")
      .select("id, slug, name, locality_name, state, updated_at")
      .order("updated_at", { ascending: false })
      .limit(6),
    canLeads
      ? sb.from("leads").select("status")
      : Promise.resolve({ data: [] as { status: string }[] }),
  ]);

  const c = (counts.data ?? {}) as Record<string, number>;
  const byStatus = new Map<string, number>();
  ((statusRows.data ?? []) as { status: string }[]).forEach((r) =>
    byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1),
  );

  const unseeded =
    (c.published_projects ?? 0) === 0 && (c.draft_projects ?? 0) === 0;

  return (
    <>
      <AdminHeader
        title={`Welcome back, ${user.fullName.split(" ")[0]}`}
        description="A live view of inventory, pipeline and content. Figures update as your team works."
        actions={
          user.permissions.includes("projects.write") ? (
            <Link href="/admin/projects/new" className="btn btn-primary btn-sm">
              <Plus className="h-4 w-4" strokeWidth={2.4} />
              New project
            </Link>
          ) : null
        }
      />

      {unseeded && (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-5">
          <h2 className="text-[0.875rem] font-bold text-amber-900">
            Database connected, but empty
          </h2>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-amber-800">
            No projects found in the database. Run{" "}
            <code className="font-mono">supabase/seed.sql</code> in the Supabase
            SQL Editor to import all 21 projects, 18 developers, 6 corridors and
            the blog archive. Until then the public site continues rendering
            from the bundled content, so visitors see no disruption.
          </p>
        </div>
      )}

      {/* stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Published projects"
          value={c.published_projects ?? 0}
          sub={`${c.draft_projects ?? 0} in draft`}
          href="/admin/projects"
        />
        {canLeads && (
          <>
            <StatCard
              label="New leads"
              value={c.new_leads ?? 0}
              sub={`${c.leads_7d ?? 0} in the last 7 days`}
              tone="brand"
              href="/admin/leads?status=new"
            />
            <StatCard
              label="Total leads"
              value={c.total_leads ?? 0}
              sub={`${c.won_leads ?? 0} marked won`}
              href="/admin/leads"
            />
          </>
        )}
        <StatCard
          label="Published posts"
          value={c.published_posts ?? 0}
          sub={`${c.subscribers ?? 0} newsletter subscribers`}
          href="/admin/blog"
        />
        {!canLeads && (
          <StatCard
            label="Active team members"
            value={c.active_users ?? 0}
            sub="Staff with dashboard access"
          />
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* recent leads */}
        {canLeads ? (
          <Panel
            title="Latest enquiries"
            description="Newest submissions from across the website"
            padded={false}
            actions={
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-1 text-[0.75rem] font-bold text-brand-700 hover:underline"
              >
                View all
                <ArrowUpRight className="h-3 w-3" strokeWidth={2.6} />
              </Link>
            }
          >
            {(recentLeads.data ?? []).length === 0 ? (
              <EmptyState
                icon={<MessageSquareQuote className="h-5 w-5" strokeWidth={2} />}
                title="No enquiries yet"
                description="Submissions from the website's enquiry forms will appear here the moment they arrive."
              />
            ) : (
              <Table head={["Name", "Interest", "Source", "Status", "Received"]}>
                {(recentLeads.data as Record<string, unknown>[]).map((l) => (
                  <tr key={String(l.id)} className="hover:bg-ink-50/70">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${l.id}`}
                        className="text-[0.8125rem] font-semibold text-ink-950 hover:text-brand-700"
                      >
                        {String(l.name)}
                      </Link>
                      <p className="text-[0.6875rem] text-ink-400">
                        {String(l.phone)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                      {(l.project_name as string) || "General enquiry"}
                    </td>
                    <td className="px-4 py-3 text-[0.75rem] text-ink-500">
                      {String(l.source)}
                    </td>
                    <td className="px-4 py-3">
                      <Pill
                        tone={
                          l.status === "new"
                            ? "info"
                            : l.status === "won"
                              ? "brand"
                              : l.status === "lost"
                                ? "neutral"
                                : "warn"
                        }
                      >
                        {LEAD_STATUS_LABEL[String(l.status)] ?? String(l.status)}
                      </Pill>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[0.75rem] text-ink-500">
                      {relativeTime(String(l.created_at))}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </Panel>
        ) : (
          <Panel title="Recently edited projects" padded={false}>
            <ProjectList rows={recentProjects.data ?? []} />
          </Panel>
        )}

        <div className="space-y-6">
          {/* pipeline */}
          {canLeads && (
            <Panel title="Pipeline by stage">
              {byStatus.size === 0 ? (
                <p className="py-4 text-[0.8125rem] text-ink-500">
                  No leads to summarise yet.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {Object.keys(LEAD_STATUS_LABEL).map((status) => {
                    const n = byStatus.get(status) ?? 0;
                    const total = c.total_leads || 1;
                    const pct = Math.round((n / total) * 100);
                    return (
                      <li key={status}>
                        <div className="flex items-baseline justify-between text-[0.75rem]">
                          <span className="font-semibold text-ink-700">
                            {LEAD_STATUS_LABEL[status]}
                          </span>
                          <span className="tabular-nums text-ink-500">
                            {n} · {pct}%
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
                          <div
                            className="h-full rounded-full bg-brand-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          )}

          {/* shortcuts */}
          <Panel title="Quick actions">
            <div className="grid gap-2">
              {[
                {
                  label: "Add a project",
                  href: "/admin/projects/new",
                  Icon: Building2,
                  perm: "projects.write",
                },
                {
                  label: "Write a blog post",
                  href: "/admin/blog/new",
                  Icon: FileText,
                  perm: "blog.write",
                },
                {
                  label: "Edit page SEO",
                  href: "/admin/seo",
                  Icon: TrendingUp,
                  perm: "seo.read",
                },
                {
                  label: "Invite a team member",
                  href: "/admin/users",
                  Icon: Users,
                  perm: "users.write",
                },
              ]
                .filter((a) =>
                  user.permissions.includes(a.perm as never),
                )
                .map(({ label, href, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 rounded-sm border border-ink-200 px-3 py-2.5 text-[0.8125rem] font-semibold text-ink-800 transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
                  >
                    <Icon className="h-4 w-4 text-brand-600" strokeWidth={2.2} />
                    {label}
                  </Link>
                ))}
            </div>
          </Panel>
        </div>
      </div>

      {canLeads && (
        <Panel
          className="mt-6"
          title="Recently edited projects"
          padded={false}
          actions={
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1 text-[0.75rem] font-bold text-brand-700 hover:underline"
            >
              Manage projects
              <ArrowUpRight className="h-3 w-3" strokeWidth={2.6} />
            </Link>
          }
        >
          <ProjectList rows={recentProjects.data ?? []} />
        </Panel>
      )}
    </>
  );
}

function ProjectList({ rows }: { rows: Record<string, unknown>[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="h-5 w-5" strokeWidth={2} />}
        title="No projects in the database"
        description="Run the seed script, or add your first project manually."
        action={
          <Link href="/admin/projects/new" className="btn btn-primary btn-sm">
            <Plus className="h-4 w-4" strokeWidth={2.4} />
            Add project
          </Link>
        }
      />
    );
  }
  return (
    <Table head={["Project", "Corridor", "State", "Last edited"]} minWidth="34rem">
      {rows.map((p) => (
        <tr key={String(p.id)} className="hover:bg-ink-50/70">
          <td className="px-4 py-3">
            <Link
              href={`/admin/projects/${p.id}`}
              className="text-[0.8125rem] font-semibold text-ink-950 hover:text-brand-700"
            >
              {String(p.name)}
            </Link>
          </td>
          <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
            {(p.locality_name as string) || "—"}
          </td>
          <td className="px-4 py-3">
            <Pill tone={p.state === "published" ? "brand" : "warn"}>
              {String(p.state)}
            </Pill>
          </td>
          <td className="whitespace-nowrap px-4 py-3 text-[0.75rem] text-ink-500">
            {relativeTime(String(p.updated_at))}
          </td>
        </tr>
      ))}
    </Table>
  );
}
