import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/terms",
    title: "Terms of Use",
    description: "The terms governing your use of the GoRealtors website, the nature of the information published here, and the limits of our role as a real estate advisory.",
  });
}

export default function TermsPage() {
  return (
    <LegalPage
      crumbLabel="Terms of Use"
      title="Terms of Use"
      updated="11 October 2026"
      intro="These terms govern your use of this website. By browsing the site or submitting an enquiry you accept them. Please read the sections on project information and our role carefully."
      sections={[
        {
          heading: "Acceptance of these terms",
          body: [
            `This website is operated by ${SITE.legalName}, registered office ${SITE.addressOneLine}. By accessing or using this website you agree to be bound by these Terms of Use and by our Privacy Policy. If you do not accept them, please do not use the site.`,
            "We may revise these terms from time to time. The version published on this page at the time of your use is the version that applies.",
          ],
        },
        {
          heading: "Our role and what we are not",
          body: [
            "GoRealtors is a real estate advisory firm and an authorised channel partner for the developers whose projects appear on this website. We are not the promoter, developer, builder or owner of any project listed here, and we do not construct, sell or deliver property in our own name.",
            "We act on the buyer's or investor's side of a transaction. Our role is to advise, shortlist, conduct diligence, negotiate and coordinate. The contract of sale is always between you and the developer or property owner directly. We are not a party to that contract and assume no obligation under it.",
            "Nothing on this website constitutes an offer, an invitation to offer, or a binding commitment by us or by any developer. Any booking creates rights only through the application form, allotment letter and builder-buyer agreement executed between you and the developer.",
          ],
        },
        {
          heading: "Project information is indicative",
          body: [
            "All project information published on this website — including prices, carpet and super areas, unit configurations, layouts, specifications, amenities, land parcel size, tower and unit counts, approval status and possession timelines — is sourced from the respective developers and is indicative only.",
            "Developers may change any of these at their sole discretion without notice to us or to you. Prices quoted are starting prices for the stated configuration and are exclusive of GST, stamp duty, registration charges, preferential location charges, floor-rise, club membership, infrastructure development charges, parking, power backup, maintenance and any other statutory or project-specific levy, unless expressly stated otherwise.",
            "All images, renders, walkthroughs and floor plans are artistic impressions supplied by developers for illustration. They are not to scale and the delivered product may differ materially. Furniture, landscaping, finishes and surroundings shown may not form part of the sale.",
            "You must independently verify every material detail before making any financial commitment. In particular, verify the project's HARERA registration number and quarterly progress reports on the official Haryana RERA portal at haryanarera.gov.in, and read the builder-buyer agreement in full.",
          ],
        },
        {
          heading: "No investment, legal or tax advice",
          body: [
            "Content on this website, including market insights, corridor guides, yield commentary and the output of our calculators, is general information published for educational purposes. It does not constitute investment advice, legal advice, tax advice or a recommendation to buy or sell any specific property.",
            "Property values can fall as well as rise. Rental yields depend on factors outside anyone's control including tenant demand, competing supply and macroeconomic conditions. Past performance of a corridor or developer is not a reliable indicator of future outcomes.",
            "Our EMI and cost calculators produce indicative estimates based on the inputs you provide and on assumptions about statutory rates stated on those pages. Actual loan eligibility, interest rates, statutory charges and total cost will differ. Please obtain formal quotations from lenders and advice from a qualified chartered accountant or advocate before relying on any figure.",
          ],
        },
        {
          heading: "Fees and brokerage",
          body: [
            "On primary and new-launch transactions our fee is paid by the developer, and no brokerage is charged to the buyer. This is disclosed openly because it is relevant to how you weigh our advice.",
            "For resale transactions, leasing mandates, property management and standalone due diligence engagements, a fee is payable by the client. The amount and basis are agreed and confirmed in writing before any such engagement begins. We do not charge fees that have not been disclosed in advance.",
            "We do not accept referral commissions from banks or housing finance companies on loan introductions.",
          ],
        },
        {
          heading: "Your use of the website",
          body: [
            "You may use this website for lawful purposes connected with evaluating property. You must not attempt to gain unauthorised access to any part of the site, its database or its administrative interfaces; scrape, harvest or systematically extract content; introduce malicious code; interfere with the site's operation; or use the site to transmit unsolicited commercial communications.",
            "Enquiry forms must be submitted with accurate information. Submitting false contact details or impersonating another person is a misuse of the service.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "The GoRealtors name, logo, wordmark, website design, layout, written content, market insights and compilations published here are owned by us or licensed to us and are protected by applicable intellectual property law. You may not reproduce, republish or commercially exploit them without our prior written permission.",
            "Developer names, project names, logos and marketing imagery remain the property of their respective owners and are used here in the course of our authorised channel-partner relationship.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "This website and its content are provided on an \"as is\" and \"as available\" basis. To the fullest extent permitted by law we exclude all warranties, express or implied, as to the accuracy, completeness, currency or fitness for purpose of any content published here.",
            "We will not be liable for any indirect, incidental, special or consequential loss, or for any loss of profit, opportunity, savings or goodwill, arising from your use of this website or from reliance on content published here. Nothing in these terms excludes liability that cannot lawfully be excluded, including liability for fraud.",
          ],
        },
        {
          heading: "Third-party sites and services",
          body: [
            "This website links to developer websites, the Haryana RERA portal, Google Maps, WhatsApp and our social media profiles. We do not control those services and are not responsible for their content, availability or practices. Links are provided for convenience and do not imply endorsement.",
          ],
        },
        {
          heading: "Governing law and jurisdiction",
          body: [
            "These terms are governed by the laws of India. The courts at Gurugram, Haryana shall have exclusive jurisdiction over any dispute arising out of or in connection with these terms or your use of this website.",
            `For any question about these terms, contact ${SITE.email} or ${SITE.phoneDisplay}.`,
          ],
        },
      ]}
    />
  );
}
