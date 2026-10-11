import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock, User } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StickyCta } from "@/components/ui/StickyCta";
import { getPostBySlug, getPosts, getRelatedPosts } from "@/lib/repo/content";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE.legalName,
      url: SITE.url,
    },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    ...(post.cover ? { image: `${SITE.url}${post.cover}` } : {}),
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <section className="border-b border-ink-200 bg-ink-950">
        <div className="shell py-8 lg:py-10">
          <Breadcrumbs
            items={[{ label: "Blog", href: "/blog" }, { label: post.category }]}
          />
          <div className="mt-5 max-w-3xl">
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="badge border border-brand-500/40 bg-brand-500/10 text-brand-300 transition-colors hover:bg-brand-500/20"
            >
              {post.category}
            </Link>
            <h1 className="mt-4 font-display text-[1.875rem] font-extrabold leading-[1.14] text-white sm:text-[2.375rem] lg:text-[2.75rem]">
              {post.title}
            </h1>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/60">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.3} />
                {post.author}
              </span>
              <span>{formatDate(post.publishedAt)}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.3} />
                {post.readMinutes} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="shell py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
          <article className="min-w-0">
            {post.cover && (
              <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-ink-100">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className="prose-go mt-8 max-w-none">
              {post.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-ink-200 pt-6">
                <span className="text-[0.75rem] font-bold uppercase tracking-wider text-ink-400">
                  Tags
                </span>
                {post.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 rounded-md border border-ink-200 bg-ink-50/60 p-6">
              <h2 className="font-display text-[1.0625rem] font-bold">
                Want this applied to your own situation?
              </h2>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">
                General analysis only goes so far. Tell us your budget, intended
                use and timeline, and we will tell you which of these corridors
                and projects actually fit — and which to avoid.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-primary">
                  Book a consultation
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </Link>
                <Link href="/projects" className="btn btn-outline">
                  Browse projects
                </Link>
              </div>
            </div>
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <EnquiryForm
              source={`blog:${post.slug}`}
              heading="Get expert advice"
              subheading="No brokerage on new launches. Just a shortlist that fits your brief."
              compact
              showBudget
              showRequirement={false}
            />

            {related.length > 0 && (
              <div className="card mt-5 p-5">
                <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
                  Related reading
                </h2>
                <ul className="mt-3.5 space-y-3.5">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/blog/${r.slug}`} className="group block">
                        <span className="block text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-700">
                          {r.category}
                        </span>
                        <span className="mt-1 block text-[0.875rem] font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
                          {r.title}
                        </span>
                        <span className="mt-0.5 block text-[0.6875rem] text-ink-400">
                          {formatDate(r.publishedAt)} · {r.readMinutes} min
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-ink-200 bg-ink-50/50 py-14">
          <div className="shell">
            <SectionHeading
              eyebrow="Keep reading"
              title="More market insights"
              action={{ label: "All insights", href: "/blog" }}
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <article key={r.slug} className="card card-hover group overflow-hidden">
                  <Link
                    href={`/blog/${r.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-ink-100"
                  >
                    <Image
                      src={r.cover || "/brand/placeholder.svg"}
                      alt={r.title}
                      fill
                      sizes="(max-width:1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-5">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-700">
                      {r.category}
                    </p>
                    <h3 className="mt-1.5 font-display text-[0.9375rem] font-bold leading-snug">
                      <Link
                        href={`/blog/${r.slug}`}
                        className="transition-colors hover:text-brand-700"
                      >
                        {r.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <StickyCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
