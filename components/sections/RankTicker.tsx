"use client";

import { useEffect, useState } from "react";
import { rankTicker, rankTickerLabel } from "@/content/rank-ticker";

/**
 * Signature element: a live-feeling rank-movement ticker rendered as a
 * horizontal marquee of monospace chips. Light-theme, techy, honestly
 * labelled as sample/illustrative data. The marquee is progressive
 * enhancement — under prefers-reduced-motion the chips render as a static,
 * wrapped row with no animation.
 */
export function RankTicker() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const chips = rankTicker.map((row) => (
    <span
      key={row.keyword}
      className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2 shadow-soft"
    >
      <span className="font-[family-name:var(--font-mono)] text-sm text-ink">
        {row.keyword}
      </span>
      <span className="font-[family-name:var(--font-mono)] text-sm text-ink-soft">
        #{row.position}
      </span>
      <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-sm text-[#0a8f70]">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M5 1l4 6H1z" fill="currentColor" />
        </svg>
        {row.change}
      </span>
    </span>
  ));

  return (
    <section
      aria-label="Sample keyword ranking movement"
      className="border-y border-line bg-cloud py-6"
    >
      <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between px-5 lg:px-8">
        <span className="mono-eyebrow text-primary">Rank movement</span>
        <span className="mono-eyebrow text-ink-soft">{rankTickerLabel}</span>
      </div>

      {reduced ? (
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-5 lg:px-8">
          {chips}
        </div>
      ) : (
        <div
          className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]"
        >
          {/* Two identical tracks for a seamless loop. */}
          <div className="flex shrink-0 items-center gap-3 pr-3 animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]">
            {chips}
          </div>
          <div
            className="flex shrink-0 items-center gap-3 pr-3 animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]"
            aria-hidden="true"
          >
            {chips}
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
}
