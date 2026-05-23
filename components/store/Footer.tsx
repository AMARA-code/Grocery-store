"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

export function Footer() {
  const [user, setUser] = useState<User | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
    setSigningOut(false);
  };

  return (
    <footer className="relative mt-auto border-t border-gray-200 bg-gradient-to-b from-white to-green-50/40">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm space-y-2">
            <span className="text-xl font-bold text-green-700">FreshCart</span>
            <p className="text-sm text-gray-600">
              Fresh groceries, delivered with care.
            </p>

            {/* Logout — only when signed in */}
            {user && (
              <div className="pt-2 space-y-1">
                <p className="text-xs text-gray-400">
                  Signed in as <span className="font-medium text-gray-600">{user.email}</span>
                </p>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-10 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Store</h4>
              <ul className="space-y-1.5 text-gray-600">
                <li>
                  <Link href="/products" className="hover:text-green-700">
                    Shop all
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-green-700">
                    View cart
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Support</h4>
              <ul className="space-y-1.5 text-gray-600">
                <li>
                  <Link href="/contact" className="hover:text-green-700">
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:amaranaeem453@gmail.com"
                    className="hover:text-green-700"
                  >
                    amaranaeem453@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-green-500/60" />
            <span className="h-2 w-2 rounded-full bg-green-600/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}