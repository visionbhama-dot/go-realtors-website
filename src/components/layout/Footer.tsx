import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "@/components/brand/SocialIcons";
import { Logo } from "@/components/brand/Logo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { SITE } from "@/lib/site";
import { getAllProjects, getDevelopers, getLocalities } from "@/lib/repo/projects";

export async function Footer() {
  const [projects, developers, localities] = await Promise.all([
    getAllProjects(),
    getDevelopers(),
    getLocalities(),
  ]);

  const residential = projects.filter((p) => p.category === "residential");
  const commercial = projects.filter((p) => p.category === "commercial");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-white">
      {/* ---- newsletter strip ---- */}
      <div className="border-b border-white/10">
        <div className="shell grid gap-6 py-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
          <div>
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
              Get Gurugram&apos;s new launches before they go public
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              One email a fortnight: pre-launch allocations, corridor price
              movements and the projects we would actually put our own money
              into. No listing spam.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* ---- link columns ---- */}
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="light" />
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            GoRealtors helps people explore property opportunities in Gurugram
            with clear information, considered comparisons and guidance tailored
            to their requirements.
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.addressOneLine)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 text-white/70 transition-colors hover:text-brand-400"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={2.2} />
              <span>
                {SITE.address.line1}
                <br />
                {SITE.address.line2}, {SITE.address.city}
                <br />
                {SITE.address.state} {SITE.address.postalCode}
              </span>
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-2.5 font-semibold text-white transition-colors hover:text-brand-400"
            >
              <Phone className="h-4 w-4 shrink-0 text-brand-500" strokeWidth={2.2} />
              {SITE.phoneDisplay}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-2.5 text-white/70 transition-colors hover:text-brand-400"
            >
              <Mail className="h-4 w-4 shrink-0 text-brand-500" strokeWidth={2.2} />
              {SITE.email}
            </a>
          </div>

          <div className="mt-6 flex items-center gap-2.5">
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
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 text-white/70 transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white"
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          heading="Residential Projects"
          links={residential.slice(0, 9).map((p) => ({
            label: p.name,
            href: `/projects/${p.slug}`,
          }))}
          more={{ label: "View all", href: "/residential" }}
        />

        <FooterCol
          heading="Commercial Projects"
          links={commercial.slice(0, 7).map((p) => ({
            label: p.name,
            href: `/projects/${p.slug}`,
          }))}
          more={{ label: "View all", href: "/commercial" }}
        />

        <FooterCol
          heading="Top Locations"
          links={[
            ...localities.map((l) => ({
              label: l.name,
              href: `/locations/${l.slug}`,
            })),
            { label: "All Locations", href: "/locations" },
          ]}
        />

        <div className="space-y-8">
          <FooterCol
            heading="Developers"
            links={developers.slice(0, 7).map((d) => ({
              label: d.short,
              href: `/developers/${d.slug}`,
            }))}
            more={{ label: "All developers", href: "/developers" }}
          />
          <FooterCol
            heading="Company"
            links={[
              { label: "About Us", href: "/about" },
              { label: "Our Team", href: "/team" },
              { label: "Services", href: "/services" },
              { label: "Market Insights", href: "/blog" },
              { label: "Careers", href: "/careers" },
              { label: "Contact", href: "/contact" },
            ]}
          />
        </div>
      </div>

      {/* ---- tool strip ---- */}
      <div className="border-t border-white/10">
        <div className="shell flex flex-wrap items-center gap-x-6 gap-y-2 py-4 text-[0.8125rem]">
          <span className="font-semibold text-white/40">Quick tools</span>
          {[
            { label: "EMI Calculator", href: "/tools/emi-calculator" },
            { label: "Compare Projects", href: "/compare" },
            { label: "Advanced Search", href: "/search" },
            { label: "Buyer FAQs", href: "/faqs" },
            { label: "Sitemap", href: "/sitemap.xml" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/65 transition-colors hover:text-brand-400"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ---- disclaimer ---- */}
      <div className="border-t border-white/10">
        <div className="shell py-6">
          <p className="text-[0.75rem] leading-relaxed text-white/40">
            <strong className="font-semibold text-white/60">Disclaimer:</strong>{" "}
            GoRealtors is an authorised channel partner and real estate advisory
            firm. We are not the developer or promoter of any project listed on
            this website. All project information — including pricing, area,
            specifications, approvals and possession timelines — is indicative,
            sourced from the respective developers, and subject to change at
            their discretion without notice. Prices quoted are exclusive of
            applicable GST, stamp duty, registration charges and other
            statutory levies unless stated otherwise. Images are artistic
            impressions provided by developers and may differ from the delivered
            product. Nothing on this website constitutes an offer or guarantee.
            Please verify all details, including HARERA registration and
            quarterly progress reports, on the{" "}
            <a
              href="https://haryanarera.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand-400"
            >
              Haryana RERA portal
            </a>{" "}
            and review the builder-buyer agreement before making any financial
            commitment.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-5 text-[0.8125rem] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href="/privacy-policy" className="hover:text-brand-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-brand-400">
              Terms of Use
            </Link>
            <Link href="/disclaimer" className="hover:text-brand-400">
              Disclaimer
            </Link>
            <Link href="/image-credits" className="hover:text-brand-400">
              Image Credits
            </Link>
            <Link href="/admin" className="hover:text-brand-400">
              Staff Login
            </Link>
          </div>
        </div>
      </div>

      {/* ---- design credit ---- */}
      <div className="border-t border-white/10 bg-ink-950">
        <div className="shell py-4 text-center text-[0.75rem] text-white/45">
          Designed &amp; developed by{" "}
          <a
            href="https://bhamavision.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white/70 transition-colors hover:text-brand-400"
          >
            Bhama Vision
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  links,
  more,
}: {
  heading: string;
  links: { label: string; href: string }[];
  more?: { label: string; href: string };
}) {
  return (
    <div>
      <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-400">
        {heading}
      </h3>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-white/60 transition-colors hover:text-brand-400"
            >
              {l.label}
            </Link>
          </li>
        ))}
        {more && (
          <li>
            <Link
              href={more.href}
              className="inline-flex items-center gap-1 font-semibold text-brand-400 hover:underline"
            >
              {more.label}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
