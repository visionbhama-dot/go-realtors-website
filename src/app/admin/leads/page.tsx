import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquareQuote } from "lucide-react";
import {
  AdminHeader,
  EmptyState,
  Panel,
  Pill,
  StatCard,
  Table,
} from "@/components/admin/ui";
import { ExportLeadsButton } from "@/components/admin/ExportLeadsButton";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { LEAD_STATUS_LABEL, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads" };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("leads.read")) {
    return (
      <EmptyState
        title="No access"
        description="Your role does not include access to the lead pipeline."
      />
    );
  }

  const sp = await searchParams;
  const status = one(sp.status) ?? "";
  const mine = one(sp.mine) === "1";
  const q = one(sp.q) ?? "";

  const sb = await getServerSupabase();

  let query = sb!
    .from("leads")
    .select(
      "id, name, phone, email, project_name, requirement, budget, status, priority, source, assigned_to, created_at, follow_up_at",
    )
    .order("created_at", { ascending: false })
    .limit(300);

  if (status) query = query.eq("status", status);
  if (mine) query = query.eq("assigned_to", user.id);
  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`);

  const [{ data, error }, allStatuses, staff] = await Promise.all([
    query,
    sb!.from("leads").select("status"),
    sb!.from("profiles").select("id, full_name").eq("is_active", true),
  ]);

  const rows = data ?? [];
  const staffMap = new Map(
    (staff.data ?? []).map((s) => [String(s.id), String(s.full_name)]),
  );

  const counts = new Map<string, number>();
  ((allStatuses.data ?? []) as { status: string }[]).forEach((r) =>
    counts.set(r.status, (counts.get(r.status) ?? 0) + 1),
  );
  const total = (allStatuses.data ?? []).length;

  const chips = [
    { label: `All (${total})`, href: "/admin/leads", active: !status && !mine },
    ...Object.entries(LEAD_STATUS_LABEL).map(([key, label]) => ({
      label: `${label} (${counts.get(key) ?? 0})`,
      href: `/admin/leads?status=${key}`,
      active: status === key,
    })),
    { label: "Assigned to me", href: "/admin/leads?mine=1", active: mine },
  ];

  return (
    <>
      <AdminHeader
        title="Lead pipeline"
        description="Every enquiry submitted through the website, with the page it came from. Update stage, assign an owner and log call notes."
        actions={
          user.permissions.includes("leads.export") ? <ExportLeadsButton /> : null
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total leads" value={total} />
        <StatCard label="New" value={counts.get("new") ?? 0} tone="brand" />
        <StatCard
          label="In progress"
          value={
            (counts.get("contacted") ?? 0) +
            (counts.get("qualified") ?? 0) +
            (counts.get("site-visit") ?? 0) +
            (counts.get("negotiation") ?? 0)
          }
        />
        <StatCard label="Won" value={counts.get("won") ?? 0} tone="dark" />
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <Link
              key={c.href + c.label}
              href={c.href}
              className={c.active ? "chip chip-active" : "chip"}
            >
              {c.label}
            </Link>
          ))}
        </div>
        <form action="/admin/leads" className="flex gap-2">
          <label htmlFor="lq" className="sr-only">
            Search leads
          </label>
          <input
            id="lq"
            name="q"
            defaultValue={q}
            placeholder="Name, phone or email…"
            className="field h-9 w-full lg:w-60"
          />
          <button type="submit" className="btn btn-outline btn-sm">
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-[0.8125rem] text-red-700">
          {error.message}
        </div>
      )}

      <Panel padded={false}>
        {rows.length === 0 ? (
          <EmptyState
            icon={<MessageSquareQuote className="h-5 w-5" strokeWidth={2} />}
            title="No leads here"
            description={
              status || q || mine
                ? "No leads match these filters."
                : "Enquiries submitted through any form on the website appear here instantly."
            }
          />
        ) : (
          <Table
            head={[
              "Contact",
              "Interest",
              "Budget",
              "Source",
              "Owner",
              "Stage",
              "Priority",
              "Received",
            ]}
            minWidth="66rem"
          >
            {rows.map((l) => (
              <tr key={String(l.id)} className="align-top hover:bg-ink-50/70">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${l.id}`}
                    className="text-[0.8125rem] font-semibold text-ink-950 hover:text-brand-700"
                  >
                    {String(l.name)}
                  </Link>
                  <p className="mt-0.5 text-[0.6875rem] text-ink-500">
                    <a href={`tel:${l.phone}`} className="hover:text-brand-700">
                      {String(l.phone)}
                    </a>
                  </p>
                  {l.email ? (
                    <p className="text-[0.6875rem] text-ink-400">{String(l.email)}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                  {(l.project_name as string) || "General enquiry"}
                  {l.requirement ? (
                    <p className="mt-0.5 text-[0.6875rem] text-ink-400">
                      {String(l.requirement)}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                  {(l.budget as string) || "—"}
                </td>
                <td className="px-4 py-3 text-[0.75rem] text-ink-500">
                  {String(l.source)}
                </td>
                <td className="px-4 py-3 text-[0.8125rem] text-ink-700">
                  {l.assigned_to
                    ? (staffMap.get(String(l.assigned_to)) ?? "Unknown")
                    : "Unassigned"}
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
                <td className="px-4 py-3">
                  <Pill
                    tone={
                      l.priority === "high"
                        ? "danger"
                        : l.priority === "low"
                          ? "neutral"
                          : "warn"
                    }
                  >
                    {String(l.priority)}
                  </Pill>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[0.75rem] text-ink-500">
                  {relativeTime(String(l.created_at))}
                  {l.follow_up_at ? (
                    <p className="mt-0.5 text-[0.6875rem] font-semibold text-amber-700">
                      Follow up{" "}
                      {new Date(String(l.follow_up_at)).toLocaleDateString("en-IN")}
                    </p>
                  ) : null}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>

      <p className="mt-4 text-[0.75rem] text-ink-500">
        Showing {rows.length} of {total} leads. Lists are capped at the 300 most
        recent — use the filters or export to CSV for the full history.
      </p>
    </>
  );
}
