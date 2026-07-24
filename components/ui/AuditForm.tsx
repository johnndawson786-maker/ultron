"use client";

import { useState, type FormEvent } from "react";

/**
 * Lead-capture form (free audit / contact).
 *
 * Phase 1–3 scope: accessible, validated UI with a honeypot and a client-side
 * success state. The server action → Resend (email) + rate-limit wiring is
 * Phase 7; until then this does not transmit data anywhere. The honeypot field
 * is already in place for when the backend is connected.
 */
export function AuditForm({
  variant = "audit",
}: {
  variant?: "audit" | "contact";
}) {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // Honeypot: if filled, silently ignore (bot).
    const honey = (form.elements.namedItem("company_website") as HTMLInputElement)
      ?.value;
    if (honey) return;
    // TODO(Phase 7): call server action → Resend + rate limit.
    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-signal/30 bg-signal/5 p-8 text-center"
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-signal/15 text-[#0a8f70]">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <path
              d="M4 11.5L9 16L18 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-xl">Thanks — we have your details</h2>
        <p className="mt-2 text-ink-soft">
          We will review your site and get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8"
      noValidate={false}
    >
      {/* Honeypot — visually hidden, off-screen, not tab-focusable. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Leave this field empty</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" autoComplete="name" required />
        <Field
          id="email"
          label="Work email"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          id="website"
          label="Website URL"
          type="url"
          placeholder="https://"
          autoComplete="url"
          required={variant === "audit"}
          className="sm:col-span-2"
        />
        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-medium text-ink">
            {variant === "audit"
              ? "What would you like to improve? (optional)"
              : "How can we help?"}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-white shadow-[0_6px_16px_rgba(47,91,255,0.25)] transition-colors duration-150 hover:bg-primary-dk sm:w-auto"
      >
        {variant === "audit" ? "Request my free audit" : "Send message"}
      </button>
      <p className="mt-3 text-xs text-ink-soft">
        We reply within one business day. No spam, ever.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
  className = "",
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />
    </div>
  );
}
