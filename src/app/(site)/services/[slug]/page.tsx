import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StickyCta } from "@/components/ui/StickyCta";
import { PROCESS_STEPS, SERVICES } from "@/data/content";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return { title: "Service not found" };
  return {
    title: `${s.title} in Gurugram | GoRealtors`,
    description: s.summary,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.summary}
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
        image="/brand/cta-commercial.jpg"
        size="compact"
      />

      <section className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="What's included"
              title={`How our ${service.title.toLowerCase()} mandate works`}
            />

            <ul className="mt-7 grid gap-px bg-ink-200 sm:grid-cols-2">
              {service.points.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2.5 bg-white p-5 text-[0.875rem] leading-relaxed text-ink-700"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600"
                    strokeWidth={2.2}
                  />
                  {p}
                </li>
              ))}
            </ul>

            <div className="prose-go mt-10">
              <h2>What you should expect from us</h2>
              <p>
                Every mandate starts with a discovery call rather than a site
                visit. We would rather spend thirty minutes understanding your
                constraints than three hours walking you through projects that
                were never going to fit.
              </p>
              <p>
                From there you receive written work — a comparison sheet, a
                yield model or a diligence summary depending on the mandate.
                Nothing we recommend arrives as a verbal assurance, because the
                point of advisory is that you can interrogate the reasoning.
              </p>
              <p>
                You will deal with one advisor throughout. The person who takes
                your first call handles your site visits, your negotiation, your
                paperwork and your possession. There are no handoffs to a
                closing team.
              </p>
              <h2>Fees and how we are paid</h2>
              <p>
                On primary and new-launch transactions our fee is paid by the
                developer, so our advisory costs you nothing on the buy side and
                does not inflate the price you pay. For resale mandates,
                leasing, property management and standalone diligence work a
                fee applies, and it is disclosed in writing before any
                engagement begins.
              </p>
              <p>
                We do not accept referral commissions from lenders, so our home
                loan recommendations are not biased toward a particular bank.
              </p>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-[1.25rem] font-bold">
                The process
              </h2>
              <ol className="mt-5 space-y-5">
                {PROCESS_STEPS.map((s) => (
                  <li key={s.step} className="flex gap-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-ink-950 text-[0.75rem] font-extrabold text-brand-400">
                      {s.step}
                    </span>
                    <div>
                      <p className="font-display text-[0.9375rem] font-bold">
                        {s.title}
                      </p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-600">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <EnquiryForm
              source={`service:${service.slug}`}
              heading={`Enquire about ${service.title}`}
              subheading="Tell us the brief and we'll come back with a scope and next steps."
              compact
            />
            <div className="card mt-5 p-5">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
                Other services
              </h3>
              <ul className="mt-3 space-y-1">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-[0.8125rem] text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
                    >
                      {s.title}
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <StickyCta context={service.title} />
    </>
  );
}
