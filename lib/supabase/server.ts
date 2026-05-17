import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function assertSupabaseServerEnv(): { url: string; anonKey: string } {
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

/**
 * Server Supabase client (Server Components, Route Handlers).
 * Cookie writes are no-ops when called from a static Server Component context.
 */
export function createSupabaseServerClient() {
  const { url, anonKey } = assertSupabaseServerEnv();
  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* called from Server Component where cookies are read-only */
        }
      },
    },
  });
}
