import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Metadata factory. All routes build their `<head>` metadata through here so
 * titles, canonicals, and social tags stay consistent and never drift.
 */

/** Ensure a path is absolute, canonical-form (leading + trailing slash). */
export function canonicalPath(path: string): string {
  let p = path.startsWith("/") ? path : `/${path}`;
  if (!p.endsWith("/")) p = `${p}/`;
  return p;
}

export function absoluteUrl(path: string): string {
  return `${site.url}${canonicalPath(path)}`;
}

type BuildMetadataArgs = {
  /** Full <title> content, keyword-first. Brand is appended automatically. */
  title: string;
  description: string;
  /** Route path, e.g. "/seo-services/". Drives the self-referencing canonical. */
  path: string;
  /** Per-page OG image path (absolute or root-relative). Optional. */
  ogImage?: string;
  /** hreflang alternates as { locale: path } — e.g. en-IN / en-US / x-default. */
  alternates?: Record<string, string>;
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  alternates,
  noindex,
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(site.brand)
    ? title
    : `${title} | ${site.brand}`;

  const languages: Record<string, string> | undefined = alternates
    ? Object.fromEntries(
        Object.entries(alternates).map(([loc, p]) => [loc, absoluteUrl(p)]),
      )
    : undefined;

  return {
    // `absolute` bypasses the layout's title template so the brand suffix is
    // never doubled (metaTitles already include the brand).
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: site.brand,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
