import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { HOME_FAQS } from "@/data/content";
import { SITE, WHATSAPP_LINK } from "@/lib/site";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "@/components/brand/SocialIcons";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/contact",
    title: "Contact GoRealtors | Property Enquiries in Gurugram",
    description: `Talk to GoRealtors about property in Gurugram. Call ${SITE.phoneDisplay}, email ${SITE.email} or visit us at SVH Metro Street, Sector 83, Gurugram.`,
  });
}

export default function ContactPage() {
  const mapQuery = encodeURIComponent(SITE.addressOneLine);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Talk About Your Property Requirements"
        description="Share a few details about what you are looking for. Our team can review your enquiry and contact you using the details you provide. A short call is usually enough to narrow a dozen options down to two or three worth visiting."
        crumbs={[{ label: "Contact" }]}
        image="/brand/hero-primary.jpg"
        size="compact"
      />

      {/* contact methods */}
      <section className="border-b border-ink-200">
        <div className="shell grid gap-px bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              Icon: Phone,
              label: "Call us",
              value: SITE.phoneDisplay,
              href: `tel:${SITE.phone}`,
              note: "Fastest response",
            },
            {
              Icon: MessageCircle,
              label: "WhatsApp",
              value: SITE.phoneDisplay,
              href: WHATSAPP_LINK(
                "Hi GoRealtors, I'd like to discuss a property in Gurugram.",
              ),
              note: "Share brochures instantly",
            },
            {
              Icon: Mail,
              label: "Email",
              value: SITE.email,
              href: `mailto:${SITE.email}`,
              note: "Detailed briefs welcome",
            },
            {
              Icon: Clock,
              label: "Office hours",
              value: "Mon - Sat",
              note: "10:00 AM - 7:30 PM IST",
            },
          ].map(({ Icon, label, value, href, note }) => {
            const inner = (
              <>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-ink-950 text-brand-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-4.5 w-4.5" strokeWidth={2.1} />
                </span>
                <span className="mt-3.5 block text-[0.625rem] font-bold uppercase tracking-[0.12em] text-ink-400">
                  {label}
                </span>
                <span className="mt-1 block break-words text-[0.9375rem] font-bold text-ink-950">
                  {value}
                </span>
                <span className="mt-0.5 block text-[0.75rem] text-ink-500">
                  {note}
                </span>
              </>
            );
            return href ? (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group bg-white p-6 transition-colors hover:bg-brand-50/50"
              >
                {inner}
              </a>
            ) : (
              <div key={label} className="group bg-white p-6">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* form + details */}
      <section className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Send an enquiry"
              title="Tell us the brief"
              description="The more you share about budget, timeline and intended use, the more useful our first response will be."
            />
            <EnquiryForm
              source="contact-page"
              variant="bare"
              className="mt-7"
              showBudget
              showRequirement
            />
          </div>

          <div>
            <SectionHeading eyebrow="Visit us" title="Our Gurugram office" />

            <div className="card mt-7 p-6">
              <h3 className="flex items-start gap-2.5 font-display text-[1rem] font-bold">
                <MapPin
                  className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600"
                  strokeWidth={2.2}
                />
                Registered office
              </h3>
              <address className="mt-3 not-italic text-[0.9375rem] leading-relaxed text-ink-700">
                {SITE.legalName}
                <br />
                {SITE.address.line1}
                <br />
                {SITE.address.line2}, {SITE.address.city}
                <br />
                {SITE.address.state} {SITE.address.postalCode}, India
              </address>

              <dl className="mt-5 grid gap-4 border-t border-ink-100 pt-5 sm:grid-cols-2">
                <div>
                  <dt className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                    Nearest landmark
                  </dt>
                  <dd className="mt-0.5 text-[0.8125rem] font-semibold text-ink-900">
                    SVH Metro Street, Sector 83
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                    Office hours
                  </dt>
                  <dd className="mt-0.5 text-[0.8125rem] font-semibold text-ink-900">
                    Mon - Sat, 10:00 - 19:30
                  </dd>
                </div>
              </dl>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm mt-5"
              >
                Get directions
              </a>
            </div>

            <div className="mt-5 overflow-hidden rounded-md border border-ink-200">
              <iframe
                title="GoRealtors office location"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[19rem] w-full border-0"
              />
            </div>

            <div className="card mt-5 p-6">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
                Follow GoRealtors
              </h3>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {[
                  { Icon: Instagram, href: SITE.social.instagram, label: "Instagram" },
                  { Icon: Facebook, href: SITE.social.facebook, label: "Facebook" },
                  { Icon: Linkedin, href: SITE.social.linkedin, label: "LinkedIn" },
                  { Icon: Youtube, href: SITE.social.youtube, label: "YouTube" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm border border-ink-200 px-3 py-2 text-[0.8125rem] font-semibold text-ink-700 transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* faq */}
      <section className="border-t border-ink-200 bg-ink-50/50 py-14 lg:py-20">
        <div className="shell max-w-4xl">
          <SectionHeading
            align="center"
            eyebrow="Before you call"
            title="Answers to the usual first questions"
          />
          <FaqAccordion faqs={HOME_FAQS.slice(0, 5)} className="mt-9" />
        </div>
      </section>
    </>
  );
}
