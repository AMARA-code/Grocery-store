"use client";

import {
  Suspense, useCallback, useEffect, useState, type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";

function navLinkClass(active: boolean) {
  return cn(
    "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
    active
      ? "bg-brand-orange text-white shadow-sm"
      : "text-stone-600 hover:bg-orange-50 hover:text-brand-orange"
  );
}

function NavbarClient() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { totalItems } = useCart();
  const { user, profile } = useAuth();
  const [search,     setSearch]     = useState("");
  const [showCart,   setShowCart]   = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = profile?.role === "admin";

  useEffect(() => { setMounted(true); }, []);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/products"))
      setSearch(searchParams.get("search") ?? "");
  }, [pathname, searchParams]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (!value.trim() && pathname.startsWith("/products")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("search");
      const q = params.toString();
      router.replace(q ? `/products?${q}` : "/products");
    }
  }, [pathname, router, searchParams]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set("search", search.trim());
    else params.delete("search");
    router.push(`/products?${params.toString()}`);
    setSidebarOpen(false);
  };

  const showSearchBar = pathname === "/" || pathname.startsWith("/products");

  const searchField = (
    <input
      type="search"
      placeholder="Search fresh groceries..."
      value={search}
      onChange={(e) => handleSearchChange(e.target.value)}
      className="w-full rounded-full border border-orange-100 bg-orange-50/50 py-2 pl-10 pr-4 text-sm text-stone-800 transition placeholder:text-stone-400 focus:border-brand-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
    />
  );

  const NAV_LINKS = [
    { href: "/",         label: "Home",    active: pathname === "/" },
    { href: "/products", label: "Shop",    active: pathname.startsWith("/products") },
    { href: "/contact",  label: "Contact", active: pathname === "/contact" },
  ];

  // Desktop auth button — admin sees only Dashboard, normal user sees username pill
  const authButtonDesktop = mounted ? (
    user ? (
      <div className="hidden items-center gap-2 sm:flex">
        {isAdmin ? (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-brand-orange">
            <Image src="/logo.svg" alt="" width={14} height={14} className="h-3.5 w-3.5 opacity-60" />
            {user.email?.split("@")[0]}
          </span>
        )}
      </div>
    ) : (
      <Link
        href={`/login?redirect=${encodeURIComponent(pathname)}`}
        className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-stone-500 transition hover:bg-orange-50 hover:text-brand-orange sm:flex"
      >
        <LogIn className="h-4 w-4" />
        Sign in
      </Link>
    )
  ) : null;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-orange-100/60 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">

          {/* ── Top row ── */}
          <div className="flex items-center gap-3">

            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <Image src="/logo.svg" alt="FreshCart" width={40} height={40} className="h-9 w-9 md:h-10 md:w-10" />
              <div className="leading-tight">
                <span className="block font-display text-base font-bold text-brand-orange md:text-lg">
                  FreshCart
                </span>
                <span className="hidden text-xs text-stone-400 sm:block">
                  Grocery delivered fresh
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="ml-4 hidden items-center gap-1 md:flex">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className={navLinkClass(l.active)}>{l.label}</Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">

              {/* Desktop search */}
              {showSearchBar && (
                <form onSubmit={handleSearch} className="relative hidden min-w-0 max-w-md flex-1 md:block md:min-w-[14rem]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  {searchField}
                </form>
              )}

              {/* Auth button desktop */}
              {authButtonDesktop}

              {/* Cart button */}
              <button
                type="button"
                onClick={() => setShowCart(true)}
                aria-label="Open cart"
                className="relative rounded-full border border-orange-200 bg-white p-2.5 text-brand-orange shadow-sm transition hover:-translate-y-0.5 hover:border-brand-orange hover:shadow-orange"
              >
                <ShoppingCart className="h-5 w-5" aria-hidden />
                {mounted && totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-dk px-1 text-xs font-bold text-white shadow">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              {/* Hamburger — mobile only */}
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setSidebarOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-100 bg-white text-stone-600 transition hover:bg-orange-50 hover:text-brand-orange md:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Mobile search bar (below top row) ── */}
          {showSearchBar && (
            <form onSubmit={handleSearch} className="relative mt-2.5 md:hidden">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              {searchField}
            </form>
          )}
        </div>
      </header>

      {/* ── Mobile sidebar ── */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition md:hidden",
          sidebarOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
        )}
        aria-hidden={!sidebarOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close menu overlay"
          className={cn(
            "absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] transition-opacity",
            sidebarOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar panel — slides in from the left */}
        <aside
          className={cn(
            "absolute left-0 top-0 flex h-full w-72 flex-col",
            "border-r border-orange-100 bg-white shadow-2xl",
            "transition-transform duration-300 ease-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between border-b border-orange-100/60 px-5 py-4">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
              <Image src="/logo.svg" alt="FreshCart" width={36} height={36} className="h-8 w-8" />
              <span className="font-display text-base font-bold text-brand-orange">FreshCart</span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-2 text-stone-500 transition hover:bg-orange-50 hover:text-brand-orange"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search inside sidebar */}
          {showSearchBar && (
            <div className="border-b border-orange-100/60 px-4 py-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                {searchField}
              </form>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                  l.active
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "text-stone-700 hover:bg-orange-50 hover:text-brand-orange"
                )}
              >
                {l.label}
                {l.active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-orange" />}
              </Link>
            ))}
          </nav>

          {/* Sidebar footer — auth */}
          {mounted && (
            <div className="border-t border-orange-100/60 px-4 py-4">
              {user ? (
                isAdmin ? (
                  // Admin: show only Dashboard button
                  <Link
                    href="/admin"
                    onClick={() => setSidebarOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                ) : (
                  // Normal user: show email pill
                  <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                      <span className="text-sm font-bold">{user.email?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-800">{user.email?.split("@")[0]}</p>
                      <p className="truncate text-xs text-stone-400">{user.email}</p>
                    </div>
                  </div>
                )
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 px-4 py-3 text-sm font-semibold text-stone-600 transition hover:bg-orange-50 hover:text-brand-orange"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              )}
            </div>
          )}
        </aside>
      </div>

      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-30 border-b border-orange-100/60 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <div className="h-10 w-10 animate-pulse rounded-full bg-orange-100" />
        <div className="h-8 flex-1 animate-pulse rounded-full bg-orange-50" />
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarClient />
    </Suspense>
  );
}