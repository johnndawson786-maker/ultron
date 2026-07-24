"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The "techy" hero centerpiece: a clean analytics dashboard card with a
 * self-drawing performance chart, plus floating stat cards around it.
 * Not the LCP element (the headline is), so animating it is safe.
 * All motion collapses to a static end-state under prefers-reduced-motion.
 */
export function HeroVisual() {
  const reduced = useReducedMotion();

  const rise = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.6, ease: "easeOut" as const },
      };

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <motion.div
        {...rise}
        className="relative rounded-2xl border border-line bg-white p-6 shadow-float"
      >
        {/* Card header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="mono-eyebrow text-primary">Organic performance</p>
            <p className="mt-1 text-sm text-ink-soft">Last 6 months</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-signal/10 px-3 py-1 text-sm font-medium text-[#0a8f70]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-signal"
              style={reduced ? undefined : { animation: "shimmerDot 2s ease-in-out infinite" }}
            />
            Live
          </span>
        </div>

        {/* Self-drawing chart */}
        <div className="mt-5">
          <svg
            viewBox="0 0 320 150"
            className="h-36 w-full"
            role="img"
            aria-label="An upward-trending organic traffic line chart"
          >
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* baseline gridlines */}
            {[30, 70, 110].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="320"
                y2={y}
                stroke="var(--line)"
                strokeWidth="1"
              />
            ))}
            {/* area */}
            <path
              d="M0,118 C40,108 60,124 90,100 S150,74 180,76 S240,44 270,40 S312,22 320,20 L320,150 L0,150 Z"
              fill="url(#area)"
            />
            {/* line, self-drawing */}
            <path
              d="M0,118 C40,108 60,124 90,100 S150,74 180,76 S240,44 270,40 S312,22 320,20"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="700"
              style={
                reduced
                  ? { strokeDashoffset: 0 }
                  : {
                      ["--dash" as string]: "700",
                      animation: "drawLine 1.6s ease-out 0.3s both",
                    }
              }
            />
            {/* end marker */}
            <circle cx="320" cy="20" r="4" fill="var(--primary)" />
            <circle
              cx="320"
              cy="20"
              r="8"
              fill="var(--primary)"
              opacity="0.18"
              style={reduced ? undefined : { animation: "shimmerDot 2s ease-in-out infinite" }}
            />
          </svg>
        </div>

        {/* Metric tiles */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: "Sessions", value: "128k" },
            { label: "Top-10 keywords", value: "342" },
            { label: "Conversions", value: "1,910" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl bg-cloud px-3 py-3">
              <p className="font-[family-name:var(--font-mono)] text-lg font-medium text-ink">
                {m.value}
              </p>
              <p className="mt-0.5 text-xs text-ink-soft">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating badge — ranking gain */}
      <div
        className="absolute -left-5 -top-5 rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-soft anim-float"
        aria-hidden="true"
      >
        <p className="mono-eyebrow text-ink-soft">seo services</p>
        <p className="mt-0.5 flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-sm text-ink">
          #4
          <span className="inline-flex items-center gap-0.5 text-signal">
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M5 1l4 6H1z" fill="currentColor" />
            </svg>
            11
          </span>
        </p>
      </div>

      {/* Floating badge — core web vitals */}
      <div
        className="absolute -right-4 -bottom-6 flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-soft anim-float-slow"
        aria-hidden="true"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-signal/12 text-[#0a8f70]">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M2 7.5L5.5 11L12 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <p className="mono-eyebrow text-ink-soft">Core Web Vitals</p>
          <p className="text-sm font-medium text-ink">All green</p>
        </div>
      </div>
    </div>
  );
}
