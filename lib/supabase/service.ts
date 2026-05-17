import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function assertServiceRoleEnv(): { url: string; serviceKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url?.trim() || url.startsWith("your_")) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing or still a placeholder.");
  }
  if (!serviceKey?.trim() || serviceKey.startsWith("your_")) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing or still a placeholder.");
  }
  return { url, serviceKey };
}

/** Service-role client for webhooks and trusted server jobs (bypasses RLS). */
export function createSupabaseServiceClient(): SupabaseClient {
  const { url, serviceKey } = assertServiceRoleEnv();
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseServiceConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url?.trim() || !key?.trim()) return false;
  if (url.startsWith("your_") || key.startsWith("your_")) return false;
  return true;
}
