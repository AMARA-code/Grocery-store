import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../hooks/useCart";

function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const address = String(data.get("address") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    if (!name || !email || !address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const orderId = `FC-${Math.floor(Math.random() * 899999 + 100000)}`;

    // Send order details to Formspree so you receive an email.
    try {
      const fsData = new FormData();
      fsData.append("orderId", orderId);
      fsData.append("name", name);
      fsData.append("email", email);
      fsData.append("phone", phone);
      fsData.append("address", address);
      fsData.append("total", totalPrice.toFixed(2));
      fsData.append(
        "items",
        items
          .map(
            (item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
          )
          .join("\n")
      );
      fsData.append("paymentMethod", "Cash on delivery");

      // Formspree endpoint configured for amaranaeem453@gmail.com
      fetch("https://formspree.io/f/mwvrloey", {
        method: "POST",
        body: fsData,
        headers: {
          Accept: "application/json"
        }
      }).catch(() => {
        // Ignore network errors here; the order can still be shown in the UI.
      });
    } catch {
      // ignore Formspree errors silently
    }

    setSubmitting(true);

    setTimeout(() => {
      clearCart();
      navigate("/order-confirmation", {
        state: {
          orderId,
          name,
          email,
          total: totalPrice,
          itemCount: items.reduce((sum, i) => sum + i.quantity, 0)
        }
      });
    }, 900);
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <div className="checkout-grid">
        <section className="checkout-section">
          <h2>Contact information</h2>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Emma Green"
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="phone">Phone (for delivery updates)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="field">
            <label htmlFor="address">Delivery address</label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              placeholder="Street, city, state, ZIP"
            />
          </div>
        </section>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          {items.length === 0 ? (
            <p className="checkout-empty">Your cart is empty.</p>
          ) : (
            <>
              <ul className="checkout-items">
                {items.map((item) => (
                  <li key={item.id}>
                    <div className="checkout-item-main">
                      <span>{item.name}</span>
                      <span>×{item.quantity}</span>
                    </div>
                    <span className="checkout-item-sub">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="checkout-total">
                <span>Total</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
              <button
                type="submit"
                className="btn btn-primary checkout-submit"
                disabled={submitting}
              >
                {submitting ? "Placing order..." : "Place order"}
              </button>
            </>
          )}
        </aside>
      </div>
    </form>
  );
}

export default CheckoutForm;

