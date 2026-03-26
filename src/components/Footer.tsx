import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container footer-inner">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="footer-logo">FreshCart</span>
            <p>Fresh groceries, delivered with care.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Store</h4>
              <Link to="/products">Shop all</Link>
              <Link to="/cart">View cart</Link>
            </div>
            <div>
              <h4>Support</h4>
              <Link to="/contact">Contact</Link>
              <a href="mailto:amaranaeem453@gmail.com">
                Email: amaranaeem453@gmail.com
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-meta">
            © {new Date().getFullYear()} FreshCart. All rights reserved.
          </p>
          <div className="footer-pulse" aria-hidden="true">
            <span />
            <span />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

