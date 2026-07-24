import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroVisual } from "./HeroVisual";

/**
 * Home hero — light, clean, techy split layout.
 * The headline/subtext/CTA (the LCP content) render as immediate static HTML;
 * only the right-side dashboard visual animates, so LCP stays fast.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Faint light grid + soft color washes (no heavy gradients). */}
      <div className="surface-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-signal/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8">
        {/* Left — static, immediate paint */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            <Eyebrow>SEO · Marketing · Web · Security</Eyebrow>
          </div>

          <h1
            className="mt-6 font-bold text-ink"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", lineHeight: 1.05 }}
          >
            The digital marketing agency built to move rankings
          </h1>

          <p className="mt-6 max-w-xl text-lg text-ink-soft">
            We combine SEO, performance marketing, web development, and
            penetration testing to grow organic revenue and keep it secure — for
            businesses across India and the USA.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/free-seo-audit/" variant="primary">
              Get a free SEO audit
            </Button>
            <Button href="/case-studies/" variant="secondary">
              See our results
            </Button>
          </div>

          {/* Trust strip */}
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
            {[
              { k: "4 services", v: "One accountable team" },
              { k: "IN + US", v: "Two markets, one strategy" },
              { k: "Data-led", v: "Reporting you can verify" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="mono-eyebrow text-primary">{s.k}</dt>
                <dd className="mt-1 text-sm text-ink-soft">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right — animated dashboard visual */}
        <HeroVisual />
      </div>
    </section>
  );
}
