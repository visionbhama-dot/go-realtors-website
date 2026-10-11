import { getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Permission, UserRole } from "@/lib/types";
import {
  ASSIGNABLE_ROLES,
  ROLE_DESCRIPTION,
  ROLE_LABEL,
  ROLE_PERMISSIONS,
} from "@/lib/roles";

export { ASSIGNABLE_ROLES, ROLE_DESCRIPTION, ROLE_LABEL, ROLE_PERMISSIONS };

/**
 * Mirrors the role_permissions table in the database. The database is the
 * source of truth for enforcement (RLS); this copy exists so the UI can hide
 * controls the current user cannot use without an extra round trip.
 */
export type StaffUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string | null;
  jobTitle: string | null;
  isActive: boolean;
  permissions: Permission[];
};

/** Returns the signed-in staff profile, or null if not authenticated. */
export async function getCurrentUser(): Promise<StaffUser | null> {
  if (!isSupabaseConfigured) return null;
  const sb = await getServerSupabase();
  if (!sb) return null;

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data: profile } = await sb
    .from("profiles")
    .select("id, email, full_name, role, phone, job_title, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    // Auth user exists but the profile trigger has not run yet.
    return {
      id: user.id,
      email: user.email ?? "",
      fullName: user.email?.split("@")[0] ?? "New user",
      role: "viewer",
      phone: null,
      jobTitle: null,
      isActive: true,
      permissions: ROLE_PERMISSIONS.viewer,
    };
  }

  const role = (profile.role as UserRole) ?? "viewer";
  return {
    id: String(profile.id),
    email: String(profile.email),
    fullName: String(profile.full_name || profile.email),
    role,
    phone: (profile.phone as string) ?? null,
    jobTitle: (profile.job_title as string) ?? null,
    isActive: Boolean(profile.is_active),
    permissions: ROLE_PERMISSIONS[role] ?? [],
  };
}

export function can(
  user: StaffUser | null,
  permission: Permission,
): boolean {
  if (!user || !user.isActive) return false;
  return user.permissions.includes(permission);
}

/** Throws if the current user lacks the permission. Use inside server actions. */
export async function requirePermission(
  permission: Permission,
): Promise<StaffUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated. Please sign in again.");
  if (!user.isActive) throw new Error("This account has been deactivated.");
  if (!can(user, permission)) {
    throw new Error(
      `Your role (${ROLE_LABEL[user.role]}) does not permit this action.`,
    );
  }
  return user;
}
