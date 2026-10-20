import type {
  Developer,
  Locality,
  ServiceItem,
  TeamMember,
  Testimonial,
  Faq,
} from "@/lib/types";

/* ------------------------------------------------------------------ *
 * Developers — every partner currently represented on gorealtors.in
 * ------------------------------------------------------------------ */
export const DEVELOPERS: Developer[] = [
  {
    slug: "godrej-properties",
    name: "Godrej Properties",
    short: "Godrej",
    established: "1990",
    headquarters: "Mumbai, Maharashtra",
    description:
      "The real estate arm of the 125-year-old Godrej Group, known for bringing institutional governance and sustainability benchmarks to Indian residential development. Its NCR portfolio is concentrated along Dwarka Expressway and Golf Course Extension Road.",
    specialities: ["Luxury residential", "Green-certified design", "Township development"],
  },
  {
    slug: "m3m-india",
    name: "M3M India",
    short: "M3M",
    established: "2007",
    headquarters: "Gurugram, Haryana",
    description:
      "One of Gurugram's largest private developers with a dense portfolio across Golf Course Extension Road, Sector 65 and the Southern Peripheral Road. M3M is recognised for design-led high rises and branded retail destinations.",
    specialities: ["Ultra-luxury apartments", "High-street retail", "Mixed-use districts"],
  },
  {
    slug: "sobha-limited",
    name: "Sobha Limited",
    short: "Sobha",
    established: "1995",
    headquarters: "Bengaluru, Karnataka",
    description:
      "A backward-integrated developer that manufactures its own joinery, glazing and concrete — which is why Sobha is widely regarded as the construction-quality benchmark in Indian real estate.",
    specialities: ["In-house construction", "Premium finishes", "Low-density communities"],
  },
  {
    slug: "elan-group",
    name: "Elan Group",
    short: "Elan",
    established: "2012",
    headquarters: "Gurugram, Haryana",
    description:
      "Elan built its reputation on experiential retail in Gurugram before expanding into large-format luxury residential towers on Dwarka Expressway.",
    specialities: ["Experiential retail", "Luxury high rises", "Hospitality-led amenities"],
  },
  {
    slug: "smartworld-developers",
    name: "Smartworld Developers",
    short: "Smartworld",
    established: "2019",
    headquarters: "Gurugram, Haryana",
    description:
      "A new-generation developer focused exclusively on Gurugram, pairing global design consultants with technology-forward, low-density master plans.",
    specialities: ["Design-led residences", "Low-density planning", "Smart home systems"],
  },
  {
    slug: "ss-group",
    name: "SS Group",
    short: "SS",
    established: "1992",
    headquarters: "Gurugram, Haryana",
    description:
      "A Gurugram-first developer with over three decades of delivery across New Gurgaon, known for competitively priced premium housing and integrated townships.",
    specialities: ["Premium housing", "Independent floors", "Integrated townships"],
  },
  {
    slug: "tulip-infratech",
    name: "Tulip Infratech",
    short: "Tulip",
    established: "1976",
    headquarters: "Gurugram, Haryana",
    description:
      "A long-standing Gurugram developer whose Monsella address on Golf Course Road represents its move into the ultra-luxury segment.",
    specialities: ["Ultra-luxury towers", "Golf Course Road", "Large-format residences"],
  },
  {
    slug: "hero-realty",
    name: "Hero Realty",
    short: "Hero",
    established: "2012",
    headquarters: "New Delhi",
    description:
      "The real estate venture of the Hero Group, bringing conglomerate-grade balance sheet strength and execution discipline to NCR residential projects.",
    specialities: ["Residential towers", "Dwarka Expressway", "Group-backed delivery"],
  },
  {
    slug: "indiabulls-real-estate",
    name: "Indiabulls Real Estate",
    short: "Indiabulls",
    established: "2006",
    headquarters: "Gurugram, Haryana",
    description:
      "A listed developer with a track record of landmark commercial and residential assets across Mumbai and the NCR, now focused on club-centric residential communities.",
    specialities: ["Club-centric living", "Listed developer", "Large-format towers"],
  },
  {
    slug: "bptp-limited",
    name: "BPTP Limited",
    short: "BPTP",
    established: "2003",
    headquarters: "Faridabad, Haryana",
    description:
      "One of the largest land holders across Gurugram and Faridabad, BPTP has delivered a wide spread of plotted, floor and apartment inventory in New Gurgaon.",
    specialities: ["Plotted development", "Residential apartments", "Large land banks"],
  },
  {
    slug: "advance-india-projects-limited",
    name: "Advance India Projects Limited",
    short: "AIPL",
    established: "1991",
    headquarters: "Gurugram, Haryana",
    description:
      "AIPL operates across retail, office and residential verticals, and is best known in Gurugram for high-footfall commercial districts and business parks.",
    specialities: ["High-street retail", "Business parks", "Residential communities"],
  },
  {
    slug: "central-park",
    name: "Central Park",
    short: "Central Park",
    established: "2004",
    headquarters: "Gurugram, Haryana",
    description:
      "A developer that pioneered serviced luxury residences in Gurugram, combining hotel-grade facility management with resort-style master plans.",
    specialities: ["Serviced residences", "Resort master plans", "Facility management"],
  },
  {
    slug: "hcbs-developments",
    name: "HCBS Developments",
    short: "HCBS",
    established: "2010",
    headquarters: "Gurugram, Haryana",
    description:
      "HCBS focuses on affordable and mid-premium housing along the Dwarka Expressway corridor, with a strong record in Haryana's affordable housing policy schemes.",
    specialities: ["Mid-premium housing", "Affordable housing policy", "Dwarka Expressway"],
  },
  {
    slug: "conscient-infrastructure",
    name: "Conscient Infrastructure",
    short: "Conscient",
    established: "2010",
    headquarters: "Gurugram, Haryana",
    description:
      "Conscient develops residential and commercial assets across Gurugram, frequently in partnership with established institutional investors.",
    specialities: ["SOHO formats", "Retail spaces", "Residential development"],
  },
  {
    slug: "mvn-group",
    name: "MVN Group",
    short: "MVN",
    established: "1985",
    headquarters: "Gurugram, Haryana",
    description:
      "An infrastructure-to-real-estate group developing mixed-use townships and anchor retail along the Dwarka Expressway and Sohna corridors.",
    specialities: ["Mixed-use townships", "Anchor malls", "Affordable housing"],
  },
  {
    slug: "reach-group",
    name: "Reach Group",
    short: "Reach",
    established: "2010",
    headquarters: "Gurugram, Haryana",
    description:
      "Reach specialises in Haryana's SCO (Shop-cum-Office) plotted commercial format, giving investors freehold ownership with independent build-out rights.",
    specialities: ["SCO plots", "Freehold retail", "Commercial plotting"],
  },
  {
    slug: "omaxe-limited",
    name: "Omaxe Limited",
    short: "Omaxe",
    established: "1987",
    headquarters: "New Delhi",
    description:
      "A listed pan-India developer with a large delivery record across North India, currently building sports-led retail destinations in Delhi.",
    specialities: ["Retail destinations", "Sports infrastructure", "Pan-India delivery"],
  },
];

