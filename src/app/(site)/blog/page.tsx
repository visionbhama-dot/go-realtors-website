import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { getPostCategories, getPosts } from "@/lib/repo/content";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/blog",
    title: "Market Insights & Property Blog | Gurugram Real Estate — GoRealtors",
    description: "Corridor analysis, project breakdowns and buyer guides for Gurugram real estate. Written by advisors who transact in these markets rather than report on them.",
  });
}

type SP = Record<string, string | string[] | undefined>;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const active = Array.isArray(sp.category) ? sp.category[0] : sp.category;

  const [all, categories] = await Promise.all([
    getPosts(),
    getPostCategories(),
  ]);

  const posts = active
    ? all.filter((p) => p.category.toLowerCase() === active.toLowerCase())
    : all;

  const [lead, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Market insights"
        title="Read before you buy"
        description="We publish what we actually tell clients: how corridors are pricing, which launches stack up, and the mechanics that quietly decide whether a purchase works out."
        crumbs={[{ label: "Blog" }]}
        image="/brand/band-residential.jpg"
        size="compact"
      />

      {/* category filter */}
      <div className="border-b border-ink-200 bg-white/95">
        <div className="shell flex gap-2 overflow-x-auto no-scrollbar py-4">
          <Link
            href="/blog"
            className={!active ? "chip chip-active" : "chip"}
          >
            All insights
            <span className="tabular-nums opacity-60">{all.length}</span>
          </Link>
          {categories.map(([name, count]) => (
            <Link
              key={name}
              href={`/blog?category=${encodeURIComponent(name)}`}
              className={
                active?.toLowerCase() === name.toLowerCase()
                  ? "chip chip-active"
                  : "chip"
              }
            >
              {name}
              <span className="tabular-nums opacity-60">{count}</span>
            </Link>
          ))}
        </div>
      </div>

      <section className="shell py-12 lg:py-16">
        {posts.length === 0 ? (
          <div className="card p-12 text-center">
            <h2 className="font-display text-lg font-bold">
              No posts in this category yet
            </h2>
            <Link href="/blog" className="btn btn-outline mt-5">
              View all insights
            </Link>
          </div>
        ) : (
          <>
            {/* lead article */}
            {lead && (
              <article className="card card-hover group overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  <Link
                    href={`/blog/${lead.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-ink-100 lg:aspect-auto lg:min-h-[21rem]"
                  >
                    <Image
                      src={lead.cover || "/brand/placeholder.svg"}
                      alt={lead.title}
                      fill
                      priority
                      sizes="(max-width:1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="badge absolute left-4 top-4 bg-brand-600 text-white">
                      Latest
                    </span>
                  </Link>
                  <div className="flex flex-col justify-center p-6 lg:p-9">
                    <div className="flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
                      <span className="text-brand-700">{lead.category}</span>
                      <span aria-hidden>·</span>
                      <span>{formatDate(lead.publishedAt)}</span>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" strokeWidth={2.5} />
                        {lead.readMinutes} min
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-[1.5rem] font-bold leading-tight lg:text-[1.875rem]">
                      <Link
                        href={`/blog/${lead.slug}`}
                        className="transition-colors hover:text-brand-700"
                      >
                        {lead.title}
                      </Link>
                    </h2>
                    <p className="mt-3.5 text-[0.9375rem] leading-relaxed text-ink-600">
                      {lead.excerpt}
                    </p>
                    <Link
                      href={`/blog/${lead.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-brand-700 hover:underline"
                    >
                      Read the analysis
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* grid */}
            {rest.length > 0 && (
              <div className="mt-10">
                <SectionHeading
                  eyebrow={`${rest.length} more`}
                  title={active ? `More in ${active}` : "All insights"}
                />
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <article
                      key={post.slug}
                      className="card card-hover group flex flex-col overflow-hidden"
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative block aspect-[16/10] overflow-hidden bg-ink-100"
                      >
                        <Image
                          src={post.cover || "/brand/placeholder.svg"}
                          alt={post.title}
                          fill
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="badge absolute left-3 top-3 bg-white/95 text-ink-900">
                          {post.category}
                        </span>
                      </Link>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
                          {formatDate(post.publishedAt)} · {post.readMinutes} min
                        </p>
                        <h3 className="mt-2 font-display text-[1rem] font-bold leading-snug">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="transition-colors hover:text-brand-700"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-2 line-clamp-3 flex-1 text-[0.8125rem] leading-relaxed text-ink-600">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-ink-100 pt-3.5">
                          {post.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[0.6875rem] font-semibold text-ink-400"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* newsletter */}
      <section className="bg-ink-950 py-14">
        <div className="shell grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
          <div>
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
              New launches and corridor updates, every fortnight
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Pre-launch allocations, price movements and the projects we would
              put our own money into. No listing spam.
            </p>
          </div>
          <NewsletterForm source="blog" />
        </div>
      </section>
    </>
  );
}
