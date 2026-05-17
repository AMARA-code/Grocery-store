"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "react-hot-toast";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
