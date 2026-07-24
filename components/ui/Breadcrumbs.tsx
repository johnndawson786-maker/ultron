import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbNode, type Breadcrumb } from "@/lib/schema";

/**
 * Visible breadcrumbs + matching BreadcrumbList JSON-LD.
 * The last item is the current page (not a link).
 */
export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <JsonLd data={breadcrumbNode(items)} />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-soft">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-primary">
                  {item.name}
                </Link>
              )}
              {!last ? (
                <span aria-hidden="true" className="text-line">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
