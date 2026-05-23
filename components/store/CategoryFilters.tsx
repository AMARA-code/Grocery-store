"use client";

import { motion } from "framer-motion";
import { seedCategories } from "@/lib/seed";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

export type CategoryFiltersProps = {
  selected: Category | "All";
  onSelect: (category: Category | "All") => void;
  className?: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  All:                   "All",
  "Fruits & Vegetables": "Fruits & Veg",
  Bakery:                "Bakery",
  "Dairy & Eggs":        "Dairy & Eggs",
  "Meat & Seafood":      "Meat & Seafood",
  Pantry:                "Pantry",
  Beverages:             "Beverages",
};

export function CategoryFilters({ selected, onSelect, className }: CategoryFiltersProps) {
  const categories: Array<Category | "All"> = ["All", ...seedCategories] as Array<Category | "All">;

  return (
    <div className={cn("w-full", className)}>
      {/* Scrollable track — no wrap, single line on all sizes */}
      <div className="relative">
        {/* Fade edges to hint at scroll */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 z-10
          bg-gradient-to-r from-[#fffbf5] to-transparent sm:hidden" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 z-10
          bg-gradient-to-l from-[#fffbf5] to-transparent sm:hidden" />

        <div
          className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, i) => {
            const isActive = selected === category;
            const label    = CATEGORY_LABELS[category] ?? category;

            return (
              <motion.button
                key={category}
                type="button"
                onClick={() => onSelect(category)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={!isActive ? { y: -1 } : {}}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold",
                  "transition-all duration-200 whitespace-nowrap",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2",
                  isActive
                    ? "text-white shadow-md"
                    : "text-stone-500 bg-white border border-stone-200 hover:border-orange-200 hover:text-stone-700"
                )}
              >
                {/* Active background */}
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      boxShadow:  "0 4px 12px rgba(249,115,22,0.35)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}

                <span className="relative">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Thin divider below */}
      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-orange-100 to-transparent" />
    </div>
  );
}