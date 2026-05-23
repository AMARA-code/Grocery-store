// components/admin/DashboardStats.tsx
import type { DashboardStatsData } from "@/lib/admin/stats";
import { formatCurrency } from "@/lib/utils";

function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub,
  breakdown,
  warning,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  sub?: string;
  breakdown?: { label: string; value: string }[];
  warning?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md flex flex-col gap-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      {breakdown && breakdown.length > 0 && (
        <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
          {breakdown.map((b) => (
            <div key={b.label} className="flex justify-between text-xs text-gray-500">
              <span>{b.label}</span>
              <span className="font-medium text-gray-700">{b.value}</span>
            </div>
          ))}
        </div>
      )}
      {warning && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
          ⏳ {warning}
        </p>
      )}
    </div>
  );
}

const CartIcon = () => (
  <svg className="text-green-700" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 1 0 2 0 1 1 0 0 0-2 0m7 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
  </svg>
);

const RevenueIcon = () => (
  <svg className="text-blue-700" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ProductIcon = () => (
  <svg className="text-orange-700" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const CustomerIcon = () => (
  <svg className="text-purple-700" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export function DashboardStats({ stats }: { stats: DashboardStatsData }) {
  const pendingParts: string[] = [];
  if (stats.pendingAdvanceCount > 0)
    pendingParts.push(`${stats.pendingAdvanceCount} advance payment${stats.pendingAdvanceCount > 1 ? "s" : ""} awaiting verification`);
  if (stats.pendingCodCount > 0)
    pendingParts.push(`${stats.pendingCodCount} COD order${stats.pendingCodCount > 1 ? "s" : ""} pending delivery`);

  const totalCustomers = stats.totalCustomers + stats.totalGuests;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* Total orders */}
      <StatCard
        icon={<CartIcon />}
        iconBg="bg-green-100"
        label="Total orders"
        value={stats.totalOrders}
      />

      {/* Revenue — verified only */}
      <StatCard
        icon={<RevenueIcon />}
        iconBg="bg-blue-100"
        label="Revenue"
        value={formatCurrency(stats.totalRevenue)}
        breakdown={[
          { label: "Advance verified", value: formatCurrency(stats.advanceRevenue) },
          { label: "COD collected",    value: formatCurrency(stats.codRevenue) },
        ]}
        warning={pendingParts.length > 0 ? pendingParts.join(" · ") : undefined}
      />

      {/* Products */}
      <StatCard
        icon={<ProductIcon />}
        iconBg="bg-orange-100"
        label="Products"
        value={stats.totalProducts}
      />

      {/* Customers — registered accounts + guest checkouts combined */}
      <StatCard
        icon={<CustomerIcon />}
        iconBg="bg-purple-100"
        label="Customers"
        value={totalCustomers}
        breakdown={[
          { label: "Registered", value: String(stats.totalCustomers) },
          { label: "Guests",     value: String(stats.totalGuests) },
        ]}
      />

    </div>
  );
}