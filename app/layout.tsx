import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "York University Computer Purchase Catalogue",
  description: "Browse approved computing equipment and submit purchase requests."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold text-yorkRed">York University</h1>
              <p className="text-sm text-gray-600">Computer Purchase Catalogue</p>
            </div>
            <nav className="flex gap-4 text-sm font-medium">
              <Link href="/" className="hover:text-yorkRed">Products</Link>
              <Link href="/cart" className="hover:text-yorkRed">Request Cart</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
