import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { ProjectCard } from "@/components/project/ProjectCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StickyCta } from "@/components/ui/StickyCta";
import { getAllProjects, getLocalities } from "@/lib/repo/projects";
import { formatINR } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const localities = await getLocalities();
  return localities.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const localities = await getLocalities();
  const l = localities.find((x) => x.slug === slug);
  if (!l) return { title: "Location not found" };

  return {
    title: `Property in ${l.name}, ${l.city} | Projects, Prices & Guide`,
    description: `${l.blurb} Current pricing ${l.priceBand} per sq.ft. Browse every residential and commercial project GoRealtors represents in ${l.name}.`,
    alternates: { canonical: `/locations/${l.slug}` },
  };
}

export default async function LocalityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [localities, all] = await Promise.all([
    getLocalities(),
    getAllProjects(),
  ]);

  const locality = localities.find((l) => l.slug === slug);
  if (!locality) notFound();

  const projects = all.filter((p) => p.locality === locality.name);
  const residential = projects.filter((p) => p.category === "residential");
  const commercial = projects.filter((p) => p.category === "commercial");
  const priced = projects.filter((p) => p.priceMin);
  const developers = [...new Set(projects.map((p) => p.developer))];
  const others = localities.filter((l) => l.slug !== locality.slug);

  return (
    <>
      <PageHero
        eyebrow={`${locality.city} corridor guide`}
        title={`Property in ${locality.name}`}
        description={locality.blurb}
        crumbs={[
          { label: "Locations", href: "/locations" },
          { label: locality.name },
        ]}
        image="/brand/hero-primary.jpg"
        stats={[
          { value: String(projects.length), label: "Live projects" },
          { value: locality.priceBand, label: "Price / sq.ft." },
          {
            value: priced.length
              ? formatINR(Math.min(...priced.map((p) => p.priceMin!)))
              : "On request",
            label: "Entry price",
          },
          { value: String(developers.length), label: "Developers" },
        ]}
      />

      <section className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The honest read"
              title={`What you need to know about ${locality.name}`}
            />
            <div className="prose-go mt-5">
              <p>{locality.description}</p>
            </div>

            <div className="mt-8 rounded-md border border-ink-200 bg-ink-50/60 p-6">
              <h3 className="flex items-center gap-2 font-display text-[1rem] font-bold">
                <TrendingUp className="h-4.5 w-4.5 text-brand-600" strokeWidth={2.2} />
                Why buyers choose this corridor
              </h3>
              <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {locality.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-700"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      strokeWidth={2.2}
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 overflow-hidden rounded-md border border-ink-200">
              <iframe
                title={`Map of ${locality.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${locality.name}, ${locality.city}, India`,
                )}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[21rem] w-full border-0"
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <EnquiryForm
              source={`locality:${locality.slug}`}
              heading={`Enquire about ${locality.name}`}
              subheading="We'll send current availability and pricing across every project in this corridor."
              compact
            />

            <div className="card mt-5 p-5">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
                Corridor snapshot
              </h3>
              <dl className="mt-3 divide-y divide-ink-100 text-[0.8125rem]">
                {[
                  ["City", locality.city],
                  ["Price / sq.ft.", locality.priceBand],
                  ["Outlook", locality.growth],
                  ["Residential", `${residential.length} projects`],
                  ["Commercial", `${commercial.length} projects`],
                  ["Developers active", String(developers.length)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 py-2">
                    <dt className="text-ink-500">{k}</dt>
                    <dd className="text-right font-semibold text-ink-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {developers.length > 0 && (
              <div className="card mt-5 p-5">
                <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
                  Developers here
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {developers.map((d) => (
                    <Link
                      key={d}
                      href={`/developers/${d.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="chip"
                    >
                      {d}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* projects */}
      {projects.length > 0 && (
        <section className="border-y border-ink-200 bg-ink-50/50 py-14 lg:py-20">
          <div className="shell">
            <SectionHeading
              eyebrow={`${projects.length} projects`}
              title={`Projects in ${locality.name}`}
              action={{ label: "Open filtered search", href: `/projects?locality=${locality.slug}` }}
            />
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} priority={i < 3} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* other corridors */}
      <section className="shell py-14 lg:py-20">
        <SectionHeading
          eyebrow="Compare alternatives"
          title="Other corridors worth considering"
          action={{ label: "All locations", href: "/locations" }}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((l) => (
            <Link
              key={l.slug}
              href={`/locations/${l.slug}`}
              className="card card-hover group p-5"
            >
              <h3 className="font-display text-[0.9375rem] font-bold transition-colors group-hover:text-brand-700">
                {l.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-600">
                {l.blurb}
              </p>
              <p className="mt-3.5 flex items-center justify-between border-t border-ink-100 pt-3 text-[0.75rem]">
                <span className="font-bold text-ink-900">{l.priceBand}</span>
                <ArrowRight
                  className="h-3.5 w-3.5 text-brand-600 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <StickyCta context={`property in ${locality.name}`} />
    </>
  );
}
