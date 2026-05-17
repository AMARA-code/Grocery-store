"use client";

import { createBrowserClient } from "@supabase/ssr";

function assertSupabaseBrowserEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.trim() || url.startsWith("your_")) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing or still a placeholder.");
  }
  if (!anonKey?.trim() || anonKey.startsWith("your_")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or still a placeholder."
    );
  }
  return { url, anonKey };
}

/** Browser Supabase client (Client Components). */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = assertSupabaseBrowserEnv();
  return createBrowserClient(url, anonKey);
}
