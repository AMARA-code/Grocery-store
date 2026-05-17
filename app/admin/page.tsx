import Link from "next/link";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { getDashboardStats } from "@/lib/admin/stats";
import { Button } from "@/components/ui/Button";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your store performance.</p>
        </div>
        <div className="flex gap-2">
          <Button href="/admin/products" variant="secondary">
            Manage products
          </Button>
          <Button href="/" variant="ghost">
            View store
          </Button>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900">Quick links</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/admin/orders" className="text-green-700 hover:underline">
              Review recent orders →
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className="text-green-700 hover:underline">
              Add or edit products →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
