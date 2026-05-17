"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { MOBILE_WALLET_NUMBER, ADMIN_EMAIL } from "@/lib/config/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type {
  CheckoutRequestBody,
  PaymentMethod,
  PaymentProvider,
} from "@/types/checkout";

export function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>("jazzcash");

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

    const payload: CheckoutRequestBody = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      shipping: { name, email, address, phone: phone || undefined },
      paymentMethod,
      ...(paymentMethod === "advance"
        ? { paymentProvider, transactionId }
        : {}),
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
        total: String(body.total ?? totalPrice),
        itemCount: String(items.reduce((s, i) => s + i.quantity, 0)),
        payment: paymentMethod,
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
        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900">Contact information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" id="name" name="name" required placeholder="Your name" />
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@gmail.com"
            />
          </div>
          <Input
            label="Phone"
            id="phone"
            name="phone"
            type="tel"
            placeholder="03XX XXXXXXX"
          />
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

        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900">Payment method</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className={cn(
                "cursor-pointer rounded-2xl border-2 p-4 transition",
                paymentMethod === "cod"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              )}
            >
              <input
                type="radio"
                name="payment_method_ui"
                className="sr-only"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span className="font-semibold text-gray-900">Cash on delivery</span>
              <p className="mt-1 text-xs text-gray-600">Pay when your order arrives.</p>
            </label>
            <label
              className={cn(
                "cursor-pointer rounded-2xl border-2 p-4 transition",
                paymentMethod === "advance"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              )}
            >
              <input
                type="radio"
                name="payment_method_ui"
                className="sr-only"
                checked={paymentMethod === "advance"}
                onChange={() => setPaymentMethod("advance")}
              />
              <span className="font-semibold text-gray-900">Advance payment</span>
              <p className="mt-1 text-xs text-gray-600">JazzCash or EasyPaisa before delivery.</p>
            </label>
          </div>

          {paymentMethod === "advance" ? (
            <div className="space-y-4 rounded-xl border border-green-100 bg-green-50/50 p-4">
              <p className="text-sm text-gray-800">
                Send <strong>{formatCurrency(totalPrice)}</strong> to{" "}
                <strong className="text-green-800">{MOBILE_WALLET_NUMBER}</strong> via JazzCash or
                EasyPaisa, then enter your transaction ID below.
              </p>
              <div className="flex flex-wrap gap-3">
                {(["jazzcash", "easypaisa"] as const).map((p) => (
                  <label
                    key={p}
                    className={cn(
                      "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium capitalize transition",
                      paymentProvider === p
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-green-400"
                    )}
                  >
                    <input
                      type="radio"
                      name="provider_ui"
                      className="sr-only"
                      checked={paymentProvider === p}
                      onChange={() => setPaymentProvider(p)}
                    />
                    {p}
                  </label>
                ))}
              </div>
              <Input
                label="Transaction ID"
                id="transaction_id"
                name="transaction_id"
                required
                placeholder="e.g. 12345678901"
              />
            </div>
          ) : null}
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>
        {items.length === 0 ? (
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
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-gray-900">
              <span className="font-medium">Total</span>
              <strong className="text-lg text-green-700">
                {formatCurrency(totalPrice)}
              </strong>
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
