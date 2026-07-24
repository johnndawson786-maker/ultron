import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { homeProcess } from "@/content/home";

export function ProcessSteps() {
  return (
    <section
      aria-labelledby="process-heading"
      className="mx-auto max-w-7xl px-5 py-24 lg:px-8"
    >
      <SectionHeading
        id="process-heading"
        eyebrow="How we work"
        title="A process you can follow, not a black box"
        lede="Clear stages, named deliverables, and reporting at every step — so you always know what we're doing and why."
      />

      <div className="relative mt-14 grid gap-8 md:grid-cols-4">
        {/* Dashed connector behind the steps (desktop). */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-6 hidden border-t border-dashed border-line md:block"
          aria-hidden="true"
        />
        {homeProcess.map((step, i) => (
          <Reveal key={step.step} delay={i * 0.06} className="relative">
            <div className="relative grid h-12 w-12 place-items-center rounded-full border border-line bg-white font-[family-name:var(--font-mono)] text-sm font-medium text-primary shadow-soft">
              {step.step}
            </div>
            <h3 className="mt-5 text-lg">{step.title}</h3>
            <p className="mt-2 text-[0.95rem] text-ink-soft">{step.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
