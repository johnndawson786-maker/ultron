import { JsonLd } from "./JsonLd";
import { faqNode, type FaqItem } from "@/lib/schema";

/**
 * Accessible FAQ block rendered as native <details>/<summary> (open-by-default
 * for the first item), plus FAQPage JSON-LD from the same data so the visible
 * copy and the schema never diverge.
 */
export function FAQAccordion({
  items,
  heading,
  id = "faq-heading",
}: {
  items: FaqItem[];
  heading: string;
  id?: string;
}) {
  return (
    <section aria-labelledby={id} className="mx-auto max-w-3xl">
      <JsonLd data={faqNode(items)} />
      <h2 id={id} className="text-2xl sm:text-3xl">
        {heading}
      </h2>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {items.map((item, i) => (
          <details
            key={item.question}
            className="group py-2"
            open={i === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-transform duration-200 group-open:rotate-45"
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path
                    d="M7 2v10M2 7h10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </summary>
            <p className="pb-4 pr-10 text-ink-soft">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
