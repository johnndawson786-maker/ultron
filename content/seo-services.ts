/**
 * SEO cluster content (Phase 3).
 *
 * One keyword = one URL. Each sub-service has genuinely differentiated copy
 * (not find-and-replace templates). No fabricated client names, results,
 * ratings, or certifications anywhere — pricing is framed as indicative and
 * confirmed after an audit.
 *
 * Primary-keyword placement checklist met per page: title (front-loaded), H1,
 * first 100 words, one H2, meta description, URL slug, one image/section alt.
 */

export type SeoFaq = { question: string; answer: string };
export type Included = { title: string; desc: string };
export type ProcessStep = { step: string; title: string; desc: string };
export type Differentiator = { title: string; desc: string };

export type SeoService = {
  slug: string; // under /seo-services/
  keyword: string; // primary keyword
  serviceType: string; // schema serviceType
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[]; // paragraphs; keyword appears in the first 100 words
  whyHeading: string;
  whyChoose: Differentiator[];
  includedHeading: string;
  included: Included[];
  process: ProcessStep[];
  pricingNote: string;
  faqHeading: string;
  faqs: SeoFaq[];
  related: string[]; // sibling slugs
};

/* ------------------------------------------------------------------ *
 * Pillar
 * ------------------------------------------------------------------ */
