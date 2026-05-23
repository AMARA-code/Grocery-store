import { OrdersManager } from "@/components/admin/OrdersManager";
import { getAdminOrders } from "@/lib/admin/orders";

// Force this page to always fetch fresh data — never use cached version
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  return <OrdersManager orders={orders} />;
}