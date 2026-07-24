import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { RelatedServices, type RelatedLink } from "./RelatedServices";
import { Button } from "@/components/ui/Button";
import {
  getSeoService,
  seoNarratives,
  seoNarratives2,
  type SeoService,
} from "@/content/seo-services";

/**
 * Renders the body sections shared by every SEO sub-service page, driven by
 * the service's data. Keeps the commercial section pattern consistent while
 * the copy stays unique per page.
 */
export function ServiceContent({ service }: { service: SeoService }) {
  const related: RelatedLink[] = [
    {
      title: "All SEO services",
      href: "/seo-services/",
      blurb: "Back to the full SEO service pillar.",
    },
    ...service.related
      .map((slug) => getSeoService(slug))
      .filter((s): s is SeoService => Boolean(s))
      .map((s) => ({
        title: capitalise(s.keyword),
        href: `/seo-services/${s.slug}/`,
        blurb: s.intro[0].split(". ")[0] + ".",
      })),
  ];

  const narrative = seoNarratives[service.slug];
  const narrative2 = seoNarratives2[service.slug];

  return (
    <>
      {/* Long-form narrative — topical depth */}
      {narrative ? (
        <section
          aria-labelledby="detail-heading"
          className="mx-auto max-w-3xl px-5 pt-16 lg:px-8"
        >
          <h2 id="detail-heading" className="text-2xl sm:text-3xl">
            {narrative.heading}
          </h2>
          <div className="mt-6 space-y-4 text-lg text-ink-soft">
            {narrative.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      {/* Why choose */}
      <section
        aria-labelledby="why-heading"
        className="mx-auto max-w-6xl px-5 py-20 lg:px-8"
      >
        <SectionHeading id="why-heading" eyebrow="Why us" title={service.whyHeading} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {service.whyChoose.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-line bg-white p-6">
                <h3 className="text-lg">{w.title}</h3>
                <p className="mt-2 text-[0.95rem] text-ink-soft">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section
        aria-labelledby="included-heading"
        className="bg-cloud"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <SectionHeading
            id="included-heading"
            eyebrow="Scope"
            title={service.includedHeading}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.included.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.06}>
                <div className="flex h-full gap-4 rounded-2xl border border-line bg-white p-6">
                  <span
                    className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/8 font-[family-name:var(--font-mono)] text-sm text-primary"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-soft">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section
        aria-labelledby="process-heading"
        className="mx-auto max-w-6xl px-5 py-20 lg:px-8"
      >
        <SectionHeading
          id="process-heading"
          eyebrow="How it works"
          title={`How our ${service.keyword} process works`}
        />
        <div className="relative mt-12 grid gap-8 md:grid-cols-4">
          <div
            className="pointer-events-none absolute left-0 right-0 top-6 hidden border-t border-dashed border-line md:block"
            aria-hidden="true"
          />
          {service.process.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.06} className="relative">
              <div className="relative grid h-12 w-12 place-items-center rounded-full border border-line bg-white font-[family-name:var(--font-mono)] text-sm font-medium text-primary shadow-soft">
                {step.step}
              </div>
              <h3 className="mt-5 text-lg">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] text-ink-soft">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Second narrative — expectations / measurement */}
      {narrative2 ? (
        <section
          aria-labelledby="detail2-heading"
          className="mx-auto max-w-3xl px-5 pb-16 lg:px-8"
        >
          <h2 id="detail2-heading" className="text-2xl sm:text-3xl">
            {narrative2.heading}
          </h2>
          <div className="mt-6 space-y-4 text-lg text-ink-soft">
            {narrative2.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      {/* Pricing note / CTA to pricing */}
      <section className="mx-auto max-w-6xl px-5 pb-4 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-cloud p-8 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 className="text-xl">Pricing</h2>
            <p className="mt-2 text-ink-soft">{service.pricingNote}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/seo-packages-pricing/" variant="secondary">
              View SEO packages
            </Button>
            <Button href="/free-seo-audit/" variant="primary">
              Get a free audit
            </Button>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <RelatedServices links={related} />
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-cloud">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <FAQAccordion heading={service.faqHeading} items={service.faqs} />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="rounded-3xl bg-ink px-8 py-14 text-center lg:px-16">
          <h2 className="text-2xl font-bold !text-white sm:text-3xl">
            Ready to improve your {service.keyword}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Start with a free audit. We will show you the specific opportunities
            on your site — no jargon, no obligation.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href="/free-seo-audit/" variant="primary">
              Get your free audit
            </Button>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 font-medium text-white transition-colors duration-150 hover:text-signal"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
