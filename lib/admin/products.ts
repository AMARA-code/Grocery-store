import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";
import type { ProductRow } from "@/types";

export async function getAdminProducts(): Promise<ProductRow[]> {
  if (!isSupabaseServerConfigured()) return [];

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as ProductRow[];
  } catch {
    return [];
  }
}