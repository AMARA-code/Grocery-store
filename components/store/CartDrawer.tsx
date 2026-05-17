"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  /* ── Prevent hydration mismatch — cart reads localStorage ── */
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  /* Show empty state until mounted so server & first client paint match */
  const cartItems = mounted ? items : [];
  const cartTotal = mounted ? totalPrice : 0;

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transition",
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart overlay"
        className={cn(
          "absolute inset-0 bg-forest-900/40 backdrop-blur-[2px] transition-opacity",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col",
          "border-l border-sage-200 bg-cream-50 shadow-2xl",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-sage-200/60 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-forest-800">
              Your cart
            </h2>
            {mounted && cartItems.length > 0 && (
              <p className="text-xs text-forest-500/60">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-2 text-forest-500 transition hover:bg-sage-100 hover:text-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="text-4xl">🛒</span>
              <p className="text-sm text-forest-600/60">Your cart is empty.</p>
              <Button href="/products" variant="secondary" onClick={onClose}>
                Start shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-sage-200/60 bg-white p-3 shadow-card"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-forest-800">
                      {item.name}
                    </h3>
                    <p className="text-sm font-semibold text-forest-600">
                      {formatCurrency(item.price)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {/* Qty stepper */}
                      <div className="flex items-center rounded-full border border-sage-200 bg-cream-50">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-forest-600 transition hover:bg-sage-100 hover:text-forest-800"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold text-forest-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-forest-600 transition hover:bg-sage-100 hover:text-forest-800"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-medium text-red-500 underline-offset-2 hover:underline"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-sage-200/60 bg-white px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-forest-700">Total</span>
            <strong className="font-display text-lg text-forest-600">
              {formatCurrency(cartTotal)}
            </strong>
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </footer>
      </aside>
    </div>
  );
}