import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SearchX } from "lucide-react";
import { ProjectCard } from "@/components/project/ProjectCard";
import { ProjectFilters, type Facets } from "@/components/project/ProjectFilters";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/ui/PageHero";
import { StickyCta } from "@/components/ui/StickyCta";
import { filterProjects, getAllProjects, toSlug } from "@/lib/repo/projects";
import { STATUS_LABEL } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/projects",
    title: "Property Projects in Gurugram | GoRealtors",
    description: "Explore property projects across Gurugram. Filter by location, property type, budget, configuration and project status to build a relevant shortlist.",
  });
}

const PER_PAGE = 12;

type SP = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const all = await getAllProjects();

  const filters = {
    q: one(sp.q),
    category: one(sp.category),
    locality: one(sp.locality),
    developer: one(sp.developer),
    status: one(sp.status),
    propertyType: one(sp.propertyType),
    bhk: one(sp.bhk),
    minPrice: one(sp.minPrice) ? Number(one(sp.minPrice)) : undefined,
    maxPrice: one(sp.maxPrice) ? Number(one(sp.maxPrice)) : undefined,
    sort: one(sp.sort),
  };

  const results = filterProjects(all, filters);
  const page = Math.max(1, Number(one(sp.page) ?? 1));
  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const facets = buildFacets(all);

  const qs = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    Object.entries(sp).forEach(([k, v]) => {
      const val = one(v);
      if (val) p.set(k, val);
    });
    Object.entries(overrides).forEach(([k, v]) =>
      v ? p.set(k, v) : p.delete(k),
    );
    const s = p.toString();
    return s ? `/projects?${s}` : "/projects";
  };

  return (
    <>
      <PageHero
        size="compact"
        eyebrow="Project directory"
        title="Explore Property Projects Across Gurugram"
        description="Browse residential and commercial opportunities across selected locations in Gurugram. Use the filters to narrow the list, review project details, and contact an advisor when you need help comparing options. Prices shown are indicative and exclude GST, stamp duty and registration — confirm current details before deciding."
        crumbs={[{ label: "Projects" }]}
        image="/brand/band-residential.jpg"
      />

      <section className="shell py-10 lg:py-14">
        <ProjectFilters
          facets={facets}
          total={all.length}
          showing={results.length}
        >
          <div>
            {slice.length === 0 ? (
              <div className="card flex flex-col items-center px-6 py-16 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                  <SearchX className="h-6 w-6" strokeWidth={2} />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold">
                  No projects match those filters
                </h2>
                <p className="mt-2 max-w-sm text-[0.875rem] text-ink-600">
                  Try widening your budget or clearing a filter. Or tell us what
                  you&apos;re after and we&apos;ll source it off-market.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href="/projects" className="btn btn-outline">
                    Clear all filters
                  </Link>
                  <Link href="/contact" className="btn btn-primary">
                    Tell us your requirement
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {slice.map((p, i) => (
                    <ProjectCard key={p.slug} project={p} priority={i < 3} />
                  ))}
                </div>

                {pages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="mt-10 flex items-center justify-center gap-1.5"
                  >
                    {current > 1 && (
                      <Link
                        href={qs({ page: String(current - 1) })}
                        className="btn btn-outline btn-sm"
                        rel="prev"
                      >
                        Previous
                      </Link>
                    )}
                    {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                      <Link
                        key={n}
                        href={qs({ page: n === 1 ? undefined : String(n) })}
                        aria-current={n === current ? "page" : undefined}
                        className={
                          n === current
                            ? "inline-flex h-9 min-w-9 items-center justify-center rounded-sm bg-ink-950 px-3 text-[0.8125rem] font-bold text-white"
                            : "inline-flex h-9 min-w-9 items-center justify-center rounded-sm border border-ink-200 px-3 text-[0.8125rem] font-semibold text-ink-700 hover:border-ink-950"
                        }
                      >
                        {n}
                      </Link>
                    ))}
                    {current < pages && (
                      <Link
                        href={qs({ page: String(current + 1) })}
                        className="btn btn-outline btn-sm"
                        rel="next"
                      >
                        Next
                      </Link>
                    )}
                  </nav>
                )}
              </>
            )}

            <div className="mt-12 rounded-md border border-ink-200 bg-ink-50/60 p-6 lg:p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-center">
                <div>
                  <h2 className="font-display text-[1.25rem] font-bold leading-snug">
                    Not finding the right fit?
                  </h2>
                  <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-600">
                    A meaningful share of what we transact never reaches a
                    listing page — pre-launch allocations, distressed resale and
                    off-market commercial. Tell us the brief and we&apos;ll
                    revert with options plus a written comparison of carpet
                    area, loading and all-in cost.
                  </p>
                </div>
                <EnquiryForm
                  source="projects-directory"
                  compact
                  showBudget
                  showRequirement={false}
                />
              </div>
            </div>
          </div>
        </ProjectFilters>
      </section>

      <StickyCta />
    </>
  );
}

function buildFacets(all: Awaited<ReturnType<typeof getAllProjects>>): Facets {
  const tally = (pick: (p: (typeof all)[number]) => string) => {
    const m = new Map<string, number>();
    all.forEach((p) => {
      const v = pick(p);
      if (v) m.set(v, (m.get(v) ?? 0) + 1);
    });
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ slug: toSlug(name), name, count }));
  };

  const statusOrder = [
    "new-launch",
    "under-construction",
    "ready-to-move",
    "sold-out",
  ];

  const statuses = statusOrder
    .map((s) => ({
      slug: s,
      name: STATUS_LABEL[s]!,
      count: all.filter((p) => p.status === s).length,
    }))
    .filter((s) => s.count > 0);

  return {
    localities: tally((p) => p.locality),
    developers: tally((p) => p.developer),
    propertyTypes: tally((p) => p.propertyType),
    statuses,
  };
}
