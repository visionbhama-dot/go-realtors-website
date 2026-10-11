import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY,
  SUPABASE_URL,
  hasServiceRole,
  isSupabaseConfigured,
} from "./config";

/** Request-scoped client that reads/writes the auth cookie. */
export async function getServerSupabase() {
  if (!isSupabaseConfigured) return null;
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          // called from a Server Component render pass - safe to ignore,
          // middleware refreshes the session instead.
        }
      },
    },
  });
}

/** Read-only client for public pages. No cookie mutation, cacheable. */
export function getPublicSupabase() {
  if (!isSupabaseConfigured) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Service-role client. Bypasses RLS — only ever call this from server
 * actions or route handlers after an explicit permission check.
 */
export function getAdminSupabase() {
  if (!hasServiceRole) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
