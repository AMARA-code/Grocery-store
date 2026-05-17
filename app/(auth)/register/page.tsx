import Link from "next/link";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Register for FreshCart",
};

function safeRedirect(value: string | string[] | undefined): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const redirectTo = safeRedirect(searchParams.redirect);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl ring-1 ring-gray-100">
      <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
      <p className="mt-1 text-sm text-gray-600">
        Register with your name and email. We&apos;ll save your profile for orders and
        checkout.
      </p>
      <div className="mt-6">
        <RegisterForm redirectTo={redirectTo} />
      </div>
      <p className="mt-6 text-center text-xs text-gray-500">
        <Link href="/" className="hover:text-green-700">
          ← Back to store
        </Link>
      </p>
    </div>
  );
}
