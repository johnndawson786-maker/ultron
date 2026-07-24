import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="surface-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-32 text-center lg:px-8">
        <p className="mono-eyebrow text-primary">Error 404</p>
        <h1 className="mt-4 text-4xl font-bold text-ink sm:text-5xl">
          This page has moved or never existed
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          The link may be broken or the page may have been retired. Let us point
          you back to something useful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="primary">
            Back to home
          </Button>
          <Button href="/seo-services/" variant="secondary">
            Browse SEO services
          </Button>
        </div>
        <p className="mt-10 text-sm text-ink-soft">
          Or{" "}
          <Link href="/contact/" className="text-primary hover:underline">
            get in touch
          </Link>{" "}
          and we will help you find what you need.
        </p>
      </div>
    </section>
  );
}
