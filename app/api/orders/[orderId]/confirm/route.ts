import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { sendMail } from "@/lib/email/mailer";
import { orderConfirmationTemplate } from "@/lib/email/templates/order-confirmation";

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  // 1. Verify the caller is an admin
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Use service client to update order status (bypasses RLS)
  const service = createSupabaseServiceClient();

  const { data: order, error: orderError } = await service
    .from("orders")
    .update({ status: "confirmed" })
    .eq("id", orderId)
    .select(`
      id,
      total,
      customer_name,
      customer_email,
      shipping_address,
      payment_method,
      order_items (
        product_name,
        quantity,
        price
      )
    `)
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "Order not found" },
      { status: 404 }
    );
  }

  // 3. Send confirmation email to customer
  try {
    const items = (order.order_items ?? []).map((i: any) => ({
      name:     i.product_name ?? "Product",
      quantity: i.quantity,
      price:    Number(i.price),
    }));

    const html = orderConfirmationTemplate({
      customerName:    order.customer_name ?? "Customer",
      orderId:         order.id,
      total:           Number(order.total),
      items,
      shippingAddress: order.shipping_address ?? "",
      paymentMethod:   order.payment_method ?? "cod",
    });

    await sendMail({
      to:      order.customer_email,
      subject: `✅ Your FreshCart order #${order.id.slice(0, 8).toUpperCase()} is confirmed!`,
      html,
    });
  } catch (emailErr) {
    console.error("Failed to send confirmation email:", emailErr);
    // Order is already confirmed — don't fail the request over email
  }

  return NextResponse.json({ success: true, orderId });
}