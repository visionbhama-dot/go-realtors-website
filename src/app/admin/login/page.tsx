import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/brand/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Staff Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const next = (Array.isArray(sp.next) ? sp.next[0] : sp.next) ?? "/admin";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* left — form */}
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16">
        <Logo />

        <div className="flex flex-1 items-center">
          <div className="w-full max-w-sm py-12">
            <span className="eyebrow">GoRealtors CMS</span>
            <h1 className="mt-3 font-display text-[1.75rem] font-extrabold leading-tight">
              Sign in to the dashboard
            </h1>
            <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-600">
              Manage projects, leads, content and SEO. Access is role-based —
              you will only see what your role permits.
            </p>

            {isSupabaseConfigured ? (
              <LoginForm next={next} />
            ) : (
              <div className="mt-7 rounded-md border border-amber-300 bg-amber-50 p-5">
                <h2 className="text-[0.875rem] font-bold text-amber-900">
                  Supabase is not connected yet
                </h2>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-amber-800">
                  Add <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                  and{" "}
                  <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                  to your environment, run the SQL migration in{" "}
                  <code className="font-mono">supabase/migrations</code>, then
                  reload this page. Full instructions are in the project README.
                </p>
                <Link href="/admin" className="btn btn-dark btn-sm mt-4">
                  Open setup checklist
                </Link>
              </div>
            )}

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink-500 transition-colors hover:text-brand-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
              Back to website
            </Link>
          </div>
        </div>

        <p className="text-[0.75rem] text-ink-400">
          © {new Date().getFullYear()} {SITE.legalName}
        </p>
      </div>

      {/* right — brand panel */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-brand-500) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-500) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative flex h-full flex-col justify-center px-16">
          <ShieldCheck className="h-10 w-10 text-brand-500" strokeWidth={1.8} />
          <h2 className="mt-6 max-w-md font-display text-[2rem] font-extrabold leading-tight text-white">
            Everything on the public site is editable here
          </h2>
          <ul className="mt-8 space-y-3.5">
            {[
              "Projects, pricing, configurations, floor plans and galleries",
              "Lead pipeline with assignment, notes and CSV export",
              "Per-page SEO: titles, descriptions, keywords, OG images, canonicals",
              "Blog posts, developers, corridors, testimonials and team profiles",
              "Team logins with six role levels and granular permissions",
              "Site settings, navigation and an immutable audit trail",
            ].map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 text-[0.875rem] leading-relaxed text-white/65"
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
