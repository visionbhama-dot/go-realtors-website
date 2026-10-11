import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Briefcase, CheckCircle2, Clock, MapPin } from "lucide-react";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getOpenings } from "@/lib/repo/content";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/careers",
    title: "Careers at GoRealtors | Real Estate Jobs in Gurugram",
    description: "Join GoRealtors in Gurugram. Open roles for property advisors, commercial investment analysts and digital marketing executives at a buyer-side real estate advisory.",
  });
}

const PERKS = [
  {
    title: "Advisory, not cold calling",
    body: "You work qualified inbound enquiries and referrals. We do not run a dialler floor.",
  },
  {
    title: "Transparent incentive structure",
    body: "Published slabs, no discretionary clawbacks, and payouts released on developer receipt without delay.",
  },
  {
    title: "Direct developer access",
    body: "Channel-partner relationships with 40+ developers means you quote live inventory, not stale portal data.",
  },
  {
    title: "Training that is actually technical",
    body: "Carpet versus super area, loading, HARERA compliance, yield modelling and lease structuring — taught properly.",
  },
  {
    title: "Own your clients",
    body: "No handoff to a closing team. You run the mandate from discovery call through registry.",
  },
  {
    title: "Small team, real ownership",
    body: "You will shape process rather than inherit it, and your work will be visible to the founder weekly.",
  },
];

export default async function CareersPage() {
  const openings = await getOpenings();

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build a career in advisory, not in broking"
        description="We are looking for people who would rather produce a defensible comparison sheet than close a unit on pressure. If that sounds like how you want to work, read on."
        crumbs={[{ label: "Careers" }]}
        image="/brand/cta-commercial.jpg"
        stats={[
          { value: String(openings.length), label: "Open roles" },
          { value: "Sector 83", label: "Office location" },
          { value: "On-site", label: "Work mode" },
          { value: SITE.stats.developers, label: "Developer partners" },
        ]}
      />

      {/* why work here */}
      <section className="shell py-14 lg:py-20">
        <SectionHeading
          eyebrow="Why GoRealtors"
          title="What working here actually looks like"
        />
        <div className="mt-9 grid gap-px bg-ink-200 sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p) => (
            <div key={p.title} className="bg-white p-6">
              <h3 className="font-display text-[0.9375rem] font-bold leading-snug">
                {p.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-600">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* openings */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow={`${openings.length} open ${openings.length === 1 ? "role" : "roles"}`}
            title="Current openings"
          />

          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
            <div className="space-y-6">
              {openings.map((job) => (
                <article
                  key={job.slug}
                  id={job.slug}
                  className="card scroll-mt-32 p-6 lg:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-[1.1875rem] font-bold">
                        {job.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.75rem] text-ink-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase
                            className="h-3.5 w-3.5 text-brand-600"
                            strokeWidth={2.3}
                          />
                          {job.department}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin
                            className="h-3.5 w-3.5 text-brand-600"
                            strokeWidth={2.3}
                          />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock
                            className="h-3.5 w-3.5 text-brand-600"
                            strokeWidth={2.3}
                          />
                          {job.employmentType}
                        </span>
                      </div>
                    </div>
                    {job.experience && (
                      <span className="badge bg-ink-950 text-white">
                        {job.experience}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-600">
                    {job.description}
                  </p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
                        What you&apos;ll do
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {job.responsibilities.map((r) => (
                          <li
                            key={r}
                            className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-700"
                          >
                            <CheckCircle2
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600"
                              strokeWidth={2.3}
                            />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
                        What we&apos;re looking for
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {job.requirements.map((r) => (
                          <li
                            key={r}
                            className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-700"
                          >
                            <CheckCircle2
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600"
                              strokeWidth={2.3}
                            />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href="#apply"
                    className="btn btn-primary btn-sm mt-6"
                  >
                    Apply for this role
                  </a>
                </article>
              ))}

              <div className="rounded-md border border-dashed border-ink-300 bg-white p-6">
                <h3 className="font-display text-[1rem] font-bold">
                  Don&apos;t see your role?
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">
                  We read every general application. If you are strong at
                  something we clearly need and have not advertised, tell us
                  what it is — we have created roles around good people before.
                </p>
              </div>
            </div>

            <aside id="apply" className="scroll-mt-32 lg:sticky lg:top-28 lg:self-start">
              <ApplicationForm
                openings={openings.map((o) => ({ slug: o.slug, title: o.title }))}
              />
              <p className="mt-4 text-center text-[0.75rem] text-ink-500">
                Or email your CV to{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  {SITE.email}
                </a>
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
