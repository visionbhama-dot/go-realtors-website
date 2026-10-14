export const SITE = {
  name: "GoRealtors",
  legalName: "Go Realtors — Real Estate Advisors",
  tagline: "Let's Go Real",
  subTagline: "Real Estate Advisors",
  description:
    "GoRealtors is a RERA-registered real estate advisory in Gurugram specialising in luxury residences, commercial retail, SCO plots and investment advisory across Dwarka Expressway, Golf Course Road and New Gurgaon.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gorealtors.in",
  locale: "en_IN",
  phone: "+919560627388",
  phoneDisplay: "+91 95606 27388",
  whatsapp: "919560627388",
  email: "tarun.gorealtors@gmail.com",
  rera: "RERA Registered Advisory",
  address: {
    line1: "SVH Metro Street, 1522-1523",
    line2: "Sector 83",
    city: "Gurugram",
    state: "Haryana",
    postalCode: "122012",
    country: "IN",
  },
  addressOneLine:
    "SVH Metro Street, 1522-1523, Sector 83, Gurugram, Haryana 122012",
  geo: { lat: 28.4089, lng: 76.9637 },
  hours: "Mon - Sat, 10:00 AM - 7:30 PM IST",
  social: {
    facebook: "https://www.facebook.com/people/Gorealtorsofficial/61578859582715/",
    instagram: "https://www.instagram.com/gorealtors.official/",
    linkedin: "https://www.linkedin.com/company/gorealtorsofficial",
    youtube: "https://www.youtube.com/@GoRealtors.Official/shorts",
  },
  stats: {
    unitsAdvised: "1,200+",
    gmv: "₹850 Cr+",
    developers: "40+",
    years: "12+",
  },
} as const;

export const WHATSAPP_LINK = (message?: string) =>
  `https://wa.me/${SITE.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export type NavChild = { label: string; href: string; note?: string };
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
  columns?: { heading: string; items: NavChild[] }[];
};
