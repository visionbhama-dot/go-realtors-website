import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { StickyCta } from "@/components/ui/StickyCta";
import { PROCESS_STEPS, SERVICES } from "@/data/content";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/services",
    title: "Property Advisory Services in Gurugram | GoRealtors",
    description: "Learn how GoRealtors can help you explore property options, compare projects, coordinate site visits and navigate the next steps within its service scope.",
  });
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Property Decisions Deserve More Than a Sales Pitch"
        description="A useful property search starts with your requirements. GoRealtors helps you identify relevant options, compare available information and plan the next step — across the full life of a decision, from shortlisting through diligence, negotiation, possession and eventually leasing or exit."
        crumbs={[{ label: "Services" }]}
        image="/brand/cta-commercial.jpg"
        stats={[
          { value: "8", label: "Service lines" },
          { value: "₹0", label: "Buyer brokerage" },
          { value: "6", label: "Step process" },
          { value: "12+", label: "Years in market" },
        ]}
      />

      <section className="shell py-14 lg:py-20">
        <SectionHeading
          eyebrow="What we do"
          title="Pick the mandate that fits your situation"
        />
        <div className="mt-9 grid gap-6 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <article key={s.slug} className="card card-hover flex flex-col p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[0.8125rem] font-extrabold text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-[1.125rem] font-bold leading-snug">
                  <Link
                    href={`/services/${s.slug}`}
                    className="transition-colors hover:text-brand-700"
                  >
                    {s.title}
                  </Link>
                </h2>
              </div>

              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-600">
                {s.summary}
              </p>

              <ul className="mt-5 flex-1 space-y-2">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-700"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      strokeWidth={2.2}
                    />
                    {p}
                  </li>
                ))}
              </ul>

              <Link
                href={`/services/${s.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 border-t border-ink-100 pt-4 text-[0.8125rem] font-bold text-brand-700 hover:underline"
              >
                Read more
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell">
          <SectionHeading
            align="center"
            eyebrow="How we work"
            title="The same six steps on every mandate"
          />
          <ol className="mt-11 grid gap-px bg-ink-200 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((s) => (
              <li key={s.step} className="bg-white p-7">
                <span className="font-display text-[2.5rem] font-extrabold leading-none text-ink-100">
                  {s.step}
                </span>
                <h3 className="mt-3 font-display text-[1rem] font-bold">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-600">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell py-14 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Transparency"
            title="How GoRealtors Is Compensated"
          />
          <div className="prose-go mx-auto mt-5 text-left">
            <p>
              On primary and new-launch transactions our fee is paid by the
              developer, which means our guidance costs you, the buyer, nothing.
              Before you proceed, we will always explain any fee, commission or
              commercial relationship relevant to your enquiry and transaction.
            </p>
            <p>
              Being paid by the developer does not change whose side we are on.
              The mandate we accept is yours — which is why we will tell you when
              a project does not stack up and advise you against it, even when
              that costs us a transaction.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Start here"
              title="Not sure which service you need?"
              description="Most people arrive with a budget and a vague sense of what they want. That is a perfectly good starting point — the discovery call exists to turn it into a brief."
            />
          </div>
          <EnquiryForm
            source="services-index"
            heading="Book a discovery call"
            compact
          />
        </div>
      </section>

      <StickyCta />
    </>
  );
}
