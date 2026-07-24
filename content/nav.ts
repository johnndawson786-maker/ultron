/** Header/footer navigation model. Mega-menu = 4 columns, one per service line. */
export type NavLink = { label: string; href: string };
export type NavColumn = { title: string; href: string; links: NavLink[] };

export const megaMenu: NavColumn[] = [
  {
    title: "SEO Optimization",
    href: "/seo-services/",
    links: [
      { label: "SEO services", href: "/seo-services/" },
      { label: "Technical SEO audit", href: "/seo-services/technical-seo-audit/" },
      { label: "On-page SEO", href: "/seo-services/on-page-seo/" },
      { label: "Link building", href: "/seo-services/link-building/" },
      { label: "Ecommerce SEO", href: "/seo-services/ecommerce-seo/" },
      { label: "SEO packages & pricing", href: "/seo-packages-pricing/" },
    ],
  },
  {
    title: "Digital Marketing",
    href: "/digital-marketing-services/",
    links: [
      { label: "Digital marketing services", href: "/digital-marketing-services/" },
      { label: "Social media marketing", href: "/digital-marketing-services/social-media-marketing/" },
      { label: "PPC management", href: "/ppc-management-services/" },
      { label: "Google Ads management", href: "/google-ads-management/" },
      { label: "Content marketing", href: "/content-marketing/" },
      { label: "Marketing packages & pricing", href: "/digital-marketing-packages-pricing/" },
    ],
  },
  {
    title: "Web Development",
    href: "/web-development-services/",
    links: [
      { label: "Web development services", href: "/web-development-services/" },
      { label: "Custom website development", href: "/web-development-services/custom-website-development/" },
      { label: "Ecommerce development", href: "/ecommerce-website-development/" },
      { label: "WordPress development", href: "/wordpress-development/" },
      { label: "React development", href: "/react-development/" },
      { label: "Website development pricing", href: "/website-development-pricing/" },
    ],
  },
  {
    title: "Penetration Testing",
    href: "/penetration-testing-services/",
    links: [
      { label: "Penetration testing services", href: "/penetration-testing-services/" },
      { label: "Web app penetration testing", href: "/web-application-penetration-testing/" },
      { label: "VAPT services", href: "/vapt-services/" },
      { label: "Website security testing", href: "/website-security-testing/" },
      { label: "API penetration testing", href: "/api-penetration-testing/" },
      { label: "Vulnerability assessment", href: "/website-vulnerability-assessment/" },
    ],
  },
];

export const primaryNav: NavLink[] = [
  { label: "Case studies", href: "/case-studies/" },
  { label: "About", href: "/about/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];
