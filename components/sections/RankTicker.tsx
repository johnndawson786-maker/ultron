"use client";

import { useEffect, useRef, useState } from "react";
import { rankTicker, rankTickerLabel } from "@/content/rank-ticker";

/**
 * Signature element: a live-feeling rank-movement ticker.
 * Rows fade/slide in on load, then the strip cycles the top entry to the
 * bottom every few seconds. Honestly labelled as sample/illustrative data.
 * Fully static content in the HTML; animation is progressive enhancement and
 * is disabled under prefers-reduced-motion.
 */
export function RankTicker() {
  const [order, setOrder] = useState(rankTicker);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;

    timer.current = setInterval(() => {
      setOrder((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 2600);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <section
      aria-label="Sample keyword ranking movement"
      className="relative z-10 mx-auto -mt-10 max-w-5xl px-5 lg:px-8"
    >
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-ink/90 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <span className="mono-eyebrow text-signal">Rank movement</span>
          <span className="mono-eyebrow text-white/40">{rankTickerLabel}</span>
        </div>

        <ul className="divide-y divide-white/5">
          {order.slice(0, 5).map((row, i) => (
            <li
              key={row.keyword}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3 font-[family-name:var(--font-mono)] text-[0.9rem]"
              style={
                reduced
                  ? undefined
                  : {
                      animation: `rankIn 400ms ease-out both`,
                      animationDelay: `${i * 60}ms`,
                    }
              }
            >
              <span className="truncate text-white/85">{row.keyword}</span>
              <span className="text-white/50">
                pos <span className="text-white">{row.position}</span>
              </span>
              <span className="inline-flex items-center gap-1 tabular-nums text-signal">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path
                    d="M5 1l4 6H1z"
                    fill="currentColor"
                  />
                </svg>
                {row.change}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes rankIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
