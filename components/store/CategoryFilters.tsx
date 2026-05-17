"use client";

import { motion, AnimatePresence } from "framer-motion";
import { seedCategories } from "@/lib/seed";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

export type CategoryFiltersProps = {
  selected: Category | "All";
  onSelect: (category: Category | "All") => void;
  className?: string;
};

/* Category emoji map */
const CATEGORY_EMOJI: Record<string, string> = {
  All:              "✨",
  "Fruits & Vegetables": "🥦",
  Bakery:           "🥐",
  "Dairy & Eggs":   "🥛",
  "Meat & Seafood": "🐟",
  Pantry:           "🫙",
  Beverages:        "🧃",
};

export function CategoryFilters({ selected, onSelect, className }: CategoryFiltersProps) {
  const categories: Array<Category | "All"> = ["All", ...seedCategories] as Array<Category | "All">;

  return (
    <div
      className={cn(
        "relative rounded-2xl p-1.5",
        className
      )}
      style={{
        background: "rgba(255,255,255,0.85)",
        border: "1px solid rgba(251,146,60,0.15)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 2px 16px rgba(251,146,60,0.07), 0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Subtle inner gradient top line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
        style={{ background: "linear-gradient(90deg, transparent, rgba(251,146,60,0.3), transparent)" }}
      />

      <div className="flex flex-wrap gap-1.5 p-1">
        {categories.map((category, i) => {
          const isActive = selected === category;
          const emoji = CATEGORY_EMOJI[category] ?? "🛒";

          return (
            <motion.button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={!isActive ? { scale: 1.04, y: -1 } : {}}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
              style={{
                color: isActive ? "#ffffff" : "#57534e",
                fontFamily: "'DM Sans', sans-serif",
                zIndex: isActive ? 1 : 0,
              }}
            >
              {/* Active pill background */}
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #fb923c 100%)",
                    boxShadow: "0 4px 14px rgba(249,115,22,0.40), 0 1px 3px rgba(234,88,12,0.25)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Hover ghost for inactive */}
              {!isActive && (
                <span
                  className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-150 hover:opacity-100"
                  style={{ background: "rgba(249,115,22,0.07)" }}
                />
              )}

              {/* Content */}
              <span className="relative flex items-center gap-2">
                <motion.span
                  animate={isActive ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  className="text-base leading-none"
                >
                  {emoji}
                </motion.span>
                <span className="relative">{category}</span>
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative ml-0.5 flex h-1.5 w-1.5 rounded-full bg-white/70"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}