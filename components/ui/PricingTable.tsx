"use client";

import { useState } from "react";
import Link from "next/link";
import {
  seoPricingTiers,
  annualMultiplier,
  type PricingTier,
} from "@/content/pricing";

/** Pricing tiers with a monthly/annual toggle. Prices labelled indicative. */
export function PricingTable() {
  const [annual, setAnnual] = useState(false);

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={annual ? "text-ink-soft" : "font-medium text-ink"}>
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-label="Toggle annual billing"
          onClick={() => setAnnual((v) => !v)}
          className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${
            annual ? "bg-primary" : "bg-line"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              annual ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={annual ? "font-medium text-ink" : "text-ink-soft"}>
          Annual
          <span className="ml-1 rounded-full bg-signal/12 px-2 py-0.5 text-xs font-medium text-[#0a8f70]">
            Save ~17%
          </span>
        </span>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {seoPricingTiers.map((tier) => (
          <TierCard key={tier.name} tier={tier} annual={annual} />
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Prices are indicative starting points, not fixed quotes. Your exact
        price is confirmed after a short audit. No long lock-in contracts.
      </p>
    </div>
  );
}

function TierCard({ tier, annual }: { tier: PricingTier; annual: boolean }) {
  const displayMonthly = annual
    ? Math.round((tier.monthly * annualMultiplier) / 12)
    : tier.monthly;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-7 ${
        tier.featured
          ? "border-primary/40 bg-white shadow-float"
          : "border-line bg-white shadow-soft"
      }`}
    >
      {tier.featured ? (
        <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
          Most popular
        </span>
      ) : null}

      <h3 className="text-xl">{tier.name}</h3>
      <p className="mt-1 text-sm text-ink-soft">{tier.tagline}</p>

      <div className="mt-5 flex items-end gap-1">
        <span className="mono-eyebrow text-ink-soft">from</span>
        <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-ink">
          {tier.currency}
          {displayMonthly.toLocaleString()}
        </span>
        <span className="mb-1 text-sm text-ink-soft">/mo</span>
      </div>
      {annual ? (
        <p className="mt-1 text-xs text-ink-soft">billed annually</p>
      ) : null}

      <p className="mt-4 text-sm text-ink-soft">{tier.bestFor}</p>

      <ul className="mt-5 flex-1 space-y-2.5">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-signal"
            >
              <path
                d="M3 8.5L6.5 12L13 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={tier.cta.href}
        className={`mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 font-medium transition-colors duration-150 ${
          tier.featured
            ? "bg-primary text-white hover:bg-primary-dk"
            : "border border-line bg-white text-ink hover:border-primary hover:text-primary"
        }`}
      >
        {tier.cta.label}
      </Link>
    </div>
  );
}
