import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  ArrowRight,
  ArrowUpRight,
  FileCheck2,
  MapPin,
  Scale,
  Users,
} from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HeroVimeo } from "@/components/home/HeroVimeo";
import { RotatingText } from "@/components/home/RotatingText";
import { PropertyShowcase } from "@/components/home/PropertyShowcase";
import {
  CuratedCollections,
  FeaturedCities,
  PropertyTypeStrip,
} from "@/components/home/HomeSections";
import { TrendingProjects } from "@/components/home/TrendingProjects";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import { AutoCarousel, AutoSlide } from "@/components/ui/AutoCarousel";
import { Counter } from "@/components/ui/Counter";
import { NavIcon, type NavIconKey } from "@/components/layout/navIcons";
import { buildSearchIndex } from "@/lib/search-index";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StickyCta } from "@/components/ui/StickyCta";
import { TestimonialSlider } from "@/components/ui/TestimonialSlider";
import { WHY_CHOOSE } from "@/data/content";
import { getPosts, getSettings, getTestimonials } from "@/lib/repo/content";
import {
  getAllProjects,
  getDevelopers,
  getFacetCounts,
  getLocalities,
} from "@/lib/repo/projects";
import { SITE } from "@/lib/site";
import { formatDate, priceRange } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/",
    title: "GoRealtors | Property Advisory & Real Estate Opportunities in Gurugram",
    description: "Explore residential and commercial property opportunities in Gurugram. Compare projects, understand your options, and speak with an advisor about your requirements.",
  });
}

