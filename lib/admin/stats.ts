// lib/admin/stats.ts
import { createClient } from "@supabase/supabase-js";
import type { RevenueSummary } from "@/types";

// Server-side client — service role key bypasses RLS so admin can read everything
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!        // never exposed to browser
);

export interface DashboardStatsData {
  totalOrders: number;
  // ── Revenue fields ──────────────────────────────────────────────────────
  // IMPORTANT: these come from the `revenue_summary` view (migration 004).
  // They only count orders where:
  //   • payment_method = 'advance' AND payment_verified = true   (admin confirmed bank transfer)
  //   • payment_method = 'cod'     AND cash_collected  = true    (admin confirmed delivery)
  // Raw order totals are intentionally NOT used here.
  totalRevenue: number;
  advanceRevenue: number;
  codRevenue: number;
  pendingAdvanceCount: number;   // advance orders awaiting admin verification
  pendingCodCount: number;       // COD orders not yet marked delivered
  // ── People ─────────────────────────────────────────────────────────────
  totalProducts: number;
  totalCustomers: number;        // registered users (user_id is not null)
  totalGuests: number;           // guest checkouts (unique guest_email, no account)
}

export async function getDashboardStats(): Promise<DashboardStatsData> {
  const [summaryRes, productsRes] = await Promise.all([
    supabase
      .from("revenue_summary")   // view created in 004_revenue_and_guests.sql
      .select("*")
      .single(),

    supabase
      .from("products")
      .select("id", { count: "exact", head: true }),
  ]);

  if (summaryRes.error) {
    console.error("[getDashboardStats] revenue_summary error:", summaryRes.error);
    throw new Error("Failed to load dashboard stats");
  }

  const s = summaryRes.data as RevenueSummary;

  return {
    totalOrders:        s.total_orders,
    totalRevenue:       s.total_revenue,        // ← verified revenue only
    advanceRevenue:     s.advance_revenue,
    codRevenue:         s.cod_revenue,
    pendingAdvanceCount: s.pending_advance_count,
    pendingCodCount:    s.pending_cod_count,
    totalProducts:      productsRes.count ?? 0,
    totalCustomers:     s.total_customers,
    totalGuests:        s.total_guests,
  };
}