import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

/**
 * Standard section header: optional eyebrow, an H2, and a lede.
 * `as` lets a page override the heading level to keep H1→H2→H3 nesting valid.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Tag = "h2",
  align = "left",
  onDark = false,
  id,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  onDark?: boolean;
  id?: string;
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`${alignment} max-w-2xl`}>
      {eyebrow ? (
        <div className="mb-3">
          <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      <Tag
        id={id}
        className={`text-2xl sm:text-3xl ${onDark ? "!text-white" : ""}`}
      >
        {title}
      </Tag>
      {lede ? (
        <p
          className={`mt-4 text-lg ${onDark ? "text-white/75" : "text-ink-soft"}`}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