export default async function HomePage() {
  const [
    projects,
    localities,
    developers,
    facets,
    testimonials,
    posts,
    searchIndex,
    settings,
  ] = await Promise.all([
      getAllProjects(),
      getLocalities(),
      getDevelopers(),
      getFacetCounts(),
      getTestimonials(),
      getPosts(),
      buildSearchIndex(),
      getSettings(),
    ]);

  // Editable homepage copy (admin → Site settings → Homepage content).
  // Falls back to the built-in default whenever a setting is blank/unset.
  const copy = (name: string, fallback: string) => {
    const v = settings[`home.${name}`];
    return typeof v === "string" && v.trim() ? v.trim() : fallback;
  };
  // Optional per-city image overrides, set from admin → Site settings →
  // City images as "City Name = /path/or/url" lines.
  const cityImages = Object.fromEntries(
    copy("city_images", "")
      .split("\n")
      .map((line) => {
        const i = line.indexOf("=");
        if (i === -1) return null;
        const name = line.slice(0, i).trim();
        const url = line.slice(i + 1).trim();
        return name && url ? ([name, url] as const) : null;
      })
      .filter((e): e is readonly [string, string] => e !== null),
  );


  const heroStats = [
    { value: String(projects.length), label: "Live projects" },
    { value: SITE.stats.developers, label: "Developer partners" },
    { value: SITE.stats.unitsAdvised, label: "Families advised" },
    { value: SITE.stats.gmv, label: "Transaction value" },
  ];

  const spotlight = projects.filter((p) => p.featured).slice(0, 3);

  const trendingProjects = [...projects]
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        Number(b.trending) - Number(a.trending) ||
        (b.priceMin ?? 0) - (a.priceMin ?? 0),
    )
    .slice(0, 10);

  const cityCounts = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.city] = (acc[p.city] ?? 0) + 1;
    return acc;
  }, {});

  // Homepage FAQ set (blueprint Section 10).
  const homeFaqs = [
    {
      question: "How do I start finding a property through GoRealtors?",
      answer:
        "Start by exploring the project directory, or contact us with your preferred location, budget, property type and timeline. We can then discuss relevant options within our service scope.",
    },
    {
      question: "Can I compare multiple projects before arranging a site visit?",
      answer:
        "Yes. Use the project pages to review available information, and speak with an advisor to clarify differences and open questions.",
    },
    {
      question: "Are the prices shown on the website final?",
      answer:
        "Published prices are indicative unless explicitly stated otherwise. Pricing, availability, charges and payment terms may change. Confirm the latest written details with the relevant seller or developer.",
    },
    {
      question: "Can GoRealtors arrange a site visit?",
      answer:
        "Site visits may be coordinated for relevant shortlisted properties, subject to project access and availability. Contact us to discuss the next step.",
    },
    {
      question: "Does GoRealtors provide legal or financial advice?",
      answer:
        "We state only the services we actually provide. For legal, tax, lending or regulated financial advice, please consult an appropriately qualified professional.",
    },
    {
      question: "How can I contact an advisor?",
      answer:
        "Use the contact form, call our published business number, or message us on the official WhatsApp contact shown on this website.",
    },
  ];

  // Hero: static prefix + animated (typewriter) city/area name, 360realtors-style.
  const heroSub = copy(
    "hero_subheading",
    "Explore property opportunities across Gurugram with clear information, thoughtful comparisons, and guidance tailored to your requirements.",
  );
  const heroWords = copy(
    "hero_words",
    "Gurugram\nNew Delhi\nDwarka Expressway\nGolf Course Road\nNoida\npopular localities",
  )
    .split("\n")
    .map((w) => w.trim())
    .filter(Boolean);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        <HeroVimeo />
        {/* Scrims over the video so the headline, search and stats stay legible. */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1] bg-gradient-to-b from-ink-950/75 via-ink-950/45 to-ink-950/90"
        />
        <div
          aria-hidden
          className="absolute inset-0 z-[1] hidden bg-gradient-to-r from-ink-950/60 via-ink-950/25 to-ink-950/45 sm:block"
        />

        <div className="shell relative z-10 py-16 text-center sm:py-20 lg:py-24">
          <h1 className="mx-auto flex max-w-4xl flex-col items-center font-display text-[1.6rem] font-extrabold leading-[1.15] text-white sm:text-[3rem] sm:leading-[1.1] lg:text-[3.5rem]">
            <span className="whitespace-nowrap">
              {copy("hero_prefix", "Discover properties in")}
            </span>
            <RotatingText className="text-brand-400" words={heroWords} />
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-white/75 sm:text-[1.0625rem]">
            {heroSub}
          </p>

          <div className="mx-auto mt-9 max-w-2xl text-left">
            <HeroSearch searchIndex={searchIndex} />
          </div>

          <dl className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-7 border-t border-white/12 pt-9 sm:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <Counter
                    value={s.value}
                    className="block font-display text-[1.75rem] font-extrabold leading-none text-white sm:text-[2.125rem]"
                  />
                  <span className="mt-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ CLARITY — a more informed way to explore ============ */}
      <section className="border-b border-ink-200 bg-ink-50/60 py-14 lg:py-20">
        <div className="shell">
          <SectionHeading
            align="center"
            eyebrow="A more informed way to explore property"
            title="Clarity for Your Next Property Decision"
            description="A property decision involves more than a brochure or a headline price. Understand the location, compare relevant options, review the available information, and decide what deserves a closer look."
          />
          <MobileCarousel
            grid="sm:grid-cols-2 lg:grid-cols-4"
            peek="lg"
            gap="gap-4"
            className="mt-10"
          >
            {[
              {
                Icon: FileCheck2,
                title: "Clear Project Information",
                body: "Review key details in one place, with important specifications identified for verification.",
              },
              {
                Icon: Scale,
                title: "Meaningful Comparisons",
                body: "Compare options by location, budget, configuration, property type and stated status.",
              },
              {
                Icon: Users,
                title: "Personalised Guidance",
                body: "Discuss your requirements with an advisor instead of navigating an overwhelming list alone.",
              },
              {
                Icon: MapPin,
                title: "Local Market Context",
                body: "Explore location factors and practical considerations that may influence your decision.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-lg border border-ink-200 bg-white p-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-ink-950 text-brand-400">
                  <Icon className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <p className="mt-4 font-display text-[1rem] font-bold text-ink-900">
                  {title}
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-600">
                  {body}
                </p>
              </div>
            ))}
          </MobileCarousel>
        </div>
      </section>

      {/* ================= PROPERTY TYPES ================= */}
      <section className="shell py-14 lg:py-20">
        <SectionHeading
          align="center"
          eyebrow="Explore by type"
          title={copy("types_title", "Start With the Kind of Property You Need")}
          description={copy(
            "types_desc",
            "Choose a property category to narrow your search and focus on opportunities relevant to your goals.",
          )}
        />
        <div className="mt-10">
          <PropertyTypeStrip />
        </div>
      </section>

      {/* ================= CURATED COLLECTIONS ================= */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell">
          <SectionHeading
            align="center"
            eyebrow="Curated collections"
            title={copy("curated_title", "Prime properties, grouped for you")}
            description={copy(
              "curated_desc",
              "Hand-picked shortlists based on how people actually search — stage, budget and format.",
            )}
          />
          <div className="mt-10">
            <CuratedCollections />
          </div>
        </div>
      </section>

      {/* ================= TRENDING PROJECTS ================= */}
      <section className="shell py-16 lg:py-24">
        <SectionHeading
          eyebrow="Featured projects"
          title={copy("trending_title", "Explore Selected Projects")}
          description={copy(
            "trending_desc",
            "Review a focused selection of projects and compare the details that matter to you. Availability, pricing and terms can change, so confirm current information before making a decision.",
          )}
          action={{ label: "View all projects", href: "/projects" }}
        />
        <div className="mt-10">
          <TrendingProjects projects={trendingProjects} />
        </div>
      </section>

      {/* ============ ADVISOR SPOTLIGHT (moved up, after selected projects) === */}
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
            <MobileCarousel
              grid="sm:grid-cols-2 lg:grid-cols-3"
              peek="lg"
              gap="gap-6"
              className="mt-10"
            >
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
            </MobileCarousel>
          </div>
        </section>
      )}

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

      {/* ================= FEATURED CITIES ================= */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            align="center"
            eyebrow="Featured cities"
            title={copy("cities_title", "Find your home in the city of your choice")}
            description={copy(
              "cities_desc",
              "We're rooted in Gurugram and Delhi today, and expanding across India's major property markets. Tell us where you're looking and we'll source it.",
            )}
          />
          <div className="mt-10">
            <FeaturedCities cityCounts={cityCounts} cityImages={cityImages} />
          </div>
        </div>
      </section>

      {/* ================= LOCATIONS ================= */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Explore by location"
            title="Find the Location That Fits Your Plans"
            description="Location can shape your commute, daily routine, access to services and long-term property considerations. Explore the areas we actively cover and compare the projects within them."
            action={{ label: "All locations", href: "/locations" }}
          />
          <MobileCarousel
            grid="sm:grid-cols-2 lg:grid-cols-3"
            peek="lg"
            gap="gap-5"
            className="mt-10"
          >
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
          </MobileCarousel>
        </div>
      </section>

      {/* ================= WHY BUY WITH US ================= */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            align="center"
            eyebrow="Why GoRealtors"
            title={copy("why_title", "Why buy with us?")}
            description={copy(
              "why_desc",
              "The things that make GoRealtors a genuine advisory, not another listing desk.",
            )}
          />
          <MobileCarousel
            grid="sm:grid-cols-2 lg:grid-cols-3"
            peek="lg"
            gap="gap-5"
            className="mt-11"
          >
            {WHY_CHOOSE.map((w) => (
              <article
                key={w.title}
                className="group flex flex-col items-center rounded-lg border border-ink-200 bg-white p-7 text-center transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <NavIcon name={w.icon as NavIconKey} className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-[1.0625rem] font-bold leading-snug">
                  {w.title}
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-600">
                  {w.body}
                </p>
              </article>
            ))}
          </MobileCarousel>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/about" className="btn btn-dark">
              Our approach
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Talk to an advisor
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="shell py-16 lg:py-24">
        <SectionHeading
          align="center"
          eyebrow="Our team"
          title="The people behind GoRealtors"
          description="A founder-led advisory of specialists across luxury residential, commercial investment and NRI mandates — accountable from your first call through to registry."
        />

        {/* full team group photo */}
        <figure className="relative mt-10 overflow-hidden rounded-lg bg-ink-100">
          <Image
            src="/team/leadership-group.jpg"
            alt="The GoRealtors team"
            width={1800}
            height={1013}
            sizes="(max-width:1280px) 100vw, 80rem"
            className="h-auto w-full object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent p-5 pt-16 text-center text-[0.875rem] font-semibold text-white sm:text-[0.9375rem]">
            One team, accountable end to end — from your first call to registry
            and beyond.
          </figcaption>
        </figure>

        <div className="mt-8 flex justify-center">
          <Link href="/team" className="btn btn-primary btn-lg">
            Meet the team
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </Link>
        </div>
      </section>



      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-ink-900 py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            tone="dark"
            eyebrow="Client experiences"
            title="Experiences From People We've Helped"
            description="Every property search is different. These are first-hand experiences from clients who agreed to share their feedback."
          />
          <div className="mt-10">
            <TestimonialSlider items={testimonials} />
          </div>
        </div>
      </section>

      {/* ================= INSIGHTS ================= */}
      <section className="shell py-16 lg:py-24">
        <SectionHeading
          eyebrow="Insights & guides"
          title="Make Your Next Property Decision With Better Information"
          description="Practical guides to property buying, location research, project comparisons, ownership costs, and the questions worth asking before you commit."
          action={{ label: "Read property guides", href: "/blog" }}
        />
        <AutoCarousel className="mt-10" gap="gap-6" delay={4000}>
          {posts.slice(0, 9).map((post) => (
            <AutoSlide key={post.slug}>
            <article className="card card-hover group h-full overflow-hidden">
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
            </AutoSlide>
          ))}
        </AutoCarousel>
      </section>

      {/* ================= FAQ + FORM ================= */}
      <section className="border-t border-ink-200 bg-ink-50/50 py-16 lg:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Frequently asked"
              title="The questions buyers ask us first"
            />
            <FaqAccordion faqs={homeFaqs} className="mt-8" />
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

      {/* ============ FINAL CONVERSION (blueprint S11) ============ */}
      <section className="relative isolate overflow-hidden bg-ink-950 py-16 lg:py-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(34,197,94,0.18),transparent)]"
        />
        <div className="shell relative text-center">
          <h2 className="mx-auto max-w-3xl font-display text-[1.6rem] font-extrabold leading-tight text-white sm:text-[2.125rem]">
            Let&apos;s Find the Right Property for Your Requirements.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-white/70">
            Tell us what you are looking for. Share a few details and our team
            can help you identify the next practical step.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Request a callback
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
            <a href={`tel:${SITE.phone}`} className="btn btn-ghost-light btn-lg">
              Call {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <StickyCta />
    </>
  );
}
