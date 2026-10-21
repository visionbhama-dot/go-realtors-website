import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CategoryShowcase } from "@/components/project/CategoryShowcase";
import { PageHero } from "@/components/ui/PageHero";
import { StickyCta } from "@/components/ui/StickyCta";
import { getProjectsByCategory } from "@/lib/repo/projects";
import { formatINR } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/commercial",
    title: "Commercial Property in Gurugram | GoRealtors",
    description: "Explore commercial property opportunities in Gurugram. Review asset type, location, occupancy or lease information, costs and relevant project details.",
  });
}

const FAQS = [
  {
    question: "What rental yield should I expect on Gurugram commercial property?",
    answer:
      "A well-located high-street retail unit with a signed tenant typically delivers 6-8% gross on current capital values. Office floors in Grade-A buildings run 7-9% gross. SCO plots vary widely — a corner plot with frontage on a high-footfall side can exceed 9% once built out and leased, while a badly positioned plot in the same colony may struggle to clear 4%. Net yields run roughly 1-1.5 percentage points below gross after maintenance, property tax and vacancy provisioning.",
  },
  {
    question: "SCO plot or strata retail — which is the better investment?",
    answer:
      "SCO gives you freehold land ownership, control over the build-out, no dependence on a maintenance agency and the ability to construct for a specific tenant's requirement. The trade-off is that you carry construction cost and execution risk, and the ticket size is larger. Strata retail is lower ticket and ready to lease, but you own an undivided share with common-area maintenance obligations and no control over neighbouring tenant mix. For investors with ₹5 crore plus and a 7-10 year horizon, we usually favour SCO. Below that, well-chosen strata retail in a proven catchment is more practical.",
  },
  {
    question: "How do you assess whether a retail catchment will actually work?",
    answer:
      "We look at the resident population within a three-kilometre radius and its absorption timeline, the office seat count that will be operational within walking distance, competing retail supply either delivered or licensed in the same catchment, the anchor tenant mix and whether those anchors have actually signed or are merely in discussion, and the access pattern — which side of the road carries the evening footfall. A project can be beautifully built and still fail on the last point alone.",
  },
  {
    question: "What is the GST and tax treatment on commercial property?",
    answer:
      "GST on under-construction commercial property is 12% with input tax credit available, versus 5% without credit on residential. If you are leasing the asset commercially and are GST-registered, that input credit is typically recoverable, which materially changes the effective cost. Rental income is taxed as income from house property with the standard 30% deduction, and capital gains on sale after 24 months qualify for long-term treatment with indexation. We work these through with partner chartered accountants before you commit, because the post-tax yield is the only number that matters.",
  },
  {
    question: "Can you help find a tenant after I buy?",
    answer:
      "Yes, and we would prefer to be involved before you buy precisely so the asset is leasable. Our leasing mandate covers tenant sourcing and screening, lease negotiation including escalation and lock-in terms, fit-out supervision, and ongoing rent and renewal management. On retail we also advise on tenant mix so you are not placing a competing brand next to your existing tenant.",
  },
  {
    question: "Is Dwarka's commercial market different from Gurugram's?",
    answer:
      "Materially so. Gurugram's commercial corridors carry deep new supply, which means pricing power sits with the buyer and project selection matters enormously. Dwarka is a DDA-planned sub-city with very limited new commercial land release, so inventory is scarce and institution-grade. The Yashobhoomi convention centre and the airport express metro have added a footfall and hospitality demand layer that Gurugram's suburban retail does not have. Different risk, different return profile — both worth holding in a portfolio.",
  },
];

export default async function CommercialPage() {
  const projects = await getProjectsByCategory("commercial");
  const priced = projects.filter((p) => p.priceMin);
  const min = priced.length ? Math.min(...priced.map((p) => p.priceMin!)) : null;

  const groups = [
    {
      label: "SCO plots — freehold commercial land",
      items: projects.filter((p) => p.propertyType.includes("SCO")),
    },
    {
      label: "High-street retail and office formats",
      items: projects.filter((p) => p.propertyType.includes("Retail")),
    },
    {
      label: "New launches",
      items: projects.filter((p) => p.status === "new-launch"),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Commercial & investment"
        title="Explore Commercial Property Opportunities in Gurugram"
        description="Commercial decisions depend on the asset, location, intended use, costs, occupancy, lease terms and your own objectives. Explore available opportunities and review the supporting details — including gross yield, exit cap and catchment strength — before deciding what to investigate further."
        crumbs={[{ label: "Commercial" }]}
        image="/brand/band-commercial.jpg"
        stats={[
          { value: String(projects.length), label: "Live assets" },
          { value: min ? formatINR(min) : "—", label: "Entry ticket" },
          { value: "6-9%", label: "Typical gross yield" },
          {
            value: String(new Set(projects.map((p) => p.locality)).size),
            label: "Corridors",
          },
        ]}
      />

      <CategoryShowcase
        projects={projects}
        enquirySource="commercial-landing"
        enquiryHeading="Request a yield comparison"
        intro={{
          heading: "Commercial property is a cash-flow business, so we model cash flow",
          paragraphs: [
            "Residential buyers can afford to buy on feel. Commercial buyers cannot. The same ₹5 crore deployed two hundred metres apart on the same road can produce a 9% yield or a vacant unit, and the difference is almost never visible in the brochure.",
            "So before we recommend anything, we build the numbers: gross and net yield at realistic achievable rent, exit cap assumptions over a five to ten year hold, the resident and office catchment that will actually generate footfall, competing supply already licensed in the same three kilometres, and which side of the road carries the evening traffic.",
            "Then we tell you what the asset is worth, and whether the asking price leaves you any margin. Sometimes the honest answer is that it does not — and a client who does not buy this year but buys the right thing next year is worth considerably more to us than a commission today.",
          ],
          points: [
            "Gross and net yield modelled at achievable, not quoted, rent",
            "Exit cap and IRR across a five to ten year hold",
            "Three-kilometre catchment and competing supply study",
            "Anchor tenant verification — signed versus in discussion",
            "SCO frontage, FAR and build-out cost analysis",
            "Post-purchase tenant sourcing and lease structuring",
          ],
        }}
        groups={groups}
        faqs={FAQS}
      />

      <StickyCta />
    </>
  );
}
