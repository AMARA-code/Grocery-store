import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="container cart-page">
      <h1 className="page-title">Your cart</h1>
      <p className="page-subtitle">
        {totalItems === 0
          ? "You have no items in your cart yet."
          : `You have ${totalItems} item${totalItems > 1 ? "s" : ""} in your cart.`}
      </p>

      {items.length === 0 ? (
        <div className="cart-empty-state">
          <p>Start exploring fresh groceries and add your favorites to the cart.</p>
          <Link to="/products" className="btn btn-primary">Browse products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {items.map((item) => (
              <article key={item.id} className="cart-row">
                <img src={item.image_url} alt={item.name} />
                <div className="cart-row-main">
                  <h3>{item.name}</h3>
                  <p>{formatCurrency(item.price)}</p>
                  <div className="cart-row-controls">
                    <div className="cart-qty">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button type="button" className="cart-remove" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(totalPrice)}</strong>
            </div>
            <p className="cart-summary-note">
              Delivery and taxes are simulated for this demo experience.
            </p>
            <Link to="/checkout" className="btn btn-primary cart-summary-btn">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export default CartPage;