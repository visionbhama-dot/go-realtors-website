import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-3xl",
          align === "center" && "text-center mx-auto",
        )}
      >
        {eyebrow && (
          <span className={cn("eyebrow", dark && "eyebrow-light")}>
            {eyebrow}
          </span>
        )}
        <h2
          className={cn(
            "mt-3 font-display text-[1.75rem] font-bold leading-[1.15] sm:text-[2.125rem] lg:text-[2.5rem]",
            dark && "text-white",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3.5 text-[0.9375rem] leading-relaxed",
              dark ? "text-white/60" : "text-ink-600",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-1.5 border-b-2 pb-1 text-[0.8125rem] font-bold transition-colors",
            dark
              ? "border-brand-500/50 text-brand-400 hover:border-brand-400"
              : "border-brand-500/40 text-brand-700 hover:border-brand-600",
          )}
        >
          {action.label}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={2.4}
          />
        </Link>
      )}
    </div>
  );
}
