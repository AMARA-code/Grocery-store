import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductDetail } from "@/components/store/ProductDetail";
import type { ProductRow } from "@/types";

export const dynamic = "force-dynamic";

type PageProps = { params: { id: string } };

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = params;

  const supabase = await createSupabaseServerClient(); // ← await
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) notFound();

  return <ProductDetail product={product as ProductRow} />;
}