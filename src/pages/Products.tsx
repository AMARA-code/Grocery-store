import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { products, Category } from "../data/products";
import CategoryFilters from "../components/CategoryFilters";
import ProductGrid from "../components/ProductGrid";

function useSearchQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get("search") || "", [search]);
}

function Products() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All"
  );
  const search = useSearchQuery();

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory;
        const term = search.toLowerCase();
        const matchesSearch =
          !term ||
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term);
        return matchesCategory && matchesSearch;
      }),
    [selectedCategory, search]
  );

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shop groceries</h1>
          <p className="page-subtitle">
            Browse fresh produce, pantry staples, beverages, and more.
          </p>
        </div>
        {search && (
          <span className="search-pill">
            Showing results for <strong>{search}</strong>
          </span>
        )}
      </div>
      <CategoryFilters
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <ProductGrid products={filtered} />
    </div>
  );
}

export default Products;

