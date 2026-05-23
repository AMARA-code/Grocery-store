// src/components/CheckoutForm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Key changes vs original:
//   • Saves guest_name, guest_email, guest_phone on the order row in Supabase
//     so the admin dashboard can count guest buyers separately from
//     registered customers.
//   • payment_verified and cash_collected default to false in the DB (migration
//     004), so no extra logic is needed here — the admin sets them later.
// ─────────────────────────────────────────────────────────────────────────────

import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PaymentMethod = "cod" | "advance";

function generateOrderId() {
  return "FC-" + Math.floor(Math.random() * 899999 + 100000).toString();
}

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const fd   = new FormData(form);

    const name    = (fd.get("name")    as string).trim();
    const email   = (fd.get("email")   as string).trim();
    const phone   = (fd.get("phone")   as string).trim();
    const address = (fd.get("address") as string).trim();

    if (!name || !email || !address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      // ── 1. Get current auth user (null for guests) ──────────
      const { data: { user } } = await supabase.auth.getUser();

      // ── 2. Build items summary string ───────────────────────
      const itemsSummary = items
        .map((i) => `${i.name} ×${i.quantity}`)
        .join(", ");

      // ── 3. Insert order into Supabase ───────────────────────
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          // auth user id — null for guests; dashboard counts distinct guest_email
          user_id:          user?.id ?? null,

          status:           "pending",
          total:            totalPrice,
          payment_method:   paymentMethod,

          // Named customer fields (used if the user is logged in)
          customer_name:    user ? name    : null,
          customer_email:   user ? email   : null,
          customer_phone:   user ? phone   : null,

          // Guest fields (used if no auth session) — counted in dashboard as "guests"
          guest_name:       !user ? name   : null,
          guest_email:      !user ? email  : null,
          guest_phone:      !user ? phone  : null,

          shipping_address: address,
          items_summary:    itemsSummary,

          // Verification flags — stay false until admin acts (migration 004)
          payment_verified: false,
          cash_collected:   false,
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const dbOrderId = orderData.id as string;
      const displayId = generateOrderId();

      // ── 4. Insert order items ────────────────────────────────
      const orderItems = items.map((item) => ({
        order_id:     dbOrderId,
        product_id:   item.id,
        product_name: item.name,
        quantity:     item.quantity,
        price:        item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // ── 5. Route by payment method ───────────────────────────
      const navState = {
        orderId:   dbOrderId,
        displayId,
        name,
        email,
        address,
        phone,
        total:     totalPrice,
        itemCount: items.length,
      };

      if (paymentMethod === "advance") {
        // Don't clear cart yet — user still needs to fill payment form.
        navigate("/payment", { state: navState });
      } else {
        // COD: order is placed; cash revenue counted when admin marks delivered.
        clearCart();
        navigate("/order-confirmation", {
          state: { ...navState, orderId: displayId },
        });
      }
    } catch (err) {
      console.error("checkout error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <div className="checkout-grid">
        {/* ── Left: customer details ── */}
        <section className="checkout-section">
          <h2>Your details</h2>

          <div className="field">
            <label htmlFor="name">Full name *</label>
            <input id="name" name="name" type="text" required placeholder="Your full name" />
          </div>

          <div className="field">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" placeholder="03XX-XXXXXXX" />
          </div>

          <div className="field">
            <label htmlFor="address">Delivery address *</label>
            <textarea id="address" name="address" rows={3} required placeholder="House no., street, city" />
          </div>

          {/* ── Payment method ── */}
          <h2 style={{ marginTop: "1.5rem" }}>Payment method</h2>

          <div className="payment-method-options">
            <label className={`payment-option ${paymentMethod === "cod" ? "payment-option--active" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives</small>
              </span>
            </label>

            <label className={`payment-option ${paymentMethod === "advance" ? "payment-option--active" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="advance"
                checked={paymentMethod === "advance"}
                onChange={() => setPaymentMethod("advance")}
              />
              <span>
                <strong>Advance bank transfer</strong>
                <small>Transfer before delivery — admin verifies payment</small>
              </span>
            </label>
          </div>
        </section>

        {/* ── Right: order summary ── */}
        <aside className="checkout-summary">
          <h2>Order summary</h2>

          <div className="checkout-items">
            {items.map((item) => (
              <div key={item.id} className="checkout-item-main">
                <span>{item.name} ×{item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <span>Total</span>
            <strong>{formatCurrency(totalPrice)}</strong>
          </div>

          <button
            type="submit"
            className="btn btn-primary checkout-submit"
            disabled={submitting || items.length === 0}
          >
            {submitting
              ? "Placing order…"
              : paymentMethod === "advance"
              ? "Continue to payment"
              : "Place order"}
          </button>

          {paymentMethod === "cod" && (
            <p className="checkout-note">
              Revenue is counted only after our team confirms delivery and cash receipt.
            </p>
          )}
          {paymentMethod === "advance" && (
            <p className="checkout-note">
              Revenue is counted after our team verifies your bank transfer.
            </p>
          )}
        </aside>
      </div>
    </form>
  );
}