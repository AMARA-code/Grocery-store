import { ContactForm } from "@/components/store/ContactForm";

/* ── Info pill component ── */
function InfoCard({
  icon,
  label,
  value,
  href,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
  color: "orange" | "green";
}) {
  const colorMap = {
    orange: {
      bg: "bg-orange-50 hover:bg-orange-100/70",
      icon: "bg-brand-orange text-white",
      text: "text-brand-orange-dk hover:text-brand-orange",
      border: "border-orange-100 hover:border-orange-200",
    },
    green: {
      bg: "bg-green-50 hover:bg-green-100/70",
      icon: "bg-brand-green text-white",
      text: "text-brand-green-dk hover:text-brand-green",
      border: "border-green-100 hover:border-green-200",
    },
  };
  const c = colorMap[color];

  const inner = (
    <div
      className={`group flex items-center gap-4 rounded-2xl border ${c.bg} ${c.border} px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-pill`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.icon} text-xl shadow-sm transition-transform duration-300 group-hover:scale-110`}
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </p>
        <p className={`text-sm font-semibold ${c.text} transition-colors duration-200`}>
          {value}
        </p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

/* ── Small SVG character scene for hero ── */
function ContactHeroScene() {
  return (
    <div className="pointer-events-none relative flex items-end justify-center gap-3">
      {/* Character 1 – shopper with cart */}
      <svg
        viewBox="0 0 120 200"
        className="w-28 drop-shadow-xl animate-float-b"
        aria-hidden="true"
      >
        {/* Cart */}
        <g transform="translate(60,150)">
          <rect x="-26" y="0" width="52" height="30" rx="5" fill="#F97316" opacity="0.92" />
          <rect x="-22" y="4" width="44" height="22" rx="3" fill="#FED7AA" opacity="0.55" />
          {/* Cart items */}
          <rect x="-16" y="-12" width="12" height="15" rx="3" fill="#22C55E" />
          <rect x="-1" y="-14" width="12" height="17" rx="3" fill="#F97316" />
          <rect x="8" y="-9" width="11" height="12" rx="3" fill="#FBBF24" />
          <line x1="-26" y1="30" x2="-31" y2="44" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="26" y1="30" x2="31" y2="44" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="-29" cy="47" r="6" fill="#1C1917" />
          <circle cx="29" cy="47" r="6" fill="#1C1917" />
          <circle cx="-29" cy="47" r="3" fill="#F97316" />
          <circle cx="29" cy="47" r="3" fill="#F97316" />
        </g>
        {/* Body */}
        <rect x="42" y="68" width="36" height="52" rx="10" fill="#F97316" />
        {/* Arm left pushing cart */}
        <line x1="42" y1="82" x2="30" y2="120" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" />
        {/* Arm right */}
        <line x1="78" y1="82" x2="88" y2="108" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" />
        {/* Legs */}
        <line x1="54" y1="120" x2="48" y2="144" stroke="#1C1917" strokeWidth="9" strokeLinecap="round" />
        <line x1="66" y1="120" x2="72" y2="144" stroke="#1C1917" strokeWidth="9" strokeLinecap="round" />
        {/* Shoes */}
        <ellipse cx="46" cy="147" rx="10" ry="5" fill="#C2410C" />
        <ellipse cx="74" cy="147" rx="10" ry="5" fill="#C2410C" />
        {/* Head */}
        <circle cx="60" cy="52" r="23" fill="#FDBA74" />
        {/* Hair */}
        <ellipse cx="60" cy="31" rx="23" ry="11" fill="#1C1917" />
        <rect x="37" y="31" width="46" height="12" fill="#1C1917" />
        {/* Eyes */}
        <circle cx="52" cy="50" r="4" fill="white" />
        <circle cx="68" cy="50" r="4" fill="white" />
        <circle cx="53" cy="51" r="2.5" fill="#1C1917" />
        <circle cx="69" cy="51" r="2.5" fill="#1C1917" />
        <circle cx="54" cy="50" r="1.2" fill="white" />
        <circle cx="70" cy="50" r="1.2" fill="white" />
        {/* Big smile */}
        <path d="M50 59 Q60 67 70 59" fill="none" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="45" cy="56" r="6" fill="#F97316" opacity="0.28" />
        <circle cx="75" cy="56" r="6" fill="#F97316" opacity="0.28" />
      </svg>

      {/* Character 2 – person on phone (taller, center) */}
      <svg
        viewBox="0 0 120 200"
        className="w-32 drop-shadow-xl animate-float-a"
        aria-hidden="true"
      >
        {/* Body */}
        <rect x="40" y="70" width="40" height="55" rx="12" fill="#22C55E" />
        {/* Arm with phone raised */}
        <line x1="40" y1="82" x2="14" y2="64" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" />
        {/* Phone */}
        <rect x="4" y="46" width="18" height="28" rx="4" fill="#1C1917" />
        <rect x="6" y="48" width="14" height="22" rx="3" fill="#60A5FA" />
        <rect x="9" y="68" width="8" height="4" rx="2" fill="#2563EB" />
        {/* Arm right */}
        <line x1="80" y1="85" x2="96" y2="105" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" />
        {/* Legs */}
        <line x1="53" y1="125" x2="46" y2="150" stroke="#15803D" strokeWidth="9" strokeLinecap="round" />
        <line x1="67" y1="125" x2="74" y2="150" stroke="#15803D" strokeWidth="9" strokeLinecap="round" />
        {/* Shoes */}
        <ellipse cx="44" cy="153" rx="11" ry="5" fill="#1C1917" />
        <ellipse cx="76" cy="153" rx="11" ry="5" fill="#1C1917" />
        {/* Head */}
        <circle cx="60" cy="52" r="24" fill="#FDBA74" />
        {/* Hair */}
        <ellipse cx="60" cy="30" rx="24" ry="12" fill="#92400E" />
        <rect x="36" y="30" width="48" height="12" fill="#92400E" />
        {/* Ponytail */}
        <ellipse cx="84" cy="36" rx="7" ry="12" fill="#92400E" />
        {/* Eyes */}
        <circle cx="52" cy="50" r="4" fill="white" />
        <circle cx="68" cy="50" r="4" fill="white" />
        <circle cx="53" cy="51" r="2.5" fill="#1C1917" />
        <circle cx="69" cy="51" r="2.5" fill="#1C1917" />
        <circle cx="54" cy="50" r="1.2" fill="white" />
        <circle cx="70" cy="50" r="1.2" fill="white" />
        {/* Open excited mouth */}
        <ellipse cx="60" cy="61" rx="7" ry="5" fill="#C2410C" />
        <ellipse cx="60" cy="59" rx="6" ry="2.5" fill="#FDBA74" />
        {/* Cheeks */}
        <circle cx="44" cy="57" r="6" fill="#F97316" opacity="0.32" />
        <circle cx="76" cy="57" r="6" fill="#F97316" opacity="0.32" />
        {/* Speech bubble */}
        <rect x="14" y="12" width="72" height="26" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1.2" />
        <polygon points="24,38 18,50 34,38" fill="white" stroke="#E5E7EB" strokeWidth="1.2" />
        <text x="50" y="29" textAnchor="middle" fontSize="10" fill="#1C1917" fontWeight="700">
          We&apos;re here! 🌿
        </text>
      </svg>

      {/* Character 3 – walker with bags */}
      <svg
        viewBox="0 0 120 200"
        className="w-28 drop-shadow-xl animate-float-c"
        aria-hidden="true"
      >
        {/* Shopping bag */}
        <rect x="70" y="90" width="34" height="40" rx="7" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
        <path d="M76 90 Q87 78 98 90" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
        {/* Items in bag */}
        <line x1="80" y1="90" x2="80" y2="78" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="80" cy="76" r="5" fill="#22C55E" />
        <line x1="90" y1="90" x2="90" y2="74" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="90" cy="72" r="5" fill="#F97316" />
        {/* Body */}
        <rect x="36" y="68" width="38" height="55" rx="11" fill="#8B5CF6" />
        {/* Arm left */}
        <line x1="36" y1="82" x2="20" y2="106" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" />
        {/* Arm right holding bag */}
        <line x1="74" y1="82" x2="82" y2="100" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" />
        {/* Legs (walking pose) */}
        <line x1="50" y1="123" x2="40" y2="150" stroke="#5B21B6" strokeWidth="9" strokeLinecap="round" />
        <line x1="62" y1="123" x2="76" y2="148" stroke="#5B21B6" strokeWidth="9" strokeLinecap="round" />
        {/* Shoes */}
        <ellipse cx="38" cy="153" rx="12" ry="5" fill="#1C1917" />
        <ellipse cx="78" cy="151" rx="12" ry="5" fill="#1C1917" />
        {/* Head */}
        <circle cx="55" cy="52" r="23" fill="#FDBA74" />
        {/* Hair */}
        <ellipse cx="55" cy="31" rx="23" ry="12" fill="#1C1917" />
        <rect x="32" y="31" width="46" height="12" fill="#1C1917" />
        {/* Sunglasses */}
        <rect x="40" y="47" width="14" height="10" rx="5" fill="#1C1917" />
        <rect x="58" y="47" width="14" height="10" rx="5" fill="#1C1917" />
        <line x1="54" y1="51" x2="58" y2="51" stroke="#1C1917" strokeWidth="2" />
        {/* Smile */}
        <path d="M44 62 Q55 70 66 62" fill="none" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="40" cy="58" r="6" fill="#F97316" opacity="0.28" />
        <circle cx="70" cy="58" r="6" fill="#F97316" opacity="0.28" />
      </svg>
    </div>
  );
}

/* ── FAQ accordion item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-gray-100 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-orange-200 hover:shadow-card [&[open]]:border-brand-orange/30 [&[open]]:shadow-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <span className="text-sm font-semibold text-gray-800">{q}</span>
        <span className="shrink-0 text-brand-orange transition-transform duration-300 group-open:rotate-45 text-lg font-light">
          +
        </span>
      </summary>
      <div className="border-t border-gray-100 px-5 py-4">
        <p className="text-sm leading-relaxed text-gray-600">{a}</p>
      </div>
    </details>
  );
}

/* ─────────────── PAGE ─────────────── */
export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      {/* ── Hero banner ── */}
      <section className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-cream to-green-50 px-6 py-12 text-center shadow-card">
        {/* Decorative radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(249,115,22,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Floating background items */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {["🍊", "🥬", "🧃", "🍋", "🫐", "🥕"].map((e, i) => (
            <span
              key={i}
              className="absolute text-2xl opacity-20"
              style={{
                top: `${10 + (i * 15) % 70}%`,
                left: `${5 + (i * 17) % 90}%`,
                animation: `${["float-a", "float-b", "float-c"][i % 3]} ${6 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            >
              {e}
            </span>
          ))}
        </div>

        <div className="relative">
          {/* Characters */}
          <ContactHeroScene />

          <div className="mt-8 space-y-3">
            <span className="inline-block rounded-full border border-orange-200 bg-orange-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-orange-dk animate-pill-bob">
              We&apos;d love to hear from you
            </span>
            <h1 className="font-display text-4xl font-semibold text-gray-900 md:text-5xl">
              Let&apos;s{" "}
              <span className="text-shimmer">get in touch</span>
            </h1>
            <p className="mx-auto max-w-md text-base text-gray-600 leading-relaxed">
              Questions about your order, a product, or just want to say hello?
              Our team is always happy to help.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main grid ── */}
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
        {/* Left column: info + FAQ */}
        <div className="space-y-8 lg:col-span-2">
          {/* Contact info */}
          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              Contact info
            </h2>
            <div className="space-y-3">
              <InfoCard
                icon="✉️"
                label="Email us"
                value="amaranaeem453@gmail.com"
                href="mailto:amaranaeem453@gmail.com"
                color="orange"
              />
              <InfoCard
                icon="📞"
                label="Call us"
                value="0334 6445127"
                href="tel:03346445127"
                color="green"
              />
              <InfoCard
                icon="🕐"
                label="Response time"
                value="Within 24 hours"
                color="orange"
              />
              <InfoCard
                icon="📍"
                label="Based in"
                value="Pakistan 🇵🇰"
                color="green"
              />
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

          {/* FAQ */}
          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              Quick answers
            </h2>
            <div className="space-y-2.5">
              <FaqItem
                q="Where is my order?"
                a="Once your order ships, you'll get an email with tracking info."
              />
              <FaqItem
                q="Can I change or cancel my order?"
                a="If your order hasn't been processed yet, reach out to us and we'll do our best to accommodate changes."
              />
              <FaqItem
                q="Do you offer same-day delivery?"
                a="Yes, orders are typically delivered within 3 - 5 hours depending on your area."
              />
              <FaqItem
                q="Are all products fresh and original?"
                a="We partner directly with trusted local suppliers to ensure you get the freshest, highest-quality groceries."
              />
            </div>
          </section>

          {/* Social proof strip */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50/50 px-5 py-4 text-center">
            <p className="text-2xl font-display font-semibold text-brand-orange-dk">
              4.9 ★
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Average customer satisfaction score
            </p>
            <div className="mt-2 flex justify-center gap-0.5 text-yellow-400 text-base" aria-hidden>
              {"★★★★★"}
            </div>
          </div>
        </div>

        {/* Right column: form */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}