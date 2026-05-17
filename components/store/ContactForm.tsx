"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

/* ─── tiny inline helpers ─── */
function FloatingEmoji({
  emoji,
  style,
}: {
  emoji: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute select-none text-2xl"
      style={style}
    >
      {emoji}
    </span>
  );
}

/* ─── SVG Characters ─── */
function CharacterShopper({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 180"
      className={cn("w-28 h-auto drop-shadow-lg", className)}
      aria-hidden="true"
    >
      {/* Cart */}
      <g transform="translate(60,130)">
        <rect x="-24" y="0" width="48" height="28" rx="4" fill="#F97316" opacity="0.9" />
        <rect x="-20" y="4" width="40" height="20" rx="2" fill="#FED7AA" opacity="0.6" />
        <line x1="-24" y1="28" x2="-28" y2="38" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="28" x2="28" y2="38" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
        <circle cx="-26" cy="40" r="5" fill="#1C1917" />
        <circle cx="26" cy="40" r="5" fill="#1C1917" />
        <circle cx="-26" cy="40" r="2.5" fill="#F97316" />
        <circle cx="26" cy="40" r="2.5" fill="#F97316" />
        {/* Grocery items in cart */}
        <rect x="-15" y="-8" width="10" height="12" rx="2" fill="#22C55E" />
        <rect x="-2" y="-10" width="10" height="14" rx="2" fill="#F97316" />
        <rect x="6" y="-6" width="10" height="10" rx="2" fill="#FBBF24" />
      </g>
      {/* Body */}
      <rect x="42" y="62" width="36" height="48" rx="10" fill="#F97316" />
      {/* Arm left (pushing cart) */}
      <line x1="42" y1="78" x2="34" y2="112" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
      {/* Arm right */}
      <line x1="78" y1="78" x2="72" y2="100" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
      {/* Legs */}
      <line x1="55" y1="110" x2="50" y2="130" stroke="#1C1917" strokeWidth="8" strokeLinecap="round" />
      <line x1="65" y1="110" x2="68" y2="130" stroke="#1C1917" strokeWidth="8" strokeLinecap="round" />
      {/* Shoes */}
      <ellipse cx="48" cy="132" rx="8" ry="4" fill="#C2410C" />
      <ellipse cx="70" cy="132" rx="8" ry="4" fill="#C2410C" />
      {/* Head */}
      <circle cx="60" cy="46" r="22" fill="#FDBA74" />
      {/* Hair */}
      <ellipse cx="60" cy="26" rx="22" ry="10" fill="#1C1917" />
      <rect x="38" y="26" width="44" height="10" rx="0" fill="#1C1917" />
      {/* Eyes */}
      <circle cx="53" cy="44" r="3.5" fill="white" />
      <circle cx="67" cy="44" r="3.5" fill="white" />
      <circle cx="54" cy="45" r="2" fill="#1C1917" />
      <circle cx="68" cy="45" r="2" fill="#1C1917" />
      <circle cx="55" cy="44" r="1" fill="white" />
      <circle cx="69" cy="44" r="1" fill="white" />
      {/* Smile */}
      <path d="M52 52 Q60 58 68 52" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="47" cy="50" r="5" fill="#F97316" opacity="0.3" />
      <circle cx="73" cy="50" r="5" fill="#F97316" opacity="0.3" />
    </svg>
  );
}

function CharacterCaller({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 180"
      className={cn("w-24 h-auto drop-shadow-lg", className)}
      aria-hidden="true"
    >
      {/* Body */}
      <rect x="40" y="65" width="40" height="50" rx="10" fill="#22C55E" />
      {/* Arm with phone */}
      <line x1="40" y1="75" x2="18" y2="65" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
      {/* Phone */}
      <rect x="6" y="52" width="16" height="24" rx="3" fill="#1C1917" />
      <rect x="8" y="54" width="12" height="18" rx="2" fill="#60A5FA" />
      {/* Arm right */}
      <line x1="80" y1="80" x2="95" y2="95" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
      {/* Legs */}
      <line x1="53" y1="115" x2="48" y2="135" stroke="#15803D" strokeWidth="8" strokeLinecap="round" />
      <line x1="67" y1="115" x2="72" y2="135" stroke="#15803D" strokeWidth="8" strokeLinecap="round" />
      {/* Shoes */}
      <ellipse cx="46" cy="137" rx="9" ry="4" fill="#1C1917" />
      <ellipse cx="74" cy="137" rx="9" ry="4" fill="#1C1917" />
      {/* Head */}
      <circle cx="60" cy="46" r="22" fill="#FDBA74" />
      {/* Hair (ponytail) */}
      <ellipse cx="60" cy="26" rx="22" ry="10" fill="#92400E" />
      <rect x="38" y="26" width="44" height="8" fill="#92400E" />
      <ellipse cx="82" cy="32" rx="6" ry="10" fill="#92400E" />
      {/* Eyes */}
      <circle cx="53" cy="44" r="3.5" fill="white" />
      <circle cx="67" cy="44" r="3.5" fill="white" />
      <circle cx="54" cy="45" r="2" fill="#1C1917" />
      <circle cx="68" cy="45" r="2" fill="#1C1917" />
      <circle cx="55" cy="44" r="1" fill="white" />
      <circle cx="69" cy="44" r="1" fill="white" />
      {/* Excited mouth */}
      <ellipse cx="60" cy="53" rx="6" ry="4" fill="#C2410C" />
      <ellipse cx="60" cy="52" rx="5" ry="2" fill="#FDBA74" />
      {/* Cheeks */}
      <circle cx="46" cy="50" r="5" fill="#F97316" opacity="0.35" />
      <circle cx="74" cy="50" r="5" fill="#F97316" opacity="0.35" />
      {/* Speech bubble */}
      <rect x="22" y="15" width="60" height="24" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      <polygon points="32,39 26,48 40,39" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      <text x="52" y="31" textAnchor="middle" fontSize="9" fill="#1C1917" fontWeight="600">Hi there! 👋</text>
    </svg>
  );
}