export const seoPillar = {
  slug: "seo-services",
  keyword: "SEO services",
  serviceType: "Search Engine Optimization",
  metaTitle: "SEO Services That Grow Organic Revenue | [BRAND]",
  metaDescription:
    "SEO services for India and the USA — technical fixes, content, and links that turn organic search into a reliable revenue channel. Get a free SEO audit.",
  h1: "SEO services that grow organic revenue, not just rankings",
  intro: [
    "You do not need more traffic. You need the right people finding the right pages and doing something once they land. Our SEO services connect the technical foundation, the content, and the links so search engines can trust your site and searchers can act on it.",
    "We work with businesses across India and the USA, from first-time founders to in-house marketing teams that need a specialist partner. Every engagement starts by naming the problem in plain terms — why the pages that should rank do not — and ends with reporting you can log into and verify yourself.",
  ],
  differentiators: [
    {
      title: "We fix causes, not symptoms",
      desc: "Ranking drops usually trace back to crawlability, thin content, or a trust gap. We diagnose the root cause instead of sprinkling keywords and hoping.",
    },
    {
      title: "One team across the whole funnel",
      desc: "The people optimising your pages sit beside the developers who build them and the analysts who measure them. Nothing gets lost between vendors.",
    },
    {
      title: "Reporting you can verify",
      desc: "Every metric ties back to Google Search Console, GA4, or a rank tracker you can open yourself. No vanity dashboards.",
    },
    {
      title: "Built for two markets",
      desc: "We run India and US campaigns with the right search behaviour, currency, and language nuances for each — not a one-size template.",
    },
  ],
  // Which sub-service slugs appear in the pillar's "services" grid.
  children: [
    "technical-seo-audit",
    "seo-audit",
    "on-page-seo",
    "off-page-seo",
    "ecommerce-seo",
    "keyword-research",
    "link-building",
    "white-label-seo",
    "shopify-seo",
    "wordpress-seo",
    "small-business-seo",
    "healthcare-seo",
  ],
  faqs: [
    {
      question: "How long do SEO services take to show results?",
      answer:
        "Most sites see early movement on technical fixes and existing content within 4–8 weeks, with compounding gains from month three onward. Competitive keywords and new domains take longer. We set realistic timelines per keyword during the audit rather than promising a fixed date.",
    },
    {
      question: "Do you guarantee first-page rankings?",
      answer:
        "No honest SEO company can guarantee a specific position, because ranking is decided by Google, not by us. We guarantee the work, the transparency, and a clear method — and we walk away from anyone promising guaranteed number-one results.",
    },
    {
      question: "What does an SEO engagement actually include?",
      answer:
        "Typically a technical audit, keyword and content strategy, on-page optimisation, content production or briefs, ethical link building, and monthly reporting. The exact mix depends on where your site is losing the most opportunity, which the audit makes clear.",
    },
    {
      question: "Can you work with our existing developers or CMS?",
      answer:
        "Yes. We provide prioritised, developer-ready tickets for your team, or implement directly on WordPress, Shopify, and most common stacks. You keep ownership of your site and accounts throughout.",
    },
    {
      question: "How do you measure SEO success?",
      answer:
        "Against outcomes that matter to your business — qualified organic sessions, keyword coverage, and conversions — not just a handful of trophy keywords. Every number is traceable in Search Console or GA4.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Sub-services (12)
 * ------------------------------------------------------------------ */
export const seoServices: SeoService[] = [
  {
    slug: "technical-seo-audit",
    keyword: "technical SEO audit",
    serviceType: "Technical SEO Audit",
    eyebrow: "SEO · Technical",
    metaTitle: "Technical SEO Audit Services | [BRAND]",
    metaDescription:
      "A technical SEO audit that finds what stops Google indexing and ranking your pages — crawlability, speed, structure — with a prioritised fix list. Book yours.",
    h1: "Technical SEO audit that finds what is really holding your site back",
    intro: [
      "If Google cannot crawl, render, and understand your pages, no amount of content or links will save your rankings. A technical SEO audit maps exactly where your site leaks crawl budget, breaks rendering, or confuses search engines — then hands you a fix list ranked by impact.",
      "We audit the things that quietly cost you traffic: index bloat, slow templates, broken canonicals, orphaned pages, and JavaScript that hides your content from crawlers. You get findings a developer can act on, not a 200-page PDF nobody reads.",
    ],
    whyHeading: "Why teams choose our technical SEO audit",
    whyChoose: [
      {
        title: "Prioritised, not exhaustive",
        desc: "Every issue is scored by traffic impact and effort, so you fix the five things that move rankings before the fifty that do not.",
      },
      {
        title: "Developer-ready output",
        desc: "Findings come as clear tickets with the affected URLs, the expected result, and how to verify the fix — ready to drop into your backlog.",
      },
      {
        title: "We check what tools miss",
        desc: "Automated crawlers flag symptoms. We manually verify rendering, log-file crawl patterns, and index coverage to find the actual cause.",
      },
    ],
    includedHeading: "What is included in a technical SEO audit",
    included: [
      {
        title: "Crawl & index coverage",
        desc: "Full crawl plus Search Console index analysis to find pages that are blocked, duplicated, or wrongly excluded from Google.",
      },
      {
        title: "Site architecture & internal links",
        desc: "We map how link equity and crawl depth flow through your site and surface orphaned or buried priority pages.",
      },
      {
        title: "Core Web Vitals & speed",
        desc: "Field and lab data on LCP, CLS, and INP, with the specific templates and assets dragging performance down.",
      },
      {
        title: "Rendering & JavaScript SEO",
        desc: "We confirm what Googlebot actually sees on JS-heavy pages and flag content that never makes it into the index.",
      },
      {
        title: "Canonicalisation & duplicates",
        desc: "Canonical, pagination, and parameter handling reviewed so you stop competing against your own URLs.",
      },
      {
        title: "Structured data & indexation rules",
        desc: "Schema, robots directives, sitemaps, and hreflang checked for errors that suppress rich results or block indexing.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Crawl & data pull",
        desc: "We crawl the site and pull Search Console, analytics, and where available server logs to see how Google treats you.",
      },
      {
        step: "02",
        title: "Diagnosis",
        desc: "We separate cause from symptom and confirm findings manually so you are not chasing false positives.",
      },
      {
        step: "03",
        title: "Prioritised report",
        desc: "You get a ranked fix list with impact, effort, and owner — plus a walkthrough call.",
      },
      {
        step: "04",
        title: "Fix or hand-off",
        desc: "We implement the fixes, or brief your developers and verify each one once it ships.",
      },
    ],
    pricingNote:
      "A one-off technical SEO audit is a fixed-scope project; ongoing implementation is quoted after we see the site.",
    faqHeading: "Technical SEO audit FAQs",
    faqs: [
      {
        question: "How long does a technical SEO audit take?",
        answer:
          "Most audits take one to two weeks depending on site size and access to Search Console and server logs. Large ecommerce sites with hundreds of thousands of URLs take longer because crawl and log analysis is more involved.",
      },
      {
        question: "What is the difference between a technical and a full SEO audit?",
        answer:
          "A technical SEO audit focuses on crawlability, indexing, speed, and site structure. A full SEO audit adds content, keyword, and off-site analysis. Many sites start technical because it removes the blockers that limit everything else.",
      },
      {
        question: "Will the audit tell my developers exactly what to change?",
        answer:
          "Yes. Each finding names the affected URLs, the recommended change, the expected outcome, and how to confirm it worked, so your developers can act without guessing.",
      },
      {
        question: "Do you need access to our website to run the audit?",
        answer:
          "We need read access to Google Search Console and analytics, and ideally server log files. We do not need to change anything on your site to complete the audit itself.",
      },
      {
        question: "How often should we run a technical SEO audit?",
        answer:
          "A full technical audit once or twice a year is typical, with lighter monitoring in between. Replatforming, migrations, or big traffic drops are triggers to audit sooner.",
      },
    ],
    related: ["seo-audit", "on-page-seo", "ecommerce-seo"],
  },
  {
    slug: "seo-audit",
    keyword: "SEO audit services",
    serviceType: "SEO Audit",
    eyebrow: "SEO · Audit",
    metaTitle: "SEO Audit Services — Full Site Review | [BRAND]",
    metaDescription:
      "SEO audit services that review technical health, content, and backlinks, then deliver a prioritised roadmap you can act on with confidence.",
    h1: "SEO audit services that turn confusion into a clear roadmap",
    intro: [
      "When traffic stalls, the hardest part is knowing where to look. Our SEO audit services review your whole search presence — technical health, content, keywords, and backlinks — and tell you plainly what is helping, what is hurting, and what to do next.",
      "This is not an automated score out of 100. It is a human read of your site against your competitors and your goals, delivered as a prioritised roadmap with the reasoning behind each recommendation so your team can act with confidence.",
    ],
    whyHeading: "Why our SEO audit services are different",
    whyChoose: [
      {
        title: "Whole-picture, not a checklist",
        desc: "Technical, content, and off-site issues rarely live in isolation. We connect them into one story about why your rankings look the way they do.",
      },
      {
        title: "Tied to your competitors",
        desc: "We benchmark you against the sites actually winning your keywords, so recommendations reflect what it takes to compete in your market.",
      },
      {
        title: "A roadmap, not a to-do dump",
        desc: "You leave with a sequenced 90-day plan, not a list of 300 issues with no order of operations.",
      },
    ],
    includedHeading: "What our SEO audit covers",
    included: [
      {
        title: "Technical health check",
        desc: "Crawlability, indexing, speed, and structure reviewed to confirm search engines can access your best pages.",
      },
      {
        title: "Content & on-page review",
        desc: "We assess whether your pages match search intent, cover topics fully, and avoid cannibalising each other.",
      },
      {
        title: "Keyword & opportunity gap",
        desc: "Where you rank, where you should, and the keywords your competitors own that you have not targeted yet.",
      },
      {
        title: "Backlink & authority profile",
        desc: "A review of your link profile for quality, relevance, and any toxic patterns that could be holding you back.",
      },
      {
        title: "Analytics & tracking check",
        desc: "We confirm your GA4 and Search Console setup actually measures what matters, so decisions rest on clean data.",
      },
      {
        title: "Prioritised 90-day roadmap",
        desc: "Every finding sequenced by impact and effort into a plan your team can start on immediately.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Discovery",
        desc: "We align on your goals, target markets, and the keywords that actually drive revenue.",
      },
      {
        step: "02",
        title: "Deep analysis",
        desc: "Technical, content, keyword, and backlink review, benchmarked against your live competitors.",
      },
      {
        step: "03",
        title: "Roadmap & readout",
        desc: "A prioritised plan delivered in a working session, not a document you never open again.",
      },
      {
        step: "04",
        title: "Execution support",
        desc: "We implement the roadmap or support your team as they do, tracking results as we go.",
      },
    ],
    pricingNote:
      "Audits are fixed-scope by site size. Retainer implementation is quoted once the roadmap is agreed.",
    faqHeading: "SEO audit services FAQs",
    faqs: [
      {
        question: "What do SEO audit services include?",
        answer:
          "A comprehensive SEO audit reviews technical health, on-page content, keyword targeting, and your backlink profile, then delivers a prioritised roadmap. The goal is to explain why you rank where you do and exactly what to change first.",
      },
      {
        question: "How much do SEO audit services cost?",
        answer:
          "Cost depends mainly on site size and complexity. A small brochure site is a modest fixed project; a large ecommerce catalogue takes more analysis. We quote a fixed price up front so there are no surprises.",
      },
      {
        question: "Is an SEO audit worth it if I already have an agency?",
        answer:
          "Often, yes. An independent audit gives you a second opinion on whether current work is addressing root causes, and it gives you the vocabulary to hold any agency accountable to outcomes.",
      },
      {
        question: "Do you just run a tool and export the results?",
        answer:
          "No. Tools inform the audit, but a specialist interprets the data, verifies issues manually, and sequences the fixes. A raw tool export is not an audit.",
      },
      {
        question: "What happens after the audit?",
        answer:
          "You own the roadmap and can execute it yourself, hand it to your developers, or engage us to implement. There is no obligation to continue with us after the audit.",
      },
    ],
    related: ["technical-seo-audit", "on-page-seo", "keyword-research"],
  },
  {
    slug: "on-page-seo",
    keyword: "on-page SEO services",
    serviceType: "On-Page SEO",
    eyebrow: "SEO · On-page",
    metaTitle: "On-Page SEO Services That Rank & Convert | [BRAND]",
    metaDescription:
      "On-page SEO services that align your pages with search intent — titles, structure, content, and internal links — so they rank and convert.",
    h1: "On-page SEO services that make every page earn its place",
    intro: [
      "A page ranks when it answers the query better than the alternatives and makes that obvious to both readers and search engines. Our on-page SEO services optimise the parts of your pages you control — titles, headings, content depth, structure, and internal links — so they match intent and convert the traffic they earn.",
      "We start from the searcher, not the keyword. What did they actually want when they typed that query, and does your page deliver it faster and more completely than page one currently does? Everything we change on the page ladders up to that answer.",
    ],
    whyHeading: "Why choose our on-page SEO services",
    whyChoose: [
      {
        title: "Intent first, keywords second",
        desc: "We map each page to the real job the searcher is trying to do, then structure the content to complete that job.",
      },
      {
        title: "Content that reads like a human wrote it",
        desc: "No keyword stuffing. We optimise for clarity and completeness, which is what modern search actually rewards.",
      },
      {
        title: "Conversion, not just ranking",
        desc: "Ranking is worthless if the page does not convert. We optimise structure and calls to action alongside the SEO.",
      },
    ],
    includedHeading: "What our on-page SEO services include",
    included: [
      {
        title: "Title tags & meta descriptions",
        desc: "Front-loaded, click-worthy titles and descriptions written to win the click, not just the ranking.",
      },
      {
        title: "Heading & content structure",
        desc: "Logical H1–H3 hierarchy and scannable structure that helps both readers and crawlers understand the page.",
      },
      {
        title: "Content depth & intent match",
        desc: "We identify gaps against top-ranking pages and expand your content to fully satisfy the query.",
      },
      {
        title: "Internal linking",
        desc: "Descriptive, varied internal links that pass authority to priority pages and guide users deeper.",
      },
      {
        title: "Schema & rich results",
        desc: "Relevant structured data to make your listings eligible for FAQ, breadcrumb, and other rich results.",
      },
      {
        title: "Image & media optimisation",
        desc: "Descriptive alt text, right-sized files, and captions that add context without slowing the page.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Page & intent audit",
        desc: "We review your priority pages against the intent behind their target queries.",
      },
      {
        step: "02",
        title: "Optimisation brief",
        desc: "A clear brief per page: what to change, why, and the expected result.",
      },
      {
        step: "03",
        title: "Implementation",
        desc: "We make the changes or hand your team a ready-to-ship brief.",
      },
      {
        step: "04",
        title: "Measure & refine",
        desc: "We track ranking and engagement shifts and iterate on what the data shows.",
      },
    ],
    pricingNote:
      "Priced per set of pages or as part of a monthly retainer. We scope after seeing which pages matter most.",
    faqHeading: "On-page SEO services FAQs",
    faqs: [
      {
        question: "What is the difference between on-page and technical SEO?",
        answer:
          "On-page SEO covers the content and elements on a page — titles, headings, copy, internal links, and schema. Technical SEO covers site-wide infrastructure like crawling, indexing, and speed. Both matter, but they solve different problems.",
      },
      {
        question: "How many keywords should one page target?",
        answer:
          "One primary keyword and its close variants. Targeting several unrelated commercial keywords on a single page usually means it ranks well for none. We map one clear intent per page.",
      },
      {
        question: "Does on-page SEO still work in the age of AI search?",
        answer:
          "Yes. Clear structure, complete answers, and strong intent match are exactly what both traditional and AI-driven search surfaces reward. Well-optimised pages are more likely to be cited, not less.",
      },
      {
        question: "Will you rewrite our existing content?",
        answer:
          "Where it helps. Sometimes a page needs a full rewrite; often it needs targeted additions, better structure, and stronger internal links. We recommend the lightest change that achieves the result.",
      },
      {
        question: "How do you avoid keyword stuffing?",
        answer:
          "We write for the reader and use natural variation rather than repeating the exact keyword. If a sentence reads like it was written for a crawler, we rewrite it. Density is a by-product of good writing, not a target.",
      },
    ],
    related: ["off-page-seo", "keyword-research", "wordpress-seo"],
  },
  {
    slug: "off-page-seo",
    keyword: "off-page SEO services",
    serviceType: "Off-Page SEO",
    eyebrow: "SEO · Off-page",
    metaTitle: "Off-Page SEO Services & Authority Building | [BRAND]",
    metaDescription:
      "Off-page SEO services that build genuine authority — ethical link building, digital PR, and brand signals — so your pages earn the trust to rank. Learn more.",
    h1: "Off-page SEO services that build authority the safe way",
    intro: [
      "Google decides how much to trust your site partly by who vouches for it. Our off-page SEO services build that trust through earned links, digital PR, and consistent brand signals — the kind of authority that lifts rankings without risking a penalty.",
      "We do not buy links from networks or chase cheap directories. We earn mentions from relevant, credible sites because that is what actually moves rankings and survives every algorithm update. Slow and safe beats fast and fragile.",
    ],
    whyHeading: "Why our off-page SEO services work",
    whyChoose: [
      {
        title: "Relevance over volume",
        desc: "Ten links from sites in your niche beat a hundred from unrelated blogs. We prioritise topical and geographic relevance.",
      },
      {
        title: "Nothing that risks a penalty",
        desc: "No link networks, no spammy tactics. Everything we build would survive a manual review by Google.",
      },
      {
        title: "Real editorial placements",
        desc: "We earn links through content worth citing and outreach to real publications, not automated blasts.",
      },
    ],
    includedHeading: "What our off-page SEO services include",
    included: [
      {
        title: "Link opportunity analysis",
        desc: "We map your and your competitors' link profiles to find realistic, high-value opportunities.",
      },
      {
        title: "Digital PR & outreach",
        desc: "Newsworthy angles and manual outreach that earn mentions from relevant publications and blogs.",
      },
      {
        title: "Linkable asset creation",
        desc: "Data studies, guides, and tools other sites genuinely want to reference and link to.",
      },
      {
        title: "Brand & citation building",
        desc: "Consistent business listings and brand mentions that reinforce trust, especially for local search.",
      },
      {
        title: "Toxic link review",
        desc: "We identify and, where warranted, disavow harmful links that may be dragging your profile down.",
      },
      {
        title: "Authority reporting",
        desc: "Transparent reporting on every link earned, with the referring domain and its relevance to you.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Profile analysis",
        desc: "We benchmark your authority and gaps against the competitors outranking you.",
      },
      {
        step: "02",
        title: "Strategy & assets",
        desc: "We agree on angles and build the content worth linking to.",
      },
      {
        step: "03",
        title: "Outreach",
        desc: "Manual, personalised outreach to relevant sites and journalists.",
      },
      {
        step: "04",
        title: "Report & repeat",
        desc: "We report every placement and compound the results month over month.",
      },
    ],
    pricingNote:
      "Off-page work is usually a monthly retainer, scaled to how competitive your target keywords are.",
    faqHeading: "Off-page SEO services FAQs",
    faqs: [
      {
        question: "What is off-page SEO?",
        answer:
          "Off-page SEO is everything you do away from your own website to build authority and trust — primarily earning links and mentions from other credible sites, plus brand signals and citations. It complements on-page and technical work.",
      },
      {
        question: "Are the links you build safe?",
        answer:
          "Yes. We only pursue editorial, relevant links that would pass a manual review. We never use private blog networks, paid link schemes, or automated tactics that risk a Google penalty.",
      },
      {
        question: "How many links do I need to rank?",
        answer:
          "There is no fixed number. What matters is closing the relevance and authority gap against the specific pages you are trying to outrank. We set targets per keyword, not an arbitrary monthly quota.",
      },
      {
        question: "Can off-page SEO fix a site that is not ranking?",
        answer:
          "Not on its own. If technical or content issues are the bottleneck, links will not help until those are resolved. We check the foundations first and only invest in links when the site is ready to benefit.",
      },
      {
        question: "How do you report on link building?",
        answer:
          "You get every earned link with its referring domain, relevance, and authority, so you can verify the work rather than trust a summary number.",
      },
    ],
    related: ["link-building", "on-page-seo", "small-business-seo"],
  },
  {
    slug: "ecommerce-seo",
    keyword: "ecommerce SEO company",
    serviceType: "Ecommerce SEO",
    eyebrow: "SEO · Ecommerce",
    metaTitle: "Ecommerce SEO Company for Online Stores | [BRAND]",
    metaDescription:
      "An ecommerce SEO company that grows organic sales from category and product pages by fixing crawl, duplication, and intent issues at scale.",
    h1: "An ecommerce SEO company focused on revenue, not just traffic",
    intro: [
      "Online stores have SEO problems most sites never face: thousands of near-duplicate product URLs, faceted navigation spinning up infinite pages, and category pages that never quite match how people shop. As an ecommerce SEO company, we fix those problems at scale so your highest-intent pages rank and sell.",
      "We care about revenue per session, not vanity traffic. That means getting category and product pages indexed correctly, matching them to commercial intent, and making sure the technical foundation can handle a large, constantly changing catalogue.",
    ],
    whyHeading: "Why choose our ecommerce SEO company",
    whyChoose: [
      {
        title: "We understand catalogue scale",
        desc: "Faceted navigation, pagination, and parameter handling done right so you rank without generating index bloat.",
      },
      {
        title: "Category pages that convert",
        desc: "We treat category pages as the money pages they are, matching them to how customers actually search and buy.",
      },
      {
        title: "Platform-native execution",
        desc: "Whether you run Shopify, WooCommerce, or Magento, we work within your platform's real constraints.",
      },
    ],
    includedHeading: "What our ecommerce SEO includes",
    included: [
      {
        title: "Faceted navigation control",
        desc: "Rules for filters and parameters that let customers browse without flooding Google with thin, duplicate URLs.",
      },
      {
        title: "Category page optimisation",
        desc: "Intent-matched titles, copy, and internal links that turn category pages into ranking, converting assets.",
      },
      {
        title: "Product page templates",
        desc: "Scalable on-page and schema templates so every product benefits from best practice automatically.",
      },
      {
        title: "Duplicate & thin content fixes",
        desc: "Canonicalisation and content strategy for variant and near-identical product pages.",
      },
      {
        title: "Product & review schema",
        desc: "Structured data for price, availability, and genuine reviews to earn richer, more clickable listings.",
      },
      {
        title: "Crawl budget management",
        desc: "We steer crawlers toward pages that earn revenue and away from those that waste budget.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Store audit",
        desc: "A technical and commercial review of how your catalogue is crawled, indexed, and converting.",
      },
      {
        step: "02",
        title: "Priority mapping",
        desc: "We identify the categories and products with the most revenue upside.",
      },
      {
        step: "03",
        title: "Implementation",
        desc: "Templates, technical fixes, and content shipped across the catalogue.",
      },
      {
        step: "04",
        title: "Scale & monitor",
        desc: "We track revenue per page and expand what works to the rest of the store.",
      },
    ],
    pricingNote:
      "Ecommerce SEO is quoted by catalogue size and platform. We scope after the store audit.",
    faqHeading: "Ecommerce SEO FAQs",
    faqs: [
      {
        question: "What does an ecommerce SEO company do differently?",
        answer:
          "It handles problems unique to online stores: large catalogues, faceted navigation, duplicate variant pages, and category-page intent. General SEO advice often breaks at ecommerce scale, so the technical approach has to be built for it.",
      },
      {
        question: "Should I optimise category or product pages first?",
        answer:
          "Usually category pages, because they target higher-volume commercial keywords and funnel visitors to products. We confirm with your data, since some stores earn more from long-tail product queries.",
      },
      {
        question: "How do you handle out-of-stock and discontinued products?",
        answer:
          "It depends on whether the product will return and whether the URL has value. We set rules for keeping, redirecting, or retiring URLs so you preserve rankings and avoid dead ends.",
      },
      {
        question: "Do you work with Shopify and WooCommerce?",
        answer:
          "Yes. We work across major platforms and tailor the technical approach to each. We also offer dedicated Shopify SEO and WordPress SEO services for platform-specific work.",
      },
      {
        question: "Can you add product review schema?",
        answer:
          "Yes, but only for genuine, verifiable reviews. We never fabricate ratings, because fake review schema leads to manual penalties from Google.",
      },
    ],
    related: ["shopify-seo", "technical-seo-audit", "on-page-seo"],
  },
  {
    slug: "keyword-research",
    keyword: "keyword research services",
    serviceType: "Keyword Research",
    eyebrow: "SEO · Research",
    metaTitle: "Keyword Research Services That Map Intent | [BRAND]",
    metaDescription:
      "Keyword research services that find the terms your customers actually search and the intent behind them — mapped to pages and prioritised by opportunity.",
    h1: "Keyword research services that map demand to real pages",
    intro: [
      "Good SEO starts with knowing what your customers type and why. Our keyword research services go past search volume to uncover the intent behind each query, then map every keyword to a single page so you never compete against yourself or chase terms that will not convert.",
      "The output is not a spreadsheet of 5,000 keywords nobody will use. It is a prioritised map: which keyword each page should own, the intent it must satisfy, and the order to build them in for the fastest realistic wins.",
    ],
    whyHeading: "Why our keyword research services help",
    whyChoose: [
      {
        title: "Intent, not just volume",
        desc: "We classify every keyword by what the searcher wants, so you target terms that actually lead to enquiries and sales.",
      },
      {
        title: "One keyword, one page",
        desc: "We map keywords to avoid cannibalisation — the single biggest silent killer of agency and service-site rankings.",
      },
      {
        title: "Prioritised for quick wins",
        desc: "We sequence keywords by difficulty and opportunity so early effort compounds instead of stalling.",
      },
    ],
    includedHeading: "What our keyword research includes",
    included: [
      {
        title: "Seed & competitor discovery",
        desc: "We expand from your services and mine competitor rankings to find the full demand landscape.",
      },
      {
        title: "Intent classification",
        desc: "Every keyword tagged informational, commercial, or transactional so pages match the searcher's stage.",
      },
      {
        title: "Difficulty & opportunity scoring",
        desc: "Realistic difficulty assessments so you invest where you can actually win.",
      },
      {
        title: "Keyword-to-URL mapping",
        desc: "A clear map of which page owns which keyword, preventing overlap and cannibalisation.",
      },
      {
        title: "Content gap analysis",
        desc: "The topics competitors rank for that you have not covered yet, prioritised by value.",
      },
      {
        title: "Prioritised roadmap",
        desc: "A build order that balances quick wins with the bigger, more competitive targets.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Business & audience input",
        desc: "We learn your services, margins, and ideal customers so research reflects real value.",
      },
      {
        step: "02",
        title: "Research & classification",
        desc: "We build the keyword universe and tag intent and difficulty.",
      },
      {
        step: "03",
        title: "Mapping",
        desc: "We assign one keyword per URL and flag pages to create, merge, or retire.",
      },
      {
        step: "04",
        title: "Roadmap delivery",
        desc: "A prioritised plan your team or ours can execute immediately.",
      },
    ],
    pricingNote:
      "Keyword research is a fixed-scope project sized to your market, and often the first step in a retainer.",
    faqHeading: "Keyword research services FAQs",
    faqs: [
      {
        question: "Why is keyword research important for SEO?",
        answer:
          "It tells you what your customers search, how strong the intent is, and how hard each term is to rank for. Without it, you risk building pages nobody searches for or targeting terms that never convert.",
      },
      {
        question: "What is keyword cannibalisation?",
        answer:
          "It is when two or more of your pages target the same keyword, so Google cannot tell which to rank and both underperform. Mapping one keyword to one URL prevents it, which is why our research always includes URL mapping.",
      },
      {
        question: "How many keywords should I target?",
        answer:
          "As many as you can genuinely serve with a distinct, high-quality page — no more. Quality of intent match beats quantity. We prioritise the keywords with the best balance of value and winnability.",
      },
      {
        question: "Do you research keywords for informational content too?",
        answer:
          "Yes. Informational keywords build topical authority and capture searchers earlier in their journey. We map them to blog and guide content that links through to your commercial pages.",
      },
      {
        question: "Will the research work for both India and US audiences?",
        answer:
          "Yes. We research each market separately where intent, phrasing, or competition differs, so India and US pages target the terms that actually convert in each region.",
      },
    ],
    related: ["on-page-seo", "seo-audit", "off-page-seo"],
  },
  {
    slug: "link-building",
    keyword: "link building services",
    serviceType: "Link Building",
    eyebrow: "SEO · Links",
    metaTitle: "Link Building Services — Earned, Relevant Links | [BRAND]",
    metaDescription:
      "Link building services that earn relevant, editorial links through digital PR and outreach — authority that lifts rankings and survives algorithm updates.",
    h1: "Link building services that earn links worth having",
    intro: [
      "Links still decide a large part of who ranks, but only the right links help. Our link building services earn relevant, editorial links through genuine outreach and content worth citing — never bought placements or link networks that put your site at risk.",
      "Every link we build is one you could show Google in a manual review without worry. That discipline is slower than spammy shortcuts, but it is the only approach that compounds instead of collapsing at the next update.",
    ],
    whyHeading: "Why our link building services are safe and effective",
    whyChoose: [
      {
        title: "Editorial links only",
        desc: "Real placements on relevant sites earned through outreach and content — never PBNs or paid schemes.",
      },
      {
        title: "Relevance drives everything",
        desc: "We prioritise topical and geographic fit because a relevant link outperforms a high-metric irrelevant one.",
      },
      {
        title: "Full transparency",
        desc: "You see every link, its source, and why it matters. No black-box link counts.",
      },
    ],
    includedHeading: "What our link building includes",
    included: [
      {
        title: "Prospecting & vetting",
        desc: "We find and manually vet relevant sites worth earning a link from, filtering out low-quality targets.",
      },
      {
        title: "Digital PR",
        desc: "Newsworthy angles pitched to journalists and editors for high-authority, editorial coverage.",
      },
      {
        title: "Guest content",
        desc: "Genuinely useful articles placed on relevant industry sites, written to their standards.",
      },
      {
        title: "Linkable assets",
        desc: "Original data, tools, and guides that attract links naturally over time.",
      },
      {
        title: "Anchor text strategy",
        desc: "Varied, natural anchor text that avoids the over-optimisation patterns that trigger penalties.",
      },
      {
        title: "Link monitoring",
        desc: "We track live links and flag any that are lost or turned toxic.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Gap analysis",
        desc: "We map where your authority falls short of the pages you want to outrank.",
      },
      {
        step: "02",
        title: "Angle & asset creation",
        desc: "We develop the stories and content that earn genuine links.",
      },
      {
        step: "03",
        title: "Outreach",
        desc: "Personalised, manual outreach to relevant, credible sites.",
      },
      {
        step: "04",
        title: "Reporting",
        desc: "Every placement reported with source and relevance, month over month.",
      },
    ],
    pricingNote:
      "Link building is a monthly retainer scaled to keyword competitiveness and target volume.",
    faqHeading: "Link building services FAQs",
    faqs: [
      {
        question: "What are link building services?",
        answer:
          "They are the work of earning links from other websites to yours, which signals authority to search engines. Ethical services do this through outreach, digital PR, and content worth citing — not by buying links.",
      },
      {
        question: "Are paid links against Google's guidelines?",
        answer:
          "Links that pass ranking credit in exchange for payment violate Google's guidelines and can trigger penalties. We only earn editorial links, so your profile stays safe under manual review.",
      },
      {
        question: "How long until link building affects rankings?",
        answer:
          "Usually a few weeks to a few months after links are earned and indexed. Competitive keywords take longer. Link building compounds, so consistent monthly effort outperforms one-off bursts.",
      },
      {
        question: "What makes a good backlink?",
        answer:
          "Relevance to your topic, genuine editorial placement, real audience and traffic, and natural anchor text. A relevant link from a modest site often beats a high-metric link from an unrelated one.",
      },
      {
        question: "Do you offer link building on its own?",
        answer:
          "We can, but we check your technical and content foundations first. Links amplify a healthy site; they will not rescue one with unresolved crawl or content problems.",
      },
    ],
    related: ["off-page-seo", "keyword-research", "white-label-seo"],
  },
  {
    slug: "white-label-seo",
    keyword: "white label SEO services",
    serviceType: "White Label SEO",
    eyebrow: "SEO · For agencies",
    metaTitle: "White Label SEO Services for Agencies | [BRAND]",
    metaDescription:
      "White label SEO services that let agencies deliver expert SEO under their own brand — audits, on-page, content, and links, with reporting you can rebrand.",
    h1: "White label SEO services that deliver under your brand",
    intro: [
      "You have the client relationships; you may not have an in-house SEO team. Our white label SEO services let your agency offer expert search work under your own brand — from audits and on-page optimisation to content and link building — with deliverables and reporting you can hand straight to your clients.",
      "We stay invisible. You keep the relationship, the margin, and the credit; we provide the specialist execution, delivered on time and to a standard you can put your name on.",
    ],
    whyHeading: "Why agencies choose our white label SEO services",
    whyChoose: [
      {
        title: "Truly invisible delivery",
        desc: "Rebrandable reports and deliverables, and we never contact your clients directly unless you ask us to.",
      },
      {
        title: "Predictable, scalable capacity",
        desc: "Add senior SEO capacity without hiring, so you can take on more clients with confidence.",
      },
      {
        title: "Standards you can sign off",
        desc: "The same methodology and quality bar we hold on our own retainers, delivered under your logo.",
      },
    ],
    includedHeading: "What our white label SEO includes",
    included: [
      {
        title: "White label audits",
        desc: "Technical and full SEO audits delivered in your branding, ready to present to clients.",
      },
      {
        title: "On-page & content",
        desc: "Optimisation and content production your team can pass through as their own.",
      },
      {
        title: "Link building",
        desc: "Ethical, editorial link building reported in a format you can rebrand.",
      },
      {
        title: "Rebrandable reporting",
        desc: "Monthly reports in your template and colours, tied to Search Console and GA4.",
      },
      {
        title: "Strategy support",
        desc: "Optional access to a strategist for pitches and client calls, under NDA.",
      },
      {
        title: "Dedicated point of contact",
        desc: "One account contact who understands your processes and client expectations.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Onboarding",
        desc: "We set up your branding, templates, and communication preferences.",
      },
      {
        step: "02",
        title: "Scoping",
        desc: "Per-client scoping so deliverables fit your commercial arrangements.",
      },
      {
        step: "03",
        title: "Delivery",
        desc: "Work delivered on schedule in your branding, ready to forward.",
      },
      {
        step: "04",
        title: "Reporting & review",
        desc: "Rebranded reporting plus regular reviews to keep quality high.",
      },
    ],
    pricingNote:
      "White label work is priced wholesale per service or as a monthly partner retainer.",
    faqHeading: "White label SEO services FAQs",
    faqs: [
      {
        question: "What are white label SEO services?",
        answer:
          "They let one agency deliver SEO produced by another under its own brand. Your clients see your logo on every deliverable; we provide the execution behind the scenes and never break that anonymity.",
      },
      {
        question: "Will you contact our clients?",
        answer:
          "Only if you want us to join calls under your brand. By default we work entirely through you and never reach out to your clients directly.",
      },
      {
        question: "Can we rebrand the reports?",
        answer:
          "Yes. Reports come in your template, colours, and logo, tied to the client's own Search Console and GA4 so the data is verifiable.",
      },
      {
        question: "How quickly can you scale up?",
        answer:
          "We onboard new partner clients in days, not weeks, so you can respond to new business without the delay and risk of hiring.",
      },
      {
        question: "Is there a minimum commitment?",
        answer:
          "We keep terms flexible for partners. One-off white label audits are available, and ongoing services run as a rolling monthly retainer.",
      },
    ],
    related: ["seo-audit", "link-building", "on-page-seo"],
  },
  {
    slug: "shopify-seo",
    keyword: "Shopify SEO services",
    serviceType: "Shopify SEO",
    eyebrow: "SEO · Shopify",
    metaTitle: "Shopify SEO Services for Growing Stores | [BRAND]",
    metaDescription:
      "Shopify SEO services that work within Shopify's real constraints — URL structure, collections, and app bloat — to grow your organic sales.",
    h1: "Shopify SEO services built around how Shopify actually works",
    intro: [
      "Shopify is fast to launch but has quirks that quietly cap organic growth: a rigid URL structure, duplicate collection paths, and apps that bloat your theme. Our Shopify SEO services work within those real constraints to grow the organic sales your store is leaving on the table.",
      "We know where Shopify stores lose rankings — from forced /collections/ and /products/ paths to thin tag pages and slow third-party apps — and we fix them without breaking your theme or checkout.",
    ],
    whyHeading: "Why choose our Shopify SEO services",
    whyChoose: [
      {
        title: "Platform-specific know-how",
        desc: "We work with Shopify's URL and template rules instead of fighting them, so fixes stick and stay stable.",
      },
      {
        title: "Speed without breaking the theme",
        desc: "We tackle app bloat and Liquid performance carefully, so pages get faster and checkout stays intact.",
      },
      {
        title: "Collection pages that rank",
        desc: "We turn collection pages into strong commercial landing pages, the biggest Shopify SEO opportunity.",
      },
    ],
    includedHeading: "What our Shopify SEO includes",
    included: [
      {
        title: "Shopify technical audit",
        desc: "URL structure, duplicate collection paths, canonicals, and indexation reviewed for Shopify-specific issues.",
      },
      {
        title: "Collection page optimisation",
        desc: "Intent-matched titles, content, and internal links that make collections rank and convert.",
      },
      {
        title: "Product page templates",
        desc: "Scalable on-page and schema improvements applied across your catalogue.",
      },
      {
        title: "App & speed cleanup",
        desc: "We remove or defer scripts from unused apps to improve Core Web Vitals.",
      },
      {
        title: "Duplicate content fixes",
        desc: "Handling for tag pages, variants, and the default duplicate product URLs Shopify creates.",
      },
      {
        title: "Structured data",
        desc: "Product, breadcrumb, and genuine review schema for richer search listings.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Store audit",
        desc: "A Shopify-specific technical and commercial review of your store.",
      },
      {
        step: "02",
        title: "Opportunity mapping",
        desc: "We prioritise the collections and products with the most upside.",
      },
      {
        step: "03",
        title: "Implementation",
        desc: "Fixes and templates rolled out safely within your theme.",
      },
      {
        step: "04",
        title: "Grow & monitor",
        desc: "We track organic revenue and expand what works.",
      },
    ],
    pricingNote:
      "Shopify SEO is quoted by store size and app complexity, after the store audit.",
    faqHeading: "Shopify SEO services FAQs",
    faqs: [
      {
        question: "Is Shopify good for SEO?",
        answer:
          "Shopify handles the basics well and is fast to launch, but its rigid URL structure, duplicate collection paths, and app-driven bloat need active management. With the right work, Shopify stores rank very competitively.",
      },
      {
        question: "Can I change Shopify's URL structure?",
        answer:
          "Shopify forces prefixes like /collections/ and /products/, which you cannot fully remove. We work within that, using canonicals, internal linking, and collection strategy to rank despite the constraint.",
      },
      {
        question: "Do Shopify apps hurt SEO?",
        answer:
          "They can. Many apps inject scripts that slow every page, harming Core Web Vitals. We audit your apps and remove or defer what is not earning its place.",
      },
      {
        question: "How do you handle duplicate product URLs on Shopify?",
        answer:
          "Shopify can create duplicate product URLs through collection paths. We set canonicals and internal linking so Google consolidates ranking signals on the correct URL.",
      },
      {
        question: "Do you also cover general ecommerce SEO?",
        answer:
          "Yes. Our ecommerce SEO service covers catalogue-scale strategy across platforms, while this Shopify service focuses on Shopify's specific technical behaviour.",
      },
    ],
    related: ["ecommerce-seo", "technical-seo-audit", "wordpress-seo"],
  },
  {
    slug: "wordpress-seo",
    keyword: "WordPress SEO services",
    serviceType: "WordPress SEO",
    eyebrow: "SEO · WordPress",
    metaTitle: "WordPress SEO Services & Optimisation | [BRAND]",
    metaDescription:
      "WordPress SEO services that fix plugin bloat, page speed, and structure — so your WordPress site ranks and loads fast. Get a WordPress SEO audit today.",
    h1: "WordPress SEO services that make your site fast and findable",
    intro: [
      "WordPress powers a huge share of the web, which means its SEO problems are well known: plugin bloat, heavy themes, and default settings that leave rankings on the table. Our WordPress SEO services fix those issues so your site loads fast, gets indexed cleanly, and ranks for the terms that matter.",
      "We are comfortable in the engine room — themes, plugins, hosting, and configuration — as well as the content. That means we can improve speed and structure at the source rather than masking problems with yet another plugin.",
    ],
    whyHeading: "Why choose our WordPress SEO services",
    whyChoose: [
      {
        title: "Fewer plugins, better performance",
        desc: "We reduce plugin bloat and configure the essentials properly instead of stacking overlapping tools.",
      },
      {
        title: "Speed at the source",
        desc: "Theme, hosting, and caching improvements that fix Core Web Vitals rather than paper over them.",
      },
      {
        title: "Clean, sensible configuration",
        desc: "We set up your SEO plugin, sitemaps, and structure correctly so the basics stop leaking rankings.",
      },
    ],
    includedHeading: "What our WordPress SEO includes",
    included: [
      {
        title: "WordPress technical audit",
        desc: "A review of theme, plugins, hosting, and configuration for the issues holding WordPress sites back.",
      },
      {
        title: "Speed & Core Web Vitals",
        desc: "Caching, image, and script optimisation to hit LCP, CLS, and INP targets.",
      },
      {
        title: "Plugin rationalisation",
        desc: "We remove redundant plugins and configure the essential ones correctly.",
      },
      {
        title: "On-page optimisation",
        desc: "Titles, structure, and internal linking set up across posts and pages.",
      },
      {
        title: "Schema & sitemaps",
        desc: "Structured data and clean XML sitemaps configured for reliable indexing.",
      },
      {
        title: "Content structure",
        desc: "Category and tag architecture that builds topical authority instead of thin archive pages.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Site audit",
        desc: "A WordPress-specific review of performance, plugins, and configuration.",
      },
      {
        step: "02",
        title: "Fix plan",
        desc: "A prioritised plan covering speed, structure, and on-page work.",
      },
      {
        step: "03",
        title: "Implementation",
        desc: "We apply fixes safely, with backups and staging where needed.",
      },
      {
        step: "04",
        title: "Monitor & improve",
        desc: "Ongoing monitoring of rankings, speed, and indexing.",
      },
    ],
    pricingNote:
      "WordPress SEO is scoped after the audit and can run as a project or retainer.",
    faqHeading: "WordPress SEO services FAQs",
    faqs: [
      {
        question: "Is WordPress good for SEO?",
        answer:
          "Yes, WordPress is very SEO-friendly when configured well. Its flexibility is also its risk: too many plugins and a heavy theme can slow the site and create technical issues. Proper setup and maintenance keep it fast and rankable.",
      },
      {
        question: "Which SEO plugin should I use?",
        answer:
          "The popular options all work; what matters is configuring one correctly and not running several overlapping plugins. We set up and tune your chosen plugin rather than pushing a specific brand.",
      },
      {
        question: "Will you slow my site down with more plugins?",
        answer:
          "No — the opposite. We usually reduce plugin count and fix performance at the theme and hosting level, so your site gets lighter and faster, not heavier.",
      },
      {
        question: "Can you improve Core Web Vitals on WordPress?",
        answer:
          "Yes. We address the common WordPress causes of poor vitals — unoptimised images, render-blocking scripts, bloated themes, and weak caching — to move LCP, CLS, and INP into the green.",
      },
      {
        question: "Do you work with WooCommerce stores?",
        answer:
          "Yes. WooCommerce sites benefit from both our WordPress SEO and ecommerce SEO approaches, since they combine WordPress technical needs with catalogue-scale challenges.",
      },
    ],
    related: ["on-page-seo", "technical-seo-audit", "small-business-seo"],
  },
  {
    slug: "small-business-seo",
    keyword: "SEO for small business",
    serviceType: "Small Business SEO",
    eyebrow: "SEO · Small business",
    metaTitle: "SEO for Small Business That Fits Your Budget | [BRAND]",
    metaDescription:
      "SEO for small business that focuses on the handful of keywords that bring real customers — practical, affordable, and genuinely measurable.",
    h1: "SEO for small business, focused on customers not vanity metrics",
    intro: [
      "Small businesses do not need enterprise SEO or a 200-keyword strategy. SEO for small business works best when it concentrates on the handful of searches that actually bring paying customers — usually local and high-intent — and does those exceptionally well.",
      "We keep it practical and affordable. No jargon, no bloated retainers, and no chasing traffic that never converts. Just the technical basics done right, the pages your customers search for, and reporting that shows real enquiries.",
    ],
    whyHeading: "Why our SEO for small business works",
    whyChoose: [
      {
        title: "Focused on high-intent terms",
        desc: "We target the searches most likely to become customers, not the biggest numbers on a chart.",
      },
      {
        title: "Local search done properly",
        desc: "Google Business Profile, local citations, and location pages that win nearby, ready-to-buy searchers.",
      },
      {
        title: "Budget-honest",
        desc: "We recommend what will actually move the needle for your size, and say when spending more will not.",
      },
    ],
    includedHeading: "What our small business SEO includes",
    included: [
      {
        title: "Foundations audit",
        desc: "A focused check of the technical and on-page basics that most affect small sites.",
      },
      {
        title: "Local SEO setup",
        desc: "Google Business Profile optimisation and consistent local citations.",
      },
      {
        title: "Priority page optimisation",
        desc: "The few service and location pages that drive enquiries, optimised properly.",
      },
      {
        title: "Content that answers customers",
        desc: "Practical pages and posts built around the questions your customers actually ask.",
      },
      {
        title: "Reviews & reputation",
        desc: "Guidance on earning genuine reviews that build trust and support local rankings.",
      },
      {
        title: "Simple, clear reporting",
        desc: "Reporting focused on calls, enquiries, and visibility — not vanity metrics.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Quick audit",
        desc: "We find the few issues costing you the most visibility.",
      },
      {
        step: "02",
        title: "Focused plan",
        desc: "A short, affordable plan aimed at real enquiries.",
      },
      {
        step: "03",
        title: "Do the work",
        desc: "We fix the basics and optimise your priority pages.",
      },
      {
        step: "04",
        title: "Measure enquiries",
        desc: "We track calls and leads, and grow from there.",
      },
    ],
    pricingNote:
      "Small business plans are deliberately affordable and scoped to your goals and budget.",
    faqHeading: "SEO for small business FAQs",
    faqs: [
      {
        question: "Is SEO worth it for a small business?",
        answer:
          "Yes, when it focuses on high-intent local searches rather than broad vanity keywords. For most small businesses, ranking for a few terms that bring ready-to-buy customers delivers a strong return over time.",
      },
      {
        question: "How much does small business SEO cost?",
        answer:
          "Far less than enterprise SEO. Because the scope is focused, plans are affordable and scaled to your goals. We are transparent about what a given budget can realistically achieve.",
      },
      {
        question: "How long before I see results?",
        answer:
          "Local and low-competition terms can move within a couple of months; more competitive terms take longer. We prioritise quick wins first so you see momentum early.",
      },
      {
        question: "Do I need a blog for small business SEO?",
        answer:
          "Not always. A few strong service and location pages often matter more. We add content only where it answers real customer questions and supports your priority pages.",
      },
      {
        question: "Can you help with Google Business Profile?",
        answer:
          "Yes. For most small businesses, an optimised Google Business Profile and consistent local citations are among the highest-impact, lowest-cost things we can do.",
      },
    ],
    related: ["off-page-seo", "wordpress-seo", "healthcare-seo"],
  },
  {
    slug: "healthcare-seo",
    keyword: "SEO for healthcare websites",
    serviceType: "Healthcare SEO",
    eyebrow: "SEO · Healthcare",
    metaTitle: "SEO for Healthcare Websites & Clinics | [BRAND]",
    metaDescription:
      "SEO for healthcare websites that respects YMYL and E-E-A-T — accurate, trustworthy content that ranks for patients searching for the care you provide.",
    h1: "SEO for healthcare websites that patients and Google trust",
    intro: [
      "Health content is held to a higher bar. SEO for healthcare websites has to satisfy Google's your-money-or-your-life standards — demonstrable expertise, accuracy, and trust — because that is exactly what patients searching for care need too. Cut corners on trust and you will not rank, no matter how good the keywords.",
      "We build healthcare search visibility the right way: medically accurate content, clear authorship and credentials, and a technical foundation that keeps sensitive sites fast and secure. It is slower than generic SEO, but it is the only approach that works in this space.",
    ],
    whyHeading: "Why healthcare sites choose our SEO",
    whyChoose: [
      {
        title: "E-E-A-T taken seriously",
        desc: "Clear authorship, credentials, citations, and review processes that demonstrate real expertise and trust.",
      },
      {
        title: "Accuracy is non-negotiable",
        desc: "We work with your clinical input so content is correct as well as optimised — never one at the expense of the other.",
      },
      {
        title: "Security-aware",
        desc: "Healthcare sites are sensitive targets. Our team also handles security, so trust extends beyond the content.",
      },
    ],
    includedHeading: "What our healthcare SEO includes",
    included: [
      {
        title: "YMYL content strategy",
        desc: "Topic and content plans that meet the accuracy and trust bar health queries demand.",
      },
      {
        title: "Author & credential setup",
        desc: "Clear author bios, credentials, and review lines that signal genuine medical expertise.",
      },
      {
        title: "Condition & treatment pages",
        desc: "Accurate, patient-friendly pages that rank for the conditions and treatments you offer.",
      },
      {
        title: "Local & practice SEO",
        desc: "Location and practitioner pages plus Google Business Profile for patients searching nearby.",
      },
      {
        title: "Technical & speed",
        desc: "A fast, crawlable, secure foundation appropriate for sensitive healthcare sites.",
      },
      {
        title: "Compliance-aware structure",
        desc: "Content and data practices mindful of healthcare privacy expectations in your region.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Clinical & SEO discovery",
        desc: "We align with your clinical team on accuracy, scope, and priorities.",
      },
      {
        step: "02",
        title: "Trust & content plan",
        desc: "A strategy built around E-E-A-T, patient intent, and your services.",
      },
      {
        step: "03",
        title: "Build & review",
        desc: "Content produced and clinically reviewed before it goes live.",
      },
      {
        step: "04",
        title: "Measure & maintain",
        desc: "We track visibility and keep content accurate and current.",
      },
    ],
    pricingNote:
      "Healthcare SEO is scoped to your specialties and content needs, typically as a retainer.",
    faqHeading: "SEO for healthcare websites FAQs",
    faqs: [
      {
        question: "Why is healthcare SEO different from regular SEO?",
        answer:
          "Health topics are your-money-or-your-life content, so Google applies stricter expertise and trust standards. Ranking requires demonstrable accuracy, clear authorship, and credible sources — not just good keywords and links.",
      },
      {
        question: "What is E-E-A-T and why does it matter for healthcare?",
        answer:
          "E-E-A-T stands for experience, expertise, authoritativeness, and trustworthiness. For healthcare sites it is central, because Google wants patients to find accurate information from credible sources. We build these signals into every page.",
      },
      {
        question: "Who writes and reviews the medical content?",
        answer:
          "We produce SEO-optimised drafts and work with your clinical team, or qualified reviewers, to verify accuracy before publishing. We never publish medical claims without appropriate review.",
      },
      {
        question: "Can you help clinics rank locally?",
        answer:
          "Yes. Local SEO — optimised Google Business Profiles, location and practitioner pages, and consistent citations — is essential for clinics and practices serving a specific area.",
      },
      {
        question: "Is patient data safe with healthcare SEO work?",
        answer:
          "We work only with the access we need and are mindful of healthcare privacy expectations. Because our team also does security testing, we take data handling on sensitive sites seriously.",
      },
    ],
    related: ["small-business-seo", "technical-seo-audit", "on-page-seo"],
  },
];

/* ------------------------------------------------------------------ *
 * Long-form narrative per service (adds topical depth and meets the
 * commercial-page word-count floor with genuinely useful content, not filler).
 * ------------------------------------------------------------------ */
export type Narrative = { heading: string; body: string[] };

export const seoNarratives: Record<string, Narrative> = {
  "technical-seo-audit": {
    heading: "Signs your site needs a technical SEO audit",
    body: [
      "The clearest signal is a gap between the content you publish and the rankings you get. If you produce genuinely good pages that never break into the top of results, the problem is usually technical: Google is not crawling them, is indexing the wrong version, or is being slowed down enough that it never fully understands the page. A technical SEO audit isolates which of those is happening on your specific templates.",
      "Other triggers are more sudden. A traffic drop after a redesign or migration almost always traces back to changed URLs, lost redirects, or a stray noindex left in place. Rapid growth in the number of indexed pages, without a matching rise in traffic, points to index bloat from parameters or faceted navigation. And a Search Console report full of \"crawled — currently not indexed\" pages means Google is choosing not to keep your content. Each of these has a different fix, which is why guessing is expensive and a structured audit pays for itself.",
      "A good audit does not stop at listing problems. It quantifies them — how many pages, how much traffic, how much crawl budget — and sequences the fixes so your team spends effort where the return is largest. That prioritisation is the difference between a report that sits in a drive and one that moves rankings within a quarter.",
    ],
  },
  "seo-audit": {
    heading: "What a thorough SEO audit reveals",
    body: [
      "Most sites that plateau are not failing at one thing; they are losing small amounts of opportunity across many. A page targets a keyword nobody searches. Two pages compete for the same term. A strong page has no internal links pointing to it. The backlink profile is thin in exactly the topics that matter. Individually these are minor. Together they cap your ceiling, and only a whole-site audit shows how they connect.",
      "Our SEO audit reads your site the way a strategist would before taking it on: what is the site trying to rank for, is it structured to do that, and what are the competitors doing that you are not. We look at intent match on your key pages, the topics you have and have not covered, the health of your links, and whether your analytics can even tell you if things improve. The result is a narrative, not a scorecard — a clear explanation of why you rank where you do.",
      "From there you get a 90-day roadmap that puts the highest-impact, lowest-effort work first. You can hand it to your own team, give it to your developers, or ask us to deliver it. Either way you leave knowing exactly what to do next and why it matters.",
    ],
  },
  "on-page-seo": {
    heading: "How modern on-page SEO actually works",
    body: [
      "On-page SEO used to mean sprinkling a keyword into a few tags. That approach stopped working years ago. Today a page ranks when it demonstrably answers the query better than the current top results — more completely, more clearly, and in a structure both people and search engines can follow. Our work starts by studying what the pages already ranking include, where they fall short, and what a searcher still has to click away to find.",
      "We then shape your page to close that gap. That can mean restructuring headings so the page has a logical hierarchy, expanding thin sections that leave questions unanswered, adding the supporting subtopics that signal genuine depth, and tightening the introduction so the main answer appears early. We pair that with strong internal links from related pages, descriptive image alt text, and schema where it earns richer results. Every change is made for a reader first; the ranking follows.",
      "Crucially, we optimise for the action after the click. A page that ranks but does not convert is a cost, not an asset, so we make sure the structure, clarity, and calls to action turn the traffic you earn into enquiries and sales.",
    ],
  },
  "off-page-seo": {
    heading: "Building authority without cutting corners",
    body: [
      "Search engines treat links and mentions as votes of confidence, but they have become very good at telling genuine votes from manufactured ones. That is why the shortcuts — link networks, mass directory submissions, and paid placements dressed up as editorial — now carry real risk. They can produce a short-lived bump followed by a painful correction when the next update or manual review lands. Off-page SEO done properly is slower precisely because it is durable.",
      "Our approach earns authority the way it is meant to be earned: by giving relevant, credible sites a genuine reason to reference you. Sometimes that is original data or a useful tool; sometimes it is a timely comment a journalist needs; sometimes it is simply well-pitched, well-written content that fits a publication's audience. We prioritise relevance over raw metrics, because a link from a modest site in your field usually does more than a high-score link from an unrelated one.",
      "Because trust also comes from consistency, we tidy up your brand's citations and business listings so the signals reinforce rather than contradict each other. And we review your existing profile for the toxic patterns that quietly hold sites back, disavowing only where it is genuinely warranted.",
    ],
  },
  "ecommerce-seo": {
    heading: "Why ecommerce SEO is a different discipline",
    body: [
      "A brochure site has a few dozen pages; a store can have tens of thousands, most of them variations on a theme. That scale changes everything. Faceted navigation can spin up a near-infinite number of filtered URLs, each thin and nearly identical, burning the crawl budget that should go to pages that sell. Product variants create duplicate content. Category pages, which target the most valuable commercial keywords, are often left as bare product grids with no reason for Google to rank them.",
      "We treat those structural problems as the core of the work, not an afterthought. That means rules for which filtered pages should be indexed and which should not, canonical strategies that consolidate ranking signals onto the right product URL, and category pages rebuilt into genuine landing pages with intent-matched copy and internal links. We template these fixes so they apply across the whole catalogue automatically, then keep them stable as the catalogue changes.",
      "Throughout, the metric that matters is revenue per session, not raw traffic. Ranking a product page that never converts is not a win. We focus on the categories and products with real commercial upside and expand from there.",
    ],
  },
  "keyword-research": {
    heading: "From keyword list to content strategy",
    body: [
      "A list of keywords is not a strategy. The value is in what you do with it: understanding the intent behind each term, deciding which page should own it, and sequencing the work so early effort compounds. Research that stops at search volume leads teams to chase big, competitive head terms while ignoring the specific, lower-competition queries that actually convert. We classify every term by intent so you can see the difference clearly.",
      "The most important output is the map: one keyword to one URL. This single discipline prevents cannibalisation, where two of your own pages compete for a term and Google, unsure which to rank, demotes both. It also reveals gaps — the topics your competitors cover and you do not — and pages that should be merged or retired. The map becomes the blueprint for your whole content plan.",
      "We prioritise that plan by balancing opportunity and difficulty, so you can win a run of achievable terms early and build the authority needed to compete for the harder ones later. Where India and US intent differ, we research each market separately rather than assuming one keyword set serves both.",
    ],
  },
  "link-building": {
    heading: "What makes a link worth building",
    body: [
      "Not all links help, and some actively hurt. A link is valuable when it is editorial — placed because someone genuinely wanted to reference you — on a site that is relevant to your topic, has a real audience, and uses natural anchor text. A link is a liability when it is bought, irrelevant, hidden in a footer farm, or over-optimised with exact-match anchors. Search engines have spent a decade learning to tell these apart, so the tactics that produce the second kind are a poor investment.",
      "Our link building focuses entirely on the first kind. We start by finding where your authority falls short of the pages you want to outrank, then develop the angles and assets that earn genuine coverage: original research, practical tools, expert commentary, and content pitched to publications that actually serve your audience. Outreach is manual and personalised, not automated, because editors can spot a template instantly.",
      "You see every link we earn, its source, and why it matters, so the work is transparent and verifiable. Because links compound, we favour a steady, sustainable pace over one-off bursts — the profile that grows naturally is the one that keeps paying off.",
    ],
  },
  "white-label-seo": {
    heading: "How white label SEO fits your agency",
    body: [
      "Plenty of agencies win SEO work they are not set up to deliver at scale. Hiring a senior specialist is slow and expensive, and demand is rarely steady enough to justify it. White label SEO solves that by giving you on-demand, senior capacity that delivers under your brand — so you can say yes to the work, protect your margin, and keep the client relationship entirely yours.",
      "We designed our partner service to be genuinely invisible. Deliverables and reports arrive in your branding, tied to the client's own Search Console and GA4 so the data is verifiable. We never contact your clients unless you specifically want us on a call under your name. And the methodology is the same one we hold on our own retainers, so the quality is something you can put your logo on without a second thought.",
      "Practically, that means faster turnaround on pitches, the ability to take on larger or more technical clients than your in-house skills would normally allow, and a single point of contact who learns how your agency works. You stay the expert in the room; we handle the execution behind the curtain.",
    ],
  },
  "shopify-seo": {
    heading: "Working with Shopify, not against it",
    body: [
      "Shopify is a superb commerce platform, but it makes specific SEO decisions for you that you cannot fully override. URLs are locked into prefixes like /collections/ and /products/. The same product can be reached through multiple collection paths, creating duplicates. Tag pages generate thin archives. And the app ecosystem that makes Shopify so extensible also injects scripts that slow every page down. Effective Shopify SEO is largely about handling these known behaviours well.",
      "We do that by leaning on the tools Shopify does give you. Canonical tags and disciplined internal linking consolidate ranking signals onto the right product URLs. Collection pages — the highest-value pages on most stores — are rebuilt with intent-matched titles, supporting copy, and links so they can rank for commercial category terms. We audit your installed apps and remove or defer the scripts that are dragging down Core Web Vitals, carefully, so nothing in your theme or checkout breaks.",
      "The result is a store that ranks competitively despite the platform's constraints, without risky hacks that a future Shopify update could undo. Where your needs go beyond Shopify specifics, our broader ecommerce SEO service covers catalogue-scale strategy across platforms.",
    ],
  },
  "wordpress-seo": {
    heading: "Getting the most SEO from WordPress",
    body: [
      "WordPress is one of the most SEO-capable platforms available, which is exactly why so many WordPress sites underperform. The same flexibility that lets you add any feature also lets you stack a dozen overlapping plugins, run a bloated theme, and accept default settings that quietly leak rankings. Most WordPress SEO problems are self-inflicted and, happily, very fixable once you know where to look.",
      "We work at the source rather than masking issues with yet another plugin. That means auditing your theme and hosting for the real causes of slow load times, rationalising your plugin stack down to the essentials and configuring them properly, and setting up sitemaps, schema, and a sensible category structure so indexing is clean and topical authority actually builds. Where Core Web Vitals are failing, we address the specific WordPress culprits — unoptimised images, render-blocking scripts, weak caching — instead of chasing a score.",
      "Done well, this makes the site faster for users and easier for Google to crawl and understand, which lifts the whole domain rather than a single page. WooCommerce stores get the same treatment plus the catalogue-scale thinking our ecommerce SEO service brings.",
    ],
  },
  "small-business-seo": {
    heading: "SEO that fits a small business budget",
    body: [
      "Small businesses are often sold enterprise SEO they do not need — sprawling keyword lists, heavy content calendars, and retainers priced for companies ten times their size. The truth is that most small businesses win by doing a small number of things exceptionally well: getting the technical basics right, claiming and optimising their Google Business Profile, and owning the handful of local, high-intent searches that actually bring customers through the door.",
      "That focus is what makes small business SEO affordable and effective. Instead of chasing national head terms you will never rank for, we target the searches with clear buying intent in your area, build the few service and location pages that convert, and earn the genuine reviews that both customers and Google trust. We are honest about what a given budget can achieve, and we will tell you when spending more will not move the needle.",
      "Reporting stays refreshingly simple: calls, enquiries, and local visibility, not a dashboard of vanity metrics. You should always be able to see the line between the work we do and the customers it brings.",
    ],
  },
  "healthcare-seo": {
    heading: "Ranking healthcare content the right way",
    body: [
      "Health sits squarely in what Google calls your-money-or-your-life territory, where a wrong answer can genuinely harm someone. Google responds by holding this content to a much higher standard of expertise and trust, and by scrutinising who is behind it. That is why generic SEO tactics fall flat on healthcare sites: without visible credentials, accurate information, and credible sourcing, the pages simply will not earn the trust required to rank, however well optimised the keywords are.",
      "We build those trust signals in from the start. Content is planned around real patient intent and produced to be medically accurate, with clear authorship, credentials, and review lines that show genuine expertise. Condition and treatment pages are written to be both patient-friendly and correct, and we work with your clinical team so accuracy is never traded for optimisation. For clinics and practices, local SEO — optimised profiles, location and practitioner pages, consistent citations — connects you with patients searching nearby.",
      "Because healthcare sites are also sensitive targets, we handle them with appropriate care for privacy and security. The same team that grows your visibility can pressure-test the site protecting your patients' data, so trust extends beyond the words on the page.",
    ],
  },
};

/** Second narrative section — a distinct, useful angle per service. */
export const seoNarratives2: Record<string, Narrative> = {
  "technical-seo-audit": {
    heading: "What you can expect after the audit",
    body: [
      "The immediate deliverable is clarity: a ranked list of issues, each with the affected URLs, the expected impact, the effort to fix, and how to confirm it worked. We walk your team through it on a call so nothing is ambiguous, and we are happy to sit with your developers as they scope the tickets. You are never left holding a document you cannot action.",
      "Once the fixes ship, the effects tend to arrive in a predictable order. Crawl and indexing improvements show first, as Google rediscovers and re-includes pages. Speed gains follow in field data over a few weeks. Rankings then respond as the site becomes easier to crawl and understand. We re-check the key issues after implementation so you have proof the work landed, not just a promise that it did.",
    ],
  },
  "seo-audit": {
    heading: "Turning the roadmap into results",
    body: [
      "An audit only creates value when it is executed, so the roadmap is built to be executed. Work is grouped into clear phases, each with a defined outcome, so progress is visible from the first fortnight rather than months down the line. Quick, high-impact fixes come first to build momentum and free up budget for the bigger pieces.",
      "If you continue with us, we track every change against the metrics agreed at the start — qualified organic sessions, keyword coverage, and conversions — all traceable in your own Search Console and analytics. If you execute in-house, the same measurement framework lets you hold any team accountable to real outcomes. Either way, the audit becomes a plan you can trust, not a report that gathers dust.",
    ],
  },
  "on-page-seo": {
    heading: "How we measure on-page success",
    body: [
      "We judge on-page work by whether the page climbs for its target intent and, just as importantly, whether it converts the visitors it earns. That means watching rankings and impressions in Search Console alongside engagement and conversion signals in analytics. A page that gains impressions but no clicks usually needs a sharper title; one that gains clicks but no enquiries needs a stronger structure or call to action.",
      "Because on-page changes compound with the rest of your SEO, we sequence them to support your priority pages first and feed authority to them through internal links. Small, well-targeted improvements across a cluster of related pages often move the whole group, which is why we optimise with the site's structure in mind rather than treating each page in isolation.",
    ],
  },
  "off-page-seo": {
    heading: "Transparent reporting on authority",
    body: [
      "Off-page work attracts more hype and more dishonesty than any other part of SEO, so transparency is the antidote. Every link and mention we earn is reported with its source, the relevance to your topic, and why it matters, so you can judge quality for yourself rather than trusting a single headline number. Nothing is hidden behind a vague monthly total.",
      "We set expectations against your specific competition, not an arbitrary quota. The goal is to close the authority gap on the pages you are trying to outrank, at a pace that looks natural to search engines. Because this kind of authority is earned rather than bought, it holds up through algorithm updates instead of evaporating at the next one.",
    ],
  },
  "ecommerce-seo": {
    heading: "Protecting rankings as your store evolves",
    body: [
      "Stores are never static. Products come and go, categories are restructured, and promotions change the site week to week. Each of those changes can quietly break rankings if URLs shift without redirects or if discontinued products leave dead ends. Part of ecommerce SEO is putting rules and monitoring in place so growth does not cost you the visibility you have built.",
      "We define how out-of-stock, seasonal, and discontinued products are handled — kept, redirected, or retired — so URL value is preserved rather than lost. We keep an eye on index coverage as the catalogue changes, catching bloat before it spreads. The aim is a store that can grow and change confidently, knowing the SEO foundation will hold.",
    ],
  },
  "keyword-research": {
    heading: "Keeping the keyword map current",
    body: [
      "Search demand shifts, competitors publish, and new intent emerges, so a keyword map is a living document, not a one-off export. We build it to be maintained: as you add pages or services, new terms slot into the map against the right URLs, and gaps that open up are easy to spot and fill.",
      "This ongoing view is what stops cannibalisation from creeping back in over time. Before any new page is created, it is checked against the map so it targets a distinct intent rather than competing with something you already rank for. The result is a content plan that scales cleanly, with every page earning its own place instead of quietly undermining another.",
    ],
  },
  "link-building": {
    heading: "A sustainable, natural link velocity",
    body: [
      "The pattern of how you earn links matters as much as the links themselves. A sudden spike followed by silence looks unnatural; a steady, consistent flow of relevant links looks exactly like a growing, credible brand. We build at a pace that reflects the second pattern, because it is both safer and more effective over time.",
      "That consistency is why link building rewards patience. Each earned link adds a little authority, and the effect accumulates as the profile grows and matures. We report progress every month with full detail, and we adjust the angles and targets as we learn what earns coverage in your space, so the programme keeps improving rather than plateauing.",
    ],
  },
  "white-label-seo": {
    heading: "Onboarding, communication, and quality control",
    body: [
      "A white label partnership lives or dies on communication, so we make onboarding thorough and the ongoing relationship predictable. We set up your branding and templates, agree how and when we report, and assign a single point of contact who learns your processes and your clients' expectations. You always know what is happening without having to chase it.",
      "Quality is held to the same bar we apply to our own retainers, with internal review before anything reaches you. Because scaling capacity should reduce your risk, not add to it, we keep terms flexible — from one-off white label audits to a rolling monthly retainer — so you can match our involvement to your pipeline rather than committing ahead of the work.",
    ],
  },
  "shopify-seo": {
    heading: "Speed, apps, and conversion on Shopify",
    body: [
      "Shopify store owners feel page speed more acutely than most, because every installed app can add scripts that slow the whole site and every second of delay costs conversions. We audit your app stack, remove or defer what is not earning its place, and address the theme-level performance issues that hurt Core Web Vitals, all without disturbing your checkout or key functionality.",
      "Faster pages help rankings and revenue at the same time, which is why speed sits alongside content and structure in our Shopify work rather than being treated as a separate technical chore. As your store grows, we keep an eye on new apps and theme changes so performance does not quietly regress after launch.",
    ],
  },
  "wordpress-seo": {
    heading: "Maintenance that protects your rankings",
    body: [
      "WordPress sites drift over time. Plugins update, new ones get added, content accumulates, and performance slowly degrades if nobody is watching. Much of the value in WordPress SEO is ongoing: keeping the plugin stack lean, monitoring speed and Core Web Vitals, and making sure new content follows the structure that builds topical authority rather than creating thin, competing pages.",
      "We can maintain this for you or set your team up to manage it confidently, with clear guidelines for adding content and plugins safely. Either way, the goal is a site that stays fast, clean, and well-structured long after the initial work, so the rankings you gain are the rankings you keep.",
    ],
  },
  "small-business-seo": {
    heading: "Reviews, reputation, and local trust",
    body: [
      "For a local business, reputation is a ranking factor and a conversion factor at once. A steady flow of genuine reviews improves your visibility in local results and reassures the customers who find you. We help you build a simple, ethical process for earning reviews from happy customers — never fake ones — and for responding to them in a way that builds trust.",
      "Alongside reviews, consistency across your Google Business Profile and local citations tells search engines your business is real, established, and exactly where it says it is. These fundamentals are inexpensive and high-impact, which is why they sit at the heart of an affordable small-business SEO plan rather than being treated as an add-on.",
    ],
  },
  "healthcare-seo": {
    heading: "Privacy, compliance, and lasting patient trust",
    body: [
      "Healthcare websites carry responsibilities that most sites do not. Patients arrive at their most vulnerable, and the data they share can be sensitive, so trust has to be earned in how the site handles information as well as in what it says. We are mindful of the privacy expectations and regulations relevant to your region, and we work only with the access we genuinely need.",
      "That care extends to security. Because our team also performs penetration testing, we understand how sensitive sites are attacked and can help make sure the site protecting your patients' data is genuinely secure. Combined with accurate, well-credentialed content, this builds the kind of durable trust that both patients and search engines reward — the foundation healthcare SEO has to stand on.",
    ],
  },
};

export function getSeoService(slug: string): SeoService | undefined {
  return seoServices.find((s) => s.slug === slug);
}

export function seoServiceSlugs(): string[] {
  return seoServices.map((s) => s.slug);
}

/** Title lookup for internal-link anchors. */
export function seoServiceTitle(slug: string): string {
  const s = getSeoService(slug);
  return s ? s.keyword : slug;
}
