import { Suspense } from "react";
import { CheckoutForm } from "@/components/store/CheckoutForm";

function CheckoutFallback() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded-lg bg-gray-200" />
      <div className="h-64 rounded-2xl bg-gray-100" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Checkout</h1>
        <p className="mt-1 text-gray-600">
          Choose cash on delivery or pay in advance with JazzCash / EasyPaisa.
        </p>
      </div>
      <Suspense fallback={<CheckoutFallback />}>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
