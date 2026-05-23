import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Register for FreshCart",
};

function safeRedirect(value: string | string[] | undefined): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const redirectTo = safeRedirect(searchParams.redirect);

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

        {/* Delivery scene SVG — unchanged from original */}
        <div className="w-full max-w-xs mx-auto mb-8 relative z-10">
          <svg viewBox="0 0 300 260" width="100%" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="210" width="300" height="36" rx="0" fill="#D1D5DB"/>
            <rect x="0" y="220" width="300" height="6" fill="#9CA3AF" opacity=".4"/>
            <rect x="20" y="222" width="30" height="4" rx="2" fill="#fff" opacity=".6"><animate attributeName="x" values="320;-50" dur="2.5s" repeatCount="indefinite"/></rect>
            <rect x="100" y="222" width="30" height="4" rx="2" fill="#fff" opacity=".6"><animate attributeName="x" values="320;-50" dur="2.5s" repeatCount="indefinite" begin="-.8s"/></rect>
            <rect x="190" y="222" width="30" height="4" rx="2" fill="#fff" opacity=".6"><animate attributeName="x" values="320;-50" dur="2.5s" repeatCount="indefinite" begin="-1.6s"/></rect>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0,0;4,0;0,0" dur="1.8s" repeatCount="indefinite"/>
              <ellipse cx="148" cy="216" rx="72" ry="7" fill="rgba(0,0,0,0.12)"/>
              <rect x="60" y="140" width="180" height="72" rx="10" fill="#F97316"/>
              <rect x="190" y="130" width="58" height="82" rx="10" fill="#EA6C0C"/>
              <rect x="196" y="136" width="40" height="36" rx="6" fill="#BFDBFE" opacity=".85"/>
              <rect x="200" y="139" width="12" height="20" rx="3" fill="#fff" opacity=".3"/>
              <line x1="190" y1="145" x2="190" y2="212" stroke="#C2410C" strokeWidth="1.5" opacity=".5"/>
              <rect x="72" y="155" width="105" height="42" rx="6" fill="#fff" opacity=".92"/>
              <text x="124" y="174" textAnchor="middle" fill="#F97316" fontSize="10" fontWeight="700" fontFamily="system-ui">🛒 FreshCart</text>
              <text x="124" y="187" textAnchor="middle" fill="#78716C" fontSize="7.5">Fast. Fresh. Delivered.</text>
              <circle cx="100" cy="215" r="16" fill="#1C1917"/>
              <circle cx="100" cy="215" r="10" fill="#374151"/>
              <circle cx="100" cy="215" r="4" fill="#9CA3AF"/>
              <circle cx="208" cy="215" r="16" fill="#1C1917"/>
              <circle cx="208" cy="215" r="10" fill="#374151"/>
              <circle cx="208" cy="215" r="4" fill="#9CA3AF"/>
              <line x1="100" y1="205" x2="100" y2="225" stroke="#6B7280" strokeWidth="1.5"><animateTransform attributeName="transform" type="rotate" values="0 100 215;360 100 215" dur=".6s" repeatCount="indefinite"/></line>
              <line x1="90" y1="215" x2="110" y2="215" stroke="#6B7280" strokeWidth="1.5"><animateTransform attributeName="transform" type="rotate" values="0 100 215;360 100 215" dur=".6s" repeatCount="indefinite"/></line>
              <line x1="208" y1="205" x2="208" y2="225" stroke="#6B7280" strokeWidth="1.5"><animateTransform attributeName="transform" type="rotate" values="0 208 215;360 208 215" dur=".6s" repeatCount="indefinite"/></line>
              <line x1="198" y1="215" x2="218" y2="215" stroke="#6B7280" strokeWidth="1.5"><animateTransform attributeName="transform" type="rotate" values="0 208 215;360 208 215" dur=".6s" repeatCount="indefinite"/></line>
              <line x1="30" y1="148" x2="55" y2="148" stroke="#FED7AA" strokeWidth="2" strokeLinecap="round" opacity=".5"><animate attributeName="opacity" values=".5;.9;.5" dur="1s" repeatCount="indefinite"/></line>
              <line x1="24" y1="156" x2="50" y2="156" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" opacity=".4"><animate attributeName="opacity" values=".4;.8;.4" dur="1s" repeatCount="indefinite" begin="-.3s"/></line>
            </g>
            <g transform="translate(10,60)">
              <polygon points="40,0 80,40 0,40" fill="#F97316" opacity=".9"/>
              <rect x="10" y="38" width="60" height="62" fill="#FFF7ED"/>
              <rect x="25" y="62" width="18" height="22" rx="3" fill="#BFDBFE"/>
              <rect x="49" y="62" width="18" height="22" rx="3" fill="#BFDBFE"/>
              <rect x="32" y="80" width="16" height="20" rx="3" fill="#D4A574"/>
              <rect x="52" y="10" width="8" height="14" rx="2" fill="#D4A574"/>
              <circle cx="56" cy="7" r="4" fill="#D1D5DB" opacity=".6"><animate attributeName="cy" values="7;-5;-15" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".6;.3;0" dur="2s" repeatCount="indefinite"/><animate attributeName="r" values="4;6;8" dur="2s" repeatCount="indefinite"/></circle>
            </g>
            <g><animateTransform attributeName="transform" type="rotate" values="0 262 40;360 262 40" dur="20s" repeatCount="indefinite"/>
              <circle cx="262" cy="40" r="22" fill="#FEF08A"/>
              <circle cx="262" cy="40" r="16" fill="#FDE047"/>
              <line x1="262" y1="10" x2="262" y2="4" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="262" y1="70" x2="262" y2="76" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="232" y1="40" x2="226" y2="40" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="292" y1="40" x2="298" y2="40" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round"/>
            </g>
            <g opacity=".75">
              <circle cx="200" cy="75" r="14" fill="#fff"/>
              <circle cx="218" cy="68" r="17" fill="#fff"/>
              <circle cx="236" cy="75" r="13" fill="#fff"/>
              <rect x="195" y="74" width="54" height="18" fill="#fff"/>
            </g>
          </svg>
        </div>

        <p className="text-xl font-bold text-stone-900 text-center leading-snug mb-1 relative z-10" style={{ fontFamily: "'Sora',system-ui,sans-serif" }}>
          Join <span className="text-orange-500">50,000+</span> happy<br />shoppers today
        </p>
        <p className="text-sm text-stone-500 text-center leading-relaxed mb-5 relative z-10">
          Free delivery. Fresh produce. Right at your doorstep.
        </p>
        <div className="flex gap-2 flex-wrap justify-center relative z-10">
          {["Safe & Secure", "No Spam", "Free to Join"].map((b) => (
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
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-orange-500">New account</span>
          </div>
          <h1 className="text-[28px] font-bold text-stone-900 mb-1 leading-tight" style={{ fontFamily: "'Sora',system-ui,sans-serif" }}>Create account</h1>
          <p className="text-sm text-stone-500 mb-5 leading-relaxed">Join FreshCart and get groceries delivered to your door.</p>

          <RegisterForm redirectTo={redirectTo} />

          <p className="mt-4 text-xs text-stone-400 text-center leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-orange-500 hover:underline">Terms</Link>{" "}
            &amp;{" "}
            <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
          </p>
         
          <p className="mt-4 text-center">
            <Link href="/" className="text-xs text-stone-400 hover:text-orange-500 transition-colors">← Back to store</Link>
          </p>
        </div>
      </div>
    </div>
  );
}