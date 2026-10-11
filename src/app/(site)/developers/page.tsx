import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ArrowRight, Building2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { StickyCta } from "@/components/ui/StickyCta";
import { getDevelopers, getFacetCounts } from "@/lib/repo/projects";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/developers",
    title: "Real Estate Developers in Gurugram | Our Channel Partners",
    description: "GoRealtors is an authorised channel partner for Godrej Properties, M3M, Sobha, Elan, Smartworld, SS Group, AIPL, BPTP, Reach, Omaxe and more across Gurugram and Delhi.",
  });
}

export default async function DevelopersPage() {
  const [developers, facets] = await Promise.all([
    getDevelopers(),
    getFacetCounts(),
  ]);

  const withProjects = developers.filter(
    (d) => (facets.byDeveloper.get(d.name) ?? 0) > 0,
  );
  const others = developers.filter(
    (d) => (facets.byDeveloper.get(d.name) ?? 0) === 0,
  );

  return (
    <>
      <PageHero
        eyebrow="Developer partners"
        title="We work directly with the developers, so you get live inventory"
        description="Channel-partner status means we quote from actual allocation sheets rather than stale listing data — and we negotiate from a position of transaction volume rather than as a one-off buyer."
        crumbs={[{ label: "Developers" }]}
        image="/brand/band-residential.jpg"
        stats={[
          { value: `${developers.length}+`, label: "Developer partners" },
          { value: String(facets.total), label: "Live projects" },
          { value: "Direct", label: "Allocation access" },
          { value: "₹0", label: "Buyer brokerage" },
        ]}
      />

      <section className="shell py-14 lg:py-20">
        <SectionHeading
          eyebrow="Active inventory"
          title="Developers with projects we currently represent"
          description="Click through for the developer's track record, specialisation and every project of theirs on our books."
        />
        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {withProjects.map((d) => (
            <article key={d.slug} className="card card-hover flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-ink-950 font-display text-[0.8125rem] font-extrabold text-brand-400">
                  {d.short.slice(0, 3).toUpperCase()}
                </span>
                <span className="badge bg-brand-50 text-brand-800">
                  {facets.byDeveloper.get(d.name)}{" "}
                  {facets.byDeveloper.get(d.name) === 1 ? "project" : "projects"}
                </span>
              </div>

              <h3 className="mt-4 font-display text-[1.0625rem] font-bold leading-snug">
                <Link
                  href={`/developers/${d.slug}`}
                  className="transition-colors hover:text-brand-700"
                >
                  {d.name}
                </Link>
              </h3>
              <p className="mt-1 text-[0.75rem] text-ink-400">
                {d.established ? `Est. ${d.established} · ` : ""}
                {d.headquarters}
              </p>

              <p className="mt-3.5 line-clamp-4 flex-1 text-[0.8125rem] leading-relaxed text-ink-600">
                {d.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {d.specialities.slice(0, 2).map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>

              <Link
                href={`/developers/${d.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 border-t border-ink-100 pt-4 text-[0.8125rem] font-bold text-brand-700 hover:underline"
              >
                View projects
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-y border-ink-200 bg-ink-50/50 py-14">
          <div className="shell">
            <SectionHeading
              eyebrow="Also on our panel"
              title="Developers we transact with on request"
              description="No inventory from these partners is listed publicly right now, but we can source current availability on request."
            />
            <div className="mt-8 grid gap-px bg-ink-200 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((d) => (
                <Link
                  key={d.slug}
                  href={`/developers/${d.slug}`}
                  className="group flex items-start gap-3 bg-white p-5 transition-colors hover:bg-brand-50/60"
                >
                  <Building2
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600"
                    strokeWidth={2.2}
                  />
                  <span>
                    <span className="block text-[0.875rem] font-bold text-ink-950 group-hover:text-brand-800">
                      {d.name}
                    </span>
                    <span className="mt-0.5 block text-[0.75rem] text-ink-500">
                      {d.specialities[0]}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="shell py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Looking for something specific?"
              title="Ask us about any developer, including ones not listed here"
              description="Our panel extends well beyond what we publish. If you have a particular developer or project in mind, we can almost always get you current pricing and allocation."
            />
          </div>
          <EnquiryForm
            source="developers-index"
            heading="Ask about a developer"
            compact
            showBudget={false}
          />
        </div>
      </section>

      <StickyCta />
    </>
  );
}
