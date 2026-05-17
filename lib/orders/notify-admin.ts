import { ADMIN_EMAIL, FORMSPREE_ORDER_ENDPOINT } from "@/lib/config/store";
import type { CheckoutLineItem } from "@/lib/orders/pending";
import type { PaymentMethod, PaymentProvider } from "@/types/checkout";

export type OrderNotifyPayload = {
  orderId: string;
  total: number;
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

function formatItemsList(items: CheckoutLineItem[]): string {
  return items
    .map(
      (item) =>
        `${item.name} ×${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n");
}

/** Sends order details to admin inbox via Formspree (non-blocking). */
export async function notifyAdminOfOrder(payload: OrderNotifyPayload): Promise<void> {
  const fd = new FormData();
  fd.append("_subject", `FreshCart order ${payload.orderId.slice(0, 8)}`);
  fd.append("_replyto", payload.shipping.email);
  fd.append("admin_email", ADMIN_EMAIL);
  fd.append("order_id", payload.orderId);
  fd.append("customer_name", payload.shipping.name);
  fd.append("customer_email", payload.shipping.email);
  fd.append("customer_phone", payload.shipping.phone ?? "");
  fd.append("shipping_address", payload.shipping.address);
  fd.append("payment_method", payload.paymentMethod);
  fd.append(
    "payment_provider",
    payload.paymentProvider ?? (payload.paymentMethod === "cod" ? "n/a" : "")
  );
  fd.append("transaction_id", payload.transactionId ?? "");
  fd.append("total", payload.total.toFixed(2));
  fd.append("products", formatItemsList(payload.items));

  try {
    await fetch(FORMSPREE_ORDER_ENDPOINT, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" },
    });
  } catch {
    /* notification is best-effort */
  }
}