/* ------------------------------------------------------------------ *
 * Micro-markets
 * ------------------------------------------------------------------ */
export const LOCALITIES: Locality[] = [
  {
    slug: "dwarka-expressway",
    name: "Dwarka Expressway",
    city: "Gurugram",
    blurb: "The 29-km Northern Peripheral Road linking Dwarka to NH-48 — now Gurugram's deepest supply corridor.",
    description:
      "Dwarka Expressway (NH-248BB) is the single most consequential infrastructure project in Gurugram's recent history. With the full carriageway and the Delhi stretch now operational, travel to IGI Airport collapses to roughly 20 minutes and Dwarka Sub-City becomes directly accessible. Sectors 99 to 115 carry the bulk of new launches, with a proposed metro extension and the Gurugram–Dwarka ISBT further strengthening the corridor. The trade-off buyers should understand: supply here is deep, so developer credibility and tower positioning matter more than the postcode alone.",
    highlights: [
      "Direct 20-minute access to IGI Airport Terminal 3",
      "Operational 8-lane expressway with dedicated service roads",
      "Proposed metro extension along the corridor",
      "Dense cluster of Grade-A developer launches in Sectors 99-115",
      "Close to Dwarka Sub-City social infrastructure",
    ],
    priceBand: "₹11K - ₹18.5K",
    growth: "High appreciation potential",
  },
  {
    slug: "golf-course-road",
    name: "Golf Course Road",
    city: "Gurugram",
    blurb: "Gurugram's established luxury spine — the highest per-square-foot address in the city.",
    description:
      "Golf Course Road is Gurugram's most mature premium corridor. A 16-lane signal-free stretch with the Rapid Metro running alongside, it concentrates the city's best private schools, hospitals, luxury retail and corporate offices within a two-kilometre band. Inventory is scarce and almost entirely resale or redevelopment, which keeps capital values resilient through market cycles. This is the corridor for buyers prioritising certainty of location over launch-stage pricing.",
    highlights: [
      "Signal-free 16-lane carriageway with Rapid Metro connectivity",
      "Highest capital values in Gurugram",
      "Walk-to-work access to DLF Cyber City and Cyber Hub",
      "Established schools, hospitals and luxury retail",
      "Scarce land parcels sustain long-term pricing power",
    ],
    priceBand: "₹22K - ₹45K",
    growth: "Stable, premium-resilient",
  },
  {
    slug: "golf-course-extension-road",
    name: "Golf Course Extension Road",
    city: "Gurugram",
    blurb: "The fast-maturing extension of the luxury spine, running from Sector 55 toward Sohna.",
    description:
      "Golf Course Extension Road carries the premium positioning of Golf Course Road at a meaningfully lower entry point. Sectors 58 to 67 have absorbed a wave of luxury launches, and the corridor benefits from the Southern Peripheral Road interchange plus proximity to the Sohna Elevated Corridor. Social infrastructure has caught up considerably over the last five years, making this the most balanced risk-return corridor in the city for premium housing.",
    highlights: [
      "Lower entry pricing than Golf Course Road, similar positioning",
      "SPR and Sohna Elevated Corridor interchanges",
      "Concentrated luxury and ultra-luxury launches in Sectors 58-67",
      "Rapidly maturing retail and schooling infrastructure",
      "Strong rental demand from corporate tenants",
    ],
    priceBand: "₹16K - ₹28K",
    growth: "Strong momentum",
  },
  {
    slug: "new-gurgaon",
    name: "New Gurgaon",
    city: "Gurugram",
    blurb: "Sectors 76-95 along NH-48 — the value corridor with the widest configuration choice.",
    description:
      "New Gurgaon spans the sectors flanking NH-48 beyond Hero Honda Chowk. It offers the city's broadest range of formats — apartments, independent floors, plots and high-street retail — at entry points materially below the Golf Course corridors. The Pataudi Road widening, KMP Expressway access and the maturing IMT Manesar employment base underpin end-user demand here. Buyers get larger carpet areas per rupee, with the understanding that social infrastructure is still consolidating.",
    highlights: [
      "Best area-per-rupee value in Gurugram",
      "Direct NH-48 and KMP Expressway access",
      "Widest format choice: apartments, floors, plots, SCO",
      "Employment catchment from IMT Manesar",
      "Active affordable and mid-premium housing supply",
    ],
    priceBand: "₹8.5K - ₹14K",
    growth: "Value accumulation",
  },
  {
    slug: "sohna-road",
    name: "Sohna Road",
    city: "Gurugram",
    blurb: "A dense mixed-use corridor transformed by the Sohna Elevated Expressway.",
    description:
      "Sohna Road connects Gurugram's Subhash Chowk to the Sohna township and has been re-rated significantly by the elevated expressway, which cuts the drive to Sohna to under twenty minutes. The corridor carries a dense mix of mid-premium housing, office parks and high-street retail, with SCO plotted commercial emerging as the standout investment format in Sectors 67-70.",
    highlights: [
      "Sohna Elevated Expressway dramatically improved travel times",
      "Established office and retail catchment",
      "Strong SCO plotted commercial opportunity",
      "Direct connectivity to Golf Course Extension Road",
      "Deep rental market from nearby office parks",
    ],
    priceBand: "₹9.5K - ₹15.5K",
    growth: "Infrastructure-led re-rating",
  },
  {
    slug: "dwarka-new-delhi",
    name: "Dwarka, New Delhi",
    city: "New Delhi",
    blurb: "Delhi's largest planned sub-city, now anchored by India International Convention Centre.",
    description:
      "Dwarka is Asia's largest planned residential sub-city and has entered a new growth phase with Yashobhoomi (India International Convention & Expo Centre), the Dwarka Expressway interchange and the airport express metro. Commercial inventory in Sectors 19B and 25 is scarce and institution-grade, making it a distinct opportunity set from Gurugram's supply-heavy corridors.",
    highlights: [
      "Yashobhoomi convention centre drives footfall and hospitality demand",
      "Airport Express and Blue Line metro connectivity",
      "DDA-planned sub-city with mature social infrastructure",
      "Limited new commercial supply sustains pricing",
      "Direct interchange with Dwarka Expressway",
    ],
    priceBand: "₹15K - ₹32K",
    growth: "Institution-grade scarcity",
  },
];

