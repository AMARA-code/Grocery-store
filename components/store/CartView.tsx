"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CartView() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Your cart</h1>
        <p className="mt-1 text-gray-600">
          {totalItems === 0
            ? "You have no items in your cart yet."
            : `You have ${totalItems} item${totalItems > 1 ? "s" : ""} in your cart.`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
          <p className="text-gray-600">
            Start exploring fresh groceries and add your favorites to the cart.
          </p>
          <Button href="/products" variant="primary" className="mt-6">
            Browse products
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm font-medium text-green-700">
                    {formatCurrency(item.price)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-full border border-gray-200 bg-gray-50">
                      <button
                        type="button"
                        className="px-2 py-1.5 text-gray-600 hover:bg-white"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="px-2 py-1.5 text-gray-600 hover:bg-white"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-medium text-red-600 hover:underline"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
          <aside className="h-fit space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <strong className="text-green-700">{formatCurrency(totalPrice)}</strong>
            </div>
            <p className="text-xs text-gray-500">
              Delivery and taxes are simulated for this demo experience.
            </p>
            <Button href="/checkout" variant="primary" className="w-full">
              Proceed to checkout
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}