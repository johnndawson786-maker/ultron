/**
 * Home-page section content. Data-driven so sections stay declarative.
 * No fabricated numbers or client names here — outcome claims are framed as
 * capabilities, and real metrics/logos are added once verified.
 */

export type ServiceLine = {
  title: string;
  href: string;
  blurb: string;
  points: string[];
  icon: "search" | "megaphone" | "code" | "shield";
};

export const serviceLines: ServiceLine[] = [
  {
    title: "SEO Optimization",
    href: "/seo-services/",
    blurb:
      "Technical fixes, content, and links that get your pages indexed, ranked, and clicked.",
    points: ["Technical & on-page SEO", "Link building", "Ecommerce & local"],
    icon: "search",
  },
  {
    title: "Digital Marketing",
    href: "/digital-marketing-services/",
    blurb:
      "Paid and organic campaigns that turn attention into measurable pipeline and revenue.",
    points: ["PPC & Google Ads", "Social & content", "Performance marketing"],
    icon: "megaphone",
  },
  {
    title: "Web Development",
    href: "/web-development-services/",
    blurb:
      "Fast, accessible, search-friendly websites and web apps built to convert.",
    points: ["Custom & headless builds", "WordPress & Shopify", "React & full-stack"],
    icon: "code",
  },
  {
    title: "Penetration Testing",
    href: "/penetration-testing-services/",
    blurb:
      "Manual VAPT that finds the vulnerabilities scanners miss — before attackers do.",
    points: ["Web & API pen testing", "VAPT & compliance", "Cloud & network"],
    icon: "shield",
  },
];

export type ProcessStep = {
  step: string;
  title: string;
  desc: string;
};

export const homeProcess: ProcessStep[] = [
  {
    step: "01",
    title: "Audit & discovery",
    desc: "We map your site, market, and competitors, then agree on the metrics that matter.",
  },
  {
    step: "02",
    title: "Strategy & roadmap",
    desc: "A prioritised plan with clear deliverables, owners, and realistic timelines.",
  },
  {
    step: "03",
    title: "Build & execute",
    desc: "Technical fixes, content, campaigns, and testing shipped in focused sprints.",
  },
  {
    step: "04",
    title: "Measure & scale",
    desc: "Transparent reporting you can verify — then we double down on what works.",
  },
];

export type Differentiator = { title: string; desc: string };

export const differentiators: Differentiator[] = [
  {
    title: "One team, four disciplines",
    desc: "SEO, marketing, development, and security under one roof — no finger-pointing between vendors.",
  },
  {
    title: "Built for two markets",
    desc: "We run India and US campaigns with the right currency, language, and search-behaviour nuances for each.",
  },
  {
    title: "Reporting you can verify",
    desc: "Every number ties back to Google Search Console, GA4, or a rank tracker you can log into yourself.",
  },
  {
    title: "Security is not an afterthought",
    desc: "The same team that grows your traffic can pressure-test the site keeping that traffic safe.",
  },
];