/* ------------------------------------------------------------------ *
 * Advisory services
 * ------------------------------------------------------------------ */
export const SERVICES: ServiceItem[] = [
  {
    slug: "residential-advisory",
    title: "Residential Advisory",
    summary:
      "Matching families to the right home across Gurugram's luxury and premium corridors — with the numbers laid out before you commit.",
    points: [
      "Shortlisting against your budget, commute and schooling needs",
      "Tower, floor and facing selection using actual inventory sheets",
      "Carpet-versus-super-area and loading comparison across options",
      "Negotiated pricing, payment plans and possession-linked schedules",
    ],
  },
  {
    slug: "commercial-investment",
    title: "Commercial & Retail Investment",
    summary:
      "Yield-first advisory on high-street retail, office floors, SCO plots and food-court formats.",
    points: [
      "Rental yield and exit-cap modelling before purchase",
      "Footfall catchment and anchor-tenant assessment",
      "SCO plot versus strata retail comparison",
      "Lease structuring, tenant sourcing and escalation terms",
    ],
  },
  {
    slug: "sco-plots",
    title: "SCO Plot Advisory",
    summary:
      "Haryana's Shop-cum-Office format gives you freehold land with independent build-out rights — if you pick the right plot.",
    points: [
      "Corner, frontage and footfall-side plot selection",
      "FAR, permissible height and build-out cost modelling",
      "Comparison of licensed SCO colonies across Gurugram",
      "Construction partner and approval hand-holding",
    ],
  },
  {
    slug: "nri-services",
    title: "NRI Services",
    summary:
      "End-to-end remote purchase for non-resident buyers, from video site visits to registry by power of attorney.",
    points: [
      "Live video walkthroughs and recorded site-progress updates",
      "FEMA, repatriation and TDS guidance with partner CAs",
      "Power-of-attorney drafting and remote registry coordination",
      "Post-possession leasing and property management",
    ],
  },
  {
    slug: "legal-due-diligence",
    title: "Legal & Due Diligence",
    summary:
      "Independent verification of title, licence and RERA status before a single rupee leaves your account.",
    points: [
      "HARERA registration and QPR filing verification",
      "Licence, zoning and occupation certificate checks",
      "Builder-buyer agreement clause-by-clause review",
      "Encumbrance and litigation search through empanelled counsel",
    ],
  },
  {
    slug: "home-loan-assistance",
    title: "Home Loan Assistance",
    summary:
      "Competing offers from a panel of banks and HFCs, with eligibility worked out before you shortlist.",
    points: [
      "Eligibility assessment across salaried, self-employed and NRI profiles",
      "Rate and processing-fee comparison across a lender panel",
      "Subvention, CLP and possession-linked plan structuring",
      "Documentation, valuation and disbursement coordination",
    ],
  },
  {
    slug: "portfolio-management",
    title: "Investment Portfolio Management",
    summary:
      "Treating real estate like an asset class: entry, hold-period review and a planned exit.",
    points: [
      "Corridor allocation across residential, retail and SCO",
      "Annual mark-to-market valuation reporting",
      "Hold-versus-exit analysis at each milestone",
      "Resale execution and buyer sourcing",
    ],
  },
  {
    slug: "leasing-property-management",
    title: "Leasing & Property Management",
    summary:
      "Keeping an asset tenanted, maintained and compliant after possession.",
    points: [
      "Tenant sourcing, screening and lease negotiation",
      "Rent collection, escalation and renewal tracking",
      "Fit-out supervision and maintenance coordination",
      "Society dues, utilities and compliance handling",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Process
 * ------------------------------------------------------------------ */
export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery call",
    body: "We map your budget, intended use, commute, timeline and financing position before showing a single project.",
  },
  {
    step: "02",
    title: "Curated shortlist",
    body: "You receive a comparison sheet — not a brochure dump — covering carpet area, loading, total outgo and possession risk.",
  },
  {
    step: "03",
    title: "Site visits",
    body: "Accompanied visits across the shortlist on a single day, with tower and floor availability confirmed in advance.",
  },
  {
    step: "04",
    title: "Due diligence",
    body: "HARERA status, licence, title and builder-buyer agreement reviewed with our empanelled legal counsel.",
  },
  {
    step: "05",
    title: "Negotiation & booking",
    body: "We negotiate price, payment plan, floor-rise and charges, then handle the booking paperwork end to end.",
  },
  {
    step: "06",
    title: "After possession",
    body: "Registry, handover inspection, fit-out coordination and leasing support if the asset is an investment.",
  },
];

/* ------------------------------------------------------------------ *
 * Differentiators
 * ------------------------------------------------------------------ */
export const WHY_CHOOSE = [
  {
    icon: "developer",
    title: "Channel-partner access, not listing-portal guesswork",
    body: "Direct allocation relationships with 40+ developers mean we quote live inventory and real availability, not stale portal data.",
  },
  {
    icon: "portfolio",
    title: "Numbers before narrative",
    body: "Every recommendation comes with carpet area, loading percentage, all-in outgo and a yield or appreciation case you can interrogate.",
  },
  {
    icon: "rera",
    title: "RERA-first due diligence",
    body: "We verify HARERA registration, quarterly progress filings and licence status before a project enters your shortlist.",
  },
  {
    icon: "money",
    title: "Zero brokerage on primary sales",
    body: "Our fee comes from the developer on new-launch transactions, so our advice costs you nothing on the buy side.",
  },
  {
    icon: "advisory",
    title: "One point of contact, start to finish",
    body: "The advisor who takes your first call handles your site visits, negotiation, paperwork and possession — no handoffs.",
  },
  {
    icon: "ready",
    title: "Post-possession continuity",
    body: "Leasing, tenant management and resale execution long after the commission has been paid.",
  },
];

/* ------------------------------------------------------------------ *
 * Team — seeded with the founder. Add the rest from /admin/team.
 * ------------------------------------------------------------------ */
export const TEAM: TeamMember[] = [
  {
    slug: "tarun-gaur",
    name: "Tarun Gaur",
    role: "Founder & Managing Director",
    bio: "Tarun leads GoRealtors with an advisory-first approach: match families and investors to the right property, back every recommendation with the numbers, and stay accountable from the first call through to registry. He personally handles luxury residential and commercial mandates across Gurugram.",
    focus: "Luxury residential, commercial investment, NRI mandates",
    email: "tarun.gorealtors@gmail.com",
    phone: "+919560627388",
    photoUrl: "/team/tarun-gaur-founder.jpg",
    initials: "TG",
  },
  {
    slug: "suraj",
    name: "Suraj",
    role: "Chief Executive Officer",
    bio: "Suraj runs operations and execution at GoRealtors — building the advisory bench, the developer relationships and the process discipline that keeps every client file moving from discovery through to possession.",
    focus: "Operations, developer relations, client delivery",
    email: "tarun.gorealtors@gmail.com",
    photoUrl: "/team/suraj-ceo.jpg",
    initials: "S",
  },
];

/* ------------------------------------------------------------------ *
 * Testimonials — SAMPLE COPY. Replace from /admin/testimonials.
 * ------------------------------------------------------------------ */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rohit & Anjali Mehra",
    location: "Sector 103, Gurugram",
    project: "Godrej Vrikshya",
    quote:
      "We came in with a shortlist of four towers and left with a comparison sheet that showed us why two of them were overpriced for the carpet area. That sheet alone saved us close to eighteen lakh.",
    rating: 5,
  },
  {
    name: "Capt. Vikram Sethi",
    location: "Dubai, UAE",
    project: "Smart World One DXP",
    quote:
      "Buying from Dubai meant trusting someone completely. Video walkthroughs every fortnight, the registry handled on power of attorney, and not one surprise charge at the end.",
    rating: 5,
  },
  {
    name: "Neha Aggarwal",
    location: "Sector 83, Gurugram",
    project: "Reach Buzz 114",
    quote:
      "I wanted an SCO plot and had no idea how frontage affects rent. They walked three colonies with me and explained why the corner plot justified its premium. It is leased already.",
    rating: 5,
  },
  {
    name: "Sandeep Khurana",
    location: "South Delhi",
    project: "The Omaxe State",
    quote:
      "The yield model they built was the most honest thing I saw in six months of looking at commercial. They talked me out of a higher-priced unit because the catchment did not support it.",
    rating: 5,
  },
  {
    name: "Dr. Preeti Raghav",
    location: "Sector 65, Gurugram",
    project: "M3M Altitude",
    quote:
      "Ten site visits in two Saturdays, every tower and floor confirmed available before we arrived. For a working couple, that organisation mattered as much as the advice.",
    rating: 5,
  },
  {
    name: "Arvind Nair",
    location: "Bengaluru",
    project: "Sobha Aranya",
    quote:
      "They flagged a clause in the builder-buyer agreement about possession-linked escalation that I would never have caught. It got amended before I signed.",
    rating: 5,
  },
];

