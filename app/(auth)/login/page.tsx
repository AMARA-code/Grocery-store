import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to FreshCart",
};

function safeRedirect(value: string | string[] | undefined): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

function adminAccessMessage(
  error: string | string[] | undefined,
  redirect: string
): string | null {
  if (!redirect.startsWith("/admin")) return null;
  const code = typeof error === "string" ? error : undefined;
  if (code === "not_admin") {
    return "This account is not an admin. In Supabase SQL Editor run: update public.profiles set role = 'admin' where email = 'amaranaeem453@gmail.com'; then sign in again.";
  }
  if (code === "profile_fetch") {
    return "Could not load your profile (network/SSL). Sign in, or restart dev with only one npm run dev terminal.";
  }
  return "Admin requires sign-in with role = admin in Supabase → Table Editor → profiles.";
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const redirectTo = safeRedirect(searchParams.redirect);
  const adminHint = adminAccessMessage(searchParams.error, redirectTo);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl ring-1 ring-gray-100">
      <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
      <p className="mt-1 text-sm text-gray-600">
        Use your email and password to access your cart and checkout.
      </p>
      {adminHint ? (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {adminHint}
        </p>
      ) : null}
      <div className="mt-6">
        <LoginForm redirectTo={redirectTo} />
      </div>
      <p className="mt-6 text-center text-xs text-gray-500">
        <Link href="/" className="hover:text-green-700">
          ← Back to store
        </Link>
      </p>
    </div>
  );
}
