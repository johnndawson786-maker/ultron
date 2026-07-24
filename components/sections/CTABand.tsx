import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Closing call-to-action band. Uses a solid ink surface (not a gradient) for
 * a clean, confident finish that still contrasts with the light page.
 */
export function CTABand() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center lg:px-16 lg:py-20">
        {/* Subtle dot texture, low opacity — no gradient. */}
        <div
          className="dot-grid pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-2xl">
          <Eyebrow onDark>Ready when you are</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold !text-white sm:text-4xl">
            See exactly what&apos;s holding your rankings back
          </h2>
          <p className="mt-4 text-lg text-white/75">
            Get a free, no-obligation SEO audit. We&apos;ll show you the
            technical issues, content gaps, and quick wins — with no jargon and
            no pressure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/free-seo-audit/" variant="primary">
              Get your free audit
            </Button>
            <Button
              href="/contact/"
              variant="ghost"
              className="!text-white hover:!text-signal"
            >
              Talk to us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
