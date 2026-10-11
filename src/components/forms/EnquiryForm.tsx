"use client";

import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2, Lock, TriangleAlert } from "lucide-react";
import { submitLead } from "@/app/actions/public";
import { cn } from "@/lib/utils";

const BUDGETS = [
  "Under ₹1.5 Cr",
  "₹1.5 Cr - ₹3 Cr",
  "₹3 Cr - ₹5 Cr",
  "₹5 Cr - ₹10 Cr",
  "Above ₹10 Cr",
];

const REQUIREMENTS = [
  "Buy to live in",
  "Buy as investment",
  "Commercial / retail",
  "SCO plot",
  "Resale / exit advisory",
  "Leasing a property",
];

export function EnquiryForm({
  projectSlug,
  projectName,
  source = "website",
  variant = "card",
  heading,
  subheading,
  showBudget = true,
  showRequirement = true,
  compact = false,
  className,
}: {
  projectSlug?: string;
  projectName?: string;
  source?: string;
  variant?: "card" | "bare" | "dark";
  heading?: string;
  subheading?: string;
  showBudget?: boolean;
  showRequirement?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const dark = variant === "dark";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const res = await submitLead(fd);
      setResult(res);
      if (res.ok) form.reset();
    });
  }

  if (result?.ok) {
    return (
      <div
        className={cn(
          variant === "card" && "card p-6",
          dark && "rounded-md border border-white/15 bg-white/5 p-6",
          className,
        )}
      >
        <div className="flex flex-col items-center py-6 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <h3
            className={cn(
              "mt-4 font-display text-lg font-bold",
              dark && "text-white",
            )}
          >
            Enquiry received
          </h3>
          <p
            className={cn(
              "mt-2 max-w-xs text-sm",
              dark ? "text-white/60" : "text-ink-600",
            )}
          >
            {result.message}
          </p>
          <button
            type="button"
            onClick={() => setResult(null)}
            className="mt-5 text-[0.8125rem] font-bold text-brand-700 hover:underline"
          >
            Submit another enquiry
          </button>
        </div>
      </div>
    );
  }

  const labelCls = cn("field-label", dark && "text-white/70");
  const fieldCls = cn(
    "field",
    dark &&
      "border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-brand-400 focus:shadow-none",
  );

  return (
    <div
      className={cn(
        variant === "card" && "card p-6 shadow-card",
        dark && "rounded-md border border-white/15 bg-white/[0.06] p-6",
        className,
      )}
    >
      {heading && (
        <div className="mb-5">
          <h3
            className={cn(
              "font-display text-lg font-bold leading-snug",
              dark && "text-white",
            )}
          >
            {heading}
          </h3>
          {subheading && (
            <p
              className={cn(
                "mt-1.5 text-[0.8125rem] leading-relaxed",
                dark ? "text-white/60" : "text-ink-600",
              )}
            >
              {subheading}
            </p>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3.5" noValidate>
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="sourcePath" value={pathname} />
        {projectSlug && (
          <input type="hidden" name="projectSlug" value={projectSlug} />
        )}
        {projectName && (
          <input type="hidden" name="projectName" value={projectName} />
        )}
        {/* honeypot */}
        <div className="absolute left-[-9999px]" aria-hidden>
          <label htmlFor="company-hp">Company</label>
          <input id="company-hp" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={cn("grid gap-3.5", !compact && "sm:grid-cols-2")}>
          <div>
            <label className={labelCls} htmlFor={`nm-${source}`}>
              Full name <span className="text-brand-600">*</span>
            </label>
            <input
              id={`nm-${source}`}
              name="name"
              required
              autoComplete="name"
              placeholder="Your name"
              className={fieldCls}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor={`ph-${source}`}>
              Mobile number <span className="text-brand-600">*</span>
            </label>
            <input
              id={`ph-${source}`}
              name="phone"
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="98XXXXXXXX"
              className={fieldCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor={`em-${source}`}>
            Email address
          </label>
          <input
            id={`em-${source}`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldCls}
          />
        </div>

        {(showBudget || showRequirement) && (
          <div className={cn("grid gap-3.5", !compact && "sm:grid-cols-2")}>
            {showRequirement && (
              <div>
                <label className={labelCls} htmlFor={`rq-${source}`}>
                  I am looking to
                </label>
                <select
                  id={`rq-${source}`}
                  name="requirement"
                  defaultValue=""
                  className={fieldCls}
                >
                  <option value="">Select</option>
                  {REQUIREMENTS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {showBudget && (
              <div>
                <label className={labelCls} htmlFor={`bg-${source}`}>
                  Budget range
                </label>
                <select
                  id={`bg-${source}`}
                  name="budget"
                  defaultValue=""
                  className={fieldCls}
                >
                  <option value="">Select</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        <div>
          <label className={labelCls} htmlFor={`ms-${source}`}>
            Anything specific we should know?
          </label>
          <textarea
            id={`ms-${source}`}
            name="message"
            rows={compact ? 2 : 3}
            placeholder={
              projectName
                ? `I'd like the price list and floor plans for ${projectName}.`
                : "Preferred sector, possession timeline, configuration…"
            }
            className={cn(fieldCls, "resize-y")}
          />
        </div>

        {result && !result.ok && (
          <p className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-[0.8125rem] text-red-700">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
            {result.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary w-full btn-lg"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
              Sending…
            </>
          ) : (
            "Request a Call Back"
          )}
        </button>

        <label
          className={cn(
            "flex items-start gap-2 text-[0.6875rem] leading-relaxed",
            dark ? "text-white/45" : "text-ink-500",
          )}
        >
          <input
            type="checkbox"
            name="consent"
            value="true"
            defaultChecked
            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand-600"
          />
          <span>
            I authorise GoRealtors to contact me by call, SMS, email or WhatsApp
            regarding my enquiry. This consent overrides any DNC/NDNC
            registration.
          </span>
        </label>

        <p
          className={cn(
            "flex items-center justify-center gap-1.5 text-[0.6875rem]",
            dark ? "text-white/40" : "text-ink-400",
          )}
        >
          <Lock className="h-3 w-3" strokeWidth={2.4} />
          Your details stay private. We never sell contact data.
        </p>
      </form>
    </div>
  );
}
