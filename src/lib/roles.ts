import type { Permission, UserRole } from "@/lib/types";

/**
 * Role definitions shared by the server (enforcement) and the client
 * (hiding controls a user cannot use). Deliberately free of any server-only
 * imports so client components can read it.
 *
 * The database table `role_permissions` is the source of truth for
 * enforcement; this file mirrors it and must be kept in sync.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    "projects.read", "projects.write", "projects.publish", "projects.delete",
    "leads.read", "leads.write", "leads.assign", "leads.export",
    "blog.read", "blog.write", "blog.publish",
    "seo.read", "seo.write", "media.write",
    "team.read", "team.write", "users.read", "users.write",
    "settings.write", "audit.read",
  ],
  admin: [
    "projects.read", "projects.write", "projects.publish", "projects.delete",
    "leads.read", "leads.write", "leads.assign", "leads.export",
    "blog.read", "blog.write", "blog.publish",
    "seo.read", "seo.write", "media.write",
    "team.read", "team.write", "users.read", "users.write",
    "settings.write", "audit.read",
  ],
  manager: [
    "projects.read", "projects.write", "projects.publish",
    "leads.read", "leads.write", "leads.assign", "leads.export",
    "blog.read", "blog.write", "blog.publish",
    "seo.read", "seo.write", "media.write",
    "team.read", "team.write", "users.read", "audit.read",
  ],
  agent: ["projects.read", "leads.read", "leads.write", "blog.read", "team.read"],
  editor: [
    "projects.read", "projects.write",
    "blog.read", "blog.write", "blog.publish",
    "seo.read", "seo.write", "media.write", "team.read", "team.write",
  ],
  viewer: ["projects.read", "leads.read", "blog.read", "team.read", "seo.read"],
};

export const ROLE_LABEL: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Administrator",
  manager: "Manager",
  agent: "Sales Advisor",
  editor: "Content Editor",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTION: Record<UserRole, string> = {
  owner:
    "Full control including billing-level settings and the ability to change any other user's role.",
  admin:
    "Everything except transferring ownership — manage projects, leads, content, SEO, users and settings.",
  manager:
    "Runs the day-to-day: projects, leads, content and SEO. Can view users but not change roles.",
  agent:
    "Works their own pipeline. Reads projects, reads and updates leads assigned to them.",
  editor:
    "Content and SEO only — projects, blog posts, team profiles and page metadata. No access to leads.",
  viewer:
    "Read-only across projects, leads, blog and SEO. Useful for auditors and new joiners.",
};

export const ASSIGNABLE_ROLES: UserRole[] = [
  "admin",
  "manager",
  "agent",
  "editor",
  "viewer",
];

