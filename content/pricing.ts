/**
 * SEO packages & pricing.
 *
 * Figures are INDICATIVE starting points to set expectations, not fixed
 * quotes — every engagement is scoped and confirmed after an audit. They are
 * the agency's own pricing to set, so they are placeholders you can adjust in
 * one place. Not client results, so no honesty rule is bent by showing them;
 * the UI clearly labels them as indicative.
 */

export type PricingTier = {
  name: string;
  tagline: string;
  monthly: number; // indicative monthly retainer
  currency: string;
  featured?: boolean;
  bestFor: string;
  features: string[];
  cta: { label: string; href: string };
};

// Annual is billed at ~2 months' discount vs monthly (10x monthly).
export const annualMultiplier = 10;

export const seoPricingTiers: PricingTier[] = [
  {
    name: "Starter",
    tagline: "Foundations & local visibility",
    monthly: 499,
    currency: "$",
    bestFor: "Small businesses and new sites getting the basics right.",
    features: [
      "Technical foundations fixed",
      "Up to 10 priority keywords",
      "On-page optimisation, 5 pages/mo",
      "Google Business Profile + local citations",
      "Monthly reporting (GSC + GA4)",
    ],
    cta: { label: "Start with a free audit", href: "/free-seo-audit/" },
  },
  {
    name: "Growth",
    tagline: "Scaling organic revenue",
    monthly: 1299,
    currency: "$",
    featured: true,
    bestFor: "Growing companies competing for commercial keywords.",
    features: [
      "Everything in Starter",
      "Up to 30 priority keywords",
      "On-page optimisation, 12 pages/mo",
      "Content production + briefs",
      "Ethical link building",
      "Fortnightly reporting & strategy call",
    ],
    cta: { label: "Talk to us", href: "/contact/" },
  },
  {
    name: "Scale",
    tagline: "Ecommerce & competitive markets",
    monthly: 2999,
    currency: "$",
    bestFor: "Ecommerce and established brands in competitive niches.",
    features: [
      "Everything in Growth",
      "Catalogue-scale ecommerce SEO",
      "Priority link building & digital PR",
      "Dedicated strategist",
      "Custom reporting dashboard",
      "Quarterly roadmap reviews",
    ],
    cta: { label: "Request a custom scope", href: "/contact/" },
  },
];

export const pricingFaqs = [
  {
    question: "How much do SEO packages cost?",
    answer:
      "The figures shown are indicative monthly starting points. Real pricing depends on your market, competition, and goals, which we confirm after a short audit. There are no long lock-in contracts — services run month to month.",
  },
  {
    question: "Why do you show indicative prices instead of exact quotes?",
    answer:
      "Because honest SEO pricing depends on your site and market. Fixed public prices either overcharge simple sites or underdeliver on competitive ones. The ranges here set expectations; the audit produces an accurate quote.",
  },
  {
    question: "Do you offer custom or one-off projects?",
    answer:
      "Yes. Alongside monthly retainers we offer fixed-scope projects such as a technical SEO audit, keyword research, or a migration. Tell us what you need and we will scope it.",
  },
  {
    question: "Which package is right for me?",
    answer:
      "Small businesses usually start with Starter, growing companies with Growth, and ecommerce or competitive brands with Scale. If you are unsure, a free audit will tell you which level of effort your goals actually require.",
  },
  {
    question: "Are there any long-term contracts?",
    answer:
      "No long lock-ins. SEO takes time to compound, so we ask for a fair initial period to do meaningful work, then continue month to month based on results you can verify.",
  },
];
