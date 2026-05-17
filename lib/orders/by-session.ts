import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OrderConfirmationData = {
  orderId: string;
  name: string;
  email: string;
  total: number;
  itemCount: number;
  status: string;
};

export async function getOrderByStripeSession(
  sessionId: string,
  userId: string
): Promise<OrderConfirmationData | null> {
  const supabase = createSupabaseServerClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, total, status, stripe_session_id")
    .eq("stripe_session_id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !order) return null;

  const [{ count }, { data: profile }] = await Promise.all([
    supabase
      .from("order_items")
      .select("id", { count: "exact", head: true })
      .eq("order_id", order.id),
    supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  return {
    orderId: order.id as string,
    name: profile?.full_name?.trim() || "there",
    email: profile?.email?.trim() || "your inbox",
    total: Number(order.total ?? 0),
    itemCount: count ?? 0,
    status: order.status as string,
  };
}
