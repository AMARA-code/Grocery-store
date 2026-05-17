import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";

export type DashboardStats = {
  configured: boolean;
  totalOrders: number;
  revenue: number;
  productCount: number;
  customerCount: number;
};

const emptyStats: DashboardStats = {
  configured: false,
  totalOrders: 0,
  revenue: 0,
  productCount: 0,
  customerCount: 0,
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseServerConfigured()) return emptyStats;

  try {
    const supabase = createSupabaseServerClient();

    const [ordersRes, productsRes, customersRes] = await Promise.all([
      supabase.from("orders").select("total"),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "customer"),
    ]);

    const orders = ordersRes.data ?? [];
    const revenue = orders.reduce((sum, row) => sum + Number(row.total ?? 0), 0);

    return {
      configured: true,
      totalOrders: orders.length,
      revenue,
      productCount: productsRes.count ?? 0,
      customerCount: customersRes.count ?? 0,
    };
  } catch {
    return { ...emptyStats, configured: true };
  }
}
