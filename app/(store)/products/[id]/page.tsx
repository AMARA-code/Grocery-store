import { notFound } from "next/navigation";
import { products } from "@/src/data/products";
import { ProductDetail } from "@/components/store/ProductDetail";

/** Avoid pre-rendering 28 product pages (large images caused local build OOM). */
export const dynamic = "force-dynamic";

type PageProps = { params: { id: string } };

export default function ProductDetailsPage({ params }: PageProps) {
  const { id } = params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
