# Digital Agency Website — [BRAND]

A production website for a full-service digital agency (SEO, Digital Marketing,
Web Development, Penetration Testing) serving India and the USA. Built with
Next.js 15 (App Router), TypeScript, and Tailwind CSS v4, with a light, clean,
techy design and per-route technical SEO.

> Real business details are not yet supplied, so brand-facing values use
> `[BRAND]`, `[PHONE]`, `[EMAIL]`, `[ADDRESS]` placeholders. Swap them in
> `content/site.ts` (and set the production domain via `site.url`). No
> fabricated client names, results, ratings, or certifications appear anywhere.

## Stack

- **Next.js 15** (App Router) + **TypeScript** — static generation, per-route metadata
- **Tailwind CSS v4** with a custom design-token layer (no default palette)
- **Framer Motion** for scroll reveals; all motion respects `prefers-reduced-motion`
- **next/font** self-hosting Sora / Inter / IBM Plex Mono (no render-blocking fonts)
- Metadata + JSON-LD generated via factories (`lib/seo.ts`, `lib/schema.ts`) so they never drift

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (fully static)
npm run start    # serve the production build
```

## Project structure

```
app/
  layout.tsx                       # fonts, Organization + WebSite JSON-LD, header/footer
  page.tsx                         # home
  globals.css                      # design tokens (@theme) + utilities + motion
  robots.ts  sitemap.ts            # crawl directives + dynamic sitemap
  not-found.tsx                    # custom 404
  free-seo-audit/  contact/        # lead-capture pages (form UI; Resend wiring = Phase 7)
  (marketing)/
    seo-services/page.tsx          # SEO pillar
    seo-services/[service]/page.tsx# 12 SEO sub-service pages (generateStaticParams)
    seo-packages-pricing/page.tsx  # pricing
components/
  ui/        # Button, Header, Footer, Breadcrumbs, FAQAccordion, PricingTable, StatCounter, ...
  sections/  # Hero, HeroVisual, RankTicker, ServicesGrid, ProcessSteps, ServiceContent, ...
content/     # site, nav, home, seo-services, pricing, rank-ticker  (typed, data-driven)
lib/         # seo.ts (metadata factory), schema.ts (JSON-LD builders)
```

## What's built (phases)

- **Phase 1–2** — Foundation, design system, and full home page.
- **Phase 3** — SEO cluster (this delivery):
  - `/seo-services/` pillar
  - 12 sub-service pages under `/seo-services/<slug>/`
  - `/seo-packages-pricing/`
  - Full internal linking (pillar ⇄ children ⇄ siblings), breadcrumbs, and
    `Service` + `FAQPage` + `BreadcrumbList` JSON-LD on every page.
- Supporting: `/free-seo-audit/`, `/contact/`, custom 404.

Future phases (per the build plan): the Digital Marketing, Web Development, and
Penetration Testing clusters, location pages, the blog engine, and wiring the
forms to Resend + analytics.

## SEO notes

- One keyword = one URL. Each page front-loads its primary keyword in the
  title, H1, first 100 words, one H2, meta description, and slug.
- Single trailing-slash policy (`trailingSlash: true`).
- Self-referencing canonicals; OG/Twitter tags via `lib/seo.ts`.
- No `AggregateRating`/`Review` schema is emitted (no real reviews to cite yet) —
  by design, to avoid manual penalties from fabricated ratings.
