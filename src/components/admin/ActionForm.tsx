"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionResult = { ok: boolean; message: string; id?: string };

/**
 * Wraps a server action in a form with inline success/error feedback.
 * Keeps every admin screen consistent without a client-side form library.
 */
export function ActionForm({
  action,
  children,
  submitLabel = "Save",
  submitClassName = "btn btn-primary",
  pendingLabel = "Saving…",
  resetOnSuccess = false,
  redirectOnSuccess,
  confirm,
  className,
  footer,
  secondary,
  inlineFeedback = true,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel?: string;
  submitClassName?: string;
  pendingLabel?: string;
  resetOnSuccess?: boolean;
  /** `:id` is replaced with the id returned by the action. */
  redirectOnSuccess?: string;
  confirm?: string;
  className?: string;
  footer?: React.ReactNode;
  secondary?: React.ReactNode;
  inlineFeedback?: boolean;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (confirm && !window.confirm(confirm)) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    setResult(null);

    start(async () => {
      const res = await action(fd);
      setResult(res);
      if (res.ok) {
        if (resetOnSuccess) form.reset();
        if (redirectOnSuccess) {
          router.push(redirectOnSuccess.replace(":id", res.id ?? ""));
        }
        router.refresh();
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className={className} noValidate>
      {children}

      {inlineFeedback && result && (
        <p
          className={cn(
            "mt-4 flex items-start gap-2 rounded-sm border px-3 py-2 text-[0.8125rem]",
            result.ok
              ? "border-brand-200 bg-brand-50 text-brand-800"
              : "border-red-200 bg-red-50 text-red-700",
          )}
          role="status"
        >
          {result.ok ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
          ) : (
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
          )}
          {result.message}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button type="submit" disabled={pending} className={submitClassName}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
              {pendingLabel}
            </>
          ) : (
            submitLabel
          )}
        </button>
        {secondary}
      </div>

      {footer}
    </form>
  );
}

/** Compact inline form for single-button row actions (delete, publish…). */
export function InlineAction({
  action,
  fields,
  label,
  className = "btn btn-outline btn-sm",
  confirm,
  pendingLabel,
  title,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  fields: Record<string, string>;
  label: React.ReactNode;
  className?: string;
  confirm?: string;
  pendingLabel?: string;
  title?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (confirm && !window.confirm(confirm)) return;
    const fd = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      const res = await action(fd);
      if (!res.ok) setError(res.message);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="inline-flex flex-col items-start">
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button type="submit" disabled={pending} className={className} title={title}>
        {pending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.4} />
            {pendingLabel ?? "Working…"}
          </>
        ) : (
          label
        )}
      </button>
      {error && (
        <span className="mt-1 max-w-[16rem] text-[0.6875rem] leading-snug text-red-600">
          {error}
        </span>
      )}
    </form>
  );
}
