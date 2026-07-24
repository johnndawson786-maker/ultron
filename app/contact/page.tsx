import type { Metadata } from "next";
import { AuditForm } from "@/components/ui/AuditForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us — Talk to an SEO Specialist | [BRAND]",
  description:
    "Get in touch to discuss SEO, digital marketing, web development, or penetration testing for your business in India or the USA. We reply within one business day.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-24 lg:pt-32">
      <div
        className="surface-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact/" },
            ]}
          />
          <div className="mt-6">
            <Eyebrow>Contact</Eyebrow>
          </div>
          <h1
            className="mt-4 font-bold text-ink"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08 }}
          >
            Let&apos;s talk about your growth
          </h1>
          <p className="mt-5 text-lg text-ink-soft">
            Whether you need SEO, digital marketing, a new website, or a security
            test, tell us what you are trying to achieve and we will point you in
            the right direction — even if that is not us.
          </p>

          <dl className="mt-10 space-y-5">
            <div>
              <dt className="mono-eyebrow text-primary">Email</dt>
              <dd className="mt-1 text-ink">{site.email}</dd>
            </div>
            <div>
              <dt className="mono-eyebrow text-primary">Phone</dt>
              <dd className="mt-1 text-ink">{site.phone}</dd>
            </div>
            <div>
              <dt className="mono-eyebrow text-primary">Serving</dt>
              <dd className="mt-1 text-ink">India &amp; the USA</dd>
            </div>
          </dl>
        </div>

        <div>
          <AuditForm variant="contact" />
        </div>
      </div>
    </section>
  );
}
