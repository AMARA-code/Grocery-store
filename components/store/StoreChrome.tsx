"use client";

import { CartProvider } from "@/hooks/useCart";
import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";
import { Toaster } from "react-hot-toast";

export function StoreChrome({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-2 py-8 md:px-4">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </CartProvider>
  );
}
