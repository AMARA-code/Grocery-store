import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentState | null;
  const [processing, setProcessing] = useState(false);

  if (!state) {
    return (
      <div className="container">
        <p>Payment details not found. Please start again from checkout.</p>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const payerName = String(data.get("payerName") || "").trim();
    const cnic = String(data.get("cnic") || "").trim();
    const payerAccount = String(data.get("payerAccount") || "").trim();

    if (!payerName || !cnic || !payerAccount) {
      toast.error("Please fill in all payment details.");
      return;
    }

    const cnicDigits = cnic.replace(/-/g, "");
    if (!/^\d{13}$/.test(cnicDigits)) {
      toast.error("Please enter a valid 13-digit CNIC (with or without dashes).");
      return;
    }

    const accountDigits = payerAccount.replace(/\s+/g, "");
    if (!/^\d{10,20}$/.test(accountDigits)) {
      toast.error("Please enter a valid bank account number (10–20 digits).");
      return;
    }

    setProcessing(true);

    // Send payment details to backend. Backend will always mark the payment
    // as successful unless there is a network/server error.
    fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderId: state.orderId,
        name: state.name,
        email: state.email,
        amount: state.total,
        payerName,
        cnic,
        payerAccount: accountDigits
      })
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Payment API returned an error");
        }
        await response.json();
        navigate("/payment-success", { state });
      })
      .catch(() => {
        toast.error("We could not reach the payment server. Please try again.");
        navigate("/payment-failure", { state });
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  return (
    <div className="container">
      <h1 className="page-title">Secure bank payment</h1>
      <p className="page-subtitle">
        Complete your advance payment for order <strong>{state.orderId}</strong>.
      </p>

      <div className="checkout-grid">
        <section className="checkout-section">
          <h2>Payment details</h2>
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="payerName">Account holder name</label>
              <input
                id="payerName"
                name="payerName"
                type="text"
                placeholder={state.name}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="cnic">CNIC</label>
              <input
                id="cnic"
                name="cnic"
                type="text"
                placeholder="12345-1234567-1"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="payerAccount">Your bank account number</label>
              <input
                id="payerAccount"
                name="payerAccount"
                type="text"
                inputMode="numeric"
                placeholder="Enter your account number"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary checkout-submit"
              disabled={processing}
            >
              {processing ? "Verifying payment..." : "Confirm payment details"}
            </button>
            <p className="checkout-note">
              This project does not connect directly to your bank. Use these details only
              in a safe test environment.
            </p>
          </form>
        </section>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <div className="checkout-items">
            <div className="checkout-item-main">
              <span>Items</span>
              <span>{state.itemCount}</span>
            </div>
          </div>
          <div className="checkout-total">
            <span>Amount to pay</span>
            <strong>{formatCurrency(state.total)}</strong>
          </div>
          <div className="checkout-note">
            <p>
              Please send your advance payment to the following account:
              <br />
              <strong>Account number: 2205 4630 1214 6428</strong>
            </p>
          </div>
          <div className="checkout-note">
            <p>
              Delivery address:
              <br />
              {state.address}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Payment;

