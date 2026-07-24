"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { megaMenu, primaryNav } from "@/content/nav";
import { Button } from "./Button";

/**
 * Sticky header. Transparent over the hero, turns solid white on scroll.
 * Services opens a 4-column mega-menu (one column per service line).
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || mobileOpen;
  const linkColor = solid ? "text-ink" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        solid ? "bg-white shadow-[0_1px_0_var(--line)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <Link
          href="/"
          className={`font-[family-name:var(--font-display)] text-xl font-bold tracking-tight ${linkColor}`}
        >
          {site.brand}
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary"
          onMouseLeave={() => setServicesOpen(false)}
        >
          <div className="relative">
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((v) => !v)}
              onMouseEnter={() => setServicesOpen(true)}
              className={`flex items-center gap-1 text-[1.0625rem] font-medium ${linkColor} hover:opacity-80`}
            >
              Services
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path
                  d="M2 4l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {servicesOpen ? (
              <div className="absolute left-1/2 top-full z-50 mt-4 w-[min(56rem,90vw)] -translate-x-1/2 rounded-2xl border border-line bg-white p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  {megaMenu.map((col) => (
                    <div key={col.href}>
                      <Link
                        href={col.href}
                        className="mono-eyebrow text-primary hover:underline"
                      >
                        {col.title}
                      </Link>
                      <ul className="mt-3 space-y-2">
                        {col.links.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              className="text-[0.95rem] text-ink-soft hover:text-primary"
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {primaryNav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[1.0625rem] font-medium ${linkColor} hover:opacity-80`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/free-seo-audit/" variant="primary">
            Free SEO audit
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className={`lg:hidden ${linkColor}`}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            {mobileOpen ? (
              <path
                d="M6 6l14 14M20 6L6 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 8h18M4 14h18M4 20h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen ? (
        <div className="border-t border-line bg-white lg:hidden">
          <nav
            className="mx-auto max-w-7xl space-y-6 px-5 py-6"
            aria-label="Mobile"
          >
            {megaMenu.map((col) => (
              <div key={col.href}>
                <Link
                  href={col.href}
                  className="mono-eyebrow text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {col.title}
                </Link>
                <ul className="mt-2 space-y-2 pl-1">
                  {col.links.slice(1).map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-ink-soft"
                        onClick={() => setMobileOpen(false)}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-col gap-2 border-t border-line pt-4">
              {primaryNav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-medium text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <Button href="/free-seo-audit/" variant="primary" className="w-full">
              Free SEO audit
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