function CharacterWalker({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 190"
      className={cn("w-24 h-auto drop-shadow-lg", className)}
      aria-hidden="true"
    >
      {/* Bag */}
      <rect x="72" y="85" width="30" height="36" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
      <path d="M78 85 Q87 75 96 85" fill="none" stroke="#F97316" strokeWidth="2" />
      {/* Little items sticking out */}
      <line x1="80" y1="85" x2="80" y2="75" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="73" r="4" fill="#22C55E" />
      <line x1="88" y1="85" x2="88" y2="72" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      <circle cx="88" cy="70" r="4" fill="#F97316" />
      {/* Body */}
      <rect x="38" y="65" width="36" height="50" rx="10" fill="#8B5CF6" />
      {/* Arm left */}
      <line x1="38" y1="78" x2="22" y2="98" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
      {/* Arm right (holding bag) */}
      <line x1="74" y1="78" x2="80" y2="95" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
      {/* Legs walking pose */}
      <line x1="52" y1="115" x2="42" y2="140" stroke="#5B21B6" strokeWidth="8" strokeLinecap="round" />
      <line x1="62" y1="115" x2="75" y2="138" stroke="#5B21B6" strokeWidth="8" strokeLinecap="round" />
      {/* Shoes */}
      <ellipse cx="40" cy="142" rx="10" ry="4.5" fill="#1C1917" />
      <ellipse cx="77" cy="140" rx="10" ry="4.5" fill="#1C1917" />
      {/* Head */}
      <circle cx="56" cy="46" r="22" fill="#FDBA74" />
      {/* Hair */}
      <ellipse cx="56" cy="26" rx="22" ry="11" fill="#1C1917" />
      <rect x="34" y="26" width="44" height="10" fill="#1C1917" />
      {/* Sunglasses */}
      <rect x="42" y="41" width="13" height="9" rx="4" fill="#1C1917" />
      <rect x="59" y="41" width="13" height="9" rx="4" fill="#1C1917" />
      <line x1="55" y1="45" x2="59" y2="45" stroke="#1C1917" strokeWidth="2" />
      {/* Smile */}
      <path d="M46 55 Q56 62 66 55" fill="none" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="42" cy="52" r="5" fill="#F97316" opacity="0.3" />
      <circle cx="70" cy="52" r="5" fill="#F97316" opacity="0.3" />
    </svg>
  );
}

/* ─── Magnetic Input ─── */
function MagneticField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
  error,
  rows,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const isTextarea = !!rows;
  const hasValue = value.length > 0;

  const baseClass = cn(
    "w-full rounded-2xl border-2 bg-white/60 px-5 py-3.5 text-gray-900",
    "font-body text-[15px] placeholder:text-gray-400",
    "transition-all duration-300 backdrop-blur-sm",
    "focus:outline-none",
    focused
      ? "border-brand-orange shadow-[0_0_0_4px_rgba(249,115,22,0.12)] bg-white"
      : error
      ? "border-red-400 bg-red-50/40"
      : hasValue
      ? "border-brand-green bg-white"
      : "border-gray-200 hover:border-gray-300"
  );

  return (
    <div className="group relative space-y-1.5">
      <label
        htmlFor={id}
        className={cn(
          "block text-sm font-semibold tracking-wide transition-colors duration-200",
          focused ? "text-brand-orange" : "text-gray-700"
        )}
      >
        {label}
        {required && (
          <span className="ml-1 text-brand-orange" aria-hidden>
            *
          </span>
        )}
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(baseClass, "resize-none leading-relaxed")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={baseClass}
        />
      )}

      {/* animated bottom border accent */}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-500 bg-brand-orange",
          focused ? "w-full" : "w-0"
        )}
      />

      {error && (
        <p className="text-xs font-medium text-red-500 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}

      {/* checkmark when valid */}
      {hasValue && !error && !focused && (
        <span className="absolute right-4 top-[2.4rem] text-brand-green text-lg pointer-events-none">
          ✓
        </span>
      )}
    </div>
  );
}

