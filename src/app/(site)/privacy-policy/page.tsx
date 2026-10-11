import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/privacy-policy",
    title: "Privacy Policy",
    description: "How GoRealtors collects, uses, stores and protects the personal information you share through this website and our advisory process.",
  });
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      crumbLabel="Privacy Policy"
      title="Privacy Policy"
      updated="11 October 2026"
      intro="This policy explains what personal information GoRealtors collects, why we collect it, who we share it with, and the control you retain over it."
      sections={[
        {
          heading: "Who we are",
          body: [
            `This website is operated by ${SITE.legalName}, a real estate advisory firm with its registered office at ${SITE.addressOneLine}. References to "we", "us" and "our" mean GoRealtors. References to "you" mean any visitor to this website or any person who shares information with us.`,
            `For any question about this policy or about data we hold on you, contact us at ${SITE.email} or ${SITE.phoneDisplay}.`,
          ],
        },
        {
          heading: "Information we collect",
          body: [
            "When you submit an enquiry form, request a call back, subscribe to our newsletter or apply for a role, we collect the information you provide directly: your name, mobile number, email address, budget range, stated requirement and any message you write. For job applications we additionally collect your CV or portfolio link and cover note.",
            "When you browse the site, our hosting and analytics providers may automatically record technical information including your IP address, browser type and version, device type, the pages you visited, referring URL and timestamps. This is used in aggregate to understand which content is useful and to detect abuse.",
            "We do not collect payment card details on this website. We do not knowingly collect information from anyone under the age of 18.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "We use the contact details you provide to respond to your enquiry, share project information, pricing and floor plans, arrange site visits, and follow up on an active requirement. This is the primary purpose of collection and is the basis on which you provide the information.",
            "Where you have consented, we may contact you by call, SMS, email or WhatsApp about projects, launches and market updates we believe are relevant to your stated requirement. The consent checkbox on our forms notes that this consent overrides any DNC or NDNC registration, as is standard for real estate enquiries in India. You can withdraw it at any time.",
            "We use enquiry data in aggregate to understand demand patterns across corridors and configurations. Aggregated, de-identified data may inform our published market insights, but no individual is identifiable in anything we publish.",
          ],
        },
        {
          heading: "Who we share information with",
          body: [
            "To progress an active enquiry we may share your name and contact number with the developer or their authorised sales team for the specific project you have enquired about. This is necessary for us to register you as our client with that developer, which is what secures our advisory position and any negotiated terms on your behalf. We share only what is necessary and only for projects you have actually enquired about.",
            "Where you ask us to arrange financing or legal review, we may share relevant details with empanelled banks, housing finance companies or legal counsel, with your knowledge.",
            "We use third-party service providers for website hosting, database storage and email delivery. These providers process data on our instructions under their own security obligations. We do not sell, rent or trade your personal information to any third party for their own marketing purposes.",
            "We may disclose information where required by law, by a court order, or by a regulatory or law enforcement authority with lawful jurisdiction.",
          ],
        },
        {
          heading: "Data storage and security",
          body: [
            "Enquiry and subscriber data is stored in a managed database with access restricted to authorised GoRealtors personnel. Access is role-based: team members see only the records relevant to their function, and administrative access is limited to a small number of accounts.",
            "We apply encryption in transit (HTTPS) across the website and rely on our infrastructure providers for encryption at rest. No method of transmission or storage is completely secure, and while we take reasonable and appropriate measures, we cannot guarantee absolute security.",
            "Our website and database may be hosted on infrastructure located outside India. By submitting information you consent to its transfer and processing in those locations under the protections described here.",
          ],
        },
        {
          heading: "How long we keep information",
          body: [
            "We retain enquiry records for as long as needed to serve your requirement and for a reasonable period afterwards, since property decisions frequently resume after long gaps. Where a transaction has completed we retain records for the period required to meet legal, tax and audit obligations.",
            "Newsletter subscriptions are retained until you unsubscribe. Job applications are retained for twelve months unless you ask us to delete them sooner.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You may ask us to confirm what personal information we hold about you, provide a copy of it, correct anything inaccurate, or delete it. You may also withdraw marketing consent at any time without affecting our ability to respond to an active enquiry you have raised.",
            `To exercise any of these, email ${SITE.email} from the address you provided or call ${SITE.phoneDisplay}. We will verify your identity before acting and will respond within a reasonable period. Where we are legally required to retain certain records we will tell you so and explain why.`,
            "To stop marketing messages specifically, reply STOP to any SMS or WhatsApp message, use the unsubscribe link in any email, or simply tell the advisor you are speaking with.",
          ],
        },
        {
          heading: "Cookies and analytics",
          body: [
            "This website uses cookies and similar storage for essential functions — maintaining your session, remembering filter selections and keeping administrative logins secure. These are necessary for the site to work.",
            "We may also use analytics and advertising measurement tools to understand how visitors find and use the site, and to measure the effectiveness of our campaigns. These may set cookies that record anonymous usage patterns. You can block or delete cookies through your browser settings, though essential cookies are required for parts of the site to function.",
          ],
        },
        {
          heading: "Third-party links",
          body: [
            "This website links to developer websites, the Haryana RERA portal, Google Maps and our social media profiles. Those services operate under their own privacy policies and we are not responsible for their practices. Please review their policies before sharing information with them.",
          ],
        },
        {
          heading: "Changes to this policy",
          body: [
            "We may update this policy to reflect changes in our practices or legal obligations. The revision date at the top of this page always reflects the current version. Material changes affecting how we use your information will be communicated to active subscribers by email.",
          ],
        },
      ]}
    />
  );
}
