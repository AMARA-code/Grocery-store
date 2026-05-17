import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { products } from "../data/products";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container">
        <p>Product not found.</p>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`, {
      style: { fontSize: "0.9rem" }
    });
  };

  return (
    <div className="container product-detail">
      <button
        type="button"
        className="btn btn-ghost product-back"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <div className="product-detail-card">
        <div className="product-detail-image">
          {product.badge && (
            <span className="product-badge">{product.badge}</span>
          )}
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-category">{product.category}</p>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-meta">
            <span className="product-detail-price">
              {formatCurrency(product.price)}
            </span>
            <span className="product-detail-note">
              Price per standard pack • Taxes included
            </span>
          </div>
          <div className="product-detail-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAdd}
            >
              Add to cart
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate("/checkout")}
            >
              Go to checkout
            </button>
          </div>
          <div className="product-inquiry">
            <h2>Ask about this product</h2>
            <p className="product-inquiry-text">
              Have a question about{" "}
              <strong>{product.name}</strong>? Send us a quick message and we&apos;ll
              reply to you by email.
            </p>
            <form
              className="product-inquiry-form"
              action="https://formspree.io/f/mwvrloey"
              method="POST"
            >
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="productName" value={product.name} />
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="inquiry-name">Your name</label>
                  <input
                    id="inquiry-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                  />
                </div>
                <div className="field">
                  <label htmlFor="inquiry-email">Your email</label>
                  <input
                    id="inquiry-email"
                    name="_replyto"
                    type="email"
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="inquiry-message">Message</label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  rows={3}
                  required
                  placeholder="e.g. Do you have this in a larger size?"
                />
              </div>
              <button type="submit" className="btn btn-ghost">
                Send product inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

