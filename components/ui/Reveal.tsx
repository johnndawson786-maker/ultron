"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-reveal wrapper: 16px rise + fade, 400ms ease-out, once.
 * Honors prefers-reduced-motion by rendering static content with no transform.
 * `delay` staggers siblings (pass i * 0.06 for the 60ms cadence).
 */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
  y = 16,
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "li" | "section" | "span";
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      {children}
    </MotionTag>
  );
}
