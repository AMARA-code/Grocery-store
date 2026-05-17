function isConfiguredPublicSupabaseEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.trim() || !key?.trim()) return false;
  if (url.startsWith("your_") || key.startsWith("your_")) return false;
  return true;
}

/** True when public Supabase env vars look configured (not placeholders). */
export function isSupabaseBrowserConfigured(): boolean {
  return isConfiguredPublicSupabaseEnv();
}

/** Same check for Server Components and route handlers. */
export function isSupabaseServerConfigured(): boolean {
  return isConfiguredPublicSupabaseEnv();
}
