import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { seoServiceSlugs } from "@/content/seo-services";

/**
 * Dynamic sitemap. Lists only routes that actually exist so we never point
 * crawlers at 404s. New clusters register their URLs here as they ship.
 * Split into sitemap-pages / sitemap-blog once the URL count exceeds ~200.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/seo-services/", priority: 0.9, freq: "weekly" },
    { path: "/seo-packages-pricing/", priority: 0.8, freq: "monthly" },
    { path: "/free-seo-audit/", priority: 0.7, freq: "monthly" },
    { path: "/contact/", priority: 0.6, freq: "yearly" },
  ];

  const seoSubServices = seoServiceSlugs().map((slug) => ({
    path: `/seo-services/${slug}/`,
    priority: 0.8,
    freq: "monthly" as const,
  }));

  return [...staticEntries, ...seoSubServices].map(({ path, priority, freq }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}
