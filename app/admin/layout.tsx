import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Admin — FreshCart",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const configured = isSupabaseServerConfigured();

  return (
    <AdminShell>
      {!configured ? (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Add Supabase keys to <code className="font-mono">.env.local</code> and run migrations{" "}
          <code className="font-mono">001_init.sql</code> +{" "}
          <code className="font-mono">002_admin_rls.sql</code> to load live data. Set a
          profile&apos;s <code className="font-mono">role</code> to <code className="font-mono">admin</code>{" "}
          in Supabase to access this panel.
        </p>
      ) : null}
      {children}
    </AdminShell>
  );
}
