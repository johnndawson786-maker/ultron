import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * JSON-LD builders. Every structured-data block on the site is produced here
 * so we never hand-write schema per page (that always drifts).
 *
 * IMPORTANT: never emit AggregateRating/Review unless backed by real,
 * verifiable reviews. There are no rating builders here by design.
 */

type Json = Record<string, unknown>;

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/** Organization node — referenced by @id elsewhere. */
export function organizationNode(): Json {
  const node: Json = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.brand,
    url: `${site.url}/`,
    description: site.description,
  };
  if (site.sameAs.length > 0) node.sameAs = site.sameAs;
  // Contact details are placeholders; only emit when they look real.
  return node;
}

/** WebSite node with a SearchAction (sitelinks search box eligibility). */
export function websiteNode(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${site.url}/`,
    name: site.brand,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/search/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Root @graph placed once in the root layout. */
export function rootGraph(): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), websiteNode()],
  };
}

export type Breadcrumb = { name: string; path: string };

export function breadcrumbNode(items: Breadcrumb[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type FaqItem = { question: string; answer: string };

export function faqNode(items: FaqItem[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

type ServiceNodeArgs = {
  name: string;
  serviceType: string;
  description: string;
  path: string;
  areaServed?: string[];
  offers?: { name: string; description?: string }[];
};

export function serviceNode({
  name,
  serviceType,
  description,
  path,
  areaServed,
  offers,
}: ServiceNodeArgs): Json {
  const node: Json = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID },
  };
  if (areaServed) node.areaServed = areaServed;
  if (offers && offers.length > 0) {
    node.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name,
      itemListElement: offers.map((o) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: o.name,
          ...(o.description ? { description: o.description } : {}),
        },
      })),
    };
  }
  return node;
}

/** Serialize a node for injection via a <script type="application/ld+json">. */
export function jsonLd(node: Json): string {
  return JSON.stringify(node);
}
