export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * The public site is designed to render from bundled seed content when
 * Supabase has not been wired up yet. Once these env vars exist, every
 * read switches over to the database automatically.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const hasServiceRole = Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);
