import type { ProductRow } from "@/types";

export function ProductInquiryForm({ product }: { product: ProductRow }) {
  return (
    <div className="mt-10 rounded-2xl border border-gray-100 bg-green-50/40 p-6 shadow-inner">
      <h2 className="text-lg font-semibold text-gray-900">Ask about this product</h2>
      <p className="mt-2 text-sm text-gray-600">
        Have a question about <strong>{product.name}</strong>? Send us a quick message
        and we&apos;ll reply by email.
      </p>
      <form
        className="mt-4 space-y-4"
        action="https://formspree.io/f/mwvrloey"
        method="POST"
      >
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="productName" value={product.name} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="inquiry-name" className="text-sm font-medium text-gray-700">
              Your name
            </label>
            <input
              id="inquiry-name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="inquiry-email" className="text-sm font-medium text-gray-700">
              Your email
            </label>
            <input
              id="inquiry-email"
              name="_replyto"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="inquiry-message" className="text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="inquiry-message"
            name="message"
            rows={3}
            required
            placeholder="e.g. Do you have this in a larger size?"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25"
          />
        </div>
        <button
          type="submit"
          className="rounded-full border-2 border-green-600 px-5 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
        >
          Send product inquiry
        </button>
      </form>
    </div>
  );
}