import { Link, useLocation, useNavigate } from "react-router-dom";
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

function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as PaymentState;

  const orderId = state.orderId || "FC-000000";
  const total = state.total ?? 0;

  const handleRetry = () => {
    navigate("/payment", { state });
  };

  return (
    <div className="container order-confirmation">
      <span className="pill">Payment not completed</span>
      <h1 className="page-title">We couldn&apos;t process your payment</h1>
      <p className="page-subtitle">
        Your card payment for order <strong>{orderId}</strong> was not completed. No
        money has been charged.
      </p>
      <div className="order-card">
        <div className="order-row">
          <span>Order ID</span>
          <strong>{orderId}</strong>
        </div>
        <div className="order-row">
          <span>Amount</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
        <p className="order-note">
          You can try again with your card, or choose Cash on Delivery as an alternative
          payment method on the checkout page.
        </p>
      </div>
      <div className="order-actions">
        <button type="button" className="btn btn-primary" onClick={handleRetry}>
          Try payment again
        </button>
        <Link to="/checkout" className="btn btn-ghost">
          Choose cash on delivery
        </Link>
        <Link to="/cart" className="btn btn-ghost">
          Back to cart
        </Link>
      </div>
    </div>
  );
}

export default PaymentFailure;

