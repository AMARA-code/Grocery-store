import { getAdminQueries } from "@/lib/admin/queries";
import { QueriesClient } from "@/components/admin/QueriesClient";

export const dynamic = "force-dynamic";

export default async function QueriesPage() {
  const queries = await getAdminQueries();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Queries</h1>
        <p className="mt-1 text-sm text-gray-500">
          Read and reply to messages sent via the contact form.
        </p>
      </div>
      <QueriesClient queries={queries} />
    </div>
  );
}