import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Home hero. Renders entirely from static HTML (LCP text is server-rendered,
 * no client JS needed) over the brand gradient with a dot-grid overlay and
 * two low-opacity radial blobs.
 */
export function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      {/* Dot-grid overlay */}
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      {/* Blurred radial blobs — mint + orange, low opacity */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-signal opacity-[0.12] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent-raw opacity-[0.12] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-36 lg:px-8 lg:pt-40">
        <div className="max-w-3xl">
          <Eyebrow onDark>SEO · Marketing · Web · Security</Eyebrow>

          <h1 className="mt-4 text-white text-4xl leading-[1.05] sm:text-5xl">
            <span
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
              className="block font-bold"
            >
              A digital marketing agency built to move rankings
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/80">
            We combine SEO, performance marketing, web development, and
            penetration testing to grow organic revenue and keep it secure —
            for businesses across India and the USA.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/free-seo-audit/" variant="primary">
              Get a free SEO audit
            </Button>
            <Button href="/case-studies/" variant="ghost" className="!text-white !border-white/30 hover:!border-white hover:!text-white">
              See our results
            </Button>
          </div>

          {/* Trust strip */}
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
            {[
              { k: "4 services", v: "One accountable team" },
              { k: "IN + US", v: "Two markets, one strategy" },
              { k: "Data-led", v: "Reporting you can verify" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="mono-eyebrow text-signal">{s.k}</dt>
                <dd className="mt-1 text-[0.9rem] text-white/70">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
