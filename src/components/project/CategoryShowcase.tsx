import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/project/ProjectCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import type { Faq, Project } from "@/lib/types";

/** Shared body for /residential and /commercial landing pages. */
export function CategoryShowcase({
  projects,
  intro,
  groups,
  faqs,
  enquirySource,
  enquiryHeading,
}: {
  projects: Project[];
  intro: { heading: string; paragraphs: string[]; points: string[] };
  groups: { label: string; items: Project[] }[];
  faqs: Faq[];
  enquirySource: string;
  enquiryHeading: string;
}) {
  return (
    <>
      {/* intro */}
      <section className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Overview" title={intro.heading} />
            <div className="prose-go mt-5">
              {intro.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {intro.points.map((p) => (
                <li
                  key={p}
                  className="border-l-2 border-brand-500 pl-3.5 text-[0.8125rem] leading-relaxed text-ink-700"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <EnquiryForm
              source={enquirySource}
              heading={enquiryHeading}
              subheading="Share your brief and we'll send a shortlist with carpet areas, loading and all-in pricing."
              compact
            />
          </div>
        </div>
      </section>

      {/* grouped listings */}
      {groups
        .filter((g) => g.items.length > 0)
        .map((g, gi) => (
          <section
            key={g.label}
            className={
              gi % 2 === 0
                ? "border-y border-ink-200 bg-ink-50/50 py-14 lg:py-20"
                : "py-14 lg:py-20"
            }
          >
            <div className="shell">
              <SectionHeading
                eyebrow={`${g.items.length} ${g.items.length === 1 ? "project" : "projects"}`}
                title={g.label}
              />
              <MobileCarousel
                grid="sm:grid-cols-2 lg:grid-cols-3"
                peek="lg"
                gap="gap-6"
                className="mt-9"
              >
                {g.items.map((p, i) => (
                  <ProjectCard key={p.slug} project={p} priority={gi === 0 && i < 3} />
                ))}
              </MobileCarousel>
            </div>
          </section>
        ))}

      {/* all */}
      <section className="shell py-14 lg:py-20">
        <SectionHeading
          eyebrow="Full directory"
          title="Every project in this category"
          description={`${projects.length} projects currently represented by GoRealtors.`}
          action={{ label: "Open filtered search", href: "/projects" }}
        />
        <div className="mt-9 grid gap-5">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} layout="row" />
          ))}
        </div>
      </section>

      {/* faqs */}
      <section className="border-t border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="FAQs" title="Questions buyers ask us" />
            <FaqAccordion faqs={faqs} className="mt-7" />
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h3 className="font-display text-[1.0625rem] font-bold">
                Want a written comparison?
              </h3>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-600">
                We&apos;ll build you a side-by-side sheet across any three
                projects — carpet area, loading percentage, all-in outgo,
                possession risk and resale comparables. No charge, no
                obligation.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/compare" className="btn btn-primary">
                  Compare projects
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Talk to an advisor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
