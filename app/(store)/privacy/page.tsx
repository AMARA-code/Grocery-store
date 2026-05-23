import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — FreshCart",
  description: "How FreshCart collects, uses, and protects your personal information.",
  metadataBase: new URL("https://grocery-store-orpin-two.vercel.app"),
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    isList: false,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    content: [
      'FreshCart ("we," "us," or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Service").',
      "By using the Service, you consent to the data practices described in this Privacy Policy. If you do not agree with the practices described in this policy, please do not use our Service.",
    ],
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    isList: false,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ),
    content: [
      "We collect information you provide directly: this includes your name, email address, phone number, delivery address, and payment information when you register an account, place an order, or contact us.",
      "We automatically collect certain technical information when you use our Service, such as your IP address, browser type, operating system, referring URLs, pages visited, and the dates and times of your visits.",
      "When you use our mobile application, we may collect device identifiers, location data (with your permission), and push notification tokens to improve your delivery experience.",
      "We may also receive information about you from third-party sources, such as our payment processors, delivery partners, and analytics providers.",
    ],
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    isList: true,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    ),
    content: [
      "Process and fulfill your orders, including payment processing, delivery coordination, and order confirmation emails.",
      "Provide customer support, respond to your inquiries, and resolve disputes.",
      "Send transactional communications such as order confirmations, delivery updates, and receipts.",
      "With your consent, send promotional emails and notifications about offers, new products, and seasonal deals. You may opt out at any time.",
      "Improve our Service by analyzing usage patterns, conducting research, and developing new features.",
      "Detect, prevent, and address fraud, security issues, and technical problems.",
      "Comply with our legal obligations and enforce our Terms of Service.",
    ],
  },
  {
    id: "sharing",
    title: "4. Information Sharing",
    isList: false,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
      </svg>
    ),
    content: [
      "We do not sell, trade, or rent your personal information to third parties for their marketing purposes.",
      "We may share your information with trusted service providers who assist us in operating our Service, including payment processors (Stripe), email service providers, delivery partners, and cloud infrastructure providers. These partners are contractually bound to protect your data.",
      "We may disclose your information if required by law, court order, or governmental authority, or if we believe in good faith that such disclosure is necessary to protect our rights or the safety of others.",
      "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the successor entity, subject to the same privacy protections described in this policy.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking",
    isList: false,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
      </svg>
    ),
    content: [
      "We use cookies and similar tracking technologies to enhance your experience, remember your preferences (such as cart contents and login status), and analyze how our Service is used.",
      "Essential cookies are necessary for the Service to function and cannot be disabled. Analytics and marketing cookies are optional and may be controlled through your browser settings or our cookie preference center.",
      "You may instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our Service may not function properly without cookies.",
    ],
  },
  {
    id: "data-security",
    title: "6. Data Security",
    isList: false,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    content: [
      "We implement industry-standard security measures to protect your personal information, including TLS/SSL encryption for data in transit, encrypted storage for sensitive information, and regular security audits.",
      "Payment card data is processed by Stripe and is never stored on our servers. Stripe is PCI DSS Level 1 certified, the highest level of security certification in the payment industry.",
      "While we take reasonable precautions, no method of data transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your account.",
    ],
  },
  {
    id: "retention",
    title: "7. Data Retention",
    isList: false,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
    content: [
      "We retain your account information for as long as your account is active or as needed to provide you with the Service. You may request deletion of your account at any time by contacting privacy@freshcart.com.",
      "Order history and transaction records may be retained for up to 7 years for accounting, tax, and legal compliance purposes, even after account deletion.",
      "Anonymized and aggregated data may be retained indefinitely for analytics and product improvement purposes.",
    ],
  },
  {
    id: "your-rights",
    title: "8. Your Rights",
    isList: true,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
    content: [
      "Access: You have the right to request a copy of the personal information we hold about you.",
      "Correction: You may request that we correct inaccurate or incomplete information.",
      "Deletion: You may request that we delete your personal information, subject to certain legal obligations.",
      "Opt-out: You may unsubscribe from promotional emails at any time using the unsubscribe link in any marketing email.",
      "Portability: You may request your data in a structured, machine-readable format.",
    ],
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    isList: false,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    content: [
      "Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete such information immediately.",
      "If you believe we may have inadvertently collected information from a child under 13, please contact us at privacy@freshcart.com.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    isList: false,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
      </svg>
    ),
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. When we make material changes, we will notify you via email or through a prominent notice on our website.",
      "We encourage you to periodically review this page for the latest information on our privacy practices.",
    ],
  },
  {
    id: "contact-privacy",
    title: "11. Contact Us",
    isList: false,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
    content: [
      "If you have any questions, concerns, or requests regarding this Privacy Policy or the way we handle your personal information, please contact our Privacy Team at privacy@freshcart.com.",
      "We take privacy inquiries seriously and aim to respond to all requests within 30 days.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FFFBF5] pb-16 pt-6">
      <div className="mx-auto max-w-5xl px-6">

        {/* ── Breadcrumb + quick links bar ── */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#A8A29E]">
            <Link href="/" className="hover:text-[#F97316] transition-colors">Home</Link>
            <span>/</span>
            <span className="font-medium text-[#1C1917]">Privacy Policy</span>
          </div>
          {/* Quick links */}
          <div className="flex items-center gap-2">
            <Link
              href="/terms"
              className="rounded-full border border-orange-200 bg-white px-4 py-1.5 text-xs font-semibold text-[#F97316] transition-all hover:border-[#F97316] hover:bg-[#FFF7ED]"
            >
              Terms of Service →
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold text-[#78716C] transition-all hover:border-stone-400"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* ── Hero header ── */}
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-[#DCFCE7] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#15803D]">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Your Privacy Matters
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#1C1917] sm:text-5xl">
            Privacy{" "}
            <span className="text-shimmer">Policy</span>
          </h1>
          <p className="mt-3 text-sm text-[#A8A29E]">
            Effective Date: <strong className="text-[#1C1917]">June 1, 2025</strong>
            &nbsp;·&nbsp; Last Updated: <strong className="text-[#1C1917]">June 1, 2025</strong>
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#78716C]">
            We believe you should know exactly what data we collect, why we collect it, and what
            choices you have. Here is our promise in plain language.
          </p>
        </div>

        {/* ── At-a-glance cards ── */}
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {[
            { icon: "🔒", title: "We Never Sell Your Data", desc: "Your information is never sold or rented to third parties.", color: "border-green-200 bg-[#DCFCE7]", text: "text-[#15803D]" },
            { icon: "🛡️", title: "Bank-Grade Security", desc: "TLS encryption and PCI-compliant payment processing.", color: "border-orange-200 bg-[#FFF7ED]", text: "text-[#C2410C]" },
            { icon: "✉️", title: "You're In Control", desc: "Opt out of marketing emails at any time, instantly.", color: "border-blue-100 bg-blue-50", text: "text-blue-700" },
          ].map((card) => (
            <div key={card.title} className={`rounded-2xl border p-4 ${card.color}`}>
              <div className="mb-1.5 text-xl">{card.icon}</div>
              <h3 className={`text-sm font-semibold ${card.text}`}>{card.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#78716C]">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">

          {/* ── Sidebar TOC ── */}
          <aside className="lg:w-60 lg:shrink-0">
            <div className="sticky top-6 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#A8A29E]">
                Contents
              </p>
              <ul className="space-y-0.5">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-[#78716C] transition-all hover:bg-[#FFF7ED] hover:text-[#F97316]"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-orange-100 pt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#A8A29E]">
                  Privacy Contact
                </p>
                <a
                  href="mailto:privacy@freshcart.com"
                  className="block rounded-xl border border-orange-200 bg-[#FFF7ED] px-3 py-2 text-center text-xs font-semibold text-[#F97316] transition-all hover:bg-[#FED7AA]"
                >
                  privacy@freshcart.com
                </a>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              {sections.map((section, i) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-6 rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FED7AA] text-[#C2410C]">
                      {section.icon}
                    </div>
                    <h2 className="font-display text-[16px] font-semibold text-[#1C1917]">
                      {section.title.replace(/^\d+\.\s/, "")}
                    </h2>
                  </div>

                  {section.isList ? (
                    <ul className="space-y-2">
                      {section.content.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <span className="mt-1.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
                            <svg className="h-2 w-2 text-[#15803D]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-[14px] leading-7 text-[#57534E]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-2.5">
                      {section.content.map((para, j) => (
                        <p key={j} className="text-[14px] leading-7 text-[#57534E]">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* ── Bottom CTA card ── */}
            <div className="mt-10 rounded-2xl border border-orange-200 bg-gradient-to-br from-[#FFF7ED] to-[#FFFBF5] p-7 text-center">
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#F97316]">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-display text-base font-semibold text-[#C2410C]">
                Your data is safe with us
              </h3>
              <p className="mt-1 text-sm text-[#78716C]">
                Have privacy concerns?{" "}
                <a href="mailto:privacy@freshcart.com" className="font-medium text-[#F97316] hover:underline">
                  Email our privacy team
                </a>
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="rounded-full bg-[#F97316] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#C2410C]"
                >
                  Create Account
                </Link>
                <Link
                  href="/terms"
                  className="rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-[#F97316] transition-all hover:border-[#F97316]"
                >
                  Terms of Service →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}