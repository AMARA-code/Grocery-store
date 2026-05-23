import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { formatCurrency } from "../utils/formatCurrency";
import type { AdminOrderRow, RevenueSummary } from "../../types";
import toast from "react-hot-toast";

// ── Supabase client (anon key is fine here — RLS policies allow admin) ──
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Map raw DB row → AdminOrderRow ──────────────────────────────────────
function mapRow(r: Record<string, unknown>): AdminOrderRow {
  return {
    id: r.id as string,
    status: (r.status as string) ?? "pending",
    total: r.total as number | null,
    created_at: r.created_at as string,
    customerName: (r.customer_name as string) ?? null,
    customerEmail: (r.customer_email as string) ?? null,
    customerPhone: (r.customer_phone as string) ?? null,
    shippingAddress: (r.shipping_address as string) ?? null,
    itemsSummary: (r.items_summary as string) ?? null,
    paymentMethod: (r.payment_method as string) ?? null,
    paymentProvider: (r.payment_provider as string) ?? null,
    transactionId: (r.transaction_id as string) ?? null,
    paymentVerified: Boolean(r.payment_verified),
    cashCollected: Boolean(r.cash_collected),
    revenueCounted: Boolean(r.revenue_counted),
    guestName: (r.guest_name as string) ?? null,
    guestEmail: (r.guest_email as string) ?? null,
    guestPhone: (r.guest_phone as string) ?? null,
  };
}

// ── Status badge colours ────────────────────────────────────────────────
function statusClass(status: string) {
  switch (status) {
    case "delivered":  return "badge badge-green";
    case "processing": return "badge badge-blue";
    case "shipped":    return "badge badge-purple";
    case "cancelled":  return "badge badge-red";
    default:           return "badge badge-yellow";   // pending
  }
}

