import type { SupabaseClient } from "@supabase/supabase-js";
import { parseProductUuid } from "@/lib/orders/product-id";
import type { PaymentMethod, PaymentProvider } from "@/types/checkout";

export type CheckoutLineItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type PlaceOrderInput = {
  userId: string;
  items: CheckoutLineItem[];
  shipping: {
    name: string;
    email: string;
    address: string;
    phone?: string;
  };
  paymentMethod: PaymentMethod;
  paymentProvider?: PaymentProvider;
  transactionId?: string;
};

export async function placeOrder(
  supabase: SupabaseClient,
  input: PlaceOrderInput
): Promise<{ orderId: string; total: number }> {
  const { userId, items, shipping, paymentMethod, paymentProvider, transactionId } = input;

  // 1. Calculate total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 2. Build a readable items summary for the orders table
  const itemsSummary = items
    .map((i) => `${i.name} x${i.quantity}`)
    .join(", ");

  // 3. Insert the order row
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id:          userId,
      status:           "pending",
      total,
      payment_method:   paymentMethod,
      payment_provider: paymentProvider ?? null,
      transaction_id:   transactionId ?? null,
      customer_name:    shipping.name,
      customer_email:   shipping.email,
      customer_phone:   shipping.phone ?? null,
      shipping_address: shipping.address,
      items_summary:    itemsSummary,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Failed to create order");
  }

  const orderId = order.id as string;

  // 4. Insert order_items rows
  const orderItems = items.map((item) => ({
    order_id:     orderId,
    product_id:   parseProductUuid(item.id),   // null if not a UUID (safe)
    product_name: item.name,
    quantity:     item.quantity,
    price:        item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    throw new Error(itemsError.message ?? "Failed to save order items");
  }

  // 5. Decrement stock for each product that has a valid UUID
  //    We do this one by one so a missing product doesn't crash the whole order.
  //    stock is clamped to 0 — it will never go negative.
  for (const item of items) {
    const productId = parseProductUuid(item.id);
    if (!productId) continue; // skip if id is not a UUID

    const { error: stockError } = await supabase.rpc("decrement_stock", {
      p_product_id: productId,
      p_quantity:   item.quantity,
    });

    // Log but don't crash the order if stock update fails
    if (stockError) {
      console.error(
        `Stock decrement failed for product ${productId}:`,
        stockError.message
      );
    }
  }

  return { orderId, total };
}