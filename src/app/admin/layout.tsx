import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | GoRealtors CMS" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // The login route renders standalone, and the setup screen needs to render
  // before any database exists — both bypass the shell.
  if (!isSupabaseConfigured || !user) {
    return <>{children}</>;
  }

  let newLeads = 0;
  if (user.permissions.includes("leads.read")) {
    const sb = await getServerSupabase();
    const { count } = await sb!
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    newLeads = count ?? 0;
  }

  return (
    <AdminShell
      user={{
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      }}
      newLeads={newLeads}
    >
      {children}
    </AdminShell>
  );
}
