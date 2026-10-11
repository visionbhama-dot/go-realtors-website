import Link from "next/link";
import { ArrowLeft, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-ink-500 transition-colors hover:text-brand-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-[1.375rem] font-bold leading-tight sm:text-[1.625rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-[0.8125rem] leading-relaxed text-ink-600">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  padded = true,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cn("rounded-md border border-ink-200 bg-white", className)}>
      {title && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-200 px-5 py-3.5">
          <div>
            <h2 className="font-display text-[0.9375rem] font-bold">{title}</h2>
            {description && (
              <p className="mt-0.5 text-[0.75rem] text-ink-500">{description}</p>
            )}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </header>
      )}
      <div className={padded ? "p-5" : undefined}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  sub,
  tone = "default",
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "brand" | "warn" | "dark";
  href?: string;
}) {
  const tones = {
    default: "bg-white border-ink-200",
    brand: "bg-brand-50 border-brand-200",
    warn: "bg-amber-50 border-amber-200",
    dark: "bg-ink-950 border-ink-950",
  };
  const body = (
    <>
      <p
        className={cn(
          "text-[0.625rem] font-bold uppercase tracking-[0.1em]",
          tone === "dark" ? "text-white/45" : "text-ink-400",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 font-display text-[1.75rem] font-extrabold leading-none tabular-nums",
          tone === "dark" ? "text-white" : "text-ink-950",
        )}
      >
        {value}
      </p>
      {sub && (
        <p
          className={cn(
            "mt-1.5 text-[0.75rem]",
            tone === "dark" ? "text-white/50" : "text-ink-500",
          )}
        >
          {sub}
        </p>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "block rounded-md border p-5 transition-shadow hover:shadow-lift",
          tones[tone],
        )}
      >
        {body}
      </Link>
    );
  }
  return (
    <div className={cn("rounded-md border p-5", tones[tone])}>{body}</div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        {icon ?? <Inbox className="h-5 w-5" strokeWidth={2} />}
      </span>
      <h3 className="mt-4 font-display text-[1rem] font-bold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[0.8125rem] leading-relaxed text-ink-600">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "warn" | "danger" | "info";
}) {
  const tones = {
    neutral: "bg-ink-100 text-ink-700 border-ink-200",
    brand: "bg-brand-50 text-brand-800 border-brand-200",
    warn: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Table({
  head,
  children,
  minWidth = "44rem",
}: {
  head: string[];
  children: React.ReactNode;
  minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-ink-200 bg-ink-50/80">
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="whitespace-nowrap px-4 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ink-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="field-label">
        {label}
        {required && <span className="ml-0.5 text-brand-600">*</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-[0.6875rem] leading-relaxed text-ink-400">
          {hint}
        </p>
      )}
    </div>
  );
}
