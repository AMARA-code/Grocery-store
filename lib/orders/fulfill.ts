import type Stripe from "stripe";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function fulfillCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<void> {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    throw new Error("Checkout session missing orderId metadata");
  }

  const supabase = createSupabaseServiceClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("id, status")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existing) return;

  const total =
    session.amount_total != null ? session.amount_total / 100 : undefined;

  const { error } = await supabase
    .from("orders")
    .update({
      status: "processing",
      stripe_session_id: session.id,
      ...(total != null ? { total } : {}),
    })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }
}
