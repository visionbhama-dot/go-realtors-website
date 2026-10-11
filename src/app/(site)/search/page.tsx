import Link from "next/link";
import type { Metadata } from "next";
import { Search, SearchX } from "lucide-react";
import { ProjectCard } from "@/components/project/ProjectCard";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { filterProjects, getAllProjects, getDevelopers, getLocalities } from "@/lib/repo/projects";
import { getPosts } from "@/lib/repo/content";

export const metadata: Metadata = {
  title: "Search Properties in Gurugram | GoRealtors",
  description:
    "Search every project, developer, corridor and market insight on GoRealtors. Find property in Gurugram by name, sector, developer or budget.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

type SP = Record<string, string | string[] | undefined>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim() ?? "";

  const [all, posts, developers, localities] = await Promise.all([
    getAllProjects(),
    getPosts(),
    getDevelopers(),
    getLocalities(),
  ]);

  const needle = q.toLowerCase();
  const projectHits = q ? filterProjects(all, { q }) : [];
  const postHits = q
    ? posts.filter((p) =>
        `${p.title} ${p.excerpt} ${p.category} ${p.tags.join(" ")}`
          .toLowerCase()
          .includes(needle),
      )
    : [];
  const devHits = q
    ? developers.filter((d) =>
        `${d.name} ${d.short} ${d.specialities.join(" ")}`
          .toLowerCase()
          .includes(needle),
      )
    : [];
  const locHits = q
    ? localities.filter((l) =>
        `${l.name} ${l.city} ${l.blurb}`.toLowerCase().includes(needle),
      )
    : [];

  const totalHits =
    projectHits.length + postHits.length + devHits.length + locHits.length;

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={q ? `Results for "${q}"` : "Search GoRealtors"}
        description={
          q
            ? `${totalHits} ${totalHits === 1 ? "match" : "matches"} across projects, developers, corridors and insights.`
            : "Search by project name, developer, sector or corridor — or jump straight into the filtered project directory."
        }
        crumbs={[{ label: "Search" }]}
        image="/brand/hero-primary.jpg"
        size="compact"
      >
        <form action="/search" method="get" className="mt-7 max-w-2xl">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                strokeWidth={2.2}
              />
              <label htmlFor="site-search" className="sr-only">
                Search
              </label>
              <input
                id="site-search"
                name="q"
                defaultValue={q}
                placeholder="Try “Dwarka Expressway”, “Godrej” or “SCO”"
                className="field h-12 pl-10 text-[0.9375rem]"
              />
            </div>
            <button type="submit" className="btn btn-primary h-12 px-7">
              Search
            </button>
          </div>
        </form>
      </PageHero>

      <section className="shell py-12 lg:py-16">
        {!q ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_21rem] lg:gap-14">
            <div>
              <SectionHeading
                eyebrow="Popular searches"
                title="Jump straight in"
              />
              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  { label: "All projects", href: "/projects" },
                  { label: "New launches", href: "/projects?status=new-launch" },
                  { label: "Under ₹3 Cr", href: "/projects?maxPrice=30000000" },
                  { label: "3 BHK apartments", href: "/projects?bhk=3" },
                  { label: "4 BHK apartments", href: "/projects?bhk=4" },
                  { label: "SCO plots", href: "/projects?propertyType=sco-plots" },
                  { label: "Commercial retail", href: "/commercial" },
                  { label: "Dwarka Expressway", href: "/locations/dwarka-expressway" },
                  { label: "Golf Course Road", href: "/locations/golf-course-road" },
                  { label: "New Gurgaon", href: "/locations/new-gurgaon" },
                ].map((s) => (
                  <Link key={s.href} href={s.href} className="chip">
                    {s.label}
                  </Link>
                ))}
              </div>

              <SectionHeading
                className="mt-12"
                eyebrow="Browse by developer"
                title="Developer directory"
                action={{ label: "All developers", href: "/developers" }}
              />
              <div className="mt-7 flex flex-wrap gap-2">
                {developers.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/developers/${d.slug}`}
                    className="chip"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            </div>
            <EnquiryForm
              source="search-empty"
              heading="Or just tell us what you want"
              subheading="A lot of our inventory never reaches a listing page."
              compact
            />
          </div>
        ) : totalHits === 0 ? (
          <div className="card mx-auto max-w-xl p-12 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-500">
              <SearchX className="h-6 w-6" strokeWidth={2} />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold">
              Nothing matched &ldquo;{q}&rdquo;
            </h2>
            <p className="mt-2 text-[0.875rem] text-ink-600">
              Try a shorter term — a sector number, a developer name or a
              corridor. Or tell us what you&apos;re looking for directly.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/projects" className="btn btn-outline">
                Browse all projects
              </Link>
              <Link href="/contact" className="btn btn-primary">
                Ask an advisor
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-14">
            {projectHits.length > 0 && (
              <div>
                <SectionHeading
                  eyebrow={`${projectHits.length} ${projectHits.length === 1 ? "project" : "projects"}`}
                  title="Projects"
                  action={{
                    label: "Open in directory",
                    href: `/projects?q=${encodeURIComponent(q)}`,
                  }}
                />
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {projectHits.slice(0, 9).map((p, i) => (
                    <ProjectCard key={p.slug} project={p} priority={i < 3} />
                  ))}
                </div>
              </div>
            )}

            {(devHits.length > 0 || locHits.length > 0) && (
              <div>
                <SectionHeading
                  eyebrow={`${devHits.length + locHits.length} matches`}
                  title="Developers & corridors"
                />
                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {devHits.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/developers/${d.slug}`}
                      className="card card-hover group p-5"
                    >
                      <p className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                        Developer
                      </p>
                      <h3 className="mt-1 font-display text-[0.9375rem] font-bold group-hover:text-brand-700">
                        {d.name}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[0.8125rem] text-ink-600">
                        {d.specialities.join(" · ")}
                      </p>
                    </Link>
                  ))}
                  {locHits.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/locations/${l.slug}`}
                      className="card card-hover group p-5"
                    >
                      <p className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                        Corridor
                      </p>
                      <h3 className="mt-1 font-display text-[0.9375rem] font-bold group-hover:text-brand-700">
                        {l.name}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[0.8125rem] text-ink-600">
                        {l.blurb}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {postHits.length > 0 && (
              <div>
                <SectionHeading
                  eyebrow={`${postHits.length} ${postHits.length === 1 ? "article" : "articles"}`}
                  title="Market insights"
                  action={{ label: "All insights", href: "/blog" }}
                />
                <ul className="mt-7 divide-y divide-ink-200 border-y border-ink-200">
                  {postHits.slice(0, 8).map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                      >
                        <span className="font-display text-[0.9375rem] font-bold text-ink-900 group-hover:text-brand-700">
                          {p.title}
                        </span>
                        <span className="shrink-0 text-[0.75rem] font-semibold uppercase tracking-wider text-ink-400">
                          {p.category} · {p.readMinutes} min
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
