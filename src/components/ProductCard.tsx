"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "../../types";  // ← updated import to use shared type
import { Badge } from "@/components/ui/Badge";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      layout
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 400, damping: 28 } }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      <Link href={`/products/${product.id}`} className="flex h-full flex-col">
        <div className="relative block aspect-[4/3] w-full overflow-hidden bg-orange-50">
          {product.badge && (
            <Badge className="absolute left-3 top-3 z-10 shadow-sm">{product.badge}</Badge>
          )}
          <Image
            src={product.image_url}  /* ← was product.image */
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
          <h3 className="font-display text-sm font-semibold text-stone-800 leading-snug sm:text-base">
            {product.name}
          </h3>
          <p className="hidden text-xs font-medium uppercase tracking-wide text-stone-400 md:block">
            {product.category}
          </p>
          <p className="hidden text-sm leading-relaxed text-stone-500 line-clamp-2 md:block">
            {product.description}
          </p>
          <p className="mt-auto pt-1 font-display text-base font-bold text-orange-500 sm:text-lg">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}