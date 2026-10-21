import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ArrowRight, Quote, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { StickyCta } from "@/components/ui/StickyCta";
import { PROCESS_STEPS, SERVICES, WHY_CHOOSE } from "@/data/content";
import { getAllProjects, getDevelopers } from "@/lib/repo/projects";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/about",
    title: "About GoRealtors | Real Estate Consultancy in Gurugram",
    description: "Learn about GoRealtors, its approach to property discovery, project comparison and buyer guidance in Gurugram.",
  });
}

const VALUES = [
  {
    title: "Disclosure over persuasion",
    body: "If a project has a weakness — thin carpet efficiency, an aggressive possession date, a developer with a patchy delivery record — you hear it from us before you hear it from the market.",
  },
  {
    title: "Written, not verbal",
    body: "Comparison sheets, yield models and diligence summaries are produced in writing. Advice you cannot interrogate is not advice.",
  },
  {
    title: "No lender kickbacks",
    body: "We do not take referral commissions from banks or housing finance companies, which is why our loan recommendations are not shaped around who pays us.",
  },
  {
    title: "The long game",
    body: "A client who does not transact this year but transacts correctly next year is worth far more to this business than a commission booked today.",
  },
];

export default async function AboutPage() {
  const [projects, developers] = await Promise.all([
    getAllProjects(),
    getDevelopers(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Real Estate Guidance Built Around Your Requirements"
        description="Property decisions involve competing priorities, complex information and significant financial commitments. GoRealtors helps you explore relevant opportunities and organise the questions that matter before taking the next step — representing the buyer's side of the table, with the reasoning in writing."
        crumbs={[{ label: "About" }]}
        image="/brand/hero-primary.jpg"
        stats={[
          { value: SITE.stats.years, label: "Years in the market" },
          { value: SITE.stats.unitsAdvised, label: "Families advised" },
          { value: SITE.stats.gmv, label: "Transaction value" },
          { value: `${developers.length}+`, label: "Developer partners" },
        ]}
      />

      {/* story */}
      <section className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Our story" title="Why we started" />
            <div className="prose-go mt-5">
              <p>
                Gurugram is one of the most competitive real estate markets in
                India, and one of the hardest to buy in well. At any given
                moment there are hundreds of towers under construction across a
                dozen corridors, quoted in super area, bundled with charges that
                are easy to miss, and marketed with possession dates that are
                sometimes aspirational.
              </p>
              <p>
                Most buyers meet this market through a site office or a listing
                portal. Both are structurally incentivised to close the unit in
                front of you rather than to find the right one. The buyer ends
                up doing their own due diligence on the largest purchase of
                their life, using a brochure as the primary data source.
              </p>
              <p>
                <strong>
                  GoRealtors exists to sit on the other side of that table.
                </strong>{" "}
                We are compensated by developers on primary transactions — which
                means our advice costs the buyer nothing — but the mandate we
                accept is the buyer&apos;s. That means saying no to projects,
                flagging loading percentages that look unreasonable, and
                occasionally telling someone that the right move this year is
                not to buy at all.
              </p>
              <p>
                Today we advise across six corridors in Gurugram plus select
                commercial assets in Dwarka, with {projects.length} live
                projects on our books and direct allocation relationships with{" "}
                {developers.length}+ developers. Most of our business arrives by
                referral, which we treat as the only meaningful scorecard.
              </p>
            </div>

            <figure className="mt-10 border-l-2 border-brand-500 pl-6">
              <Quote className="h-6 w-6 text-brand-500" strokeWidth={2} />
              <blockquote className="mt-3 font-display text-[1.125rem] font-semibold leading-relaxed text-ink-900">
                We would rather lose a commission than lose the referral that
                follows a client who was advised honestly.
              </blockquote>
              <figcaption className="mt-3 text-[0.8125rem] text-ink-500">
                Tarun Gaur — Founder & Managing Director, GoRealtors
              </figcaption>
            </figure>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-ink-900">
              <Image
                src="/brand/band-residential.jpg"
                alt="Residential development in Gurugram"
                fill
                sizes="(max-width:1024px) 100vw, 34rem"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-brand-400">
                  Registered office
                </p>
                <p className="mt-2 text-[0.875rem] font-semibold leading-relaxed text-white">
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}, {SITE.address.city}
                  <br />
                  {SITE.address.state} {SITE.address.postalCode}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-[0.75rem] text-white/60">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.3} />
                  {SITE.rera}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* values */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="How we operate"
            title="Four commitments we don't bend on"
          />
          <div className="mt-9 grid gap-px bg-ink-200 md:grid-cols-2">
            {VALUES.map((v, i) => (
              <div key={v.title} className="bg-white p-7">
                <span className="font-display text-[0.8125rem] font-extrabold text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2.5 font-display text-[1.0625rem] font-bold leading-snug">
                  {v.title}
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-600">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* differentiators */}
      <section className="shell py-14 lg:py-20">
        <SectionHeading
          eyebrow="What changes for you"
          title="The practical difference in working with us"
        />
        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((w) => (
            <div key={w.title} className="card p-6">
              <h3 className="font-display text-[0.9375rem] font-bold leading-snug">
                {w.title}
              </h3>
              <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-600">
                {w.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* process */}
      <section className="bg-ink-950 py-14 lg:py-20">
        <div className="shell">
          <SectionHeading
            tone="dark"
            eyebrow="Engagement model"
            title="Six steps, every single time"
            description="The process does not change with ticket size. A ₹1.2 crore apartment gets the same diligence as a ₹20 crore commercial floor."
          />
          <ol className="mt-11 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((s) => (
              <li key={s.step} className="bg-ink-950 p-7">
                <span className="font-display text-[2.25rem] font-extrabold leading-none text-white/12">
                  {s.step}
                </span>
                <h3 className="mt-3 font-display text-[1rem] font-bold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-white/60">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* services + cta */}
      <section className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Capabilities"
              title="Eight mandates under one roof"
              action={{ label: "All services", href: "/services" }}
            />
            <ul className="mt-8 grid gap-px bg-ink-200 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex h-full flex-col bg-white p-5 transition-colors hover:bg-brand-50/60"
                  >
                    <span className="font-display text-[0.9375rem] font-bold group-hover:text-brand-800">
                      {s.title}
                    </span>
                    <span className="mt-1.5 flex-1 text-[0.8125rem] leading-relaxed text-ink-600">
                      {s.summary}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-[0.75rem] font-bold text-brand-700">
                      Learn more
                      <ArrowRight
                        className="h-3 w-3 transition-transform group-hover:translate-x-1"
                        strokeWidth={2.6}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <EnquiryForm
              source="about"
              heading="Talk to the founder"
              subheading="Luxury residential, commercial and NRI mandates are handled personally. Leave your details and you'll get a call back."
              compact
            />
            <div className="card mt-5 p-5">
              <h3 className="font-display text-[0.9375rem] font-bold">
                Prefer to read more first?
              </h3>
              <div className="mt-3 space-y-1">
                {[
                  { label: "Meet the team", href: "/team" },
                  { label: "Market insights", href: "/blog" },
                  { label: "Buyer FAQs", href: "/faqs" },
                  { label: "Careers at GoRealtors", href: "/careers" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-[0.8125rem] text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
                  >
                    {l.label}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <StickyCta />
    </>
  );
}
