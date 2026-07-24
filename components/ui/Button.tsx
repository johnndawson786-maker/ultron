import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

const sizes = "px-6 py-3 text-[1.0625rem] leading-none";

const variants: Record<Variant, string> = {
  // Blue is the single primary accent in the clean/light scheme.
  primary:
    "bg-primary text-white hover:bg-primary-dk shadow-[0_6px_16px_rgba(47,91,255,0.25)]",
  secondary:
    "bg-white text-ink border border-line hover:border-primary hover:text-primary",
  ghost: "bg-transparent text-ink hover:text-primary",
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
