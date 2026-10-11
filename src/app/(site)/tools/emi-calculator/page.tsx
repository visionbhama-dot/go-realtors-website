import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import { EmiCalculator } from "@/components/tools/EmiCalculator";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/tools/emi-calculator",
    title: "Home Loan EMI Calculator | Gurugram Property Cost Calculator",
    description: "Calculate your home loan EMI plus the full acquisition cost of a Gurugram property — GST, Haryana stamp duty and registration included. Built by GoRealtors advisors.",
  });
}

const FAQS = [
  {
    question: "How much home loan am I eligible for?",
    answer:
      "Lenders generally cap the EMI at 50-55% of your net monthly income, and the loan at 75-80% of the agreement value. So on a combined net income of ₹4 lakh a month you could typically service an EMI of around ₹2 lakh, which at 8.5% over 20 years supports a loan of roughly ₹2.3 crore. Existing EMIs reduce this proportionately. We run exact eligibility across a lender panel before you shortlist, because knowing the ceiling changes which corridors are realistic.",
  },
  {
    question: "Should I take the longest tenure available?",
    answer:
      "A longer tenure lowers the EMI, which helps eligibility, but materially increases total interest. On a ₹3 crore loan at 8.5%, moving from 20 to 30 years cuts the EMI by about ₹23,000 but adds roughly ₹1.6 crore in interest over the life of the loan. The practical approach is to take the longer tenure for eligibility, then prepay aggressively — most floating-rate home loans carry no prepayment penalty for individual borrowers.",
  },
  {
    question: "Is GST payable on all property purchases?",
    answer:
      "No. GST at 5% without input tax credit applies to under-construction residential property. Once a project has received its occupation certificate and is sold as ready-to-move, GST does not apply. Commercial property attracts 12% with input credit available, which is often recoverable if you are GST-registered and leasing the asset. This single distinction can shift the effective cost by several percent.",
  },
  {
    question: "What is the stamp duty in Haryana?",
    answer:
      "Haryana charges 7% stamp duty for male buyers in urban areas, 5% for female buyers, and 6% for joint male-female ownership. Registration charges are additional and capped at ₹50,000. Registering in a female family member's name is therefore one of the simplest legitimate ways to reduce acquisition cost on a large purchase — on a ₹5 crore property it saves ₹10 lakh.",
  },
  {
    question: "What is subvention and should I take it?",
    answer:
      "Under a subvention scheme the developer services your loan interest until possession, so you pay only the down payment during construction. It improves cash flow but the cost is usually embedded in a higher base price, and critically the loan is in your name — if the developer stops paying, your credit score takes the hit. We evaluate subvention on a case-by-case basis and are comfortable with it only where the developer's balance sheet is genuinely strong.",
  },
];

export default function EmiCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Buyer tools"
        title="Home loan EMI & total cost calculator"
        description="Most calculators give you an EMI. This one also shows the GST, stamp duty and registration you will actually pay in Haryana — because the quoted price is never the real price."
        crumbs={[{ label: "Tools" }, { label: "EMI Calculator" }]}
        image="/brand/band-residential.jpg"
        size="compact"
      />

      <section className="shell py-12 lg:py-16">
        <EmiCalculator />
      </section>

      <section className="border-y border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Financing FAQs"
              title="What buyers get wrong about home loans"
            />
            <FaqAccordion faqs={FAQS} className="mt-8" />
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <EnquiryForm
              source="emi-calculator"
              heading="Get an exact eligibility check"
              subheading="We run your profile across a panel of banks and HFCs and come back with real sanctioned numbers — not estimates."
              compact
              showBudget
              showRequirement={false}
            />
            <div className="card mt-5 p-5">
              <h3 className="font-display text-[0.9375rem] font-bold">
                Related
              </h3>
              <div className="mt-3 space-y-1">
                {[
                  { label: "Home Loan Assistance", href: "/services/home-loan-assistance" },
                  { label: "Compare Projects", href: "/compare" },
                  { label: "Browse all projects", href: "/projects" },
                  { label: "Buyer FAQs", href: "/faqs" },
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
          </div>
        </div>
      </section>
    </>
  );
}
