import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiyaleFilms",
  description:
    "Cinematic event photography and filmmaking for weddings, celebrations, and public events.",
};

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl px-4 py-2 bg-gradient-to-r from-indigo-600 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
    >
      {label}
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
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
          <div className="h-[2px] w-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-indigo-500" />

          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-fuchsia-500 to-indigo-500 text-slate-950 font-bold">
                M
              </span>
              <span className="text-base font-semibold tracking-wide">
                MiyaleFilms
              </span>
            </Link>

            <nav className="flex items-center gap-1">
              <NavItem href="/" label="Home" />
              <NavItem href="/portfolio" label="Portfolio" />
              <Link
                href="/contact"
                className="ml-1 rounded-xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm hover:opacity-95 transition"
              >
                Contact
              </Link>
            </nav>
          </div>
        </header>

        {/* Page container */}
        <div className="mx-auto max-w-6xl px-6 py-10 bg-gradient-to-r from-indigo-900">{children}</div>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-gradient-to-r from-slate-900">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <div className="rounded-xl p-4 p-3 text-black text-sm font-semibold tracking-wide bg-gradient-to-r from-emerald-200">
                  MiyaleFilms
                </div>
                <p className="mt-3 max-w-sm text-sm text-white/70">
                  Cinematic coverage for weddings, birthdays and celebrations,
                  and political/public events.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="rounded-xl bg-white/10 px-4 py-2 bg-gradient-to-r from-indigo-600 text-sm text-white hover:bg-white/15 transition"
                    href="/portfolio"
                  >
                    View portfolio
                  </Link>
                  <Link
                    className="rounded-xl bg-white/10 px-4 py-2 bg-gradient-to-r from-indigo-600 text-sm text-white hover:bg-white/15 transition"
                    href="/contact"
                  >
                    Booking/Enquiries
                  </Link>
                </div>
              </div>

              <div className="sm:justify-self-end">
                <div className="text-sm font-semibold tracking-wide">
                  Quick contact
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    className="rounded-xl bg-gradient-to-r from-emerald-200 px-4 py-2 text-sm text-black hover:bg-white/15 transition"
                    href="tel:+254724269201"
                  >
                    Call
                  </Link>

                  <Link
                    className="rounded-xl bg-gradient-to-r from-emerald-300 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-white/15 transition"
                    href="https://wa.me/254724269201"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </Link>

                  <Link
                    className="rounded-xl bg-gradient-to-r from-emerald-100 px-4 py-2 text-sm text-black hover:bg-white/15 transition"
                    href="mailto:davidomuga@gmail.com?subject=Booking%20Enquiry"
                  >
                    Email
                  </Link>
                </div>

                <div className="mt-6 text-xs text-white/60">
                  Nairobi and nationwide coverage.
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
              © {new Date().getFullYear()} MiyaleFilms. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