/* ------------------------------------------------------------------ *
 * Homepage FAQ
 * ------------------------------------------------------------------ */
export const HOME_FAQS: Faq[] = [
  {
    question: "Does GoRealtors charge buyers a brokerage fee?",
    answer:
      "No. On primary or new-launch transactions our fee is paid by the developer, so our advisory costs you nothing on the buy side. For resale, leasing and property management mandates a fee applies and is disclosed in writing before any engagement begins.",
  },
  {
    question: "Which areas of Gurugram does GoRealtors cover?",
    answer:
      "We advise across Dwarka Expressway (Sectors 99-115), Golf Course Road, Golf Course Extension Road, Sohna Road, New Gurgaon (Sectors 76-95) and select commercial assets in Dwarka, New Delhi. These are the corridors we transact in regularly, so our pricing and availability data is current.",
  },
  {
    question: "How do you verify that a project is safe to buy into?",
    answer:
      "Before a project enters a client shortlist we verify its HARERA registration number and quarterly progress reports, the developer's licence and zoning approvals, and the title chain through empanelled legal counsel. We also review the builder-buyer agreement clause by clause with you.",
  },
  {
    question: "Can NRIs buy property in Gurugram through GoRealtors?",
    answer:
      "Yes, and a meaningful share of our mandates are NRI. We run live video site visits, coordinate FEMA and repatriation guidance with partner chartered accountants, draft the power of attorney and manage the registry remotely. Post-possession leasing and management can continue under the same mandate.",
  },
  {
    question: "What is an SCO plot and why is it being recommended so often?",
    answer:
      "SCO stands for Shop-cum-Office, a Haryana plotted commercial format where you own the land freehold and control the build-out within the permitted FAR. Compared with strata retail you get ownership clarity, no common-area maintenance dependency and the flexibility to build for a specific tenant. Returns depend heavily on frontage and footfall side, which is where advice matters.",
  },
  {
    question: "What is the difference between carpet area and super area?",
    answer:
      "Carpet area is the usable floor area inside your walls. Super area adds a proportionate share of lobbies, staircases, lifts and amenity space — the difference is called loading, and in Gurugram it typically runs between 30% and 55%. Two projects quoted at the same per-square-foot rate can differ by 20% in actual usable space, which is why every comparison sheet we produce states carpet area explicitly.",
  },
  {
    question: "How long does it take to complete a purchase?",
    answer:
      "From the first discovery call to booking, most residential transactions close in two to five weeks. Commercial and SCO mandates typically take longer — four to eight weeks — because yield modelling and tenant assessment add a step. Registry timelines then depend on the project's possession stage.",
  },
  {
    question: "Do you help with home loans?",
    answer:
      "Yes. We run your eligibility across a panel of banks and housing finance companies, compare rates and processing fees, and structure subvention or possession-linked plans where they genuinely benefit you. We do not earn a referral fee that would bias the lender recommendation.",
  },
];

