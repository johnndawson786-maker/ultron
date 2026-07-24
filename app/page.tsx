import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { RankTicker } from "@/components/sections/RankTicker";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: `${site.brand} — Digital Marketing Agency for India & USA`,
  description:
    "Full-service digital marketing agency: SEO, paid media, web development, and penetration testing for businesses across India and the USA. Get a free audit.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <RankTicker />

      {/* Remaining home sections are built in Phase 2. */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <p className="mono-eyebrow text-ink-soft">
          Phase 1 preview — home hero &amp; rank ticker. Full home page sections
          land in Phase 2.
        </p>
      </section>
    </>
  );
}
