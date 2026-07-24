/**
 * Global site + brand configuration.
 *
 * Real business details are not yet supplied, so commercial-facing values use
 * clearly-marked placeholders. Do NOT invent a real business name, phone,
 * address, certifications, or client results — swap these once provided.
 */
export const site = {
  brand: "[BRAND]",
  // Used for canonical/OG absolute URLs. Update to the production domain.
  url: "https://example.com",
  tagline: "Digital marketing agency for India and the USA",
  description:
    "SEO, digital marketing, web development, and penetration testing for growth-focused businesses across India and the USA.",
  phone: "[PHONE]",
  email: "[EMAIL]",
  address: {
    street: "[ADDRESS]",
    locality: "[CITY]",
    region: "[REGION]",
    postalCode: "[POSTAL]",
    country: "IN",
  },
  // Social profiles — only add real, owned profiles here (used in sameAs).
  sameAs: [] as string[],
  serviceLines: [
    { title: "SEO Optimization", href: "/seo-services/" },
    { title: "Digital Marketing", href: "/digital-marketing-services/" },
    { title: "Web Development", href: "/web-development-services/" },
    { title: "Penetration Testing", href: "/penetration-testing-services/" },
  ],
} as const;

export type Site = typeof site;
