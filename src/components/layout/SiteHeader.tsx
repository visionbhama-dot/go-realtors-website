import { Header, type HeaderNavItem } from "./Header";
import {
  getAllProjects,
  getDevelopers,
  getLocalities,
} from "@/lib/repo/projects";

export async function SiteHeader() {
  const [projects, developers, localities] = await Promise.all([
    getAllProjects(),
    getDevelopers(),
    getLocalities(),
  ]);

  const countFor = (fn: (p: (typeof projects)[number]) => boolean) =>
    String(projects.filter(fn).length);

  const residential = projects.filter((p) => p.category === "residential");
  const commercial = projects.filter((p) => p.category === "commercial");

  const nav: HeaderNavItem[] = [
    { label: "Home", href: "/" },
    {
      label: "Residential",
      href: "/residential",
      mega: [
        {
          heading: "Featured Residential",
          viewAll: { label: "All residential projects", href: "/residential" },
          items: residential
            .filter((p) => p.featured)
            .slice(0, 6)
            .map((p) => ({
              label: p.name,
              href: `/projects/${p.slug}`,
              note: p.sector,
            })),
        },
        {
          heading: "By Configuration",
          items: [
            { label: "2 BHK Apartments", href: "/projects?category=residential&bhk=2" },
            { label: "3 BHK Apartments", href: "/projects?category=residential&bhk=3" },
            { label: "4 BHK Apartments", href: "/projects?category=residential&bhk=4" },
            { label: "5 BHK & Penthouses", href: "/projects?category=residential&bhk=5" },
            { label: "Independent Floors", href: "/projects?propertyType=independent-floor" },
          ],
        },
        {
          heading: "By Stage",
          items: [
            {
              label: "New Launches",
              href: "/projects?category=residential&status=new-launch",
              note: countFor((p) => p.category === "residential" && p.status === "new-launch"),
            },
            {
              label: "Under Construction",
              href: "/projects?category=residential&status=under-construction",
              note: countFor(
                (p) => p.category === "residential" && p.status === "under-construction",
              ),
            },
            { label: "Ready to Move", href: "/projects?category=residential&status=ready-to-move" },
            { label: "Under ₹3 Cr", href: "/projects?category=residential&maxPrice=30000000" },
            { label: "₹5 Cr and above", href: "/projects?category=residential&minPrice=50000000" },
          ],
        },
      ],
    },
    {
      label: "Commercial",
      href: "/commercial",
      mega: [
        {
          heading: "Featured Commercial",
          viewAll: { label: "All commercial projects", href: "/commercial" },
          items: commercial.slice(0, 6).map((p) => ({
            label: p.name,
            href: `/projects/${p.slug}`,
            note: p.sector,
          })),
        },
        {
          heading: "By Asset Type",
          items: [
            { label: "SCO Plots", href: "/projects?propertyType=sco-plots" },
            { label: "Retail & High Street", href: "/projects?category=commercial" },
            { label: "Office Spaces", href: "/projects?propertyType=retail-office" },
            { label: "Malls & Multiplex", href: "/projects?propertyType=mall-retail" },
            { label: "Food Court & F&B", href: "/projects?category=commercial" },
          ],
        },
        {
          heading: "Investor Tools",
          items: [
            { label: "EMI Calculator", href: "/tools/emi-calculator" },
            { label: "Compare Projects", href: "/compare" },
            { label: "Commercial Advisory", href: "/services/commercial-investment" },
            { label: "SCO Plot Advisory", href: "/services/sco-plots" },
            { label: "Portfolio Management", href: "/services/portfolio-management" },
          ],
        },
      ],
    },
    {
      label: "Locations",
      href: "/locations",
      mega: [
        {
          heading: "Gurugram Corridors",
          viewAll: { label: "All locations", href: "/locations" },
          items: localities.map((l) => ({
            label: l.name,
            href: `/locations/${l.slug}`,
            note: countFor((p) => p.locality === l.name),
          })),
        },
        {
          heading: "Popular Sectors",
          items: [...new Set(projects.map((p) => p.sector))]
            .filter(Boolean)
            .slice(0, 8)
            .map((s) => ({
              label: `${s} Gurgaon`,
              href: `/projects?q=${encodeURIComponent(s)}`,
            })),
        },
      ],
    },
    {
      label: "Developers",
      href: "/developers",
      mega: [
        {
          heading: "Top Developers",
          viewAll: { label: "All developers", href: "/developers" },
          items: developers.slice(0, 9).map((d) => ({
            label: d.name,
            href: `/developers/${d.slug}`,
            note: countFor((p) => p.developer === d.name),
          })),
        },
        {
          heading: "More Partners",
          items: developers.slice(9, 18).map((d) => ({
            label: d.name,
            href: `/developers/${d.slug}`,
            note: countFor((p) => p.developer === d.name),
          })),
        },
      ],
    },
    {
      label: "Services",
      href: "/services",
      mega: [
        {
          heading: "Advisory",
          viewAll: { label: "All services", href: "/services" },
          items: [
            { label: "Residential Advisory", href: "/services/residential-advisory" },
            { label: "Commercial & Retail Investment", href: "/services/commercial-investment" },
            { label: "SCO Plot Advisory", href: "/services/sco-plots" },
            { label: "NRI Services", href: "/services/nri-services" },
          ],
        },
        {
          heading: "Transaction Support",
          items: [
            { label: "Legal & Due Diligence", href: "/services/legal-due-diligence" },
            { label: "Home Loan Assistance", href: "/services/home-loan-assistance" },
            { label: "Portfolio Management", href: "/services/portfolio-management" },
            { label: "Leasing & Property Management", href: "/services/leasing-property-management" },
          ],
        },
        {
          heading: "Tools",
          items: [
            { label: "EMI Calculator", href: "/tools/emi-calculator" },
            { label: "Compare Projects", href: "/compare" },
            { label: "Advanced Search", href: "/search" },
            { label: "Market Insights", href: "/blog" },
          ],
        },
      ],
    },
    {
      label: "Company",
      href: "/about",
      mega: [
        {
          heading: "About GoRealtors",
          items: [
            { label: "Who We Are", href: "/about" },
            { label: "Our Team", href: "/team" },
            { label: "Careers", href: "/careers" },
            { label: "Contact Us", href: "/contact" },
          ],
        },
        {
          heading: "Resources",
          items: [
            { label: "Market Insights", href: "/blog" },
            { label: "Buyer FAQs", href: "/faqs" },
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Use", href: "/terms" },
          ],
        },
      ],
    },
  ];

  return <Header nav={nav} />;
}
