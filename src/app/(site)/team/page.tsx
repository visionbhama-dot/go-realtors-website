import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ArrowRight, Briefcase, Mail, Phone, UserPlus } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { StickyCta } from "@/components/ui/StickyCta";
import { getOpenings, getTeam } from "@/lib/repo/content";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/team",
    title: "Our Team | GoRealtors Property Advisors, Gurugram",
    description: "Meet the advisory team behind GoRealtors — property consultants covering luxury residential, commercial investment and NRI mandates across Gurugram.",
  });
}

export default async function TeamPage() {
  const [team, openings] = await Promise.all([getTeam(), getOpenings()]);

  return (
    <>
      <PageHero
        eyebrow="The team"
        title="You will deal with one advisor, from first call to registry"
        description="No closing team, no handoffs, no being passed to someone who has never seen your file. The person who takes your enquiry owns it through possession."
        crumbs={[{ label: "Team" }]}
        image="/brand/band-residential.jpg"
        size="compact"
      />

      <section className="shell py-14 lg:py-20">
        <SectionHeading
          eyebrow="Advisory team"
          title="Who you'll be working with"
        />

        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <article key={m.slug} className="card flex flex-col p-6">
              <div className="flex items-start gap-4">
                {m.photoUrl ? (
                  <Image
                    src={m.photoUrl}
                    alt={`${m.name} — ${m.role}`}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-sm object-cover object-top"
                  />
                ) : (
                  <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-ink-950 font-display text-[1.125rem] font-extrabold text-brand-400">
                    {m.initials}
                  </span>
                )}
                <div className="min-w-0">
                  <h2 className="font-display text-[1.0625rem] font-bold leading-snug">
                    {m.name}
                  </h2>
                  <p className="mt-0.5 text-[0.8125rem] font-semibold text-brand-700">
                    {m.role}
                  </p>
                </div>
              </div>

              <p className="mt-4 flex-1 text-[0.8125rem] leading-relaxed text-ink-600">
                {m.bio}
              </p>

              {m.focus && (
                <p className="mt-4 flex items-start gap-2 text-[0.75rem] text-ink-500">
                  <Briefcase
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600"
                    strokeWidth={2.3}
                  />
                  {m.focus}
                </p>
              )}

              {(m.email || m.phone) && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
                  {m.phone && (
                    <a
                      href={`tel:${m.phone}`}
                      className="btn btn-outline btn-sm"
                    >
                      <Phone className="h-3.5 w-3.5" strokeWidth={2.3} />
                      Call
                    </a>
                  )}
                  {m.email && (
                    <a
                      href={`mailto:${m.email}`}
                      className="btn btn-outline btn-sm"
                    >
                      <Mail className="h-3.5 w-3.5" strokeWidth={2.3} />
                      Email
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}

          {/* we're hiring card */}
          <article className="flex flex-col justify-between rounded-md border-2 border-dashed border-ink-300 bg-ink-50/50 p-6">
            <div>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-sm bg-brand-600 text-white">
                <UserPlus className="h-6 w-6" strokeWidth={2.1} />
              </span>
              <h2 className="mt-4 font-display text-[1.0625rem] font-bold leading-snug">
                We&apos;re growing the advisory bench
              </h2>
              <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-600">
                {openings.length} open{" "}
                {openings.length === 1 ? "role" : "roles"} across sales,
                investment analysis and marketing. If you believe real estate
                advice should be written down and defensible, we should talk.
              </p>
            </div>
            <Link href="/careers" className="btn btn-dark mt-6 w-full">
              View open roles
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
          </article>
        </div>
      </section>

      <section className="border-y border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Get in touch"
              title="Want to be matched with the right advisor?"
              description="Tell us whether you're looking at residential, commercial or an SCO plot, and we'll put you with whoever transacts most in that corridor."
            />
            <div className="mt-7 space-y-3 text-[0.875rem]">
              <a
                href={`tel:${SITE.phone}`}
                className="flex items-center gap-2.5 font-semibold text-ink-900 hover:text-brand-700"
              >
                <Phone className="h-4 w-4 text-brand-600" strokeWidth={2.3} />
                {SITE.phoneDisplay}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2.5 text-ink-700 hover:text-brand-700"
              >
                <Mail className="h-4 w-4 text-brand-600" strokeWidth={2.3} />
                {SITE.email}
              </a>
              <p className="text-[0.8125rem] text-ink-500">{SITE.hours}</p>
            </div>
          </div>
          <EnquiryForm source="team" heading="Request a call back" compact />
        </div>
      </section>

      <StickyCta />
    </>
  );
}
