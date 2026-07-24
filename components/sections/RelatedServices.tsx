import Link from "next/link";

export type RelatedLink = { title: string; href: string; blurb?: string };

/**
 * Sideways/related internal links (siblings + pillar). Descriptive, varied
 * anchor text — never identical exact-match anchors.
 */
export function RelatedServices({
  heading = "Related SEO services",
  links,
}: {
  heading?: string;
  links: RelatedLink[];
}) {
  return (
    <section aria-labelledby="related-heading" className="mx-auto max-w-5xl">
      <h2 id="related-heading" className="text-2xl sm:text-3xl">
        {heading}
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group rounded-xl border border-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-medium text-ink">{l.title}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1"
              >
                <path
                  d="M3 8h9M9 4l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {l.blurb ? (
              <span className="mt-1.5 block text-sm text-ink-soft">
                {l.blurb}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
