import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Dynamic sitemap. Phase 1 covers the routes that exist so far; each new
 * cluster registers its URLs here as pages are built. Split into
 * sitemap-pages / sitemap-blog once the URL count exceeds ~200.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
  ];

  return staticPaths.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));
}
