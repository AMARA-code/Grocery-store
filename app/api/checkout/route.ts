import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";
import { placeOrder, type CheckoutLineItem } from "@/lib/orders/pending";
import { notifyAdminOfOrder } from "@/lib/orders/notify-admin";
import type { CheckoutRequestBody, PaymentMethod } from "@/types/checkout";

function parseBody(body: unknown): CheckoutRequestBody | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as CheckoutRequestBody;
  if (!Array.isArray(raw.items) || raw.items.length === 0) return null;
  if (!raw.shipping?.name?.trim() || !raw.shipping?.email?.trim()) return null;
  if (!raw.shipping?.address?.trim()) return null;
  if (raw.paymentMethod !== "cod" && raw.paymentMethod !== "advance") return null;

  const items: CheckoutLineItem[] = [];
  for (const item of raw.items) {
    if (!item?.id || !item?.name || typeof item.price !== "number") return null;
    const quantity = Number(item.quantity);
    if (!Number.isFinite(quantity) || quantity < 1) return null;
    items.push({
      id: String(item.id),
      name: String(item.name),
      price: item.price,
      quantity: Math.floor(quantity),
    });
  }

  const paymentMethod = raw.paymentMethod as PaymentMethod;

  if (paymentMethod === "advance") {
    if (raw.paymentProvider !== "jazzcash" && raw.paymentProvider !== "easypaisa") {
      return null;
    }
    const tid = raw.transactionId?.trim();
    if (!tid || tid.length < 4) return null;
  }

  return {
    items,
    shipping: {
      name: raw.shipping.name.trim(),
      email: raw.shipping.email.trim(),
      address: raw.shipping.address.trim(),
      phone: raw.shipping.phone?.trim() || undefined,
    },
    paymentMethod,
    paymentProvider: raw.paymentProvider,
    transactionId: raw.transactionId?.trim(),
  };
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseBody(json);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add keys to .env.local." },
      { status: 503 }
    );
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to checkout" }, { status: 401 });
  }

  try {
    const { orderId, total } = await placeOrder(supabase, {
      userId: user.id,
      items: parsed.items,
      shipping: parsed.shipping,
      paymentMethod: parsed.paymentMethod,
      paymentProvider: parsed.paymentProvider,
      transactionId: parsed.transactionId,
    });

    void notifyAdminOfOrder({
      orderId,
      total,
      items: parsed.items,
      shipping: parsed.shipping,
      paymentMethod: parsed.paymentMethod,
      paymentProvider: parsed.paymentProvider,
      transactionId: parsed.transactionId,
    });

    return NextResponse.json({
      orderId,
      total,
      paymentMethod: parsed.paymentMethod,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
