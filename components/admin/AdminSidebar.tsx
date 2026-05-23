"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, LogOut, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
] as const;

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.replace("/login");
    router.refresh();
  };

  const email = profile?.email ?? user?.email ?? "Admin";

  return (
    <aside
      className={cn(
        // Base: fixed on mobile, static on desktop
        "fixed inset-y-0 left-0 z-30 flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out",
        "lg:static lg:translate-x-0",
        // Mobile: slide in/out
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-6">
        <Link
          href="/admin"
          className="text-lg font-bold text-green-700"
          onClick={onClose}
        >
          FreshCart Admin
        </Link>
        {/* Close button — mobile only */}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-green-100 text-green-800"
                  : "text-gray-700 hover:bg-gray-50 hover:text-green-700"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4">
        <p className="truncate text-xs text-gray-500">Signed in as</p>
        <p className="truncate text-sm font-medium text-gray-900">{email}</p>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="mt-3 flex w-full items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-600 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  );
}