import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ArrowRight, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { StickyCta } from "@/components/ui/StickyCta";
import { getFacetCounts, getLocalities } from "@/lib/repo/projects";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/locations",
    title: "Property Locations in Gurugram | Corridor & Micro-Market Guides",
    description: "Compare Gurugram's property corridors — Dwarka Expressway, Golf Course Road, Golf Course Extension Road, Sohna Road, New Gurgaon and Dwarka Delhi — on pricing, infrastructure and growth outlook.",
  });
}

export default async function LocationsPage() {
  const [localities, facets] = await Promise.all([
    getLocalities(),
    getFacetCounts(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Micro-markets"
        title="In Gurugram, the corridor does most of the work"
        description="Project selection matters, but corridor selection matters more. These are the six micro-markets we transact in, compared honestly on what you pay, what you get and what is likely to happen next."
        crumbs={[{ label: "Locations" }]}
        image="/brand/hero-primary.jpg"
        stats={[
          { value: String(localities.length), label: "Corridors covered" },
          { value: String(facets.total), label: "Live projects" },
          { value: "₹8.5K - ₹45K", label: "Price / sq.ft. range" },
          { value: "2", label: "Cities" },
        ]}
      />

      {/* comparison table */}
      <section className="shell py-14 lg:py-20">
        <SectionHeading
          eyebrow="Side by side"
          title="Corridor comparison at a glance"
          description="Price bands reflect current primary-market asking rates for premium inventory. Actual achievable pricing varies by project, tower and floor."
        />
        <div className="mt-8 overflow-x-auto rounded-md border border-ink-200">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr className="bg-ink-950 text-white">
                {["Corridor", "City", "Price / sq.ft.", "Projects", "Outlook", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[0.6875rem] font-bold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {localities.map((l) => (
                <tr key={l.slug} className="bg-white hover:bg-brand-50/40">
                  <td className="px-4 py-4">
                    <Link
                      href={`/locations/${l.slug}`}
                      className="font-display text-[0.9375rem] font-bold text-ink-950 hover:text-brand-700"
                    >
                      {l.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-[0.8125rem] text-ink-600">
                    {l.city}
                  </td>
                  <td className="px-4 py-4 text-[0.875rem] font-bold text-ink-900">
                    {l.priceBand}
                  </td>
                  <td className="px-4 py-4 text-[0.875rem] font-semibold tabular-nums text-ink-700">
                    {facets.byLocality.get(l.name) ?? 0}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-brand-700">
                      <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.3} />
                      {l.growth}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/locations/${l.slug}`}
                      className="inline-flex items-center gap-1 text-[0.75rem] font-bold text-brand-700 hover:underline"
                    >
                      Guide
                      <ArrowRight className="h-3 w-3" strokeWidth={2.6} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* detail cards */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Corridor guides"
            title="Read before you shortlist a project"
          />
          <div className="mt-9 grid gap-6 lg:grid-cols-2">
            {localities.map((l) => (
              <article key={l.slug} className="card card-hover flex flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-[1.125rem] font-bold">
                      <Link
                        href={`/locations/${l.slug}`}
                        className="transition-colors hover:text-brand-700"
                      >
                        {l.name}
                      </Link>
                    </h3>
                    <p className="mt-0.5 text-[0.75rem] text-ink-400">{l.city}</p>
                  </div>
                  <span className="badge shrink-0 bg-ink-950 text-white">
                    {facets.byLocality.get(l.name) ?? 0} projects
                  </span>
                </div>

                <p className="mt-3.5 text-[0.875rem] leading-relaxed text-ink-600">
                  {l.blurb}
                </p>

                <ul className="mt-5 space-y-2">
                  {l.highlights.slice(0, 4).map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-700"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-600"
                      />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-end justify-between border-t border-ink-100 pt-4">
                  <div>
                    <p className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                      Price / sq.ft.
                    </p>
                    <p className="mt-0.5 font-display text-[1rem] font-bold">
                      {l.priceBand}
                    </p>
                  </div>
                  <Link
                    href={`/locations/${l.slug}`}
                    className="btn btn-outline btn-sm"
                  >
                    Full guide
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Not sure which corridor?"
              title="Tell us how you live, and we'll tell you where to buy"
              description="Commute, schools, holding period and financing all point to different corridors. A twenty-minute call usually narrows six options down to two."
            />
          </div>
          <EnquiryForm
            source="locations-index"
            heading="Get a corridor recommendation"
            compact
          />
        </div>
      </section>

      <StickyCta />
    </>
  );
}
