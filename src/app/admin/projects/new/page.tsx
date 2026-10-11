import { redirect } from "next/navigation";
import { AdminHeader, EmptyState } from "@/components/admin/ui";
import { EMPTY_PROJECT, ProjectForm } from "@/components/admin/ProjectForm";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("projects.write")) {
    return (
      <EmptyState
        title="No access"
        description="Your role does not include permission to create projects."
      />
    );
  }

  const sb = await getServerSupabase();
  const [devs, locs] = await Promise.all([
    sb!.from("developers").select("name").order("name"),
    sb!.from("localities").select("name").order("name"),
  ]);

  return (
    <>
      <AdminHeader
        title="New project"
        description="Create a project record. Save it as a draft while you fill in content, then publish when it's ready."
        back={{ href: "/admin/projects", label: "Back to projects" }}
      />
      <ProjectForm
        initial={EMPTY_PROJECT}
        developers={(devs.data ?? []).map((d) => String(d.name))}
        localities={(locs.data ?? []).map((l) => String(l.name))}
        canPublish={user.permissions.includes("projects.publish")}
      />
    </>
  );
}