export const DEVELOPER_BY_NAME = new Map(DEVELOPERS.map((d) => [d.name, d]));
export const LOCALITY_BY_NAME = new Map(LOCALITIES.map((l) => [l.name, l]));

/* ------------------------------------------------------------------ *
 * Home page — browse-by-property-type strip
 * Each entry maps to a filtered view of the project directory.
 * ------------------------------------------------------------------ */
export type PropertyTypeTile = {
  label: string;
  href: string;
  icon: string;
  image: string;
};

export const PROPERTY_TYPE_TILES: PropertyTypeTile[] = [
  {
    label: "Branded Residences",
    href: "/projects?category=residential&minPrice=50000000",
    icon: "penthouse",
    image: "/projects/tulip-monsella-sector-53-gurgaon-premium-3-4-bhk-apartments/03.webp",
  },
  {
    label: "Under Construction",
    href: "/projects?status=under-construction",
    icon: "construction",
    image: "/projects/smart-world-one-dxp-sector-113-gurgaon/01.jpg",
  },
  {
    label: "Ready To Move",
    href: "/projects?status=ready-to-move",
    icon: "ready",
    image: "/projects/elan-the-presidential-gurgaon/02.jpg",
  },
  {
    label: "Highrise Apartment",
    href: "/projects?propertyType=apartment",
    icon: "apartment",
    image: "/projects/sobha-aranya-sector-80-gurgaon-luxury-apartments-modern-living/02.jpg",
  },
  {
    label: "Independent Builder Floors",
    href: "/projects?propertyType=independent-floor",
    icon: "floors",
    image: "/projects/ss-linden-floors-sector-84-gurgaon/01.jpg",
  },
  {
    label: "Residential Plot",
    href: "/projects?category=residential&q=plot",
    icon: "plot",
    image: "/projects/godrej-vrikshya-gurgaon-luxury-3-4-bhk-homes/02.jpg",
  },
  {
    label: "Commercial Plot",
    href: "/projects?propertyType=sco-plots",
    icon: "sco",
    image: "/projects/aipl-joy-district-gurgaon/01.jpg",
  },
  {
    label: "Low Rise Floors",
    href: "/projects?propertyType=independent-floor",
    icon: "township",
    image: "/projects/bptp-gaia-residences-sector-102-gurgaon-luxury-3-bhk-apartments/02.webp",
  },
];

