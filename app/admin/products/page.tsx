import { ProductsManager } from "@/components/admin/ProductsManager";
import { getAdminProducts } from "@/lib/admin/products";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return <ProductsManager products={products} />;
}
