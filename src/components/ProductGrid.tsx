import { Product } from "../data/products";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="product-empty">
        <h3>No results</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;

