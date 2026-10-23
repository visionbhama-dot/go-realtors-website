import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Compass,
  Download,
  Layers,
  LandPlot,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectWalkthrough } from "@/components/project/ProjectVideo";
import { ProjectCard } from "@/components/project/ProjectCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { StickyCta } from "@/components/ui/StickyCta";
import { DEVELOPER_BY_NAME, LOCALITY_BY_NAME } from "@/data/content";
import {
  getAllProjects,
  getProjectBySlug,
  getSimilarProjects,
  toSlug,
} from "@/lib/repo/projects";
import { SITE, WHATSAPP_LINK } from "@/lib/site";
import {
  STATUS_LABEL,
  STATUS_TONE,
  cn,
  formatArea,
  priceRange,
} from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  const title = project.seoTitle || `${project.name} ${project.sector} ${project.city}`;
  const description =
    project.seoDescription ||
    `${project.name} by ${project.developer} at ${project.sector}, ${project.locality}. ${project.configurationsLabel} starting ${priceRange(project.priceMin, project.priceMax)}. Floor plans, price list and site visits via GoRealtors.`;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description,
      url: `/projects/${project.slug}`,
      type: "article",
      images: project.images[0] ? [{ url: project.images[0] }] : undefined,
    },
  };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "pricing", label: "Price & Area" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "developer", label: "Developer" },
  { id: "faqs", label: "FAQs" },
];

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const similar = await getSimilarProjects(project, 3);
  const developer = DEVELOPER_BY_NAME.get(project.developer);
  const locality = LOCALITY_BY_NAME.get(project.locality);

  // Insert a "Plans" tab after "Price & Area" when the project has plan images.
  const navSections: { id: string; label: string }[] = SECTIONS.map((x) => ({
    id: x.id,
    label: x.label,
  }));
  if (project.plans?.length) {
    const idx = navSections.findIndex((x) => x.id === "amenities");
    navSections.splice(idx < 0 ? navSections.length : idx, 0, {
      id: "plans",
      label: "Plans",
    });
  }

  const facts = [
    {
      Icon: LandPlot,
      label: "Configurations",
      value: project.configurationsLabel || project.propertyType,
    },
    {
      Icon: Compass,
      label: "Land area",
      value: project.landAcres ? `${project.landAcres} acres` : "On request",
    },
    {
      Icon: Layers,
      label: "Towers / units",
      value:
        project.towers && project.units
          ? `${project.towers} towers · ${project.units} units`
          : project.towers
            ? `${project.towers} towers`
            : project.units
              ? `${project.units} units`
              : "On request",
    },
    {
      Icon: CalendarClock,
      label: "Possession",
      value: project.possession ?? "On request",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.name,
    description: project.seoDescription || project.tagline,
    url: `${SITE.url}/projects/${project.slug}`,
    image: project.images.map((i) => `${SITE.url}${i}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: project.sector,
      addressLocality: project.locality,
      addressRegion: project.city,
      addressCountry: "IN",
    },
    ...(project.priceMin
      ? {
          offers: {
            "@type": "Offer",
            price: project.priceMin,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            seller: { "@type": "RealEstateAgent", name: SITE.legalName },
          },
        }
      : {}),
  };

  const faqSchema = project.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: project.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${SITE.url}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: `${SITE.url}/projects/${project.slug}`,
      },
    ],
  };

  return (
    <>
      {/* ---------- masthead ---------- */}
      <section className="border-b border-ink-200 bg-ink-950">
        <div className="shell py-6 lg:py-8">
          <Breadcrumbs
            items={[
              { label: "Projects", href: "/projects" },
              {
                label: project.category === "commercial" ? "Commercial" : "Residential",
                href: `/${project.category}`,
              },
              { label: project.name },
            ]}
          />

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("badge", STATUS_TONE[project.status])}>
                  {STATUS_LABEL[project.status]}
                </span>
                {project.featured && (
                  <span className="badge border border-white/20 bg-white/10 text-white">
                    Advisor pick
                  </span>
                )}
                {project.rera && (
                  <span className="badge border border-brand-500/40 bg-brand-500/10 text-brand-300">
                    <ShieldCheck className="h-3 w-3" strokeWidth={2.6} />
                    RERA registered
                  </span>
                )}
              </div>

              <h1 className="mt-3.5 font-display text-[1.875rem] font-extrabold leading-[1.12] text-white sm:text-[2.375rem] lg:text-[2.75rem]">
                {project.name}
              </h1>
              <p className="mt-2.5 max-w-2xl text-[0.9375rem] text-white/60">
                {project.tagline}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem]">
                <span className="inline-flex items-center gap-1.5 text-white/70">
                  <MapPin className="h-4 w-4 text-brand-500" strokeWidth={2.2} />
                  {project.sector}, {project.locality}, {project.city}
                </span>
                <Link
                  href={`/developers/${toSlug(project.developer)}`}
                  className="inline-flex items-center gap-1.5 text-white/70 transition-colors hover:text-brand-400"
                >
                  <Building2 className="h-4 w-4 text-brand-500" strokeWidth={2.2} />
                  {project.developer}
                </Link>
              </div>

              {project.videoUrl && (
                <div className="mt-5">
                  <ProjectWalkthrough url={project.videoUrl} title={project.name} />
                </div>
              )}
            </div>

            <div className="shrink-0 rounded-md border border-white/15 bg-white/[0.06] p-5 lg:min-w-[17rem]">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-white/45">
                Starting price
              </p>
              <p className="mt-1 font-display text-[1.75rem] font-extrabold leading-none text-white">
                {priceRange(project.priceMin, project.priceMax)}
              </p>
              <p className="mt-1.5 text-[0.6875rem] text-white/40">
                + GST, stamp duty & registration
              </p>
              <div className="mt-4 flex gap-2">
                <a href={`tel:${SITE.phone}`} className="btn btn-ghost-light btn-sm flex-1">
                  <Phone className="h-3.5 w-3.5" strokeWidth={2.3} />
                  Call
                </a>
                <a
                  href={WHATSAPP_LINK(`Hi, please share the price list and floor plans for ${project.name}, ${project.sector}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm flex-1"
                >
                  Get details
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- section nav ---------- */}
      <nav
        aria-label="Project sections"
        className="sticky top-16 z-30 border-b border-ink-200 bg-white/95 backdrop-blur lg:top-28"
      >
        <div className="shell flex gap-1 overflow-x-auto no-scrollbar">
          {navSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap border-b-2 border-transparent px-3 py-3.5 text-[0.8125rem] font-semibold text-ink-600 transition-colors hover:border-brand-500 hover:text-brand-700"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="shell py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_21rem] lg:gap-12">
          {/* ================= MAIN ================= */}
          <div className="min-w-0">
            <ProjectGallery
              images={project.images}
              imageAlts={project.imageAlts}
              name={project.name}
              sector={project.sector}
              city={project.city}
            />

            {/* quick facts */}
            <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map(({ Icon, label, value }) => (
                <div key={label} className="bg-white p-4">
                  <dt className="flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                    <Icon className="h-3.5 w-3.5 text-brand-600" strokeWidth={2.2} />
                    {label}
                  </dt>
                  <dd className="mt-1.5 text-[0.875rem] font-bold leading-snug text-ink-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* overview */}
            <section id="overview" className="mt-12 scroll-mt-[11rem]">
              <SectionTitle
                eyebrow="Overview"
                title={`About ${project.name}`}
              />
              <div className="prose-go mt-5">
                {project.overview.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {project.highlights.length > 0 && (
                <div className="mt-8 rounded-md border border-ink-200 bg-ink-50/60 p-6">
                  <h3 className="flex items-center gap-2 font-display text-[1rem] font-bold">
                    <Sparkles className="h-4.5 w-4.5 text-brand-600" strokeWidth={2.2} />
                    Key highlights
                  </h3>
                  <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                    {project.highlights.map((h, i) => (
                      <li
                        key={i}
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
              )}
            </section>

            {/* pricing */}
            <section id="pricing" className="mt-12 scroll-mt-[11rem]">
              <SectionTitle
                eyebrow="Price & area"
                title={`${project.name} price list`}
                note="Developer-quoted starting prices. Exclusive of GST, stamp duty, registration and other statutory charges."
              />

              {project.configurations.length > 0 ? (
                <div className="mt-5 overflow-x-auto rounded-md border border-ink-200">
                  <table className="w-full min-w-[34rem] border-collapse text-left">
                    <thead>
                      <tr className="bg-ink-950 text-white">
                        <th className="px-4 py-3 text-[0.6875rem] font-bold uppercase tracking-wider">
                          Unit type
                        </th>
                        <th className="px-4 py-3 text-[0.6875rem] font-bold uppercase tracking-wider">
                          Area
                        </th>
                        <th className="px-4 py-3 text-[0.6875rem] font-bold uppercase tracking-wider">
                          Starting price
                        </th>
                        <th className="px-4 py-3 text-right text-[0.6875rem] font-bold uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-200">
                      {project.configurations.map((c, i) => (
                        <tr key={i} className="bg-white hover:bg-brand-50/40">
                          <td className="px-4 py-3.5 text-[0.875rem] font-bold text-ink-950">
                            {c.type}
                          </td>
                          <td className="px-4 py-3.5 text-[0.875rem] text-ink-700">
                            {c.areaSqft ? formatArea(c.areaSqft) : "On request"}
                          </td>
                          <td className="px-4 py-3.5 text-[0.875rem] font-bold text-brand-800">
                            {c.price}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <a
                              href={WHATSAPP_LINK(`Hi, please share the ${c.type} floor plan and payment plan for ${project.name}.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[0.75rem] font-bold text-brand-700 hover:underline"
                            >
                              Floor plan
                              <ArrowRight className="h-3 w-3" strokeWidth={2.6} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-5 rounded-md border border-dashed border-ink-300 bg-ink-50/60 p-6 text-center">
                  <p className="text-[0.875rem] font-semibold text-ink-900">
                    Pricing for this project is available on request
                  </p>
                  <p className="mx-auto mt-1.5 max-w-md text-[0.8125rem] text-ink-600">
                    The developer has not released a public price list for{" "}
                    {project.name} yet. We can share current allocation rates
                    and the unit inventory directly.
                  </p>
                  <a
                    href={WHATSAPP_LINK(`Hi, please share the current price list for ${project.name}, ${project.sector}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm mt-4"
                  >
                    Request price list
                  </a>
                </div>
              )}

              {project.floorPlanNote && (
                <div className="mt-6">
                  <h3 className="font-display text-[1rem] font-bold">
                    Floor plans
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">
                    {project.floorPlanNote}
                  </p>
                  <a
                    href={WHATSAPP_LINK(`Hi, please send the complete floor plan set and brochure for ${project.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm mt-4"
                  >
                    <Download className="h-3.5 w-3.5" strokeWidth={2.3} />
                    Request brochure & floor plans
                  </a>
                </div>
              )}
            </section>

            {/* plans */}
            {project.plans && project.plans.length > 0 && (
              <section id="plans" className="mt-12 scroll-mt-[11rem]">
                <SectionTitle
                  eyebrow="Plans"
                  title={`${project.name} floor & master plans`}
                  note="Tap a plan to view it full size. Plans are indicative and subject to change — confirm the latest set with us."
                />
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {project.plans.map((pl, i) => (
                    <a
                      key={i}
                      href={pl.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group overflow-hidden rounded-md border border-ink-200 bg-white transition-colors hover:border-brand-300"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-ink-50">
                        {/* eslint-disable-next-line @next/next/no-img-element -- plan images are arbitrary hosted URLs; the optimizer would need each host whitelisted */}
                        <img
                          src={pl.image}
                          alt={`${pl.type}${pl.title ? ` — ${pl.title}` : ""}`}
                          loading="lazy"
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="badge absolute left-3 top-3 bg-ink-950 text-white">
                          {pl.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="min-w-0">
                          {pl.title && (
                            <p className="truncate text-[0.875rem] font-bold text-ink-900">
                              {pl.title}
                            </p>
                          )}
                          {pl.size && (
                            <p className="text-[0.75rem] text-ink-500">{pl.size}</p>
                          )}
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 text-[0.75rem] font-bold text-brand-700">
                          View
                          <ArrowRight className="h-3 w-3" strokeWidth={2.6} />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* amenities */}
            {project.amenities.length > 0 && (
              <section id="amenities" className="mt-12 scroll-mt-[11rem]">
                <SectionTitle
                  eyebrow="Amenities"
                  title="What's inside the development"
                />
                <ul className="mt-5 grid gap-px overflow-hidden rounded-md border border-ink-200 bg-ink-200 sm:grid-cols-2">
                  {project.amenities.map((a, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 bg-white px-4 py-3.5 text-[0.8125rem] leading-relaxed text-ink-700"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                        strokeWidth={2.2}
                      />
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* why invest */}
            {project.whyInvest.length > 0 && (
              <section className="mt-12">
                <SectionTitle
                  eyebrow="Investment case"
                  title={`Why consider ${project.name}`}
                />
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {project.whyInvest.map((w, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-md border border-ink-200 p-4"
                    >
                      <TrendingUp
                        className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600"
                        strokeWidth={2.2}
                      />
                      <span className="text-[0.8125rem] leading-relaxed text-ink-700">
                        {w}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* location */}
            <section id="location" className="mt-12 scroll-mt-[11rem]">
              <SectionTitle
                eyebrow="Location"
                title={`${project.sector}, ${project.locality}`}
                note={locality?.blurb}
              />

              {project.locationAdvantages.length > 0 && (
                <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {project.locationAdvantages.map((l, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-700"
                    >
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                        strokeWidth={2.2}
                      />
                      {l}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 overflow-hidden rounded-md border border-ink-200">
                <iframe
                  title={`Map of ${project.name}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    `${project.name}, ${project.sector}, ${project.city}, India`,
                  )}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[20rem] w-full border-0"
                />
              </div>

              {locality && (
                <Link
                  href={`/locations/${locality.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-brand-700 hover:underline"
                >
                  Read the full {locality.name} corridor guide
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                </Link>
              )}
            </section>

            {/* developer */}
            <section id="developer" className="mt-12 scroll-mt-[11rem]">
              <SectionTitle eyebrow="Developer" title={project.developer} />
              <div className="mt-5 rounded-md border border-ink-200 p-6">
                {developer ? (
                  <>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.75rem] font-semibold text-ink-500">
                      {developer.established && (
                        <span>Established {developer.established}</span>
                      )}
                      <span>HQ: {developer.headquarters}</span>
                    </div>
                    <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-700">
                      {developer.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {developer.specialities.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/developers/${developer.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-brand-700 hover:underline"
                    >
                      All {developer.short} projects
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </Link>
                  </>
                ) : (
                  <p className="text-[0.875rem] text-ink-700">
                    {project.name} is developed by {project.developer}. Ask us
                    for the developer&apos;s delivery record and current
                    projects in Gurugram.
                  </p>
                )}
              </div>

              {project.rera && (
                <div className="mt-5 flex items-start gap-3 rounded-md border border-brand-200 bg-brand-50 p-4">
                  <ShieldCheck
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-700"
                    strokeWidth={2.2}
                  />
                  <div>
                    <p className="text-[0.8125rem] font-bold text-brand-900">
                      RERA registration
                    </p>
                    <p className="mt-0.5 break-all font-mono text-[0.75rem] text-brand-800">
                      {project.rera}
                    </p>
                    <p className="mt-1.5 text-[0.75rem] leading-relaxed text-brand-800/80">
                      Verify this number and the project&apos;s quarterly
                      progress reports on the official{" "}
                      <a
                        href="https://haryanarera.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline"
                      >
                        Haryana RERA portal
                      </a>{" "}
                      before booking.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* faqs */}
            {project.faqs.length > 0 && (
              <section id="faqs" className="mt-12 scroll-mt-[11rem]">
                <SectionTitle
                  eyebrow="FAQs"
                  title={`${project.name} — common questions`}
                />
                <FaqAccordion faqs={project.faqs} className="mt-5" />
              </section>
            )}

            {/* disclaimer */}
            <p className="mt-10 rounded-md bg-ink-50 p-4 text-[0.6875rem] leading-relaxed text-ink-500">
              <strong className="font-bold text-ink-700">Disclaimer:</strong>{" "}
              GoRealtors is an authorised channel partner, not the developer of{" "}
              {project.name}. All information above is sourced from{" "}
              {project.developer} and is indicative only — pricing, area,
              specifications, approvals and possession dates are subject to
              change at the developer&apos;s discretion. Images are artistic
              impressions. Please verify all details and review the
              builder-buyer agreement before any financial commitment.
            </p>
          </div>

          {/* ================= SIDEBAR ================= */}
          <aside className="lg:sticky lg:top-[11rem] lg:self-start">
            <EnquiryForm
              projectSlug={project.slug}
              projectName={project.name}
              source={`project:${project.slug}`}
              heading={`Enquire about ${project.name}`}
              subheading="Get the current price list, available inventory and floor plans. No obligation."
              compact
              showBudget
              showRequirement={false}
            />

            <div className="card mt-5 p-5">
              <h3 className="font-display text-[0.9375rem] font-bold">
                Speak to an advisor
              </h3>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-600">
                Prefer to talk it through? We&apos;ll tell you honestly whether
                this project fits your brief.
              </p>
              <div className="mt-4 space-y-2">
                <a href={`tel:${SITE.phone}`} className="btn btn-dark w-full">
                  <Phone className="h-4 w-4" strokeWidth={2.3} />
                  {SITE.phoneDisplay}
                </a>
                <Link href="/compare" className="btn btn-outline w-full">
                  Compare with other projects
                </Link>
              </div>
              <p className="mt-3 text-center text-[0.6875rem] text-ink-400">
                {SITE.hours}
              </p>
            </div>

            <div className="card mt-5 p-5">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
                At a glance
              </h3>
              <dl className="mt-3 divide-y divide-ink-100 text-[0.8125rem]">
                {[
                  ["Project type", project.propertyType],
                  ["Category", project.category === "commercial" ? "Commercial" : "Residential"],
                  ["Status", STATUS_LABEL[project.status]!],
                  ["Sector", project.sector],
                  ["Corridor", project.locality],
                  ["City", project.city],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 py-2">
                    <dt className="text-ink-500">{k}</dt>
                    <dd className="text-right font-semibold text-ink-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>

      {/* ---------- similar ---------- */}
      {similar.length > 0 && (
        <section className="border-t border-ink-200 bg-ink-50/50 py-14">
          <div className="shell">
            <SectionTitle
              eyebrow="You may also like"
              title={`Similar projects in ${project.locality}`}
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
            <div className="mt-8">
              <Link href="/projects" className="btn btn-outline">
                Browse all projects
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <StickyCta context={`${project.name}, ${project.sector}`} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      )}
    </>
  );
}

function SectionTitle({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note?: string;
}) {
  return (
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-2.5 font-display text-[1.375rem] font-bold leading-snug sm:text-[1.625rem]">
        {title}
      </h2>
      {note && (
        <p className="mt-2 max-w-2xl text-[0.8125rem] leading-relaxed text-ink-500">
          {note}
        </p>
      )}
    </div>
  );
}
