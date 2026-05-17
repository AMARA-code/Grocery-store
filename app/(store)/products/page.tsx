import { Suspense } from "react";
import { ProductsCatalog } from "@/components/store/ProductsCatalog";

function ProductsFallback() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded-lg bg-gray-200" />
      <div className="h-12 w-full max-w-md rounded-full bg-gray-100" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsCatalog />
    </Suspense>
  );
}
