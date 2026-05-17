import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreshCart — Grocery store",
  description: "Modern grocery e-commerce (Next.js migration)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
