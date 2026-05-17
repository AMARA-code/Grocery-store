import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-gray-200 bg-gradient-to-b from-white to-green-50/40">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm space-y-2">
            <span className="text-xl font-bold text-green-700">FreshCart</span>
            <p className="text-sm text-gray-600">
              Fresh groceries, delivered with care.
            </p>
          </div>
          <div className="flex flex-wrap gap-10 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Store</h4>
              <ul className="space-y-1.5 text-gray-600">
                <li>
                  <Link href="/products" className="hover:text-green-700">
                    Shop all
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-green-700">
                    View cart
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Support</h4>
              <ul className="space-y-1.5 text-gray-600">
                <li>
                  <Link href="/contact" className="hover:text-green-700">
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:amaranaeem453@gmail.com"
                    className="hover:text-green-700"
                  >
                    amaranaeem453@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-green-500/60" />
            <span className="h-2 w-2 rounded-full bg-green-600/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
