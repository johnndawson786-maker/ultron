import Link from "next/link";
import type { ServiceLine } from "@/content/home";
import { ServiceIcon } from "./ServiceIcon";

/** Icon + title + blurb + bullet points + arrow. Whole card is a link. */
export function ServiceCard({ service }: { service: ServiceLine }) {
  return (
    <Link
      href={service.href}
      className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/8 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
        <ServiceIcon name={service.icon} />
      </span>

      <h3 className="mt-5 text-xl">{service.title}</h3>
      <p className="mt-2 text-[0.95rem] text-ink-soft">{service.blurb}</p>

      <ul className="mt-4 space-y-1.5">
        {service.points.map((p) => (
          <li
            key={p}
            className="flex items-center gap-2 text-sm text-ink-soft"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="text-signal">
              <path
                d="M2 7.5L5.5 11L12 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {p}
          </li>
        ))}
      </ul>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        Explore
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
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
    </Link>
  );
}
