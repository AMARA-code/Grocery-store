import { Link, useLocation } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

interface OrderState {
  orderId?: string;
  name?: string;
  email?: string;
  total?: number;
  itemCount?: number;
}

function OrderConfirmation() {
  const location = useLocation();
  const state = (location.state || {}) as OrderState;

  const orderId = state.orderId || "FC-000000";
  const name = state.name || "there";
  const email = state.email || "your inbox";
  const itemCount = state.itemCount ?? 0;
  const total = state.total ?? 0;

  return (
    <div className="container order-confirmation">
      <span className="pill">Order placed</span>
      <h1 className="page-title">Thank you, {name}!</h1>
      <p className="page-subtitle">
        We&apos;ve received your order. A confirmation email will be sent to{" "}
        <strong>{email}</strong>.
      </p>
      <div className="order-card">
        <div className="order-row">
          <span>Order ID</span>
          <strong>{orderId}</strong>
        </div>
        <div className="order-row">
          <span>Items</span>
          <strong>{itemCount}</strong>
        </div>
        <div className="order-row">
          <span>Estimated total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
        <p className="order-note">
          If you have any questions about this order, contact us at{" "}
          <a href="mailto:amaranaeem453@gmail.com">
            amaranaeem453@gmail.com
          </a>{" "}
          or call{" "}
          <a href="tel:03346445127">03346445127</a>.
        </p>
      </div>
      <div className="order-actions">
        <Link to="/products" className="btn btn-primary">
          Continue shopping
        </Link>
        <Link to="/" className="btn btn-ghost">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;

