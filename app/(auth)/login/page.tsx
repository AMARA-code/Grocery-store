import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to FreshCart",
};

function safeRedirect(value: string | string[] | undefined): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function adminAccessMessage(error: string | string[] | undefined, redirect: string): string | null {
  if (!redirect.startsWith("/admin")) return null;
  const code = typeof error === "string" ? error : undefined;
  if (code === "not_admin") return "This account is not an admin. In Supabase SQL Editor run: update public.profiles set role = 'admin' where email = 'amaranaeem453@gmail.com'; then sign in again.";
  if (code === "profile_fetch") return "Could not load your profile (network/SSL). Sign in, or restart dev with only one npm run dev terminal.";
  return "Admin requires sign-in with role = admin in Supabase → Table Editor → profiles.";
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const redirectTo = safeRedirect(searchParams.redirect);
  const adminHint  = adminAccessMessage(searchParams.error, redirectTo);

  return (
    <div className="flex min-h-screen w-full">

      {/* ── LEFT BRAND PANEL ── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center flex-[0_0_44%] relative overflow-hidden px-10 py-12"
        style={{ background: "linear-gradient(150deg,#fff9f2 0%,#fdebd6 55%,#fbd5a6 100%)", borderRight: "1px solid rgba(249,115,22,0.10)" }}
      >
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10 animate-pulse" style={{ background: "#F97316" }} />
          <div className="absolute -bottom-16 -right-10 w-52 h-52 rounded-full opacity-10 animate-pulse" style={{ background: "#22C55E", animationDelay: "1.5s" }} />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 relative z-10">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-md p-2">
            <Image src="/logo.svg" alt="FreshCart" width={44} height={44} className="h-10 w-10" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-stone-900" style={{ fontFamily: "'Sora',system-ui,sans-serif" }}>
            Fresh<span className="text-orange-500">Cart</span>
          </span>
        </div>

        {/* Grocery scene SVG */}
        <div className="w-full max-w-xs mx-auto mb-8 relative z-10">
          <svg viewBox="0 0 300 260" width="100%" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="150" cy="248" rx="110" ry="9" fill="rgba(249,115,22,0.12)"/>
            <rect x="20" y="190" width="260" height="18" rx="6" fill="#C8956C"/>
            <rect x="20" y="192" width="260" height="6" rx="3" fill="#D4A574" opacity=".6"/>
            <rect x="38" y="208" width="10" height="36" rx="4" fill="#C8956C"/>
            <rect x="252" y="208" width="10" height="36" rx="4" fill="#C8956C"/>
            <g>
              <animateTransform attributeName="transform" type="translate" values="190,110;190,104;190,110" dur="4s" repeatCount="indefinite"/>
              <ellipse cx="30" cy="75" rx="34" ry="8" fill="#B8860B" opacity=".35"/>
              <rect x="0" y="20" width="60" height="52" rx="8" fill="#D4A017"/>
              <rect x="0" y="20" width="60" height="10" rx="5" fill="#C8920F"/>
              <line x1="12" y1="30" x2="12" y2="72" stroke="#C8920F" strokeWidth="1.5" opacity=".5"/>
              <line x1="24" y1="30" x2="24" y2="72" stroke="#C8920F" strokeWidth="1.5" opacity=".5"/>
              <line x1="36" y1="30" x2="36" y2="72" stroke="#C8920F" strokeWidth="1.5" opacity=".5"/>
              <line x1="48" y1="30" x2="48" y2="72" stroke="#C8920F" strokeWidth="1.5" opacity=".5"/>
              <line x1="0" y1="42" x2="60" y2="42" stroke="#C8920F" strokeWidth="1.5" opacity=".5"/>
              <line x1="0" y1="56" x2="60" y2="56" stroke="#C8920F" strokeWidth="1.5" opacity=".5"/>
              <path d="M8 20 Q30 -8 52 20" stroke="#B8860B" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="10" fill="#F97316"/>
              <path d="M12 6 Q14 0 12 -4" stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <circle cx="32" cy="12" r="11" fill="#22C55E"/>
              <line x1="32" y1="1" x2="32" y2="-4" stroke="#15803D" strokeWidth="2"/>
              <circle cx="50" cy="16" r="9" fill="#EF4444"/>
              <path d="M50 7 Q53 2 50 -2" stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </g>
            <g>
              <animateTransform attributeName="transform" type="translate" values="58,80;58,74;58,80" dur="3.5s" repeatCount="indefinite"/>
              <ellipse cx="22" cy="112" rx="18" ry="4" fill="rgba(0,0,0,0.08)"/>
              <rect x="8" y="32" width="28" height="78" rx="6" fill="#EFF6FF"/>
              <rect x="8" y="32" width="28" height="20" rx="4" fill="#DBEAFE"/>
              <rect x="14" y="8" width="16" height="26" rx="4" fill="#BFDBFE"/>
              <rect x="16" y="4" width="12" height="10" rx="3" fill="#93C5FD"/>
              <rect x="11" y="58" width="22" height="36" rx="3" fill="#DBEAFE"/>
              <text x="22" y="73" textAnchor="middle" fill="#1E40AF" fontSize="7" fontWeight="700">FRESH</text>
              <text x="22" y="83" textAnchor="middle" fill="#1E40AF" fontSize="6">MILK</text>
            </g>
            <g>
              <animateTransform attributeName="transform" type="translate" values="100,120;100,114;100,120" dur="5s" repeatCount="indefinite"/>
              <ellipse cx="40" cy="72" rx="36" ry="6" fill="rgba(0,0,0,0.08)"/>
              <rect x="4" y="18" width="72" height="50" rx="12" fill="#D4A574"/>
              <ellipse cx="20" cy="20" rx="16" ry="12" fill="#C8956C"/>
              <ellipse cx="40" cy="16" rx="18" ry="14" fill="#D4A574"/>
              <ellipse cx="60" cy="20" rx="16" ry="12" fill="#C8956C"/>
              <line x1="26" y1="22" x2="26" y2="64" stroke="#B8774A" strokeWidth="1.5" opacity=".5"/>
              <line x1="40" y1="18" x2="40" y2="64" stroke="#B8774A" strokeWidth="1.5" opacity=".5"/>
              <line x1="54" y1="22" x2="54" y2="64" stroke="#B8774A" strokeWidth="1.5" opacity=".5"/>
            </g>
            <g style={{ transformOrigin: "14px 30px" }}>
              <animateTransform attributeName="transform" type="rotate" values="0 46 160;5 46 160;-5 46 160;0 46 160" dur="6s" repeatCount="indefinite"/>
              <g transform="translate(32,130)">
                <ellipse cx="14" cy="52" rx="10" ry="3" fill="rgba(0,0,0,0.07)"/>
                <path d="M6 10 Q2 30 14 50 Q26 30 22 10 Z" fill="#FB923C"/>
                <line x1="10" y1="8" x2="8" y2="-4" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="14" y1="6" x2="14" y2="-6" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="18" y1="8" x2="20" y2="-4" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"/>
              </g>
            </g>
            <g>
              <animateTransform attributeName="transform" type="translate" values="12,85;12,79;12,85" dur="4.5s" repeatCount="indefinite" begin="-.8s"/>
              <ellipse cx="22" cy="88" rx="18" ry="5" fill="rgba(0,0,0,0.08)"/>
              <circle cx="22" cy="52" r="32" fill="#EF4444"/>
              <ellipse cx="22" cy="32" rx="22" ry="10" fill="#F87171" opacity=".5"/>
              <circle cx="14" cy="42" r="6" fill="#fff" opacity=".18"/>
              <line x1="22" y1="22" x2="22" y2="10" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M22 10 Q30 4 34 10" stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </g>
            <g>
              <animateTransform attributeName="transform" type="translate" values="236,100;236,94;236,100" dur="3.8s" repeatCount="indefinite" begin="-1.2s"/>
              <ellipse cx="20" cy="88" rx="15" ry="4" fill="rgba(0,0,0,0.07)"/>
              <rect x="8" y="28" width="24" height="60" rx="5" fill="#EAB308"/>
              <rect x="8" y="28" width="24" height="14" rx="4" fill="#CA8A04"/>
              <rect x="12" y="14" width="16" height="18" rx="4" fill="#FEF08A"/>
              <rect x="15" y="10" width="10" height="8" rx="2" fill="#D97706"/>
              <rect x="11" y="48" width="18" height="28" rx="2" fill="#FEF9C3"/>
              <text x="20" y="60" textAnchor="middle" fill="#854D0E" fontSize="5" fontWeight="700">OLIVE</text>
              <text x="20" y="68" textAnchor="middle" fill="#854D0E" fontSize="5">OIL</text>
            </g>
            <circle cx="168" cy="60" r="3.5" fill="#F97316" opacity=".7"><animate attributeName="r" values="3.5;5.5;3.5" dur="2s" repeatCount="indefinite"/></circle>
            <circle cx="85" cy="68" r="2.5" fill="#22C55E" opacity=".6"><animate attributeName="r" values="2.5;4;2.5" dur="2.8s" repeatCount="indefinite" begin="-.5s"/></circle>
            <circle cx="258" cy="76" r="2" fill="#EAB308" opacity=".8"><animate attributeName="r" values="2;3.5;2" dur="2.3s" repeatCount="indefinite" begin="-1s"/></circle>
          </svg>
        </div>

        <p className="text-xl font-bold text-stone-900 text-center leading-snug mb-1 relative z-10" style={{ fontFamily: "'Sora',system-ui,sans-serif" }}>
          Your groceries, <span className="text-orange-500">delivered fresh.</span>
        </p>
        <p className="text-sm text-stone-500 text-center leading-relaxed mb-5 relative z-10">
          Shop thousands of products from the comfort of your home.
        </p>
        <div className="flex gap-2 flex-wrap justify-center relative z-10">
          {["Free Delivery", "Same Day", "4.9★ Rated"].map((b) => (
            <span key={b} className="flex items-center gap-1.5 bg-white border border-orange-100 rounded-full px-3 py-1 text-xs font-semibold text-stone-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />{b}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(249,115,22,0.05) 0%,transparent 70%)" }} />

        <div className="w-full max-w-sm">

          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-50 p-1.5">
              <Image src="/logo.svg" alt="FreshCart" width={28} height={28} className="h-full w-full" />
            </div>
            <span className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Sora',system-ui,sans-serif" }}>
              Fresh<span className="text-orange-500">Cart</span>
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-0.5 rounded bg-orange-500" />
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-orange-500">Welcome back</span>
          </div>
          <h1 className="text-[28px] font-bold text-stone-900 mb-1 leading-tight" style={{ fontFamily: "'Sora',system-ui,sans-serif" }}>Sign in</h1>
          <p className="text-sm text-stone-500 mb-5 leading-relaxed">Access your cart, orders &amp; exclusive offers.</p>

          {adminHint && (
            <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{adminHint}</p>
          )}

          <LoginForm redirectTo={redirectTo} />

          <p className="mt-6 text-center text-sm text-stone-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-500 font-bold hover:underline">Create one free →</Link>
          </p>
          <p className="mt-4 text-center">
            <Link href="/" className="text-xs text-stone-400 hover:text-orange-500 transition-colors">← Back to store</Link>
          </p>
        </div>
      </div>
    </div>
  );
}