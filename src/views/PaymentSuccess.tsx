import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

interface PaymentState {
  orderId: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
  total: number;
  itemCount: number;
}

function PaymentSuccess() {
  const location = useLocation();
  const state = (location.state || {}) as PaymentState;
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const orderId = state.orderId || "FC-000000";
  const name = state.name || "there";
  const email = state.email || "your email";
  const total = state.total ?? 0;

  return (
    <div className="container order-confirmation">
      <span className="pill">Payment successful</span>
      <h1 className="page-title">Thank you, {name}!</h1>
      <p className="page-subtitle">
        Your payment has been approved and your order is confirmed. A receipt will be
        sent to <strong>{email}</strong>.
      </p>
      <div className="order-card">
        <div className="order-row">
          <span>Order ID</span>
          <strong>{orderId}</strong>
        </div>
        <div className="order-row">
          <span>Payment method</span>
          <strong>Advance card payment</strong>
        </div>
        <div className="order-row">
          <span>Paid amount</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
        <p className="order-note">
          If you have any questions about this order, contact us at{" "}
          <a href="mailto:amaranaeem453@gmail.com">
            amaranaeem453@gmail.com
          </a>{" "}
          or call <a href="tel:03346445127">03346445127</a>.
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

export default PaymentSuccess;