/* ─── Main ContactForm ─── */
interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm({ className }: { className?: string }) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [serverError, setServerError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  // Floating particles on mount
  const particles = [
    { emoji: "🥦", top: "8%", left: "6%", anim: "animate-float-a" },
    { emoji: "🛒", top: "15%", right: "4%", anim: "animate-float-b" },
    { emoji: "🍎", bottom: "30%", left: "3%", anim: "animate-float-c" },
    { emoji: "🥛", bottom: "18%", right: "6%", anim: "animate-float-a" },
    { emoji: "🌿", top: "55%", left: "2%", anim: "animate-float-b" },
    { emoji: "🧀", top: "40%", right: "2%", anim: "animate-float-c" },
  ];

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = "Please enter your full name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || undefined,
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setServerError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setServerError("Network error. Please check your connection and try again.");
    }
  }

  /* ── Success state ── */
  if (status === "success") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br",
          "from-green-50 via-white to-orange-50 p-10 shadow-card text-center",
          "animate-scale-in",
          className
        )}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-4xl animate-scale-in">
              ✉️
            </div>
            <span className="absolute -right-1 -top-1 h-7 w-7 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold animate-pulse">
              ✓
            </span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-gray-900">
            Message sent!
          </h3>
          <p className="text-gray-600 max-w-xs leading-relaxed">
            Thanks for reaching out. We&apos;ll get back to you at{" "}
            <span className="font-semibold text-brand-orange">
              {form.email || "your email"}
            </span>{" "}
            as soon as possible.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-2 rounded-2xl bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white shadow-orange hover:bg-brand-orange-dk transition-colors duration-200"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={formRef}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-gray-100/80",
        "bg-gradient-to-br from-white via-orange-50/30 to-green-50/20",
        "p-7 sm:p-9 shadow-card",
        className
      )}
    >
      {/* Floating emoji particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <FloatingEmoji
            key={i}
            emoji={p.emoji}
            style={{
              top: p.top,
              left: "left" in p ? p.left : undefined,
              right: "right" in p ? (p as { right?: string }).right : undefined,
              bottom: "bottom" in p ? (p as { bottom?: string }).bottom : undefined,
              animation: `${
                i % 3 === 0
                  ? "float-a 7s"
                  : i % 3 === 1
                  ? "float-b 5.5s"
                  : "float-c 8s"
              } ease-in-out infinite`,
              animationDelay: `${i * 0.9}s`,
              opacity: 0.55,
              fontSize: "1.3rem",
            }}
          />
        ))}
      </div>

      {/* Decorative glow blob */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-orange opacity-[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-brand-green opacity-[0.07] blur-3xl"
        aria-hidden
      />

      {/* Header */}
      <div className="relative mb-7 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-orange">
            Get in touch
          </p>
          <h2 className="font-display text-2xl font-semibold text-gray-900">
            Send us a message
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            We&apos;ll respond within 24 hours.
          </p>
        </div>

        {/* Mini character trio */}
        <div className="hidden sm:flex items-end gap-1 -mt-2">
          <CharacterCaller className="animate-float-b w-14" />
          <CharacterShopper className="animate-float-a w-16" />
          <CharacterWalker className="animate-float-c w-13" />
        </div>
      </div>

      {/* Form fields */}
      <div className="relative space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <MagneticField
            label="Full name"
            id="contact-name"
            name="name"
            placeholder="Your name"
            required
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <MagneticField
            label="Email address"
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@gmail.com"
            required
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>

        <MagneticField
          label="Subject"
          id="contact-subject"
          name="subject"
          placeholder="How can we help?"
          value={form.subject}
          onChange={handleChange}
        />

        <MagneticField
          label="Message"
          id="contact-message"
          name="message"
          placeholder="Tell us a bit more…"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          error={errors.message}
        />

        {/* Server error banner */}
        {status === "error" && serverError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-up flex items-start gap-2">
            <span aria-hidden className="mt-0.5 shrink-0">
              ⚠
            </span>
            <span>{serverError}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "loading"}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl px-6 py-4 font-display text-base font-semibold",
            "text-white transition-all duration-300",
            "bg-gradient-to-r from-brand-orange via-brand-orange to-orange-400",
            "hover:shadow-orange hover:-translate-y-0.5 hover:from-brand-orange-dk hover:to-brand-orange",
            "active:translate-y-0 active:shadow-none",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0",
            "focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
          )}
        >
          {/* shimmer sweep */}
          <span
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            aria-hidden
          />

          <span className="relative flex items-center justify-center gap-2">
            {status === "loading" ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="3"
                    strokeOpacity="0.3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Sending…
              </>
            ) : (
              <>
                Send message
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </>
            )}
          </span>
        </button>

        <p className="text-center text-xs text-gray-400">
          Your message is stored securely and only accessible to our team.
        </p>
      </div>
    </div>
  );
}
