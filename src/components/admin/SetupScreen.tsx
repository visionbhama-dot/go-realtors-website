import Link from "next/link";
import { CircleCheck, CircleDashed, ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function SetupScreen({
  hasUrl,
  hasAnon,
  hasService,
}: {
  hasUrl: boolean;
  hasAnon: boolean;
  hasService: boolean;
}) {
  const steps = [
    {
      done: false,
      title: "Create a Supabase project",
      body: "Sign in at supabase.com, create a project in the Singapore (ap-southeast-1) region for the lowest latency from India, and wait for it to provision.",
    },
    {
      done: false,
      title: "Run the database migration",
      body: "Open the SQL Editor in Supabase, paste the contents of supabase/migrations/20260101000000_init.sql from this repository, and run it. This creates every table, the role-permission matrix and all row-level security policies.",
    },
    {
      done: false,
      title: "Seed your content",
      body: "Run supabase/seed.sql next. It loads all 21 projects, 18 developers, 6 corridors, 13 blog posts, testimonials, SEO records and site settings from this repository into the database.",
    },
    {
      done: hasUrl && hasAnon,
      title: "Add the public environment variables",
      body: "Copy the Project URL and the anon public key from Supabase > Project Settings > API into NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      detail: [
        { key: "NEXT_PUBLIC_SUPABASE_URL", ok: hasUrl },
        { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", ok: hasAnon },
      ],
    },
    {
      done: hasService,
      title: "Add the service role key",
      body: "SUPABASE_SERVICE_ROLE_KEY lets the server write enquiries even when nobody is signed in. Keep it server-side only — never prefix it with NEXT_PUBLIC_.",
      detail: [{ key: "SUPABASE_SERVICE_ROLE_KEY", ok: hasService }],
    },
    {
      done: false,
      title: "Create your owner account",
      body: "In Supabase > Authentication > Users, click Add user and create an account with your email and a password. The first profile created automatically becomes the Owner, with full access. Then sign in at /admin/login.",
    },
  ];

  return (
    <div className="min-h-screen bg-ink-50/60">
      <div className="border-b border-ink-200 bg-white">
        <div className="shell flex h-16 items-center justify-between">
          <Logo />
          <Link href="/" className="btn btn-outline btn-sm">
            View live site
          </Link>
        </div>
      </div>

      <div className="shell max-w-4xl py-12">
        <span className="eyebrow">Setup required</span>
        <h1 className="mt-3 font-display text-[1.75rem] font-extrabold leading-tight sm:text-[2.125rem]">
          Connect Supabase to switch the backend on
        </h1>
        <p className="mt-3.5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
          The public website is already live and fully rendered from the content
          bundled in this repository, so nothing is broken. Once you connect
          Supabase, every page switches over to reading from the database and
          this dashboard becomes editable.
        </p>

        <ol className="mt-10 space-y-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="rounded-md border border-ink-200 bg-white p-5"
            >
              <div className="flex gap-4">
                <span className="mt-0.5 shrink-0">
                  {s.done ? (
                    <CircleCheck
                      className="h-5 w-5 text-brand-600"
                      strokeWidth={2.2}
                    />
                  ) : (
                    <CircleDashed
                      className="h-5 w-5 text-ink-300"
                      strokeWidth={2.2}
                    />
                  )}
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-[0.9375rem] font-bold">
                    <span className="text-ink-400">Step {i + 1}.</span> {s.title}
                  </h2>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-600">
                    {s.body}
                  </p>
                  {s.detail && (
                    <ul className="mt-3 space-y-1.5">
                      {s.detail.map((d) => (
                        <li
                          key={d.key}
                          className="flex items-center gap-2 font-mono text-[0.75rem]"
                        >
                          <span
                            className={
                              d.ok
                                ? "inline-block h-1.5 w-1.5 rounded-full bg-brand-600"
                                : "inline-block h-1.5 w-1.5 rounded-full bg-ink-300"
                            }
                          />
                          <span
                            className={d.ok ? "text-brand-800" : "text-ink-500"}
                          >
                            {d.key}
                          </span>
                          <span
                            className={
                              d.ok
                                ? "text-[0.6875rem] font-sans font-bold uppercase tracking-wider text-brand-700"
                                : "text-[0.6875rem] font-sans font-bold uppercase tracking-wider text-ink-400"
                            }
                          >
                            {d.ok ? "set" : "missing"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
          >
            Open Supabase dashboard
            <ExternalLink className="h-4 w-4" strokeWidth={2.3} />
          </a>
          <Link href="/admin/login" className="btn btn-outline">
            Go to sign in
          </Link>
        </div>

        <div className="mt-10 rounded-md border border-ink-200 bg-white p-6">
          <h2 className="font-display text-[1rem] font-bold">
            Deploying to Vercel
          </h2>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-600">
            Add the same three variables under Vercel &gt; Project &gt; Settings &gt;
            Environment Variables, plus{" "}
            <code className="font-mono text-[0.75rem]">NEXT_PUBLIC_SITE_URL</code>{" "}
            set to your production domain so canonical URLs, the sitemap and
            Open Graph tags resolve correctly. Redeploy after saving.
          </p>
        </div>
      </div>
    </div>
  );
}
