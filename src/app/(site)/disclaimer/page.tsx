import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/disclaimer",
    title: "Disclaimer",
    description: "Important disclosures about the project information published on the GoRealtors website, our channel-partner role and the verification you should carry out before buying.",
  });
}

export default function DisclaimerPage() {
  return (
    <LegalPage
      crumbLabel="Disclaimer"
      title="Disclaimer"
      updated="11 October 2026"
      intro="Please read this page before relying on any project information published on this website. It sets out what we are, what the information is, and what you must verify yourself."
      sections={[
        {
          heading: "We are an advisory, not a developer",
          body: [
            `${SITE.legalName} is a real estate advisory firm and an authorised channel partner for the developers whose projects appear on this website. We are not the promoter, developer or owner of any project listed here.`,
            "Every project named on this site belongs to the respective developer. Project names, logos and marketing material are the property of those developers and are used in the course of our authorised channel-partner relationship. Any sale contract is executed directly between you and the developer; we are not a party to it.",
          ],
        },
        {
          heading: "All project information is indicative",
          body: [
            "Prices, carpet and super areas, unit configurations, floor plans, specifications, amenities, land parcel size, tower and unit counts, approval status, RERA details and possession timelines are sourced from the respective developers and are indicative only.",
            "Developers may change any of this at their sole discretion and without notice. Where a possession date is shown, it reflects the developer's current stated expectation, not a guarantee. Where a price is shown, it is a starting price for the stated configuration at the time of publication and is subject to revision.",
            "We make reasonable efforts to keep this information current, but we cannot warrant its accuracy or completeness at any given moment.",
          ],
        },
        {
          heading: "Pricing excludes statutory and additional charges",
          body: [
            "Unless expressly stated otherwise, all prices shown on this website are base prices and exclude GST, stamp duty, registration charges, preferential location charges, floor-rise charges, club membership, infrastructure development charges, car parking, power backup, advance maintenance, and any other statutory levy or project-specific charge.",
            "Total acquisition cost in Gurugram typically runs 12-18% above the quoted base price for residential property. Our EMI and cost calculators produce indicative estimates only; actual figures depend on the project, your buyer profile and prevailing statutory rates. Obtain an itemised cost sheet from us or from the developer before committing.",
          ],
        },
        {
          heading: "Images are artistic impressions",
          body: [
            "All renders, walkthroughs, elevations, interior visuals and landscape imagery on this website are artistic impressions supplied by developers for illustrative purposes. They are not to scale and are not photographs of a delivered product.",
            "Furniture, fittings, finishes, appliances, landscaping, vehicles and surroundings depicted may not form part of the sale and may differ materially from what is ultimately delivered. Floor plans shown are typical layouts and may vary by tower, floor and unit.",
          ],
        },
        {
          heading: "No investment, legal or tax advice",
          body: [
            "Market insights, corridor guides, price bands, yield commentary and growth outlooks published on this website are general information for educational purposes. They do not constitute investment advice, legal advice, tax advice or a recommendation to buy or sell any particular property.",
            "Real estate values can fall as well as rise. Rental yields depend on tenant demand, competing supply, infrastructure delivery and macroeconomic conditions, none of which can be guaranteed. The historic performance of a corridor, developer or asset class is not a reliable indicator of future returns.",
            "Please obtain independent advice from a qualified chartered accountant, advocate or registered investment adviser before acting on anything published here.",
          ],
        },
        {
          heading: "What you must verify before buying",
          body: [
            "Verify the project's HARERA registration number and its quarterly progress report filings on the official Haryana RERA portal at haryanarera.gov.in. Confirm the declared completion date and check whether QPR filings are current.",
            "Verify the developer's licence, zoning approval, approved building plans and — for ready inventory — the occupation certificate. Confirm the title chain and run an encumbrance search through independent legal counsel.",
            "Read the builder-buyer agreement in full before signing, paying particular attention to the carpet-area definition, possession date and force majeure language, delay compensation, price escalation rights and the cancellation and refund mechanism.",
            "We conduct this diligence for our clients as part of our mandate and will share our findings, but the responsibility for satisfying yourself rests with you as the purchaser.",
          ],
        },
        {
          heading: "Third-party content and links",
          body: [
            "This website embeds Google Maps and links to developer websites, the Haryana RERA portal, WhatsApp and our social media profiles. We do not control these services and accept no responsibility for their content, accuracy or availability. Inclusion of a link does not imply endorsement.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "To the fullest extent permitted by law, GoRealtors accepts no liability for any loss or damage arising from reliance on information published on this website, from any inaccuracy or omission in that information, or from any act or omission of a developer.",
            `If you believe anything on this website is inaccurate or out of date, please tell us at ${SITE.email} and we will review and correct it promptly.`,
          ],
        },
      ]}
    />
  );
}
