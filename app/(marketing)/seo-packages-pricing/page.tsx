import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PricingTable } from "@/components/ui/PricingTable";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { buildMetadata } from "@/lib/seo";
import { pricingFaqs } from "@/content/pricing";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "SEO Packages and Pricing — Plans for Every Stage | [BRAND]",
  description:
    "SEO packages and pricing for small business, growth, and ecommerce. Indicative monthly plans with no long lock-in — your exact scope confirmed after a free audit.",
  path: "/seo-packages-pricing/",
});

export default function SeoPricingPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "SEO services", path: "/seo-services/" },
          { name: "SEO packages and pricing", path: "/seo-packages-pricing/" },
        ]}
        eyebrow="Pricing"
        title="SEO packages and pricing built around real goals"
        intro={
          <>
            <p className="mb-4">
              Our SEO packages and pricing are designed to match effort to
              outcome — from local small-business visibility to competitive
              ecommerce growth. The figures below are indicative starting
              points; your exact price is confirmed after a short, free audit.
            </p>
            <p>
              No long lock-in contracts, no vanity metrics — just a clear scope
              and reporting you can verify.
            </p>
          </>
        }
        secondaryCta={{ label: "Back to SEO services", href: "/seo-services/" }}
      />

      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <PricingTable />
      </section>

      <section className="border-y border-line bg-cloud">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <FAQAccordion
            heading="SEO packages and pricing FAQs"
            items={pricingFaqs}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <RelatedServices
          heading="Explore our SEO services"
          links={[
            {
              title: "All SEO services",
              href: "/seo-services/",
              blurb: "The full SEO pillar and every specialist service.",
            },
            {
              title: "Technical SEO audit",
              href: "/seo-services/technical-seo-audit/",
              blurb: "Find what is stopping Google ranking your pages.",
            },
            {
              title: "Ecommerce SEO company",
              href: "/seo-services/ecommerce-seo/",
              blurb: "Grow organic revenue from category and product pages.",
            },
          ]}
        />
      </section>
    </>
  );
}
