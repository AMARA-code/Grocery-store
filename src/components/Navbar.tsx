import { useState, FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import CartDrawer from "./CartDrawer";
import Logo from "../assets/logo.svg";

function Navbar() {
  const { totalItems } = useCart();
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (value: string) => {
    setSearch(value);

    // If user clears the search while on the products page,
    // immediately reset the URL so all products are shown again.
    if (!value.trim() && location.pathname.startsWith("/products")) {
      const params = new URLSearchParams(location.search);
      params.delete("search");
      const query = params.toString();
      navigate(query ? `/products?${query}` : "/products", { replace: true });
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    navigate(`/products?${params.toString()}`);
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand">
            <img src={Logo} alt="FreshCart logo" className="navbar-logo" />
            <div className="navbar-brand-text">
              <span className="navbar-title">FreshCart</span>
              <span className="navbar-subtitle">Grocery delivered fresh</span>
            </div>
          </Link>

          <nav className="navbar-links">
            <NavLink to="/" className="navbar-link">
              Home
            </NavLink>
            <NavLink to="/products" className="navbar-link">
              Shop
            </NavLink>
            <NavLink to="/contact" className="navbar-link">
              Contact
            </NavLink>
          </nav>

          <div className="navbar-right">
            {(location.pathname === "/" ||
              location.pathname.startsWith("/products")) && (
              <form className="navbar-search" onSubmit={handleSearch}>
                <input
                  type="search"
                  placeholder="Search fresh groceries..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </form>
            )}
            <button
              type="button"
              className="navbar-cart-btn"
              onClick={() => setShowCart(true)}
              aria-label="Open cart"
            >
              <span className="navbar-cart-icon" />
              {totalItems > 0 && (
                <span className="navbar-cart-badge">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}

export default Navbar;

