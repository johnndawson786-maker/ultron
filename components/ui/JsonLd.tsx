/**
 * Renders a JSON-LD block. Kept server-only and dangerouslySetInnerHTML'd
 * because structured data must be present in the static HTML for crawlers.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
