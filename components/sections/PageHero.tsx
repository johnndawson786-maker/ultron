import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { Breadcrumb } from "@/lib/schema";

/**
 * Standard interior/service page hero: breadcrumbs, eyebrow, H1, intro, CTAs.
 * Light surface with a faint grid — consistent with the home hero, lighter
 * weight. The H1 and intro render as static HTML (fast LCP).
 */
export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  children,
  primaryCta = { label: "Get a free SEO audit", href: "/free-seo-audit/" },
  secondaryCta,
}: {
  breadcrumbs: Breadcrumb[];
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  children?: ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white pt-28 pb-16 lg:pt-32">
      <div
        className="surface-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-6">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1
          className="mt-4 font-bold text-ink"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08 }}
        >
          {title}
        </h1>
        <div className="mt-5 max-w-2xl text-lg text-ink-soft">{intro}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={primaryCta.href} variant="primary">
            {primaryCta.label}
          </Button>
          {secondaryCta ? (
            <Button href={secondaryCta.href} variant="secondary">
              {secondaryCta.label}
            </Button>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
