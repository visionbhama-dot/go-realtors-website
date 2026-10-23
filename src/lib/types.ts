export type ProjectCategory = "residential" | "commercial";

export type ProjectStatus =
  | "new-launch"
  | "under-construction"
  | "ready-to-move"
  | "sold-out";

export type Configuration = {
  type: string;
  areaSqft: number;
  price: string;
};

/** A floor plan / master plan / layout image with its type and size label. */
export type ProjectPlan = {
  /** e.g. "Floor Plan", "Master Plan", "Unit Plan", "Location Plan" */
  type: string;
  /** e.g. "3 BHK + Study", "Tower cluster" */
  title: string;
  /** image URL */
  image: string;
  /** e.g. "1,947 sq.ft." or "12 acres" */
  size: string;
};

export type Faq = { question: string; answer: string };

export type Project = {
  slug: string;
  legacySlug?: string | null;
  name: string;
  tagline: string;
  developer: string;
  sector: string;
  locality: string;
  city: string;
  category: ProjectCategory;
  propertyType: string;
  status: ProjectStatus;
  configurationsLabel: string;
  featured: boolean;
  trending: boolean;
  priceMin: number | null;
  priceMax: number | null;
  landAcres: number | null;
  towers: number | null;
  units: number | null;
  possession: string | null;
  rera: string | null;
  overview: string[];
  highlights: string[];
  amenities: string[];
  configurations: Configuration[];
  plans?: ProjectPlan[];
  floorPlanNote: string | null;
  videoUrl: string | null;
  whyInvest: string[];
  locationAdvantages: string[];
  faqs: Faq[];
  images: string[];
  /** alt text per image, index-aligned with images */
  imageAlts: string[];
  seoTitle: string;
  seoDescription: string;
};

export type Developer = {
  slug: string;
  name: string;
  short: string;
  established: string | null;
  headquarters: string;
  description: string;
  specialities: string[];
};

export type Locality = {
  slug: string;
  name: string;
  city: string;
  blurb: string;
  description: string;
  highlights: string[];
  priceBand: string;
  growth: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  cover: string;
  body: string[];
  tags: string[];
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  focus: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  initials: string;
};

export type Testimonial = {
  name: string;
  location: string;
  project: string;
  quote: string;
  rating: number;
};

export type ServiceItem = {
  slug: string;
  title: string;
  summary: string;
  points: string[];
};

/* ---------- Admin / backend domain ---------- */

export type UserRole = "owner" | "admin" | "manager" | "agent" | "editor" | "viewer";

export type Permission =
  | "projects.read"
  | "projects.write"
  | "projects.publish"
  | "projects.delete"
  | "leads.read"
  | "leads.write"
  | "leads.assign"
  | "leads.export"
  | "blog.read"
  | "blog.write"
  | "blog.publish"
  | "seo.read"
  | "seo.write"
  | "media.write"
  | "team.read"
  | "team.write"
  | "users.read"
  | "users.write"
  | "settings.write"
  | "audit.read";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "site-visit"
  | "negotiation"
  | "won"
  | "lost";

export type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string | null;
  source: string;
  projectSlug: string | null;
  projectName: string | null;
  status: LeadStatus;
  assignedTo: string | null;
  budget: string | null;
  createdAt: string;
};

export type SeoRecord = {
  path: string;
  label: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string | null;
  noindex: boolean;
  canonical: string | null;
};
