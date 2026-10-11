import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CompareTool } from "@/components/tools/CompareTool";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllProjects } from "@/lib/repo/projects";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/compare",
    title: "Compare Property Projects in Gurugram | Side-by-Side Comparison",
    description: "Compare up to three Gurugram projects side by side on price, area, configuration, possession, land parcel and RERA status. Free tool from GoRealtors.",
  });
}

export default async function ComparePage() {
  const projects = await getAllProjects();

  return (
    <>
      <PageHero
        eyebrow="Buyer tools"
        title="Compare projects side by side"
        description="Put up to three projects against each other on the parameters that actually matter — then ask us for the carpet-area and all-in-cost version of the same comparison."
        crumbs={[{ label: "Compare" }]}
        image="/brand/band-commercial.jpg"
        size="compact"
      />

      <section className="shell py-12 lg:py-16">
        <CompareTool projects={projects} />
      </section>

      <section className="border-t border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Go deeper"
              title="Want the version with carpet area and total outgo?"
              description="The table above uses publicly quoted super-area figures. The comparison we build for clients adds carpet area, loading percentage, floor-rise and PLC charges, GST, stamp duty, club and IDC charges, and a possession-risk note on each project. It is the document most people actually decide on."
            />
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Carpet area and loading % per configuration",
                "All-in outgo including every statutory charge",
                "Possession-risk assessment per developer",
                "Resale and rental comparables in the same sector",
              ].map((p) => (
                <li
                  key={p}
                  className="border-l-2 border-brand-500 pl-3.5 text-[0.8125rem] leading-relaxed text-ink-700"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <EnquiryForm
            source="compare-tool"
            heading="Request a detailed comparison"
            subheading="Tell us which projects you're weighing up and we'll send the full sheet."
            compact
          />
        </div>
      </section>
    </>
  );
}
