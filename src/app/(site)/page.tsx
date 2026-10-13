import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Calculator,
  FileCheck2,
  Handshake,
  LineChart,
  MapPin,
  Scale,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { PropertyShowcase } from "@/components/home/PropertyShowcase";
import { buildSearchIndex } from "@/lib/search-index";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StickyCta } from "@/components/ui/StickyCta";
import { TestimonialSlider } from "@/components/ui/TestimonialSlider";
import {
  HOME_FAQS,
  PROCESS_STEPS,
  SERVICES,
  WHY_CHOOSE,
} from "@/data/content";
import { getPosts, getTestimonials } from "@/lib/repo/content";
import {
  getAllProjects,
  getDevelopers,
  getFacetCounts,
  getLocalities,
  toSlug,
} from "@/lib/repo/projects";
import { SITE } from "@/lib/site";
import { formatDate, priceRange } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/",
    title: "Property Consultant in Gurugram | Luxury & Investment Real Estate — GoRealtors",
    description: "GoRealtors is a Gurugram real estate advisory for luxury apartments, commercial retail and SCO plots across Dwarka Expressway, Golf Course Road and New Gurgaon. RERA-verified projects, zero brokerage on new launches.",
  });
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "residential-advisory": <Building2 className="h-5 w-5" strokeWidth={2} />,
  "commercial-investment": <Store className="h-5 w-5" strokeWidth={2} />,
  "sco-plots": <MapPin className="h-5 w-5" strokeWidth={2} />,
  "nri-services": <Users className="h-5 w-5" strokeWidth={2} />,
  "legal-due-diligence": <Scale className="h-5 w-5" strokeWidth={2} />,
  "home-loan-assistance": <Calculator className="h-5 w-5" strokeWidth={2} />,
  "portfolio-management": <LineChart className="h-5 w-5" strokeWidth={2} />,
  "leasing-property-management": <Handshake className="h-5 w-5" strokeWidth={2} />,
};

