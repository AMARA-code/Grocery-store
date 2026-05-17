import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";

export async function getAdminOrders() {
  if (!isSupabaseServerConfigured()) return [];

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        `id, status, total, created_at,
         customer_name, customer_email, customer_phone, shipping_address,
         items_summary, payment_method, payment_provider, transaction_id`
      )
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      id:               row.id               as string,
      status:           row.status           as string,
      total:            row.total            as number | null,
      created_at:       row.created_at       as string,
      customer_name:    row.customer_name    as string | null,
      customer_email:   row.customer_email   as string | null,
      customer_phone:   row.customer_phone   as string | null,
      shipping_address: row.shipping_address as string | null,
      items_summary:    row.items_summary    as string | null,
      payment_method:   row.payment_method   as string | null,
      payment_provider: row.payment_provider as string | null,
      transaction_id:   row.transaction_id   as string | null,
    }));
  } catch {
    return [];
  }
}
