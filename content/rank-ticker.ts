/**
 * Data for the signature "live rank-movement ticker" under the hero.
 *
 * SAMPLE DATA — clearly labelled. These are illustrative keyword positions,
 * NOT verified client results. Replace with a real, connected dataset (e.g.
 * from a rank-tracking API export) before presenting as actual outcomes.
 * The UI labels this strip as "sample data" for honesty.
 */
export type RankRow = {
  keyword: string;
  position: number; // current position
  change: number; // positions gained (+) or lost (-) over the period
};

export const rankTickerLabel = "Sample rank movement · illustrative data";

export const rankTicker: RankRow[] = [
  { keyword: "seo services", position: 4, change: 11 },
  { keyword: "ecommerce seo company", position: 6, change: 9 },
  { keyword: "digital marketing agency", position: 3, change: 7 },
  { keyword: "web application penetration testing", position: 5, change: 14 },
  { keyword: "technical seo audit", position: 2, change: 6 },
  { keyword: "shopify seo services", position: 8, change: 12 },
  { keyword: "ppc management services", position: 7, change: 5 },
  { keyword: "vapt services", position: 4, change: 10 },
  { keyword: "link building services", position: 9, change: 8 },
  { keyword: "react development", position: 6, change: 4 },
  { keyword: "local seo services usa", position: 3, change: 13 },
  { keyword: "wordpress development", position: 5, change: 6 },
];
