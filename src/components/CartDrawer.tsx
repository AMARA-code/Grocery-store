import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function CartDrawer({ isOpen, onClose }: Props) {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={isOpen ? "cart-drawer-overlay cart-drawer-open" : "cart-drawer-overlay"}
      aria-hidden={!isOpen}
      onClick={handleOverlayClick}
    >
      <div className="cart-drawer">
        <header className="cart-drawer-header">
          <h2>Your cart</h2>
          <button type="button" className="cart-drawer-close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </header>
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.image_url} alt={item.name} />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{formatCurrency(item.price)}</p>
                    <div className="cart-item-controls">
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
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="cart-drawer-footer">
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatCurrency(totalPrice)}</strong>
          </div>
          <button
            type="button"
            className="btn btn-primary cart-checkout-btn"
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </footer>
      </div>
    </div>
  );
}

export default CartDrawer;