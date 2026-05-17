"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ADMIN_EMAIL } from "@/lib/config/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

function OrderConfirmationInner() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const orderId = searchParams.get("orderId") ?? "—";
  const name = searchParams.get("name") ?? "there";
  const email = searchParams.get("email") ?? ADMIN_EMAIL;
  const itemCount = Number(searchParams.get("itemCount") ?? "0") || 0;
  const total = Number(searchParams.get("total") ?? "0") || 0;
  const payment = searchParams.get("payment");

  useEffect(() => {
    if (searchParams.get("orderId")) clearCart();
  }, [searchParams, clearCart]);

  const paymentNote =
    payment === "advance"
      ? "We will verify your JazzCash / EasyPaisa payment using your transaction ID."
      : "Pay with cash when your order is delivered.";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Badge variant="default">Order placed</Badge>
      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Thank you, {name}!</h1>
      <p className="text-gray-600">
        We&apos;ve received your order. Confirmation details were sent to{" "}
        <strong className="text-gray-900">{email}</strong> and our team at{" "}
        <strong className="text-gray-900">{ADMIN_EMAIL}</strong>.
      </p>
      <p className="text-sm text-green-800">{paymentNote}</p>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Order ID</dt>
            <dd className="max-w-[60%] truncate font-semibold text-gray-900">{orderId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Items</dt>
            <dd className="font-semibold text-gray-900">{itemCount}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Total</dt>
            <dd className="font-semibold text-green-700">{formatCurrency(total)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-gray-500">
          Questions?{" "}
          <a href={`mailto:${ADMIN_EMAIL}`} className="text-green-700 hover:underline">
            {ADMIN_EMAIL}
          </a>{" "}
          or{" "}
          <a href="tel:03346445127" className="text-green-700 hover:underline">
            03346445127
          </a>
          .
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/products" variant="primary" className="flex-1">
          Continue shopping
        </Button>
        <Button href="/" variant="secondary" className="flex-1">
          Back to home
        </Button>
      </div>
    </div>
  );
}

function OrderConfirmationFallback() {
  return (
    <div className="mx-auto max-w-xl animate-pulse space-y-4">
      <div className="h-6 w-24 rounded-full bg-gray-200" />
      <div className="h-10 w-full rounded-lg bg-gray-200" />
      <div className="h-24 rounded-2xl bg-gray-100" />
    </div>
  );
}

export function OrderConfirmation() {
  return (
    <Suspense fallback={<OrderConfirmationFallback />}>
      <OrderConfirmationInner />
    </Suspense>
  );
}
