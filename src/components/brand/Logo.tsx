import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Compact vector mark used where the full lockup image is too large
 * (e.g. the collapsed admin sidebar). The uploaded brand lockups are used
 * for the public header/footer via the <Logo /> component below.
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

/**
 * Renders the uploaded GoRealtors brand lockup.
 * - `variant="dark"` (default) → dark-text logo, for use on LIGHT backgrounds (header).
 * - `variant="light"` → white logo, for use on DARK backgrounds (footer).
 *
 * `withTagline` is accepted for backwards compatibility but no longer changes
 * the artwork, since the uploaded lockups already include the brand wordmark.
 */
export function Logo({
  variant = "dark",
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  withTagline = true,
}: {
  variant?: "dark" | "light";
  className?: string;
  withTagline?: boolean;
}) {
  const src = variant === "light" ? "/brand/logo-light.png" : "/brand/logo-dark.png";
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center", className)}
      aria-label="GoRealtors home"
    >
      <Image
        src={src}
        alt="GoRealtors"
        width={500}
        height={360}
        priority
        className="h-12 w-auto"
      />
    </Link>
  );
}
