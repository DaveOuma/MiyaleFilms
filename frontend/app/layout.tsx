import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiyaleFilms",
  description: "Event photography and filmmaking for weddings, celebrations, and public events.",
};

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold">
              MiyaleFilms
            </Link>

            <nav className="flex items-center gap-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/portfolio">Portfolio</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>

        <footer className="mt-12 border-t bg-white">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium">MiyaleFilms</div>
                <div className="mt-1 text-xs text-gray-600">
                  Event photography and filmmaking.
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <a className="hover:underline" href="/contact">
                  Book / Enquiries
                </a>
                <a className="hover:underline" href="tel:+254724269201">
                  Call
                </a>
                <a
                  className="hover:underline"
                  href="https://wa.me/254724269201"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              © {new Date().getFullYear()} MiyaleFilms. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

