import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Reveal } from "@/components/ui/Reveal";
import { serviceLines } from "@/content/home";

export function ServicesGrid() {
  return (
    <section
      aria-labelledby="services-heading"
      className="mx-auto max-w-7xl px-5 py-24 lg:px-8"
    >
      <SectionHeading
        id="services-heading"
        eyebrow="What we do"
        title="Four services, built to work together"
        lede="Most agencies do one thing. We connect SEO, marketing, development, and security so growth and stability reinforce each other."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {serviceLines.map((service, i) => (
          <Reveal key={service.href} delay={i * 0.06} className="h-full">
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
