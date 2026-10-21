import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CategoryShowcase } from "@/components/project/CategoryShowcase";
import { PageHero } from "@/components/ui/PageHero";
import { StickyCta } from "@/components/ui/StickyCta";
import { getProjectsByCategory } from "@/lib/repo/projects";
import { formatINR } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/residential",
    title: "Residential Properties in Gurugram | GoRealtors",
    description: "Explore residential property opportunities in Gurugram. Compare projects by location, budget, configuration and available project information.",
  });
}

const FAQS = [
  {
    question: "Which Gurugram corridor is best for buying a home right now?",
    answer:
      "It depends on what you are optimising for. Golf Course Road gives you the most mature social infrastructure and the most resilient resale values, but at ₹22,000-45,000 per square foot. Golf Course Extension Road offers similar positioning at ₹16,000-28,000. Dwarka Expressway has the strongest infrastructure-led appreciation case and the deepest choice of new launches. New Gurgaon gives you the largest carpet area per rupee. We map these against your commute, schooling needs and holding period rather than recommending a single answer.",
  },
  {
    question: "Should I buy an apartment or an independent floor?",
    answer:
      "Independent floors give you lower density, no high-rise maintenance dependency and typically better carpet efficiency — but fewer amenities and slower resale liquidity. Apartments in large townships give you clubhouse amenities, security infrastructure and a deeper resale market, at the cost of higher monthly maintenance and more loading. For end-use with a 10-year-plus horizon, floors often work better; for investment liquidity, apartments usually do.",
  },
  {
    question: "What is a safe loading percentage to accept?",
    answer:
      "In Gurugram, loading between 30% and 40% is normal for a well-planned project. Between 40% and 50% is common in amenity-heavy high rises and can still be acceptable if the amenities are genuinely usable. Above 55% you are paying substantially for shared space, and we would want a strong reason. We state carpet area explicitly on every comparison sheet so you are never comparing a 32% loading project against a 52% one on the same per-square-foot headline.",
  },
  {
    question: "How much should I budget beyond the quoted price?",
    answer:
      "Plan for roughly 12-18% on top of the base price. That typically covers GST at 5% on under-construction property, stamp duty and registration in Haryana (7% for male buyers, 5% for female, plus registration), club membership and infrastructure development charges, power backup and parking charges, and one year of advance maintenance. We itemise all of these before you book so the total outgo is never a surprise.",
  },
  {
    question: "Is it better to buy at launch or closer to possession?",
    answer:
      "Launch-stage pricing is typically 15-25% below the same project near possession, which is the compensation you receive for construction and delivery risk. That trade is worth taking with a developer that has a clean delivery record and a RERA-compliant escrow discipline. With a first-time or thinly capitalised developer it usually is not. This is precisely the judgement we are paid to make on your behalf.",
  },
  {
    question: "Can I negotiate on a new launch?",
    answer:
      "Yes, though rarely on the headline per-square-foot rate, which developers protect. The negotiable levers are floor-rise charges, preferential location charges, club and infrastructure charges, payment plan structure, and occasionally a free car park or waived maintenance period. On a ₹4 crore booking these typically add up to between ₹8 lakh and ₹25 lakh. Because we transact volume with these developers, we negotiate from a stronger position than an individual buyer walking into a site office.",
  },
];

export default async function ResidentialPage() {
  const projects = await getProjectsByCategory("residential");
  const priced = projects.filter((p) => p.priceMin);
  const min = priced.length ? Math.min(...priced.map((p) => p.priceMin!)) : null;
  const max = priced.length ? Math.max(...priced.map((p) => p.priceMin!)) : null;

  const groups = [
    {
      label: "New launches and pre-launch allocations",
      items: projects.filter((p) => p.status === "new-launch"),
    },
    {
      label: "Advisor picks — strongest fundamentals",
      items: projects.filter((p) => p.featured && p.status !== "new-launch"),
    },
    {
      label: "Under ₹4 Cr — best value right now",
      items: projects.filter((p) => p.priceMin && p.priceMin < 40000000),
    },
    {
      label: "Ultra-luxury above ₹7 Cr",
      items: projects.filter((p) => p.priceMin && p.priceMin >= 70000000),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Residential"
        title="Find a Home That Fits Your Life and Plans"
        description="Explore residential projects across selected Gurugram locations. Compare layouts, budgets, amenities, location factors and project information to create a shortlist that fits your needs. Every project below has been checked for HARERA registration, carpet-area efficiency and the developer's delivery record."
        crumbs={[{ label: "Residential" }]}
        image="/brand/band-residential.jpg"
        stats={[
          { value: String(projects.length), label: "Live projects" },
          {
            value: min ? formatINR(min) : "—",
            label: "Entry price",
          },
          { value: max ? formatINR(max) : "—", label: "Top end" },
          {
            value: String(new Set(projects.map((p) => p.locality)).size),
            label: "Corridors",
          },
        ]}
      />

      <CategoryShowcase
        projects={projects}
        enquirySource="residential-landing"
        enquiryHeading="Get a curated residential shortlist"
        intro={{
          heading: "What we actually do differently on residential",
          paragraphs: [
            "Gurugram currently has more residential supply under construction than at any point in its history, which is good news for buyers and dangerous for the unprepared. Two towers on the same road, quoted at the same per-square-foot rate, can differ by twenty percent in usable carpet area and by three years in realistic possession.",
            "So we do not start with projects. We start with your commute, your children's schooling, how long you intend to hold, and how the purchase is being financed. Only then do we shortlist — and the shortlist arrives as a comparison sheet with carpet area, loading percentage, all-in outgo and possession risk stated side by side.",
            "Where a project does not stack up, we say so. We have talked clients out of more bookings than we would like to admit, and it is the single reason most of our business arrives by referral.",
          ],
          points: [
            "Carpet area and loading stated explicitly on every option",
            "All-in outgo including GST, stamp duty, club and IDC charges",
            "Developer delivery record and HARERA QPR filings verified",
            "Tower, floor and facing selected from live inventory sheets",
            "Negotiation on floor-rise, PLC and payment plan structure",
            "Zero brokerage to you on primary and new-launch purchases",
          ],
        }}
        groups={groups}
        faqs={FAQS}
      />

      <StickyCta />
    </>
  );
}
