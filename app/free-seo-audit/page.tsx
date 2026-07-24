import type { Metadata } from "next";
import { AuditForm } from "@/components/ui/AuditForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Free SEO Audit — See What's Holding You Back | [BRAND]",
  description:
    "Request a free SEO audit. We'll review your technical health, content, and rankings, then send a prioritised list of opportunities. No obligation.",
  path: "/free-seo-audit/",
});

const points = [
  "The technical issues stopping Google indexing your pages",
  "Content and keyword gaps against your competitors",
  "Quick wins you can act on straight away",
  "A prioritised roadmap — no jargon, no obligation",
];

export default function FreeAuditPage() {
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
              { name: "Free SEO audit", path: "/free-seo-audit/" },
            ]}
          />
          <div className="mt-6">
            <Eyebrow>Free SEO audit</Eyebrow>
          </div>
          <h1
            className="mt-4 font-bold text-ink"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08 }}
          >
            Get a free SEO audit of your website
          </h1>
          <p className="mt-5 text-lg text-ink-soft">
            Tell us your website and we will review it by hand — not just a tool
            export. You will get a clear, prioritised list of what to fix first
            to grow your organic traffic.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-ink">
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-signal/12 text-[#0a8f70]"
                  aria-hidden="true"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14">
                    <path
                      d="M3 7.5L6 10.5L11 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <AuditForm variant="audit" />
        </div>
      </div>
    </section>
  );
}
