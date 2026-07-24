import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { differentiators } from "@/content/home";

export function WhyUs() {
  return (
    <section
      aria-labelledby="why-heading"
      className="bg-cloud"
    >
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <SectionHeading
          id="why-heading"
          eyebrow="Why teams choose us"
          title="Growth and security from a single team"
          lede="No hand-offs between three vendors who blame each other. One roadmap, one point of contact, four disciplines."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {differentiators.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.06}>
              <div className="flex h-full gap-4 rounded-2xl border border-line bg-white p-6">
                <span
                  className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-signal/12 text-[#0a8f70]"
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path
                      d="M3 8.5L6.5 12L13 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg">{d.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] text-ink-soft">{d.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
