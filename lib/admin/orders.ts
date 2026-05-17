import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";
import type { AdminOrderRow } from "@/types";

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
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
      id: row.id as string,
      status: row.status as string,
      total: row.total as number | null,
      created_at: row.created_at as string,
      customerName: (row.customer_name as string | null) ?? null,
      customerEmail: (row.customer_email as string | null) ?? null,
      customerPhone: (row.customer_phone as string | null) ?? null,
      shippingAddress: (row.shipping_address as string | null) ?? null,
      itemsSummary: (row.items_summary as string | null) ?? null,
      paymentMethod: (row.payment_method as string | null) ?? null,
      paymentProvider: (row.payment_provider as string | null) ?? null,
      transactionId: (row.transaction_id as string | null) ?? null,
    }));
  } catch {
    return [];
  }
}
