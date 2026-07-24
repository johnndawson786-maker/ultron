import type { ReactNode } from "react";

/** Monospace, uppercase, tracked label that sits above a section heading. */
export function Eyebrow({
  children,
  className = "",
  onDark = false,
}: {
  children: ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <p
      className={`mono-eyebrow ${onDark ? "text-signal" : "text-primary"} ${className}`}
    >
      {children}
    </p>
  );
}
