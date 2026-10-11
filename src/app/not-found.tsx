import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <div className="shell py-6">
        <Logo variant="light" />
      </div>

      <main className="shell flex flex-1 items-center py-16">
        <div className="max-w-2xl">
          <p className="font-display text-[5rem] font-extrabold leading-none text-white/12 sm:text-[7rem]">
            404
          </p>
          <h1 className="mt-2 font-display text-[1.75rem] font-extrabold leading-tight text-white sm:text-[2.25rem]">
            This page has moved, or never existed
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/60">
            We redesigned this website recently, so a few older links no longer
            resolve. The project you were looking for is almost certainly still
            on the site — try the directory or search.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary btn-lg">
              <Home className="h-4 w-4" strokeWidth={2.3} />
              Back to home
            </Link>
            <Link href="/projects" className="btn btn-ghost-light btn-lg">
              Browse all projects
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
            <Link href="/search" className="btn btn-ghost-light btn-lg">
              <Search className="h-4 w-4" strokeWidth={2.3} />
              Search
            </Link>
          </div>

          <div className="mt-12 border-t border-white/12 pt-8">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-400">
              Popular destinations
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: "Residential projects", href: "/residential" },
                { label: "Commercial & SCO", href: "/commercial" },
                { label: "Dwarka Expressway", href: "/locations/dwarka-expressway" },
                { label: "Golf Course Road", href: "/locations/golf-course-road" },
                { label: "Developers", href: "/developers" },
                { label: "Market insights", href: "/blog" },
                { label: "Contact us", href: "/contact" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full border border-white/20 px-3.5 py-1.5 text-[0.8125rem] font-medium text-white/75 transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
