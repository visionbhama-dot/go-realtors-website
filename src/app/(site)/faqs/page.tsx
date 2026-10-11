import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { HOME_FAQS } from "@/data/content";
import { SITE } from "@/lib/site";
import type { Faq } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/faqs",
    title: "Property Buyer FAQs | Gurugram Real Estate Questions Answered",
    description: "Straight answers on carpet versus super area, loading, HARERA verification, stamp duty in Haryana, NRI purchase, SCO plots and brokerage — from GoRealtors advisors.",
  });
}

const GROUPS: { id: string; title: string; blurb: string; faqs: Faq[] }[] = [
  {
    id: "working-with-us",
    title: "Working with GoRealtors",
    blurb: "How the engagement works, and how we get paid.",
    faqs: HOME_FAQS.slice(0, 4),
  },
  {
    id: "area-and-pricing",
    title: "Area, pricing & charges",
    blurb: "The mechanics that quietly decide whether a purchase works out.",
    faqs: [
      HOME_FAQS[5]!,
      {
        question: "What charges should I expect beyond the base price?",
        answer:
          "Budget 12-18% above the quoted base price. That typically covers GST at 5% on under-construction residential property, Haryana stamp duty at 7% for male buyers (5% female, 6% joint) plus registration capped at ₹50,000, club membership and infrastructure development charges, preferential location charges and floor-rise where applicable, power backup and car parking, and one year of advance maintenance. We itemise all of these per project before you book.",
      },
      {
        question: "What is floor-rise and is it negotiable?",
        answer:
          "Floor-rise is a per-square-foot premium developers charge for higher floors, typically ₹25-100 per square foot per floor above a base level. On a 2,500 sq.ft. unit on the 20th floor that can add ₹15-30 lakh. It is one of the most negotiable line items in a booking, along with preferential location charges and club charges — far more so than the headline rate, which developers protect because it sets the benchmark for the rest of the tower.",
      },
      {
        question: "How do I know if a project is overpriced?",
        answer:
          "Compare it on carpet-area rate, not super-area rate, against three things: recently transacted primary rates in the same sector, resale rates for comparable completed projects within two kilometres, and the achievable rent if the asset were leased. If the carpet rate is more than 12-15% above sector comparables without a clear justification — a materially better developer, a genuinely scarce location, or a much lower loading — you are paying for marketing.",
      },
    ],
  },
  {
    id: "legal-and-rera",
    title: "Legal, RERA & due diligence",
    blurb: "What we verify before a project reaches your shortlist.",
    faqs: [
      HOME_FAQS[2]!,
      {
        question: "How do I verify a HARERA registration myself?",
        answer:
          "Go to haryanarera.gov.in, open the registered projects search and enter the registration number or project name. You should be able to see the registration certificate, the declared completion date, and the quarterly progress reports the promoter is legally required to file. If QPRs are missing or significantly behind the declared schedule, that is a material signal. We check this on every project and will show you the filings.",
      },
      {
        question: "What should I look for in a builder-buyer agreement?",
        answer:
          "The possession date and whether it is firm or subject to force majeure language broad enough to be meaningless; the compensation payable to you for delay and whether it is symmetrical with the penalty you pay for late payment; the definition of carpet area and whether it matches RERA's definition; the developer's right to alter the layout or amenities; the exit and refund mechanism if you cancel; and any clause allowing escalation of the agreed price. We review these clause by clause with empanelled counsel before you sign.",
      },
      {
        question: "Is an occupation certificate the same as a completion certificate?",
        answer:
          "No. A completion certificate confirms the building was constructed per approved plans. An occupation certificate confirms it is legally fit for occupation, which is what you actually need before taking possession and the point at which GST ceases to apply. Taking possession without an OC exposes you to significant risk, including difficulty obtaining utility connections and problems at resale. Never register or take handover on a verbal assurance that the OC is coming.",
      },
    ],
  },
  {
    id: "nri",
    title: "NRI buyers",
    blurb: "Remote purchase, FEMA, repatriation and registry by proxy.",
    faqs: [
      HOME_FAQS[3]!,
      {
        question: "Can an NRI buy any type of property in India?",
        answer:
          "NRIs and persons of Indian origin may freely purchase residential and commercial property in India. The restriction is on agricultural land, plantation property and farmhouses, which require RBI approval. Payment must be routed through normal banking channels using NRE, NRO or FCNR accounts, or by inward remittance — not foreign currency in cash.",
      },
      {
        question: "How does repatriation of sale proceeds work?",
        answer:
          "Sale proceeds on up to two residential properties can be repatriated, subject to the purchase having been made through NRE or inward remittance, and capped at the original foreign-currency amount invested for those properties. Repatriation from an NRO account is permitted up to USD 1 million per financial year with Form 15CA/15CB certification from a chartered accountant. We coordinate this with partner CAs rather than leaving you to figure it out at sale time.",
      },
      {
        question: "What TDS applies when an NRI sells property?",
        answer:
          "The buyer is required to deduct TDS on the sale consideration — currently 20% plus surcharge and cess on long-term capital gains for NRI sellers, which is substantially higher than the 1% applicable to resident sellers. You can apply to the Income Tax Department for a lower deduction certificate under Section 197 if the actual gain is lower than the deduction, which is usually worth doing on a large transaction.",
      },
    ],
  },
  {
    id: "commercial-sco",
    title: "Commercial & SCO plots",
    blurb: "Yield mechanics and the plotted commercial format.",
    faqs: [
      HOME_FAQS[4]!,
      {
        question: "What yield should I underwrite on Gurugram commercial?",
        answer:
          "High-street retail with a signed tenant typically delivers 6-8% gross on current capital values; Grade-A office floors 7-9%. Well-positioned SCO can exceed 9% once built out and leased, but a poorly positioned plot in the same colony may not clear 4%. Net yields run roughly 1-1.5 percentage points below gross once maintenance, property tax and a realistic vacancy provision are applied. Underwrite on achievable rent, not quoted rent.",
      },
      {
        question: "How much does it cost to build out an SCO plot?",
        answer:
          "Construction on an SCO plot in Gurugram currently runs roughly ₹2,200-3,500 per square foot of built-up area depending on specification, finish level and whether you are building to a tenant's fit-out requirement. On a four-floor build-out over a 1,000 square yard plot that is a material second cheque, and it needs to be in the model from day one. We build the total-cost-to-lease figure, not just the land price.",
      },
      {
        question: "Does GST input credit apply on commercial purchases?",
        answer:
          "Commercial property under construction attracts 12% GST with input tax credit available. If you are GST-registered and will be leasing the asset as a commercial supply, that credit is typically recoverable, which changes the effective acquisition cost meaningfully versus the headline. The treatment depends on your registration status and intended use, so we work it through with a chartered accountant before you commit.",
      },
    ],
  },
  {
    id: "process",
    title: "Process & timelines",
    blurb: "What happens, and how long it takes.",
    faqs: [HOME_FAQS[6]!, HOME_FAQS[7]!],
  },
];

