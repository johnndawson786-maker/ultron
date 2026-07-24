import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

const sizes = "px-6 py-3 text-[1.0625rem] leading-none";

const variants: Record<Variant, string> = {
  // Orange CTA fill uses the darkened --accent so white label text clears 4.5:1.
  primary: "bg-accent text-white hover:bg-[#c94e12]",
  secondary: "bg-primary text-white hover:bg-primary-dk",
  ghost:
    "bg-transparent text-ink border border-line hover:border-primary hover:text-primary",
};

type ButtonAsLink = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">;

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  ...rest
}: ButtonAsLink) {
  return (
    <Link
      href={href}
      className={`${base} ${sizes} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
