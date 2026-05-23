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
  userId: string | null;
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
  promoCode?: string;
  discount?: number;
};

export async function placeOrder(
  supabase: SupabaseClient,
  input: PlaceOrderInput
): Promise<{ orderId: string; total: number; discount: number; originalTotal: number }> {
  const {
    userId, items, shipping, paymentMethod,
    paymentProvider, transactionId, promoCode, discount = 0,
  } = input;

  const originalTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, originalTotal - discount);
  const itemsSummary = items.map((i) => `${i.name} x${i.quantity}`).join(", ");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id:          userId,
      status:           "pending",
      total,
      original_total:   originalTotal,
      discount:         discount,
      promo_code:       promoCode ?? null,
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

  const orderItems = items.map((item) => ({
    order_id:     orderId,
    product_id:   parseProductUuid(item.id) ?? null,
    product_name: item.name,
    quantity:     item.quantity,
    price:        item.price,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw new Error(itemsError.message ?? "Failed to save order items");

  for (const item of items) {
    const productId = parseProductUuid(item.id);
    if (!productId) continue;
    const { error: stockError } = await supabase.rpc("decrement_stock", {
      p_product_id: productId,
      p_quantity:   item.quantity,
    });
    if (stockError) {
      console.error(`Stock decrement failed for product ${productId}:`, stockError.message);
    }
  }

  return { orderId, total, discount, originalTotal };
}