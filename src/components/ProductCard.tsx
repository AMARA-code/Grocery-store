import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Product } from "../data/products";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`, {
      style: { fontSize: "0.9rem" }
    });
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-body">
        <div className="product-header">
          <h3 className="product-title">{product.name}</h3>
          <span className="product-price">{formatCurrency(product.price)}</span>
        </div>
        <p className="product-meta">{product.category}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-actions">
          <Link to={`/products/${product.id}`} className="btn btn-ghost">
            View details
          </Link>
          <button className="btn btn-primary" type="button" onClick={handleAdd}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

