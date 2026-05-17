"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Product } from "@/src/data/products";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductInquiryForm } from "./ProductInquiryForm";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`, { style: { fontSize: "0.9rem" } });
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm font-medium text-green-700 hover:underline"
      >
        ← Back
      </button>
      <div className="grid gap-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-md md:grid-cols-2 md:p-8">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
          {product.badge ? (
            <Badge className="absolute left-4 top-4 z-10 shadow-sm">{product.badge}</Badge>
          ) : null}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>
          <p className="text-sm font-medium text-green-700">{product.category}</p>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex flex-col gap-1 border-y border-gray-100 py-4">
            <span className="text-2xl font-bold text-green-700">
              {formatCurrency(product.price)}
            </span>
            <span className="text-xs text-gray-500">
              Price per standard pack • Taxes included
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="primary" className="flex-1" onClick={handleAdd}>
              Add to cart
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => router.push("/checkout")}
            >
              Go to checkout
            </Button>
          </div>
          <ProductInquiryForm product={product} />
        </div>
      </div>
    </div>
  );
}
