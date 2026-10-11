"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { submitApplication } from "@/app/actions/public";

export function ApplicationForm({
  openings,
}: {
  openings: { slug: string; title: string }[];
}) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const res = await submitApplication(fd);
      setResult(res);
      if (res.ok) form.reset();
    });
  }

  if (result?.ok) {
    return (
      <div className="card p-6">
        <div className="flex flex-col items-center py-6 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <h3 className="mt-4 font-display text-lg font-bold">
            Application received
          </h3>
          <p className="mt-2 max-w-xs text-sm text-ink-600">{result.message}</p>
          <button
            type="button"
            onClick={() => setResult(null)}
            className="mt-5 text-[0.8125rem] font-bold text-brand-700 hover:underline"
          >
            Apply for another role
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="font-display text-[1.0625rem] font-bold">Apply now</h2>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-600">
        Send us a link to your CV (Google Drive, Dropbox or LinkedIn) and a
        short note on why this role.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3.5" noValidate>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="ap-name">
              Full name <span className="text-brand-600">*</span>
            </label>
            <input
              id="ap-name"
              name="name"
              required
              autoComplete="name"
              className="field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="ap-phone">
              Mobile
            </label>
            <input
              id="ap-phone"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              className="field"
              placeholder="98XXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="ap-email">
            Email <span className="text-brand-600">*</span>
          </label>
          <input
            id="ap-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="ap-role">
            Role
          </label>
          <select id="ap-role" name="openingSlug" defaultValue="" className="field">
            <option value="">General application</option>
            {openings.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="ap-resume">
            CV / portfolio link
          </label>
          <input
            id="ap-resume"
            name="resumeUrl"
            type="url"
            className="field"
            placeholder="https://drive.google.com/…"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="ap-note">
            Why this role?
          </label>
          <textarea
            id="ap-note"
            name="coverNote"
            rows={4}
            className="field resize-y"
            placeholder="A few lines on your experience and what draws you to advisory work."
          />
        </div>

        {result && !result.ok && (
          <p className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-[0.8125rem] text-red-700">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
            {result.message}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn btn-primary w-full btn-lg">
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
              Submitting…
            </>
          ) : (
            "Submit application"
          )}
        </button>
      </form>
    </div>
  );
}
