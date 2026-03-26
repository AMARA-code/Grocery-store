import { categories, Category } from "../data/products";

interface Props {
  selected: Category | "All";
  onSelect: (category: Category | "All") => void;
}

function CategoryFilters({ selected, onSelect }: Props) {
  return (
    <div className="category-filters">
      <button
        type="button"
        className={
          selected === "All"
            ? "category-chip category-chip-active"
            : "category-chip"
        }
        onClick={() => onSelect("All")}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={
            selected === category
              ? "category-chip category-chip-active"
              : "category-chip"
          }
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilters;

