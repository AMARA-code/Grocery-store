import Link from "next/link";

export const metadata = {
  title: "Terms of Service — FreshCart",
  description: "FreshCart Terms of Service and conditions of use.",
  metadataBase: new URL("https://grocery-store-orpin-two.vercel.app"),
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      'By accessing or using FreshCart\'s website, mobile application, or any related services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.',
      "These Terms constitute a legally binding agreement between you and FreshCart. We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service following any changes constitutes your acceptance of the revised Terms.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: [
      "You must be at least 18 years of age to use this Service. By using FreshCart, you represent and warrant that you are 18 years of age or older and that you have the legal capacity to enter into these Terms.",
      "If you are using the Service on behalf of a business or other legal entity, you represent that you have the authority to bind that entity to these Terms.",
    ],
  },
  {
    id: "account",
    title: "3. Your Account",
    content: [
      "To access certain features of the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.",
      "You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify FreshCart immediately at support@freshcart.com of any unauthorized use of your account.",
      "FreshCart reserves the right to terminate accounts, remove or edit content, or cancel orders at our sole discretion.",
    ],
  },
  {
    id: "orders",
    title: "4. Orders & Payments",
    content: [
      "All orders placed through FreshCart are subject to product availability. We reserve the right to cancel any order for any reason, including but not limited to product unavailability, errors in pricing or product description, or suspected fraudulent activity.",
      "Prices for products are subject to change without notice. We reserve the right to modify or discontinue any product at any time. Payment must be received prior to order fulfillment.",
      "By submitting payment information, you authorize FreshCart to charge the provided payment method for the total order amount, including applicable taxes and delivery fees.",
    ],
  },
  {
    id: "delivery",
    title: "5. Delivery Policy",
    content: [
      "FreshCart endeavors to deliver orders within the estimated time frames provided at checkout. However, delivery times are estimates only and may vary due to factors beyond our control, including weather, traffic, and high demand periods.",
      "You are responsible for ensuring that someone is available to receive the delivery at the specified address. FreshCart is not liable for any loss or damage resulting from an unattended delivery.",
    ],
  },
  {
    id: "returns",
    title: "6. Returns & Refunds",
    content: [
      "If you receive a damaged, defective, or incorrect product, please contact our support team within 24 hours of delivery with photographic evidence. We will arrange a replacement or refund at our discretion.",
      "Perishable items, including fresh produce, dairy, and meat products, are not eligible for return once delivered unless they are found to be spoiled or damaged upon arrival.",
      "Refunds, where applicable, will be processed to the original payment method within 5–10 business days.",
    ],
  },
  {
    id: "conduct",
    title: "7. Prohibited Conduct",
    content: [
      "You agree not to use the Service for any unlawful purpose or in any way that could harm, disable, overburden, or impair FreshCart or its infrastructure. This includes but is not limited to: attempting to gain unauthorized access to any portion of the Service; transmitting any content that is harmful, offensive, or otherwise objectionable; and using automated means to scrape or collect data from the Service.",
    ],
  },
  {
    id: "intellectual-property",
    title: "8. Intellectual Property",
    content: [
      "All content on the Service, including but not limited to text, graphics, logos, images, and software, is the property of FreshCart or its content suppliers and is protected by applicable intellectual property laws.",
      "You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any content from the Service without our express written permission.",
    ],
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: [
      "To the fullest extent permitted by applicable law, FreshCart shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from your use or inability to use the Service.",
      "Our total liability to you for any claims arising under these Terms shall not exceed the total amount paid by you to FreshCart in the 12 months preceding the claim.",
    ],
  },
  {
    id: "governing-law",
    title: "10. Governing Law",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which FreshCart operates, without regard to its conflict of law provisions.",
      "Any dispute arising from these Terms shall be resolved through good-faith negotiation. If the dispute cannot be resolved informally, it shall be submitted to binding arbitration in accordance with applicable arbitration rules.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact Us",
    content: [
      "If you have any questions about these Terms of Service, please contact us at legal@freshcart.com or write to us at our registered business address. We aim to respond to all inquiries within 5 business days.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#FFFBF5] pb-16 pt-6">
      <div className="mx-auto max-w-5xl px-6">

        {/* ── Breadcrumb + quick links bar ── */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#A8A29E]">
            <Link href="/" className="hover:text-[#F97316] transition-colors">Home</Link>
            <span>/</span>
            <span className="font-medium text-[#1C1917]">Terms of Service</span>
          </div>
          {/* Quick links */}
          <div className="flex items-center gap-2">
            <Link
              href="/privacy"
              className="rounded-full border border-orange-200 bg-white px-4 py-1.5 text-xs font-semibold text-[#F97316] transition-all hover:border-[#F97316] hover:bg-[#FFF7ED]"
            >
              Privacy Policy →
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
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-[#FFF7ED] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#C2410C]">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            Legal Document
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#1C1917] sm:text-5xl">
            Terms of{" "}
            <span className="text-shimmer">Service</span>
          </h1>
          <p className="mt-3 text-sm text-[#A8A29E]">
            Effective Date: <strong className="text-[#1C1917]">June 1, 2025</strong>
            &nbsp;·&nbsp; Last Updated: <strong className="text-[#1C1917]">June 1, 2025</strong>
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#78716C]">
            Please read these terms carefully before using FreshCart. They outline your rights and
            responsibilities when shopping with us.
          </p>
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
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Intro callout */}
            <div className="mb-8 rounded-2xl border border-orange-200 bg-gradient-to-br from-[#FFF7ED] to-[#FFFBF5] p-5">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FED7AA]">
                  <svg className="h-4 w-4 text-[#C2410C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed text-[#78716C]">
                  Welcome to FreshCart. These Terms of Service govern your use of our platform.
                  By creating an account or placing an order, you agree to these terms.
                  The sidebar helps you jump to any section quickly.
                </p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((section, i) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-6 rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FED7AA] text-xs font-bold text-[#C2410C]">
                      {i + 1}
                    </span>
                    <h2 className="font-display text-[16px] font-semibold text-[#1C1917]">
                      {section.title.replace(/^\d+\.\s/, "")}
                    </h2>
                  </div>
                  <div className="space-y-2.5">
                    {section.content.map((para, j) => (
                      <p key={j} className="text-[14px] leading-7 text-[#57534E]">
                        {para}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* ── Bottom CTA card ── */}
            <div className="mt-10 rounded-2xl border border-green-200 bg-gradient-to-br from-[#DCFCE7] to-[#FFFBF5] p-7 text-center">
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E]">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-display text-base font-semibold text-[#15803D]">
                {"You're all caught up"}
              </h3>
              <p className="mt-1 text-sm text-[#78716C]">
                Questions?{" "}
                <Link href="/contact" className="font-medium text-[#F97316] hover:underline">
                  Contact our support team
                </Link>
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="rounded-full bg-[#F97316] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#C2410C]"
                >
                  Create Account
                </Link>
                <Link
                  href="/privacy"
                  className="rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-[#F97316] transition-all hover:border-[#F97316]"
                >
                  Privacy Policy →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}