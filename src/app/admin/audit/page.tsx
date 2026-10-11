import { redirect } from "next/navigation";
import { ScrollText } from "lucide-react";
import { AdminHeader, EmptyState, Panel, Pill, Table } from "@/components/admin/ui";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { formatDateTime, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Activity log" };

const TONE: Record<string, "brand" | "warn" | "danger" | "info" | "neutral"> = {
  create: "brand",
  update: "info",
  publish: "warn",
  delete: "danger",
  export: "neutral",
};

export default async function AdminAuditPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("audit.read")) {
    return (
      <EmptyState
        title="No access"
        description="Only owners, administrators and managers can view the activity log."
      />
    );
  }

  const sb = await getServerSupabase();
  const { data: rows } = await sb!
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  return (
    <>
      <AdminHeader
        title="Activity log"
        description="An append-only record of every change made through this dashboard. Entries cannot be edited or removed."
      />

      <Panel padded={false}>
        {(rows ?? []).length === 0 ? (
          <EmptyState
            icon={<ScrollText className="h-5 w-5" strokeWidth={2} />}
            title="No activity recorded yet"
            description="Creating, editing, publishing or deleting any record writes an entry here automatically."
          />
        ) : (
          <Table head={["When", "Who", "Action", "Entity", "Detail"]} minWidth="52rem">
            {(rows ?? []).map((a) => (
              <tr key={String(a.id)} className="align-top hover:bg-ink-50/70">
                <td className="whitespace-nowrap px-4 py-3">
                  <p className="text-[0.75rem] font-semibold text-ink-900">
                    {relativeTime(String(a.created_at))}
                  </p>
                  <p className="text-[0.625rem] text-ink-400">
                    {formatDateTime(String(a.created_at))}
                  </p>
                </td>
                <td className="px-4 py-3 text-[0.75rem] text-ink-700">
                  {String(a.actor_email ?? "system")}
                </td>
                <td className="px-4 py-3">
                  <Pill tone={TONE[String(a.action)] ?? "neutral"}>
                    {String(a.action)}
                  </Pill>
                </td>
                <td className="px-4 py-3 text-[0.75rem] text-ink-600">
                  {String(a.entity)}
                  {a.entity_id ? (
                    <p className="font-mono text-[0.625rem] text-ink-400">
                      {String(a.entity_id).slice(0, 18)}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[0.8125rem] text-ink-800">
                  {String(a.summary ?? "—")}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>

      <p className="mt-4 text-[0.75rem] text-ink-500">
        Showing the 300 most recent entries.
      </p>
    </>
  );
}