/* ------------------------------------------------------------------ *
 * Home page — curated collections (image tiles)
 * ------------------------------------------------------------------ */
export type Collection = {
  label: string;
  href: string;
  image: string;
};

export const CURATED_COLLECTIONS: Collection[] = [
  {
    label: "New Projects",
    href: "/projects?status=new-launch",
    image: "/projects/smart-world-one-dxp-sector-113-gurgaon/01.jpg",
  },
  {
    label: "Ready to Move",
    href: "/projects?status=ready-to-move",
    image: "/projects/elan-the-presidential-gurgaon/02.jpg",
  },
  {
    label: "Luxury",
    href: "/projects?category=residential&minPrice=50000000",
    image: "/projects/tulip-monsella-sector-53-gurgaon-premium-3-4-bhk-apartments/03.webp",
  },
  {
    label: "Budget Friendly",
    href: "/projects?category=residential&maxPrice=30000000",
    image: "/projects/ss-cendana-sector-83-gurgaon/01.webp",
  },
  {
    label: "Condominiums",
    href: "/projects?propertyType=apartment",
    image: "/projects/sobha-aranya-sector-80-gurgaon-luxury-apartments-modern-living/02.jpg",
  },
  {
    label: "Builder Floors",
    href: "/projects?propertyType=independent-floor",
    image: "/projects/ss-linden-floors-sector-84-gurgaon/01.jpg",
  },
  {
    label: "Commercial & Retail",
    href: "/commercial",
    image: "/projects/aipl-joy-district-gurgaon/01.jpg",
  },
  {
    label: "SCO Plots",
    href: "/projects?propertyType=sco-plots",
    image: "/projects/reach-the-bazaria-68-gurgaon-premium-sco-plots-retail-spaces/01.jpg",
  },
];

