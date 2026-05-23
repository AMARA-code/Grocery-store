"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";
import { revalidatePath } from "next/cache";
import { sendMail } from "@/lib/email/mailer";
import {
  codConfirmationTemplate,
  advanceConfirmationTemplate,
  shipmentNotificationTemplate,
  type OrderEmailData,
} from "@/lib/email/order-emails";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function revalidate() {
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

function parseItemsSummary(
  summary: string | null
): { name: string; quantity: number; price: number }[] {
  if (!summary) return [];
  return summary.split(",").map((part) => {
    const trimmed = part.trim();
    const match = trimmed.match(/^(.+?)\s*[x×]\s*(\d+)$/i);
    if (match) {
      return { name: match[1].trim(), quantity: parseInt(match[2], 10), price: 0 };
    }
    return { name: trimmed, quantity: 1, price: 0 };
  });
}

async function fetchOrderForEmail(orderId: string) {
  const supabase = await createSupabaseServerClient(); // ← await
  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, total, items_summary, shipping_address, payment_method, transaction_id,
       customer_name, customer_email, guest_name, guest_email`
    )
    .eq("id", orderId)
    .single();

  if (error || !data) throw new Error("Order not found");
  return data;
}

function buildEmailData(order: Awaited<ReturnType<typeof fetchOrderForEmail>>): OrderEmailData {
  return {
    customerName:    order.customer_name ?? order.guest_name ?? "Customer",
    orderId:         order.id,
    total:           order.total ?? 0,
    items:           parseItemsSummary(order.items_summary),
    shippingAddress: order.shipping_address ?? "—",
    paymentMethod:   order.payment_method ?? "cod",
    transactionId:   order.transaction_id,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────────────────────────────────────

export async function getAdminOrders() {
  if (!isSupabaseServerConfigured()) return [];

  try {
    const supabase = await createSupabaseServerClient(); // ← await
    const { data, error } = await supabase
      .from("orders")
      .select(
        `id, status, total, created_at,
         customer_name, customer_email, customer_phone, shipping_address,
         items_summary, payment_method, payment_provider, transaction_id,
         payment_verified, cash_collected, revenue_counted,
         order_confirmed, order_shipped,
         guest_name, guest_email, guest_phone`
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
      payment_verified: Boolean(row.payment_verified),
      cash_collected:   Boolean(row.cash_collected),
      revenue_counted:  Boolean(row.revenue_counted),
      order_confirmed:  Boolean(row.order_confirmed),
      order_shipped:    Boolean(row.order_shipped),
      guest_name:       row.guest_name       as string | null,
      guest_email:      row.guest_email      as string | null,
      guest_phone:      row.guest_phone      as string | null,
    }));
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Actions — all await the client now
// ─────────────────────────────────────────────────────────────────────────────

export async function confirmCodOrder(orderId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("orders")
    .update({ order_confirmed: true, status: "processing" })
    .eq("id", orderId)
    .eq("payment_method", "cod");

  if (error) throw new Error(error.message);

  try {
    const order = await fetchOrderForEmail(orderId);
    const email = order.customer_email ?? order.guest_email;
    if (email) {
      await sendMail({
        to: email,
        subject: `✅ Order Confirmed – FreshCart (#${order.id.slice(0, 8).toUpperCase()})`,
        html: codConfirmationTemplate(buildEmailData(order)),
      });
    }
  } catch (emailErr) {
    console.error("[confirmCodOrder] email failed:", emailErr);
  }

  revalidate();
}

export async function confirmAdvancePayment(orderId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("orders")
    .update({
      payment_verified: true,
      order_confirmed:  true,
      status:           "processing",
    })
    .eq("id", orderId)
    .eq("payment_method", "advance");

  if (error) throw new Error(error.message);

  try {
    const order = await fetchOrderForEmail(orderId);
    const email = order.customer_email ?? order.guest_email;
    if (email) {
      await sendMail({
        to: email,
        subject: `💜 Payment Confirmed – FreshCart (#${order.id.slice(0, 8).toUpperCase()})`,
        html: advanceConfirmationTemplate(buildEmailData(order)),
      });
    }
  } catch (emailErr) {
    console.error("[confirmAdvancePayment] email failed:", emailErr);
  }

  revalidate();
}

export async function markOrderShipped(orderId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("orders")
    .update({ order_shipped: true, status: "shipped" })
    .eq("id", orderId);

  if (error) throw new Error(error.message);

  try {
    const order = await fetchOrderForEmail(orderId);
    const email = order.customer_email ?? order.guest_email;
    if (email) {
      await sendMail({
        to: email,
        subject: `🚚 Your Order is On the Way – FreshCart (#${order.id.slice(0, 8).toUpperCase()})`,
        html: shipmentNotificationTemplate(buildEmailData(order)),
      });
    }
  } catch (emailErr) {
    console.error("[markOrderShipped] email failed:", emailErr);
  }

  revalidate();
}

export async function markCashCollected(orderId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("orders")
    .update({ cash_collected: true, status: "delivered" })
    .eq("id", orderId)
    .eq("payment_method", "cod");

  if (error) throw new Error(error.message);
  revalidate();
}

export async function markAdvanceDelivered(orderId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("orders")
    .update({ status: "delivered" })
    .eq("id", orderId)
    .eq("payment_method", "advance");

  if (error) throw new Error(error.message);
  revalidate();
}