"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  confirmCodOrder,
  confirmAdvancePayment,
  markOrderShipped,
  markCashCollected,
  markAdvanceDelivered,
} from "@/lib/admin/orders";
import type { getAdminOrders } from "@/lib/admin/orders";

type Order = Awaited<ReturnType<typeof getAdminOrders>>[number];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatCurrency(amount: number | null) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    pending:    { bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400",  label: "Pending"    },
    processing: { bg: "bg-sky-50",     text: "text-sky-700",    dot: "bg-sky-400",    label: "Processing" },
    shipped:    { bg: "bg-orange-50",  text: "text-orange-700", dot: "bg-orange-400", label: "Shipped"    },
    delivered:  { bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-400",label: "Delivered"  },
    cancelled:  { bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-400",    label: "Cancelled"  },
  };
  const s = map[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function PaymentBadge({ method }: { method: string | null }) {
  if (method === "advance") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
        💳 Advance
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
      💵 COD
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Action Button
// ─────────────────────────────────────────────────────────────────────────────
function ActionButton({
  label, loadingLabel, variant, loading, disabled, onClick,
}: {
  label: string; loadingLabel: string;
  variant: "green" | "orange" | "purple" | "ghost";
  loading: boolean; disabled: boolean;
  onClick: () => void;
}) {
  const variants = {
    green:  "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200",
    orange: "bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-200",
    purple: "bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-200",
    ghost:  "bg-gray-100 hover:bg-gray-200 text-gray-700",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {loading ? (
        <>
          <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          {loadingLabel}
        </>
      ) : label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Workflow Actions — receives onUpdate to patch local state immediately
// ─────────────────────────────────────────────────────────────────────────────
function WorkflowActions({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (patch: Partial<Order>) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const run = (
    key: string,
    fn: () => Promise<void>,
    successMsg: string,
    patch: Partial<Order>,
  ) => {
    setActiveAction(key);
    startTransition(async () => {
      try {
        await fn();
        onUpdate(patch);          // ← update local state immediately
        toast.success(successMsg);
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setActiveAction(null);
      }
    });
  };

  const busy    = (key: string) => isPending && activeAction === key;
  const anyBusy = isPending && activeAction !== null;
  const isCod     = order.payment_method === "cod";
  const isAdvance = order.payment_method === "advance";
  const status    = order.status;

  // ── Delivered ──────────────────────────────────────────────────────────────
  if (status === "delivered") {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          ✓ Order complete
        </div>
        {isCod && order.cash_collected && (
          <p className="text-center text-xs text-emerald-600 font-medium">💵 Cash collected</p>
        )}
        {isAdvance && order.payment_verified && (
          <p className="text-center text-xs text-violet-600 font-medium">💳 Advance paid</p>
        )}
      </div>
    );
  }

  // ── Shipped ────────────────────────────────────────────────────────────────
  if (status === "shipped") {
    return (
      <div className="space-y-2">
        {isCod && (
          <ActionButton
            label="✓ Delivered + Cash Collected"
            loadingLabel="Saving…"
            variant="green"
            loading={busy("cash")}
            disabled={anyBusy}
            onClick={() =>
              run(
                "cash",
                () => markCashCollected(order.id),
                "Cash collected — order complete!",
                { status: "delivered", cash_collected: true },
              )
            }
          />
        )}
        {isAdvance && (
          <ActionButton
            label="✓ Mark as Delivered"
            loadingLabel="Saving…"
            variant="green"
            loading={busy("adv-deliver")}
            disabled={anyBusy}
            onClick={() =>
              run(
                "adv-deliver",
                () => markAdvanceDelivered(order.id),
                "Order marked as delivered!",
                { status: "delivered" },
              )
            }
          />
        )}
      </div>
    );
  }

  // ── Processing ─────────────────────────────────────────────────────────────
  if (status === "processing") {
    return (
      <div className="space-y-2">
        <p className="text-center text-xs font-medium text-sky-600">
          {isCod ? "✓ Confirmed — bill emailed" : ""}
          {isAdvance ? "💳 Payment verified" : ""}
        </p>
        <ActionButton
          label="🚚 Mark as Shipped"
          loadingLabel="Updating…"
          variant="orange"
          loading={busy("ship")}
          disabled={anyBusy}
          onClick={() =>
            run(
              "ship",
              () => markOrderShipped(order.id),
              "Shipment email sent to customer!",
              { status: "shipped", order_shipped: true },
            )
          }
        />
      </div>
    );
  }

  // ── Pending ────────────────────────────────────────────────────────────────
  if (status === "pending") {
    return (
      <div className="space-y-2">
        {isCod && (
          <ActionButton
            label="✓ Confirm Order"
            loadingLabel="Confirming…"
            variant="green"
            loading={busy("confirm-cod")}
            disabled={anyBusy}
            onClick={() =>
              run(
                "confirm-cod",
                () => confirmCodOrder(order.id),
                "Order confirmed — bill emailed!",
                { status: "processing", order_confirmed: true },
              )
            }
          />
        )}
        {isAdvance && (
          <ActionButton
            label="💳 Verify Payment Received"
            loadingLabel="Verifying…"
            variant="purple"
            loading={busy("confirm-adv")}
            disabled={anyBusy}
            onClick={() =>
              run(
                "confirm-adv",
                () => confirmAdvancePayment(order.id),
                "Payment verified — receipt emailed!",
                { status: "processing", payment_verified: true, order_confirmed: true },
              )
            }
          />
        )}
        {!isCod && !isAdvance && (
          <span className="text-xs italic text-gray-400">Unknown payment method</span>
        )}
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Order Card — has its own local copy of order data
// ─────────────────────────────────────────────────────────────────────────────
function OrderCard({
  order: initialOrder,
  onUpdate,
}: {
  order: Order;
  onUpdate: (patch: Partial<Order>) => void;
}) {
  const [order, setOrder] = useState<Order>(initialOrder);

  const handleUpdate = (patch: Partial<Order>) => {
    setOrder((prev) => ({ ...prev, ...patch }));
    onUpdate(patch);
  };

  const displayName  = order.customer_name  ?? order.guest_name  ?? "—";
  const displayEmail = order.customer_email ?? order.guest_email ?? "—";
  const displayPhone = order.customer_phone ?? order.guest_phone ?? "—";
  const isGuest      = !order.customer_name && !!order.guest_name;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden">

      {/* Coloured left accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
        order.status === "delivered"  ? "bg-emerald-400" :
        order.status === "shipped"    ? "bg-orange-400"  :
        order.status === "processing" ? "bg-sky-400"     :
        order.status === "cancelled"  ? "bg-red-400"     :
        "bg-amber-400"
      }`} />

      <div className="pl-5 pr-4 py-4">

        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="font-mono text-xs font-bold text-gray-400 tracking-wider">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {new Date(order.created_at).toLocaleDateString("en-PK", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Customer */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Customer</p>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {displayName}
              {isGuest && (
                <span className="ml-1.5 text-[10px] font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  guest
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
            <p className="text-xs text-gray-500">{displayPhone}</p>
            {order.shipping_address && (
              <p className="text-[11px] text-gray-400 flex items-start gap-1 mt-1 leading-relaxed">
                <span className="shrink-0 mt-px">📍</span>
                <span className="line-clamp-2">{order.shipping_address}</span>
              </p>
            )}
          </div>

          {/* Items */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Items</p>
            <p className="text-sm text-gray-700 leading-relaxed">{order.items_summary ?? "—"}</p>
            <p className="text-sm font-bold text-gray-900 mt-2">{formatCurrency(order.total)}</p>
          </div>

          {/* Payment */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Payment</p>
            <PaymentBadge method={order.payment_method} />
            {order.payment_provider && (
              <p className="text-xs text-gray-500 capitalize">{order.payment_provider}</p>
            )}
            {order.transaction_id && (
              <p className="text-[11px] text-gray-400 font-mono break-all">
                TXN: {order.transaction_id}
              </p>
            )}
            <div>
              {order.revenue_counted ? (
                <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5 font-medium">
                  ✓ Revenue counted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 rounded-full px-2 py-0.5 font-medium">
                  ⏳ Pending revenue
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Actions</p>
            <WorkflowActions order={order} onUpdate={handleUpdate} />
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats bar — derived from live orders state
// ─────────────────────────────────────────────────────────────────────────────
function StatsBar({ orders }: { orders: Order[] }) {
  const counts = {
    pending:    orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    delivered:  orders.filter(o => o.status === "delivered").length,
  };
  const totalRevenue = orders
    .filter(o => o.revenue_counted)
    .reduce((sum, o) => sum + (o.total ?? 0), 0);

  const stats = [
    { label: "Pending",    value: counts.pending,    color: "text-amber-600",   bg: "bg-amber-50"   },
    { label: "Processing", value: counts.processing, color: "text-sky-600",     bg: "bg-sky-50"     },
    { label: "Delivered",  value: counts.delivered,  color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className={`rounded-xl ${s.bg} px-4 py-3`}>
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
        </div>
      ))}
      <div className="rounded-xl bg-gray-900 px-4 py-3">
        <p className="text-2xl font-bold text-white">
          {new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(totalRevenue)}
        </p>
        <p className="text-xs text-gray-400 font-medium mt-0.5">Revenue counted</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter tabs
// ─────────────────────────────────────────────────────────────────────────────
const FILTERS = ["all", "pending", "processing", "shipped", "delivered"] as const;
type Filter = typeof FILTERS[number];

// ─────────────────────────────────────────────────────────────────────────────
// Main export — owns the orders array in state so updates propagate everywhere
// ─────────────────────────────────────────────────────────────────────────────
export function OrdersManager({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<Filter>("all");

  // Called by each OrderCard when its local state changes,
  // so the stats bar and filter counts stay accurate
  const handleOrderUpdate = (id: string, patch: Partial<Order>) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, ...patch } : o))
    );
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Confirm orders, track shipments, and collect payments.
          </p>
        </div>
        <p className="text-sm text-gray-400 font-medium shrink-0">
          {orders.length} total order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-400 text-sm font-medium">No orders yet.</p>
          <p className="text-gray-300 text-xs mt-1">Orders will appear here once customers place them.</p>
        </div>
      ) : (
        <>
          <StatsBar orders={orders} />

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                  filter === f
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all"
                  ? `All (${orders.length})`
                  : `${f} (${orders.filter(o => o.status === f).length})`}
              </button>
            ))}
          </div>

          {/* Order cards */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
                <p className="text-gray-400 text-sm">No {filter} orders.</p>
              </div>
            ) : (
              filtered.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdate={(patch) => handleOrderUpdate(order.id, patch)}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}