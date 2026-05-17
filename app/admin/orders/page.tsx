import { OrdersManager } from "@/components/admin/OrdersManager";
import { getAdminOrders } from "@/lib/admin/orders";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return <OrdersManager orders={orders} />;
}