// ── Payment method label ────────────────────────────────────────────────
function paymentLabel(method: string | null) {
  if (method === "advance") return "Advance (bank)";
  if (method === "cod")     return "Cash on Delivery";
  return method ?? "—";
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AdminOrders component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ── Fetch orders + revenue summary ──────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, summaryRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("revenue_summary")
          .select("*")
          .single(),
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (summaryRes.error) throw summaryRes.error;

      setOrders((ordersRes.data ?? []).map(mapRow));
      setSummary(summaryRes.data as RevenueSummary);
    } catch (err) {
      console.error("fetchData error:", err);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // ── Action: verify advance payment ───────────────────────────
  const handleVerifyPayment = async (orderId: string) => {
    setActionLoading(orderId + "_verify");
    try {
      const res = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json() as { ok: boolean; message: string };
      if (!data.ok) throw new Error(data.message);
      toast.success("Payment verified — revenue updated!");
      await fetchData();
    } catch (err) {
      toast.error((err as Error).message ?? "Action failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Action: mark COD delivered + cash received ───────────────
  const handleMarkDelivered = async (orderId: string) => {
    setActionLoading(orderId + "_deliver");
    try {
      const res = await fetch("/api/admin/mark-delivered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json() as { ok: boolean; message: string };
      if (!data.ok) throw new Error(data.message);
      toast.success("Order marked delivered — cash revenue recorded!");
      await fetchData();
    } catch (err) {
      toast.error((err as Error).message ?? "Action failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Action: update status (general) ─────────────────────────
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setActionLoading(orderId + "_status");
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      if (error) throw error;
      toast.success(`Order status → ${newStatus}`);
      await fetchData();
    } catch (err) {
      toast.error("Status update failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Render
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div className="admin-orders">

      {/* ── Revenue dashboard ─────────────────────────────── */}
      <section className="admin-revenue-cards">
        <h2 className="admin-section-title">Revenue overview</h2>

        {summary ? (
          <div className="revenue-grid">

            {/* Total confirmed revenue */}
            <div className="revenue-card revenue-card--primary">
              <span className="revenue-card__label">Total confirmed revenue</span>
              <span className="revenue-card__value">
                {formatCurrency(summary.total_revenue)}
              </span>
              <span className="revenue-card__sub">
                Advance verified + COD collected
              </span>
            </div>

            {/* Advance payments */}
            <div className="revenue-card">
              <span className="revenue-card__label">Advance payments</span>
              <span className="revenue-card__value">
                {formatCurrency(summary.advance_revenue)}
              </span>
              <span className="revenue-card__sub">
                {summary.pending_advance_count} pending verification
              </span>
            </div>

            {/* COD collected */}
            <div className="revenue-card">
              <span className="revenue-card__label">COD collected</span>
              <span className="revenue-card__value">
                {formatCurrency(summary.cod_revenue)}
              </span>
              <span className="revenue-card__sub">
                {summary.pending_cod_count} out for delivery
              </span>
            </div>

            {/* Orders */}
            <div className="revenue-card">
              <span className="revenue-card__label">Total orders</span>
              <span className="revenue-card__value">{summary.total_orders}</span>
            </div>

            {/* Guests */}
            <div className="revenue-card">
              <span className="revenue-card__label">Guest buyers</span>
              <span className="revenue-card__value">{summary.total_guests}</span>
              <span className="revenue-card__sub">Unique guest emails</span>
            </div>

            {/* Registered customers */}
            <div className="revenue-card">
              <span className="revenue-card__label">Registered customers</span>
              <span className="revenue-card__value">{summary.total_customers}</span>
            </div>

          </div>
        ) : (
          <p className="admin-loading">Loading summary…</p>
        )}
      </section>

      {/* ── Orders table ──────────────────────────────────── */}
      <section className="admin-orders-table-section">
        <div className="admin-orders-header">
          <h2 className="admin-section-title">All orders</h2>
          <button className="btn btn-ghost btn-sm" onClick={fetchData}>
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <p className="admin-loading">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="admin-empty">No orders yet.</p>
        ) : (
          <div className="admin-orders-list">
            {orders.map((order) => (
              <div key={order.id} className="admin-order-card">

                {/* ── Order header ── */}
                <div className="admin-order-card__header">
                  <div className="admin-order-card__id">
                    <span className="mono">{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="admin-order-card__date">
                      {new Date(order.created_at).toLocaleDateString("en-PK", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="admin-order-card__badges">
                    <span className={statusClass(order.status)}>
                      {order.status}
                    </span>

                    {/* Revenue badge */}
                    {order.revenueCounted ? (
                      <span className="badge badge-green">✓ Revenue counted</span>
                    ) : (
                      <span className="badge badge-yellow">⏳ Pending revenue</span>
                    )}
                  </div>
                </div>

                {/* ── Customer info ── */}
                <div className="admin-order-card__body">
                  <div className="admin-order-card__col">
                    <p className="admin-order-card__field-label">Customer</p>
                    <p>
                      {order.customerName ?? order.guestName ?? "—"}
                      {!order.customerName && order.guestName && (
                        <span className="guest-badge"> (guest)</span>
                      )}
                    </p>
                    <p className="muted">{order.customerEmail ?? order.guestEmail ?? "—"}</p>
                    <p className="muted">{order.customerPhone ?? order.guestPhone ?? "—"}</p>
                  </div>

                  <div className="admin-order-card__col">
                    <p className="admin-order-card__field-label">Shipping</p>
                    <p className="muted">{order.shippingAddress ?? "—"}</p>
                  </div>

                  <div className="admin-order-card__col">
                    <p className="admin-order-card__field-label">Items</p>
                    <p className="muted">{order.itemsSummary ?? "—"}</p>
                  </div>

                  <div className="admin-order-card__col">
                    <p className="admin-order-card__field-label">Payment</p>
                    <p>{paymentLabel(order.paymentMethod)}</p>
                    {order.paymentProvider && (
                      <p className="muted">{order.paymentProvider}</p>
                    )}
                    {order.transactionId && (
                      <p className="muted mono">{order.transactionId}</p>
                    )}
                  </div>

                  <div className="admin-order-card__col">
                    <p className="admin-order-card__field-label">Total</p>
                    <p className="admin-order-card__total">
                      {order.total != null ? formatCurrency(order.total) : "—"}
                    </p>
                  </div>
                </div>

                {/* ── Actions ── */}
                <div className="admin-order-card__actions">

                  {/* Status dropdown */}
                  <div className="admin-order-card__status-wrap">
                    <label htmlFor={`status-${order.id}`} className="sr-only">
                      Change status
                    </label>
                    <select
                      id={`status-${order.id}`}
                      className="admin-select"
                      value={order.status}
                      disabled={actionLoading === order.id + "_status"}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* ── Advance payment: verify button ── */}
                  {order.paymentMethod === "advance" && !order.paymentVerified && (
                    <button
                      className="btn btn-success btn-sm"
                      disabled={actionLoading === order.id + "_verify"}
                      onClick={() => handleVerifyPayment(order.id)}
                    >
                      {actionLoading === order.id + "_verify"
                        ? "Verifying…"
                        : "✓ Verify payment received"}
                    </button>
                  )}

                  {order.paymentMethod === "advance" && order.paymentVerified && (
                    <span className="admin-confirmed-tag">
                      ✓ Payment verified
                    </span>
                  )}

                  {/* ── COD: mark delivered + cash received button ── */}
                  {order.paymentMethod === "cod" && !order.cashCollected && (
                    <button
                      className="btn btn-success btn-sm"
                      disabled={actionLoading === order.id + "_deliver"}
                      onClick={() => handleMarkDelivered(order.id)}
                    >
                      {actionLoading === order.id + "_deliver"
                        ? "Saving…"
                        : "✓ Mark delivered + cash received"}
                    </button>
                  )}

                  {order.paymentMethod === "cod" && order.cashCollected && (
                    <span className="admin-confirmed-tag">
                      ✓ Delivered & cash collected
                    </span>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}