"use client";

import { motion } from "framer-motion";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { formatCurrency } from "@/lib/utils";
import type { DashboardStats } from "@/lib/admin/stats";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function DashboardStats({ stats }: { stats: DashboardStats }) {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <StatsCard
        title="Total orders"
        value={String(stats.totalOrders)}
        icon={ShoppingCart}
        accent="green"
      />
      <StatsCard
        title="Revenue"
        value={formatCurrency(stats.revenue)}
        icon={DollarSign}
        accent="blue"
      />
      <StatsCard
        title="Products"
        value={String(stats.productCount)}
        icon={Package}
        accent="amber"
      />
      <StatsCard
        title="Customers"
        value={String(stats.customerCount)}
        icon={Users}
        accent="violet"
      />
    </motion.div>
  );
}