/* ------------------------------------------------------------------ *
 * Home page — featured cities
 * GoRealtors transacts in Gurugram and Delhi today; the other cities
 * are on the expansion roadmap. Cities with live inventory link to
 * filtered results; the rest invite an enquiry rather than showing a
 * fake options count.
 * ------------------------------------------------------------------ */
export type CityArt = "towers" | "domes" | "bridge" | "coast";

export type FeaturedCity = {
  name: string;
  /** matches Project.city for inventory lookup */
  matchCity?: string;
  /** two-colour gradient for the card, on-brand */
  gradient: string;
  /** which original silhouette illustration to layer on the card */
  art: CityArt;
  /** real photo for cities we operate in; others use the gradient + silhouette */
  image?: string;
};

export const FEATURED_CITIES: FeaturedCity[] = [
  {
    name: "Gurugram",
    matchCity: "Gurugram",
    gradient: "from-brand-700 to-brand-900",
    art: "towers",
    image: "/projects/smart-world-one-dxp-sector-113-gurgaon/01.jpg",
  },
  {
    name: "New Delhi",
    matchCity: "New Delhi",
    gradient: "from-ink-700 to-ink-950",
    art: "domes",
    image: "/projects/the-omaxe-state-sector-19b-dwarka/01.jpg",
  },
  { name: "Noida", gradient: "from-emerald-700 to-emerald-900", art: "towers", image: "/cities/noida.jpg" },
  { name: "Pune", gradient: "from-teal-700 to-teal-900", art: "towers", image: "/cities/pune.jpg" },
  { name: "Hyderabad", gradient: "from-ink-600 to-ink-900", art: "domes", image: "/cities/hyderabad.jpg" },
  { name: "Bangalore", gradient: "from-brand-600 to-brand-800", art: "towers", image: "/cities/bangalore.jpg" },
  { name: "Chennai", gradient: "from-cyan-700 to-cyan-900", art: "coast", image: "/cities/chennai.jpg" },
  { name: "Mumbai", gradient: "from-ink-700 to-brand-900", art: "bridge", image: "/cities/mumbai.jpg" },
  { name: "Goa", gradient: "from-teal-600 to-emerald-800", art: "coast", image: "/cities/goa.jpg" },
  { name: "Lucknow", gradient: "from-amber-700 to-ink-800", art: "domes", image: "/cities/lucknow.jpg" },
  { name: "Kolkata", gradient: "from-ink-600 to-ink-800", art: "bridge", image: "/cities/kolkata.jpg" },
];
