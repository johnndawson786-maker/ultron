import { StatCounter } from "@/components/ui/StatCounter";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Honest stats strip. These are structural facts about how we work, not
 * fabricated client results — the "100%" is our verifiable-reporting promise,
 * not an outcome metric. Real performance numbers land in Case Studies once
 * they're verified.
 */
const stats = [
  { value: 4, suffix: "", label: "Service lines, one accountable team" },
  { value: 2, suffix: "", label: "Markets served — India & the USA" },
  { value: 100, suffix: "%", label: "Verifiable reporting (GSC / GA4)" },
];

export function StatsStrip() {
  return (
    <section className="border-y border-line bg-cloud">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-3 lg:px-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
