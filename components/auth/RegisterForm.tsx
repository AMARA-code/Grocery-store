"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export type RegisterFormProps = {
  redirectTo: string;
};

export function RegisterForm({ redirectTo }: RegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | undefined>();
  const [info, setInfo]       = useState<string | undefined>();
  const configured = isSupabaseBrowserConfigured();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setInfo(undefined);
    if (!configured) { setError("Configure Supabase in .env.local before registering."); return; }

    const fd       = new FormData(e.currentTarget);
    const email    = String(fd.get("email")     || "").trim();
    const password = String(fd.get("password")  || "");
    const fullName = String(fd.get("full_name") || "").trim();

    if (!email || !password || !fullName) { setError("Fill in name, email, and password."); return; }
    if (password.length < 6)             { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signError) { setError(signError.message); return; }

      if (data.session) {
        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ full_name: fullName, email })
            .eq("id", data.user.id);
          if (profileError) console.warn("Profile update:", profileError.message);
        }
        toast.success("Welcome to FreshCart");
        const safe = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
        router.replace(safe);
        router.refresh();
        return;
      }

      setInfo("Check your email to confirm your account, then sign in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!configured && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Set Supabase keys in <code className="font-mono">.env.local</code> to register.
        </p>
      )}
      <Input label="Full name" name="full_name" autoComplete="name" required disabled={!configured} placeholder="Alex Rivera" />
      <Input label="Email" name="email" type="email" autoComplete="email" required disabled={!configured} placeholder="you@example.com" />
      <Input label="Password" name="password" type="password" autoComplete="new-password" required disabled={!configured} placeholder="At least 6 characters" />
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      {info  && <p className="text-sm text-green-800" role="status">{info}</p>}
      <Button type="submit" variant="primary" className="w-full" disabled={loading || !configured}>
        {loading ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href={redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
          className="font-medium text-orange-500 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}