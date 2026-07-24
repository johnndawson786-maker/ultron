import Link from "next/link";
import { site } from "@/content/site";
import { megaMenu, primaryNav } from "@/content/nav";

/** Fat 4-column footer with newsletter and a partner/payment strip. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2">
            <p className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
              {site.brand}
            </p>
            <p className="mt-4 max-w-xs text-[0.95rem]">
              {site.tagline}. Serving clients across India and the USA.
            </p>

            <form className="mt-6 max-w-xs" aria-label="Newsletter signup">
              <label
                htmlFor="footer-email"
                className="mono-eyebrow text-signal"
              >
                Get the growth newsletter
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                />
                <button
                  type="submit"
                  className="rounded-full bg-accent px-4 py-2 font-medium text-white transition-colors duration-150 hover:bg-[#c94e12]"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

          {/* Service columns */}
          {megaMenu.map((col) => (
            <div key={col.href}>
              <Link
                href={col.href}
                className="font-[family-name:var(--font-display)] text-[0.95rem] font-semibold text-white hover:text-signal"
              >
                {col.title}
              </Link>
              <ul className="mt-4 space-y-2">
                {col.links.slice(1, 5).map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[0.9rem] hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Partner / payment strip (placeholders — add real logos only) */}
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-8">
          <span className="mono-eyebrow text-white/40">
            {/* TODO: add real partner/certification badges only if held */}
            Partners &amp; certifications: add on verification
          </span>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-[0.85rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.brand}. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {primaryNav.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            ))}
            <Link href="/privacy-policy/" className="hover:text-white">
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
