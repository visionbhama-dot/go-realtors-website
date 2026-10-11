import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ProjectCard } from "@/components/project/ProjectCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StickyCta } from "@/components/ui/StickyCta";
import { getAllProjects, getDevelopers } from "@/lib/repo/projects";
import { formatINR } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const developers = await getDevelopers();
  return developers.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const developers = await getDevelopers();
  const d = developers.find((x) => x.slug === slug);
  if (!d) return { title: "Developer not found" };

  return {
    title: `${d.name} Projects in Gurugram | Prices, Floor Plans & Reviews`,
    description: `${d.name} — ${d.description.slice(0, 150)}. Browse every ${d.short} project GoRealtors represents, with current pricing and availability.`,
    alternates: { canonical: `/developers/${d.slug}` },
  };
}

export default async function DeveloperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [developers, all] = await Promise.all([
    getDevelopers(),
    getAllProjects(),
  ]);

  const developer = developers.find((d) => d.slug === slug);
  if (!developer) notFound();

  const projects = all.filter((p) => p.developer === developer.name);
  const priced = projects.filter((p) => p.priceMin);
  const localities = [...new Set(projects.map((p) => p.locality))];
  const peers = developers
    .filter((d) => d.slug !== developer.slug)
    .filter((d) => all.some((p) => p.developer === d.name))
    .slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow="Developer profile"
        title={developer.name}
        description={developer.description}
        crumbs={[
          { label: "Developers", href: "/developers" },
          { label: developer.short },
        ]}
        image="/brand/band-residential.jpg"
        stats={[
          { value: String(projects.length), label: "Projects with us" },
          {
            value: priced.length
              ? formatINR(Math.min(...priced.map((p) => p.priceMin!)))
              : "On request",
            label: "Entry price",
          },
          { value: developer.established ?? "—", label: "Established" },
          { value: String(localities.length || "—"), label: "Corridors" },
        ]}
      />

      <section className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="About the developer"
              title={`What ${developer.short} is known for`}
            />
            <div className="prose-go mt-5">
              <p>{developer.description}</p>
              <p>
                When we evaluate a {developer.short} project for a client we
                look past the marketing at three things: the delivery record on
                previously launched phases, the HARERA quarterly progress
                filings against the committed construction schedule, and the
                carpet-area efficiency of the actual floor plates. Those three
                data points tell you more about outcome than any brochure.
              </p>
            </div>

            <div className="mt-8 rounded-md border border-ink-200 bg-ink-50/60 p-6">
              <h3 className="font-display text-[1rem] font-bold">
                Specialisation
              </h3>
              <ul className="mt-4 space-y-2.5">
                {developer.specialities.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-[0.875rem] text-ink-700"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      strokeWidth={2.2}
                    />
                    {s}
                  </li>
                ))}
              </ul>
              <dl className="mt-6 grid gap-4 border-t border-ink-200 pt-5 sm:grid-cols-2">
                <div>
                  <dt className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                    Headquarters
                  </dt>
                  <dd className="mt-0.5 text-[0.875rem] font-semibold text-ink-900">
                    {developer.headquarters}
                  </dd>
                </div>
                {developer.established && (
                  <div>
                    <dt className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                      Established
                    </dt>
                    <dd className="mt-0.5 text-[0.875rem] font-semibold text-ink-900">
                      {developer.established}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <EnquiryForm
              source={`developer:${developer.slug}`}
              heading={`Enquire about ${developer.short}`}
              subheading={`Get current pricing, inventory and payment plans across all ${developer.short} projects.`}
              compact
            />
            {localities.length > 0 && (
              <div className="card mt-5 p-5">
                <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
                  Active corridors
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {localities.map((l) => (
                    <Link
                      key={l}
                      href={`/locations/${l.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="chip"
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {projects.length > 0 ? (
        <section className="border-y border-ink-200 bg-ink-50/50 py-14 lg:py-20">
          <div className="shell">
            <SectionHeading
              eyebrow={`${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
              title={`${developer.name} projects we represent`}
              action={{
                label: "Open filtered search",
                href: `/projects?developer=${developer.slug}`,
              }}
            />
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} priority={i < 3} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="border-y border-ink-200 bg-ink-50/50 py-14">
          <div className="shell">
            <div className="card mx-auto max-w-2xl p-8 text-center">
              <h2 className="font-display text-[1.25rem] font-bold">
                No {developer.short} inventory listed right now
              </h2>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-600">
                {developer.name} is on our panel but we are not publishing
                availability publicly at the moment. Tell us what you are
                looking for and we will source current pricing and allocation
                directly from the developer.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="btn btn-primary">
                  Request availability
                </Link>
                <Link href="/projects" className="btn btn-outline">
                  Browse all projects
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {peers.length > 0 && (
        <section className="shell py-14 lg:py-20">
          <SectionHeading
            eyebrow="Compare developers"
            title="Other partners with live inventory"
            action={{ label: "All developers", href: "/developers" }}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {peers.map((d) => (
              <Link
                key={d.slug}
                href={`/developers/${d.slug}`}
                className="card card-hover group p-5"
              >
                <h3 className="font-display text-[0.9375rem] font-bold transition-colors group-hover:text-brand-700">
                  {d.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-600">
                  {d.specialities.join(" · ")}
                </p>
                <p className="mt-3.5 flex items-center justify-between border-t border-ink-100 pt-3 text-[0.75rem] font-bold text-ink-900">
                  {all.filter((p) => p.developer === d.name).length} projects
                  <ArrowRight
                    className="h-3.5 w-3.5 text-brand-600 transition-transform group-hover:translate-x-1"
                    strokeWidth={2.4}
                  />
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <StickyCta context={`${developer.name} projects`} />
    </>
  );
}
