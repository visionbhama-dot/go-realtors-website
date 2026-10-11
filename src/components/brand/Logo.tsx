import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Vector rebuild of the GoRealtors mark: an outlined house whose right wall
 * breaks away as a green blade, with a solid green arrow rising inside it.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 56"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="GoRealtors"
    >
      {/* house outline */}
      <path
        d="M4 26.5 L30 4 L50 21.4 L50 48 L36.5 48 L36.5 41 L44 41 L44 25 L30 12.8 L14.5 26.3 L14.5 41 L25 41 L25 48 L4 48 Z"
        fill="currentColor"
      />
      {/* detached blade */}
      <path d="M54.5 25.2 L60 30 L60 48 L54.5 48 Z" fill="var(--color-brand-500)" />
      {/* rising arrow */}
      <path
        d="M30 19.6 L41 31.5 L33.4 31.5 L33.4 41.5 L26.6 41.5 L26.6 31.5 L19 31.5 Z"
        fill="var(--color-brand-500)"
      />
    </svg>
  );
}

export function Logo({
  variant = "dark",
  className,
  withTagline = true,
}: {
  variant?: "dark" | "light";
  className?: string;
  withTagline?: boolean;
}) {
  const light = variant === "light";
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="GoRealtors home"
    >
      <LogoMark className={cn("h-10 w-10 shrink-0", light ? "text-white" : "text-ink-950")} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.3rem] font-extrabold tracking-[-0.03em]",
            light ? "text-white" : "text-ink-950",
          )}
        >
          Go<span className="text-brand-500">Realtors</span>
        </span>
        {withTagline && (
          <span
            className={cn(
              "mt-1 flex items-center gap-1.5 text-[0.5rem] font-bold uppercase tracking-[0.22em]",
              light ? "text-white/60" : "text-ink-500",
            )}
          >
            <span aria-hidden className={cn("h-px w-3", light ? "bg-white/40" : "bg-ink-300")} />
            Let&apos;s Go Real
          </span>
        )}
      </span>
    </Link>
  );
}
