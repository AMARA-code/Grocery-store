"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatsCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  accent?: "green" | "blue" | "amber" | "violet";
};

const accents: Record<NonNullable<StatsCardProps["accent"]>, string> = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
};

export const statsCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function StatsCard({ title, value, icon: Icon, accent = "green" }: StatsCardProps) {
  return (
    <motion.article
      variants={statsCardVariants}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-xl"
    >
      <motion.div
        className={cn("mb-4 inline-flex rounded-xl p-3", accents[accent])}
        whileHover={{ scale: 1.05 }}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </motion.div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </motion.article>
  );
}