export default async function HomePage() {
  const [
    projects,
    localities,
    developers,
    facets,
    testimonials,
    posts,
    searchIndex,
  ] = await Promise.all([
      getAllProjects(),
      getLocalities(),
      getDevelopers(),
      getFacetCounts(),
      getTestimonials(),
      getPosts(),
      buildSearchIndex(),
    ]);

  const propertyTypes = [...new Set(projects.map((p) => p.propertyType))]
    .filter(Boolean)
    .map((t) => ({ slug: toSlug(t), name: t }));

  const heroStats = [
    { value: String(projects.length), label: "Live projects" },
    { value: SITE.stats.developers, label: "Developer partners" },
    { value: SITE.stats.unitsAdvised, label: "Families advised" },
    { value: SITE.stats.gmv, label: "Transaction value" },
  ];

  const spotlight = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        <Image
          src="/brand/hero-primary.jpg"
          alt="Luxury residential arrival court in Gurugram"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.55]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/30"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/50"
        />

        <div className="shell relative py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="max-w-[22ch] font-display text-[2.25rem] font-extrabold leading-[1.08] text-white sm:text-[3rem] lg:text-[3.75rem]">
              {"Property advice that starts with "}
              <span className="text-brand-400">your numbers</span>
              {", not a brochure."}
            </h1>

            <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-white/70 sm:text-[1.0625rem]">
              GoRealtors represents buyers and investors across Gurugram&apos;s
              luxury residential, high-street retail and SCO plotted markets.
              Every project we put in front of you has been checked for HARERA
              status, carpet-area loading and real exit potential — before it
              reaches your shortlist.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/projects" className="btn btn-primary btn-lg">
                Browse {projects.length} Projects
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
              <Link href="/contact" className="btn btn-ghost-light btn-lg">
                Book a Free Consultation
              </Link>
            </div>
          </div>

          <div className="mt-10 lg:mt-14">
            <HeroSearch
              localities={localities}
              propertyTypes={propertyTypes}
              searchIndex={searchIndex}
            />
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/12 pt-8 sm:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-[1.75rem] font-extrabold leading-none text-white sm:text-[2.125rem]">
                    {s.value}
                  </span>
                  <span className="mt-1.5 block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="border-b border-ink-200 bg-ink-50/60">
        <div className="shell grid gap-y-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              Icon: BadgeCheck,
              title: "RERA-verified only",
              body: "HARERA number and QPR filings checked first",
            },
            {
              Icon: FileCheck2,
              title: "Zero buyer brokerage",
              body: "Our fee is paid by the developer on new launches",
            },
            {
              Icon: TrendingUp,
              title: "Numbers-first advice",
              body: "Carpet area, loading and all-in outgo, in writing",
            },
            {
              Icon: Handshake,
              title: "One advisor, end to end",
              body: "From first call to registry and beyond",
            },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3 lg:px-2">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white text-brand-700 shadow-card">
                <Icon className="h-4.5 w-4.5" strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-[0.8125rem] font-bold text-ink-900">{title}</p>
                <p className="mt-0.5 text-[0.75rem] leading-snug text-ink-500">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DEVELOPER MARQUEE ================= */}
      <section className="overflow-hidden border-b border-ink-200 py-8">
        <p className="shell text-center text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink-400">
          Channel partner to {developers.length}+ of India&apos;s leading developers
        </p>
        <div className="relative mt-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent"
          />
          <div className="flex w-max animate-marquee">
            {[0, 1].map((dup) => (
              <ul
                key={dup}
                className="flex items-center"
                aria-hidden={dup === 1}
              >
                {developers.map((d) => (
                  <li key={d.slug} className="px-7">
                    <Link
                      href={`/developers/${d.slug}`}
                      className="whitespace-nowrap font-display text-[1.0625rem] font-bold tracking-tight text-ink-300 transition-colors hover:text-brand-600"
                    >
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ALL PROPERTIES ================= */}
      <section className="shell py-16 lg:py-24">
        <SectionHeading
          eyebrow={`${projects.length} properties · one place`}
          title="Every property we represent in Gurugram"
          description="Apartments, independent floors, high-street retail, office floors and SCO plots — all in one place. Narrow it down by category, budget or stage rather than hunting through separate pages."
          action={{ label: "Open full directory", href: "/projects" }}
        />
        <PropertyShowcase projects={projects} />
      </section>

      {/* ================= LOCATIONS ================= */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Top locations in Gurugram"
            title="Pick the corridor, then pick the project"
            description="In Gurugram the corridor does most of the work. Here is how the six micro-markets we transact in actually compare on pricing, infrastructure and growth outlook."
            action={{ label: "All locations", href: "/locations" }}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {localities.map((l) => {
              const count = facets.byLocality.get(l.name) ?? 0;
              return (
                <Link
                  key={l.slug}
                  href={`/locations/${l.slug}`}
                  className="card card-hover group flex flex-col p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-[1.0625rem] font-bold transition-colors group-hover:text-brand-700">
                        {l.name}
                      </h3>
                      <p className="mt-0.5 text-[0.75rem] text-ink-400">
                        {l.city}
                      </p>
                    </div>
                    <span className="badge shrink-0 bg-ink-950 text-white">
                      {count} {count === 1 ? "project" : "projects"}
                    </span>
                  </div>
                  <p className="mt-3.5 flex-1 text-[0.8125rem] leading-relaxed text-ink-600">
                    {l.blurb}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-ink-100 pt-4">
                    <div>
                      <dt className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                        Price / sq.ft.
                      </dt>
                      <dd className="mt-0.5 text-[0.8125rem] font-bold text-ink-900">
                        {l.priceBand}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                        Outlook
                      </dt>
                      <dd className="mt-0.5 text-[0.8125rem] font-bold text-brand-700">
                        {l.growth}
                      </dd>
                    </div>
                  </dl>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="shell py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Why GoRealtors"
              title="Most brokers sell inventory. We represent you."
              description="The difference shows up in what you receive: a comparison sheet instead of a brochure, a yield model instead of a sales pitch, and the same advisor from the first call to the registry."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-dark">
                Our approach
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
              <Link href="/team" className="btn btn-outline">
                Meet the team
              </Link>
            </div>
          </div>

          <ul className="grid gap-px bg-ink-200 sm:grid-cols-2">
            {WHY_CHOOSE.map((w, i) => (
              <li key={w.title} className="bg-white p-6">
                <span className="font-display text-[0.8125rem] font-extrabold text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2.5 font-display text-[0.9375rem] font-bold leading-snug">
                  {w.title}
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-600">
                  {w.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= SPOTLIGHT ================= */}
      {spotlight.length > 0 && (
        <section className="border-y border-ink-200 bg-ink-950 py-16 lg:py-24">
          <div className="shell">
            <SectionHeading
              tone="dark"
              eyebrow="Advisor spotlight"
              title="Three properties worth a closer look"
              description="Shortlisted on fundamentals — developer delivery record, corridor infrastructure, carpet-area efficiency and realistic possession timelines. Residential and commercial, judged the same way."
              action={{ label: "All properties", href: "/projects" }}
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {spotlight.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-md border border-white/12 bg-white/[0.03] transition-colors hover:border-brand-500/50"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">
                    <Image
                      src={p.images[0] ?? "/brand/placeholder.svg"}
                      alt={p.name}
                      fill
                      sizes="(max-width:1024px) 100vw, 33vw"
                      className="object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-brand-400">
                      {p.developer}
                    </p>
                    <h3 className="mt-2 font-display text-[1.125rem] font-bold text-white">
                      {p.name}
                    </h3>
                    <p className="mt-1.5 text-[0.8125rem] text-white/50">
                      {p.sector}, {p.locality}
                    </p>
                    <p className="mt-4 flex-1 text-[0.8125rem] leading-relaxed text-white/65">
                      {p.tagline}
                    </p>
                    <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[0.625rem] font-bold uppercase tracking-wider text-white/35">
                          {p.configurationsLabel}
                        </p>
                        <p className="mt-0.5 font-display text-[1.0625rem] font-bold text-white">
                          {priceRange(p.priceMin, p.priceMax)}
                        </p>
                      </div>
                      <ArrowUpRight
                        className="h-5 w-5 text-brand-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                        strokeWidth={2.4}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= SERVICES ================= */}
      <section className="shell py-16 lg:py-24">
        <SectionHeading
          eyebrow="What we do"
          title="Advisory, diligence and execution under one roof"
          description="Eight service lines that cover the full life of a real estate decision — from the first shortlist through leasing the asset years later."
          action={{ label: "All services", href: "/services" }}
        />
        <div className="mt-10 grid gap-px bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex flex-col bg-white p-6 transition-colors hover:bg-brand-50/60"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-ink-950 text-brand-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                {SERVICE_ICONS[s.slug]}
              </span>
              <h3 className="mt-4 font-display text-[0.9375rem] font-bold leading-snug">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-ink-600">
                {s.summary}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] font-bold text-brand-700">
                Learn more
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.4}
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            align="center"
            eyebrow="How we work"
            title="Six steps from first call to keys in hand"
            description="No step gets skipped, and you always know which one you are on."
          />
          <ol className="mt-12 grid gap-px bg-ink-200 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((s) => (
              <li key={s.step} className="relative bg-white p-7">
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

      {/* ================= COMMERCIAL BAND ================= */}
      <section className="relative isolate overflow-hidden bg-ink-950 py-16 lg:py-24">
        <Image
          src="/brand/cta-commercial.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/60"
        />
        <div className="shell relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="Commercial & investment"
              title="Gurugram's commercial market rewards the prepared buyer"
              description="Retail, office and SCO assets can deliver 7-9% gross yields in the right catchment — and close to nothing in the wrong one. We model the difference before you commit."
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  k: "Yield modelling",
                  v: "Gross and net yield, exit cap and IRR across a 5-10 year hold.",
                },
                {
                  k: "Catchment study",
                  v: "Footfall drivers, anchor tenants and competing supply within 3 km.",
                },
                {
                  k: "SCO versus strata",
                  v: "Freehold land and build-out control compared against strata retail.",
                },
                {
                  k: "Tenant sourcing",
                  v: "Lease structuring, escalation terms and tenant introductions.",
                },
              ].map((i) => (
                <li
                  key={i.k}
                  className="border-l-2 border-brand-500/60 pl-4"
                >
                  <p className="text-[0.8125rem] font-bold text-white">{i.k}</p>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-white/60">
                    {i.v}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/commercial" className="btn btn-primary">
                View commercial projects
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
              <Link href="/tools/emi-calculator" className="btn btn-ghost-light">
                <Calculator className="h-4 w-4" strokeWidth={2.2} />
                EMI calculator
              </Link>
            </div>
          </div>

          <EnquiryForm
            variant="dark"
            source="home-commercial"
            heading="Talk to a commercial advisor"
            subheading="Tell us the ticket size and we'll send a yield comparison across the assets that fit."
            showBudget
            showRequirement
          />
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-ink-900 py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            tone="dark"
            eyebrow="Client outcomes"
            title="What buyers say after the deal closes"
            description="Collected from families and investors we have represented across Gurugram and Delhi."
          />
          <div className="mt-10">
            <TestimonialSlider items={testimonials} />
          </div>
        </div>
      </section>

      {/* ================= INSIGHTS ================= */}
      <section className="shell py-16 lg:py-24">
        <SectionHeading
          eyebrow="Market insights"
          title="Read before you buy"
          description="Corridor analysis, launch breakdowns and the things developers would rather you did not ask about."
          action={{ label: "All insights", href: "/blog" }}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <article key={post.slug} className="card card-hover group overflow-hidden">
              <Link
                href={`/blog/${post.slug}`}
                className="relative block aspect-[16/10] overflow-hidden bg-ink-100"
              >
                <Image
                  src={post.cover || "/brand/placeholder.svg"}
                  alt={post.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="badge absolute left-3 top-3 bg-white/95 text-ink-900">
                  {post.category}
                </span>
              </Link>
              <div className="p-5">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
                  {formatDate(post.publishedAt)} · {post.readMinutes} min read
                </p>
                <h3 className="mt-2 font-display text-[1rem] font-bold leading-snug">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-brand-700"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-[0.8125rem] leading-relaxed text-ink-600">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================= FAQ + FORM ================= */}
      <section className="border-t border-ink-200 bg-ink-50/50 py-16 lg:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Frequently asked"
              title="The questions buyers ask us first"
            />
            <FaqAccordion faqs={HOME_FAQS} className="mt-8" />
            <p className="mt-6 text-[0.8125rem] text-ink-600">
              Still unsure about something?{" "}
              <Link
                href="/faqs"
                className="font-bold text-brand-700 hover:underline"
              >
                Read the full FAQ
              </Link>{" "}
              or{" "}
              <a
                href={`tel:${SITE.phone}`}
                className="font-bold text-brand-700 hover:underline"
              >
                call {SITE.phoneDisplay}
              </a>
              .
            </p>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <EnquiryForm
              source="home-faq"
              heading="Get a free property consultation"
              subheading="Share your requirement and budget. You'll get a shortlist with carpet areas and all-in pricing — usually within one working day."
            />
          </div>
        </div>
      </section>

      <StickyCta />
    </>
  );
}
