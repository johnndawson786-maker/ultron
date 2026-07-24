import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceContent } from "@/components/sections/ServiceContent";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { serviceNode } from "@/lib/schema";
import {
  getSeoService,
  seoServiceSlugs,
} from "@/content/seo-services";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return seoServiceSlugs().map((service) => ({ service }));
}

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getSeoService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/seo-services/${service.slug}/`,
  });
}

export default async function SeoServicePage({ params }: Props) {
  const { service: slug } = await params;
  const service = getSeoService(slug);
  if (!service) notFound();

  const path = `/seo-services/${service.slug}/`;

  return (
    <>
      <JsonLd
        data={serviceNode({
          name: service.metaTitle.replace(" | [BRAND]", ""),
          serviceType: service.serviceType,
          description: service.metaDescription,
          path,
          areaServed: ["India", "United States"],
          offers: service.included.map((i) => ({
            name: i.title,
            description: i.desc,
          })),
        })}
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "SEO services", path: "/seo-services/" },
          { name: service.keyword, path },
        ]}
        eyebrow={service.eyebrow}
        title={service.h1}
        intro={service.intro.map((p) => (
          <p key={p} className="mb-4 last:mb-0">
            {p}
          </p>
        ))}
        secondaryCta={{ label: "View SEO packages", href: "/seo-packages-pricing/" }}
      />

      <ServiceContent service={service} />
    </>
  );
}
