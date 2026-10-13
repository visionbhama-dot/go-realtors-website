import { Header } from "./Header";
import type { HeaderNavItem } from "./MegaMenu";
import { buildSearchIndex } from "@/lib/search-index";
import {
  getAllProjects,
  getDevelopers,
  getLocalities,
} from "@/lib/repo/projects";

export async function SiteHeader() {
  const [projects, developers, localities, searchIndex] = await Promise.all([
    getAllProjects(),
    getDevelopers(),
    getLocalities(),
    buildSearchIndex(),
  ]);

  const count = (fn: (p: (typeof projects)[number]) => boolean) =>
    String(projects.filter(fn).length);

  /** Picks an icon that reflects what the corridor actually is. */
  const corridorIcon = (name: string) => {
    if (/golf/i.test(name)) return "golf" as const;
    if (/expressway|road/i.test(name)) return "expressway" as const;
    if (/delhi/i.test(name)) return "cityscape" as const;
    if (/new gurgaon/i.test(name)) return "township" as const;
    return "location" as const;
  };

  const plural = (n: number, word: string) =>
    `${n} ${word}${n === 1 ? "" : "s"}`;

  const residential = projects.filter((p) => p.category === "residential");
  const commercial = projects.filter((p) => p.category === "commercial");

  const nav: HeaderNavItem[] = [
    {
      label: "Residential",
      href: "/residential",
      width: 58,
      mega: [
        {
          heading: "Find a home by size",
          span: 4,
          items: [
            {
              label: "2 BHK Apartments",
              href: "/projects?category=residential&bhk=2",
              description: "Compact homes for first-time buyers",
              icon: "apartment",
            },
            {
              label: "3 BHK Apartments",
              href: "/projects?category=residential&bhk=3",
              description: "The most in-demand family configuration",
              icon: "apartment",
              note: count(
                (p) =>
                  p.category === "residential" &&
                  p.configurationsLabel.includes("3"),
              ),
            },
            {
              label: "4 BHK Apartments",
              href: "/projects?category=residential&bhk=4",
              description: "Larger layouts with staff and utility rooms",
              icon: "apartment",
              note: count(
                (p) =>
                  p.category === "residential" &&
                  p.configurationsLabel.includes("4"),
              ),
            },
            {
              label: "5 BHK & Penthouses",
              href: "/projects?category=residential&bhk=5",
              description: "Duplexes and top-floor residences",
              icon: "penthouse",
            },
            {
              label: "Independent Floors",
              href: "/projects?propertyType=independent-floor",
              description: "Low-rise living, no high-rise maintenance",
              icon: "floors",
            },
          ],
          viewAll: {
            label: `All ${residential.length} residential projects`,
            href: "/residential",
          },
        },
        {
          heading: "Find a home by budget",
          span: 4,
          items: [
            {
              label: "Under ₹3 Cr",
              href: "/projects?category=residential&maxPrice=30000000",
              description: "Best value per square foot in New Gurgaon",
              icon: "budget",
            },
            {
              label: "₹3 Cr - ₹5 Cr",
              href: "/projects?category=residential&minPrice=30000000&maxPrice=50000000",
              description: "Premium towers on Dwarka Expressway",
              icon: "money",
            },
            {
              label: "₹5 Cr - ₹10 Cr",
              href: "/projects?category=residential&minPrice=50000000&maxPrice=100000000",
              description: "Luxury addresses with full amenity decks",
              icon: "money",
            },
            {
              label: "Above ₹10 Cr",
              href: "/projects?category=residential&minPrice=100000000",
              description: "Ultra-luxury on Golf Course Road",
              icon: "penthouse",
            },
          ],
        },
        {
          heading: "Find a home by stage",
          span: 4,
          items: [
            {
              label: "New Launches",
              href: "/projects?category=residential&status=new-launch",
              description: "Earliest pricing, longest wait to possession",
              icon: "launch",
              note: count(
                (p) => p.category === "residential" && p.status === "new-launch",
              ),
            },
            {
              label: "Under Construction",
              href: "/projects?category=residential&status=under-construction",
              description: "Work in progress, RERA timelines verified",
              icon: "construction",
              note: count(
                (p) =>
                  p.category === "residential" &&
                  p.status === "under-construction",
              ),
            },
            {
              label: "Ready to Move",
              href: "/projects?category=residential&status=ready-to-move",
              description: "Occupation certificate in hand, no GST",
              icon: "ready",
            },
            {
              label: "Advisor Picks",
              href: "/projects?category=residential",
              description: "Shortlisted on fundamentals, not marketing",
              icon: "featured",
            },
          ],
        },
      ],
    },
    {
      label: "Commercial",
      href: "/commercial",
      width: 58,
      mega: [
        {
          heading: "Invest by asset type",
          span: 4,
          items: [
            {
              label: "SCO Plots",
              href: "/projects?propertyType=sco-plots",
              description: "Own the land freehold and build to suit",
              icon: "sco",
              note: count((p) => /sco/i.test(p.propertyType)),
            },
            {
              label: "High-Street Retail",
              href: "/commercial",
              description: "Shopfronts priced on footfall, not frontage",
              icon: "retail",
            },
            {
              label: "Office Spaces",
              href: "/projects?propertyType=retail-office",
              description: "Grade-A floors with corporate tenants",
              icon: "office",
            },
            {
              label: "Malls & Multiplex",
              href: "/projects?propertyType=mall-retail",
              description: "Anchor-led retail in mixed-use townships",
              icon: "mall",
            },
          ],
          viewAll: {
            label: `All ${commercial.length} commercial assets`,
            href: "/commercial",
          },
        },
        {
          heading: "Invest by ticket size",
          span: 4,
          items: [
            {
              label: "Under ₹2 Cr",
              href: "/projects?category=commercial&maxPrice=20000000",
              description: "Entry-level retail and food-court units",
              icon: "budget",
            },
            {
              label: "₹2 Cr - ₹5 Cr",
              href: "/projects?category=commercial&minPrice=20000000&maxPrice=50000000",
              description: "Leasable shopfronts with signed tenants",
              icon: "money",
            },
            {
              label: "Above ₹5 Cr",
              href: "/projects?category=commercial&minPrice=50000000",
              description: "SCO plots and whole office floors",
              icon: "yield",
            },
          ],
        },
        {
          heading: "Before you invest",
          span: 4,
          items: [
            {
              label: "Rental Yield Calculator",
              href: "/tools/emi-calculator",
              description: "Model the return before you commit",
              icon: "yield",
            },
            {
              label: "Commercial Advisory",
              href: "/services/commercial-investment",
              description: "Catchment and exit-cap analysis",
              icon: "portfolio",
            },
            {
              label: "SCO Plot Advisory",
              href: "/services/sco-plots",
              description: "Frontage, FAR and build-out cost",
              icon: "sco",
            },
            {
              label: "Leasing & Management",
              href: "/services/leasing-property-management",
              description: "Tenant sourcing after you buy",
              icon: "advisory",
            },
          ],
        },
      ],
    },
    {
      label: "Locations",
      href: "/locations",
      width: 50,
      mega: [
        {
          heading: "Popular corridors",
          span: 7,
          layout: "tiles",
          items: localities.map((l) => ({
            label: l.name,
            href: `/locations/${l.slug}`,
            icon: corridorIcon(l.name),
            note: plural(
              projects.filter((p) => p.locality === l.name).length,
              "project",
            ),
          })),
          viewAll: {
            label: "Compare all corridors on price",
            href: "/locations",
          },
        },
        {
          heading: "Popular sectors",
          span: 5,
          layout: "links",
          items: [...new Set(projects.map((p) => p.sector))]
            .filter(Boolean)
            .sort((a, b) => {
              const na = Number(a.replace(/\D/g, ""));
              const nb = Number(b.replace(/\D/g, ""));
              return na - nb;
            })
            .map((s) => ({
              label: `${s} Gurgaon`,
              href: `/projects?q=${encodeURIComponent(s)}`,
            })),
          viewAll: {
            label: "Search every sector",
            href: "/projects",
          },
        },
      ],
    },
    {
      label: "Developers",
      href: "/developers",
      width: 48,
      mega: [
        {
          heading: "Developers with live inventory",
          span: 7,
          items: developers
            .filter((d) => projects.some((p) => p.developer === d.name))
            .slice(0, 6)
            .map((d) => ({
              label: d.name,
              href: `/developers/${d.slug}`,
              description: d.specialities.slice(0, 2).join(" · "),
              icon: "developer" as const,
              note: count((p) => p.developer === d.name),
            })),
          viewAll: {
            label: `All ${developers.length} developer partners`,
            href: "/developers",
          },
        },
        {
          heading: "Also on our panel",
          span: 5,
          layout: "links",
          items: developers
            .filter((d) => !projects.some((p) => p.developer === d.name))
            .map((d) => ({ label: d.short, href: `/developers/${d.slug}` })),
          viewAll: {
            label: "Ask about any developer",
            href: "/contact",
          },
        },
      ],
    },
    {
      label: "Services",
      href: "/services",
      width: 60,
      mega: [
        {
          heading: "For home buyers",
          span: 4,
          items: [
            {
              label: "Residential Advisory",
              href: "/services/residential-advisory",
              description: "Shortlists built around your brief",
              icon: "advisory",
            },
            {
              label: "Home Loan Assistance",
              href: "/services/home-loan-assistance",
              description: "Competing offers from a lender panel",
              icon: "loan",
            },
            {
              label: "Legal & Due Diligence",
              href: "/services/legal-due-diligence",
              description: "Title and RERA checked before you pay",
              icon: "legal",
            },
            {
              label: "NRI Services",
              href: "/services/nri-services",
              description: "Buy remotely, registry by power of attorney",
              icon: "nri",
            },
          ],
        },
        {
          heading: "For investors",
          span: 4,
          items: [
            {
              label: "Commercial Investment",
              href: "/services/commercial-investment",
              description: "Yield modelled before you commit",
              icon: "portfolio",
            },
            {
              label: "SCO Plot Advisory",
              href: "/services/sco-plots",
              description: "Freehold land with build-out control",
              icon: "sco",
            },
            {
              label: "Portfolio Management",
              href: "/services/portfolio-management",
              description: "Entry, hold review and planned exit",
              icon: "trending",
            },
            {
              label: "Leasing & Management",
              href: "/services/leasing-property-management",
              description: "Keep the asset tenanted and compliant",
              icon: "advisory",
            },
          ],
        },
        {
          heading: "Tools and calculators",
          span: 4,
          items: [
            {
              label: "Home Loan EMI Calculator",
              href: "/tools/emi-calculator",
              description: "EMI plus stamp duty and GST",
              icon: "loan",
            },
            {
              label: "Compare Projects",
              href: "/compare",
              description: "Three projects, side by side",
              icon: "compare",
            },
            {
              label: "Advanced Search",
              href: "/projects",
              description: "Filter by budget, stage and corridor",
              icon: "search",
            },
            {
              label: "Market Insights",
              href: "/blog",
              description: "Corridor analysis and buyer guides",
              icon: "insights",
            },
          ],
        },
      ],
    },
    {
      label: "Company",
      href: "/about",
      width: 36,
      mega: [
        {
          heading: "About GoRealtors",
          span: 6,
          items: [
            {
              label: "Who We Are",
              href: "/about",
              description: "Buyer-side advisory, numbers first",
              icon: "advisory",
            },
            {
              label: "Our Team",
              href: "/team",
              description: "One advisor from call to registry",
              icon: "team",
            },
            {
              label: "Careers",
              href: "/careers",
              description: "Open roles in Gurugram",
              icon: "developer",
            },
            {
              label: "Contact Us",
              href: "/contact",
              description: "Sector 83, Gurugram",
              icon: "contact",
            },
          ],
        },
        {
          heading: "Resources",
          span: 6,
          items: [
            {
              label: "Market Insights",
              href: "/blog",
              description: "What we tell clients, published",
              icon: "insights",
            },
            {
              label: "Buyer FAQs",
              href: "/faqs",
              description: "Carpet area, loading, stamp duty",
              icon: "faq",
            },
            {
              label: "Verify RERA",
              href: "/faqs#legal-and-rera",
              description: "How to check a project yourself",
              icon: "rera",
            },
            {
              label: "Compare Projects",
              href: "/compare",
              description: "Side-by-side on the facts",
              icon: "compare",
            },
          ],
        },
      ],
    },
  ];

  return <Header nav={nav} searchIndex={searchIndex} />;
}
