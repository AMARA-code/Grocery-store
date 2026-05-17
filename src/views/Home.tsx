import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductGrid from "../components/ProductGrid";

function Home() {
  const featured = products.slice(0, 2);

  return (
    <div className="container home">
      <section className="hero">
        <div className="hero-text">
          <div className="hero-orbits">
            <span className="hero-orbit hero-orbit-lg" />
            <span className="hero-orbit hero-orbit-md" />
            <span className="hero-orbit hero-orbit-sm" />
          </div>
          <span className="pill">Fresh. Fast. Local.</span>
          <h1>
            Grocery shopping,
            <span> reimagined.</span>
          </h1>
          <p>
            Order fresh groceries online with a clean, fast experience. Explore
            fruits, vegetables, bakery, dairy, meat, pantry staples and more.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">
              Start shopping
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Contact us
            </Link>
          </div>
          <p className="hero-meta">Same-day delivery on selected areas.</p>
        </div>
        <div className="hero-card">
          <div className="hero-card-inner">
            <h2>Today&apos;s picks</h2>
            <p>Fresh produce and everyday essentials picked for you.</p>
            <ProductGrid products={featured} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

