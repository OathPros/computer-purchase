import type { Metadata } from "next";
import Link from "next/link";
import { RequestCartProvider } from "@/components/RequestCartProvider";
import RequestCartNavLink from "@/components/RequestCartNavLink";
import "./globals.css";

export const metadata: Metadata = {
  title: "York University Device Request Catalogue",
  description: "Browse approved computing equipment and submit equipment requests."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <RequestCartProvider>
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-xl font-semibold text-yorkRed">York University</h1>
                <p className="text-sm text-gray-700">Device Request Catalogue</p>
              </div>
              <nav className="flex gap-4 text-sm font-medium" aria-label="Main">
                <Link href="/" className="rounded-sm hover:text-yorkRed">Products</Link>
                <RequestCartNavLink />
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </RequestCartProvider>
      </body>
    </html>
  );
}
