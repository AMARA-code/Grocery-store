"use client";

import { type FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { MOBILE_WALLET_NUMBER, ADMIN_EMAIL } from "@/lib/config/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Tag, CheckCircle, XCircle } from "lucide-react";
import type {
  CheckoutRequestBody,
  PaymentMethod,
  PaymentProvider,
} from "@/types/checkout";

// Client-side promo registry — percent based
const VALID_PROMOS: Record<string, { percent: number; label: string }> = {
  FRESH10: { percent: 10, label: "10% off your first order" },
};

export function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>("jazzcash");

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    label: string;
    percent: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  useEffect(() => setMounted(true), []);

  const discountedTotal = appliedPromo
    ? Math.max(0, totalPrice - appliedPromo.discount)
    : totalPrice;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const promo = VALID_PROMOS[code];
    if (!promo) {
      setPromoError("Invalid promo code.");
      setAppliedPromo(null);
      return;
    }
    const discountAmount = Math.round(totalPrice * promo.percent / 100);
    setAppliedPromo({ code, discount: discountAmount, label: promo.label, percent: promo.percent });
    setPromoError("");
    toast.success(`Promo applied: ${promo.label}!`);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const address = String(data.get("address") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const transactionId = String(data.get("transaction_id") || "").trim();

    if (!name || !email || !address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (paymentMethod === "advance" && transactionId.length < 4) {
      toast.error("Enter your JazzCash or EasyPaisa transaction ID.");
      return;
    }

    const payload: CheckoutRequestBody & { promoCode?: string } = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      shipping: { name, email, address, phone: phone || undefined },
      paymentMethod,
      ...(paymentMethod === "advance" ? { paymentProvider, transactionId } : {}),
      ...(appliedPromo ? { promoCode: appliedPromo.code } : {}),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as {
        orderId?: string;
        total?: number;
        discount?: number;
        originalTotal?: number;
        error?: string;
      };

      if (!res.ok || !body.orderId) {
        toast.error(body.error ?? "Could not place order");
        return;
      }

      clearCart();
      const q = new URLSearchParams({
        orderId: body.orderId,
        name,
        email,
        total: String(body.total ?? discountedTotal),
        itemCount: String(items.reduce((s, i) => s + i.quantity, 0)),
        payment: paymentMethod,
        ...(body.discount ? { discount: String(body.discount) } : {}),
        ...(body.originalTotal ? { originalTotal: String(body.originalTotal) } : {}),
      });
      router.push(`/order-confirmation?${q.toString()}`);
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">

        {/* Contact info */}
        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900">Contact information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" id="name" name="name" required placeholder="Your name" />
            <Input label="Email" id="email" name="email" type="email" required placeholder="you@gmail.com" />
          </div>
          <Input label="Phone" id="phone" name="phone" type="tel" placeholder="03XX XXXXXXX" />
          <div className="space-y-1.5">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Delivery address
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              placeholder="Street, area, city"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30"
            />
          </div>
        </section>

        {/* Payment method */}
        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900">Payment method</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={cn(
              "cursor-pointer rounded-2xl border-2 p-4 transition",
              paymentMethod === "cod" ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-green-300"
            )}>
              <input type="radio" name="payment_method_ui" className="sr-only"
                checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              <span className="font-semibold text-gray-900">Cash on delivery</span>
              <p className="mt-1 text-xs text-gray-600">Pay when your order arrives.</p>
            </label>
            <label className={cn(
              "cursor-pointer rounded-2xl border-2 p-4 transition",
              paymentMethod === "advance" ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-green-300"
            )}>
              <input type="radio" name="payment_method_ui" className="sr-only"
                checked={paymentMethod === "advance"} onChange={() => setPaymentMethod("advance")} />
              <span className="font-semibold text-gray-900">Advance payment</span>
              <p className="mt-1 text-xs text-gray-600">JazzCash or EasyPaisa before delivery.</p>
            </label>
          </div>

          {paymentMethod === "advance" && (
            <div className="space-y-4 rounded-xl border border-green-100 bg-green-50/50 p-4">
              <p className="text-sm text-gray-800">
                Send <strong>{formatCurrency(discountedTotal)}</strong> to{" "}
                <strong className="text-green-800">{MOBILE_WALLET_NUMBER}</strong> via JazzCash or
                EasyPaisa, then enter your transaction ID below.
              </p>
              <div className="flex flex-wrap gap-3">
                {(["jazzcash", "easypaisa"] as const).map((p) => (
                  <label key={p} className={cn(
                    "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium capitalize transition",
                    paymentProvider === p
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-green-400"
                  )}>
                    <input type="radio" name="provider_ui" className="sr-only"
                      checked={paymentProvider === p} onChange={() => setPaymentProvider(p)} />
                    {p}
                  </label>
                ))}
              </div>
              <Input label="Transaction ID" id="transaction_id" name="transaction_id"
                required placeholder="e.g. 12345678901" />
            </div>
          )}
        </section>

        {/* Promo code */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Promo code</h2>
          {appliedPromo ? (
            <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-800">{appliedPromo.code}</p>
                  <p className="text-xs text-green-600">
                    {appliedPromo.label} — {formatCurrency(appliedPromo.discount)} off
                  </p>
                </div>
              </div>
              <button type="button" onClick={handleRemovePromo}
                className="rounded-lg p-1 text-gray-400 hover:text-red-500">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value.toUpperCase());
                    setPromoError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyPromo())}
                  placeholder="Enter promo code"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm font-mono uppercase tracking-widest text-gray-900 placeholder:normal-case placeholder:tracking-normal focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyPromo}
                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition"
              >
                Apply
              </button>
            </div>
          )}
          {promoError && (
            <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
              <XCircle className="h-3.5 w-3.5" /> {promoError}
            </p>
          )}
        </section>
      </div>

      {/* Order summary */}
      <aside className="h-fit space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>

        {!mounted ? (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((i) => <div key={i} className="h-6 rounded bg-gray-100" />)}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-100 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2 py-2">
                  <span className="text-gray-700">
                    {item.name} <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="space-y-1 border-t border-gray-100 pt-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between font-medium text-green-600">
                  <span>Discount ({appliedPromo.percent}% off)</span>
                  <span>− {formatCurrency(appliedPromo.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 text-gray-900">
                <span className="font-semibold">Total</span>
                <strong className="text-lg text-green-700">
                  {formatCurrency(discountedTotal)}
                </strong>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
              {submitting ? "Placing order…" : "Place order"}
            </Button>
            <p className="text-xs text-gray-500">
              Orders are sent to {ADMIN_EMAIL}. Sign in required.
            </p>
          </>
        )}
      </aside>
    </form>
  );
}