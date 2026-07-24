import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { serviceNode } from "@/lib/schema";
import { seoPillar, seoServices } from "@/content/seo-services";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: seoPillar.metaTitle,
  description: seoPillar.metaDescription,
  path: "/seo-services/",
});

export default function SeoServicesPillar() {
  return (
    <>
      <JsonLd
        data={serviceNode({
          name: "SEO Services",
          serviceType: seoPillar.serviceType,
          description: seoPillar.metaDescription,
          path: "/seo-services/",
          areaServed: ["India", "United States"],
          offers: seoServices.map((s) => ({
            name: s.keyword,
            description: s.metaDescription,
          })),
        })}
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "SEO services", path: "/seo-services/" },
        ]}
        eyebrow="Search Engine Optimization"
        title={seoPillar.h1}
        intro={seoPillar.intro.map((p) => (
          <p key={p} className="mb-4 last:mb-0">
            {p}
          </p>
        ))}
        secondaryCta={{ label: "View SEO packages", href: "/seo-packages-pricing/" }}
      />

      {/* Differentiators */}
      <section
        aria-labelledby="why-heading"
        className="mx-auto max-w-6xl px-5 py-20 lg:px-8"
      >
        <SectionHeading
          id="why-heading"
          eyebrow="Why us"
          title="Why businesses choose our SEO services"
          lede="We connect the technical foundation, the content, and the links — the three things that decide whether your pages rank — under one accountable team."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {seoPillar.differentiators.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.06}>
              <div className="flex h-full gap-4 rounded-2xl border border-line bg-white p-6">
                <span
                  className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-signal/12 text-[#0a8f70]"
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path
                      d="M3 8.5L6.5 12L13 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg">{d.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] text-ink-soft">{d.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sub-services grid (links down to all children) */}
      <section
        aria-labelledby="services-heading"
        className="border-y border-line bg-cloud"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <SectionHeading
            id="services-heading"
            eyebrow="Our SEO services"
            title="Specialist SEO services for every need"
            lede="Each service targets a specific problem. Not sure where to start? A free audit will point you to the ones that matter most for your site."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {seoServices.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 0.06} className="h-full">
                <Link
                  href={`/seo-services/${s.slug}/`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft"
                >
                  <h3 className="text-lg capitalize">{s.keyword}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-soft">
                    {s.intro[0].split(". ")[0]}.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Learn more
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      <path
                        d="M3 8h9M9 4l4 4-4 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-white p-8 shadow-soft sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl">Transparent SEO pricing</h2>
            <p className="mt-2 text-ink-soft">
              See indicative packages for small business, growth, and ecommerce
              — with your exact scope confirmed after a free audit.
            </p>
          </div>
          <Button href="/seo-packages-pricing/" variant="primary">
            See SEO packages &amp; pricing
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-cloud">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <FAQAccordion
            heading="Frequently asked questions about SEO services"
            items={seoPillar.faqs}
          />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="rounded-3xl bg-ink px-8 py-14 text-center lg:px-16">
          <h2 className="text-2xl font-bold !text-white sm:text-3xl">
            Find out what is holding your rankings back
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Get a free SEO audit and a prioritised list of the opportunities on
            your site. No obligation, no jargon.
          </p>
          <div className="mt-7">
            <Button href="/free-seo-audit/" variant="primary">
              Get your free SEO audit
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