export default function FaqsPage() {
  const allFaqs = GROUPS.flatMap((g) => g.faqs);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title="Straight answers, including the inconvenient ones"
        description="Everything buyers ask us about area definitions, charges, RERA verification, NRI purchase and commercial yields — answered the way we'd answer on a call."
        crumbs={[{ label: "FAQs" }]}
        image="/brand/band-residential.jpg"
        size="compact"
      />

      <section className="shell py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[14rem_1fr_19rem] lg:gap-10">
          {/* jump nav */}
          <nav
            aria-label="FAQ categories"
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
              Jump to
            </p>
            <ul className="mt-3 space-y-0.5">
              {GROUPS.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="block rounded-sm px-2.5 py-2 text-[0.8125rem] font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
                  >
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* groups */}
          <div className="min-w-0 space-y-12">
            {GROUPS.map((g) => (
              <section key={g.id} id={g.id} className="scroll-mt-32">
                <span className="eyebrow">{g.faqs.length} questions</span>
                <h2 className="mt-2.5 font-display text-[1.375rem] font-bold">
                  {g.title}
                </h2>
                <p className="mt-1.5 text-[0.875rem] text-ink-500">{g.blurb}</p>
                <FaqAccordion faqs={g.faqs} defaultOpen={null} className="mt-5" />
              </section>
            ))}
          </div>

          {/* aside */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <EnquiryForm
              source="faqs"
              heading="Question not answered?"
              subheading="Ask it directly. We answer buyer questions whether or not you end up transacting with us."
              compact
              showBudget={false}
            />
            <div className="card mt-5 p-5">
              <h3 className="font-display text-[0.9375rem] font-bold">
                Prefer to talk?
              </h3>
              <a
                href={`tel:${SITE.phone}`}
                className="btn btn-dark mt-3 w-full"
              >
                {SITE.phoneDisplay}
              </a>
              <p className="mt-2.5 text-center text-[0.6875rem] text-ink-400">
                {SITE.hours}
              </p>
              <div className="mt-4 space-y-1 border-t border-ink-100 pt-4">
                {[
                  { label: "EMI Calculator", href: "/tools/emi-calculator" },
                  { label: "Compare Projects", href: "/compare" },
                  { label: "Market Insights", href: "/blog" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-[0.8125rem] text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
                  >
                    {l.label}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
