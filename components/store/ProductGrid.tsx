import type { Product } from "@/src/data/products";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

export type ProductGridProps = {
  products: Product[];
  className?: string;
};

export function ProductGrid({ products, className }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm",
          className
        )}
      >
        <h3 className="text-lg font-semibold text-gray-900">No results</h3>
        <p className="mt-2 text-sm text-gray-600">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
