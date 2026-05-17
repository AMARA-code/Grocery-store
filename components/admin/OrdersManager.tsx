"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, Clock, Package, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";

type Order = {
  id: string;
  status: string;
  total: number | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  payment_method: string | null;
  payment_provider: string | null;
  transaction_id: string | null;
  items_summary: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
  pending: {
    label: "Pending",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3 w-3" />,
  },
  confirmed: {
    label: "Confirmed",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  processing: {
    label: "Processing",
    classes: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <Package className="h-3 w-3" />,
  },
  delivered: {
    label: "Delivered",
    classes: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle className="h-3 w-3" />,
  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? {
    label: status,
    classes: "bg-gray-50 text-gray-700 border-gray-200",
    icon: null,
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.classes}`}>
      {s.icon}
      {s.label}
    </span>
  );
}

export function OrdersManager({ orders: initialOrders }: { orders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [confirming, setConfirming] = useState<string | null>(null);

  const handleConfirm = async (order: Order) => {
    if (
      !window.confirm(
        `Confirm order #${order.id.slice(0, 8).toUpperCase()} for ${order.customer_name}?\n\nA confirmation email will be sent to ${order.customer_email}.`
      )
    )
      return;

    setConfirming(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}/confirm`, {
        method: "POST",
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Failed to confirm order");
      }

      // Optimistically update status in UI
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "confirmed" } : o))
      );

      toast.success(
        `Order confirmed! Confirmation email sent to ${order.customer_email} ✅`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setConfirming(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-600">
          Review and confirm customer orders. Confirming sends an email to the customer.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 align-top">
                  {/* Order ID */}
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {order.customer_name ?? "—"}
                    </div>
                    <div className="text-xs text-gray-400">{order.customer_email}</div>
                    {order.customer_phone && (
                      <div className="text-xs text-gray-400">{order.customer_phone}</div>
                    )}
                    {order.shipping_address && (
                      <div className="mt-1 text-xs text-gray-400 max-w-[180px] truncate">
                        📍 {order.shipping_address}
                      </div>
                    )}
                  </td>

                  {/* Items */}
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {order.items_summary ?? "—"}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-gray-700 capitalize">
                      {order.payment_method === "cod"
                        ? "Cash on Delivery"
                        : "Advance Payment"}
                    </div>
                    {order.payment_provider && (
                      <div className="text-xs text-gray-400 capitalize">
                        {order.payment_provider}
                      </div>
                    )}
                    {order.transaction_id && (
                      <div className="text-xs text-gray-400 font-mono">
                        TXN: {order.transaction_id}
                      </div>
                    )}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {order.total != null ? formatCurrency(Number(order.total)) : "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-right">
                    {order.status === "pending" ? (
                      <button
                        type="button"
                        onClick={() => void handleConfirm(order)}
                        disabled={confirming === order.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {confirming === order.id ? (
                          <>
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Confirming…
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            Confirm Order
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        {order.status === "confirmed" ? "Confirmed ✓" : "—"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}