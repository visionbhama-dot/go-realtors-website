import type { MetadataRoute } from "next";
import { SERVICES } from "@/data/content";
import { getPosts } from "@/lib/repo/content";
import {
  getAllProjects,
  getDevelopers,
  getLocalities,
} from "@/lib/repo/projects";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, developers, localities, posts] = await Promise.all([
    getAllProjects(),
    getDevelopers(),
    getLocalities(),
    getPosts(),
  ]);

  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: {
    path: string;
    changeFrequency: NonNullable<
      MetadataRoute.Sitemap[number]["changeFrequency"]
    >;
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/projects", changeFrequency: "daily", priority: 0.95 },
    { path: "/residential", changeFrequency: "daily", priority: 0.9 },
    { path: "/commercial", changeFrequency: "daily", priority: 0.9 },
    { path: "/locations", changeFrequency: "weekly", priority: 0.85 },
    { path: "/developers", changeFrequency: "weekly", priority: 0.85 },
    { path: "/services", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog", changeFrequency: "daily", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/team", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.75 },
    { path: "/careers", changeFrequency: "weekly", priority: 0.6 },
    { path: "/faqs", changeFrequency: "monthly", priority: 0.7 },
    { path: "/compare", changeFrequency: "monthly", priority: 0.6 },
    { path: "/tools/emi-calculator", changeFrequency: "monthly", priority: 0.65 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
    { path: "/disclaimer", changeFrequency: "yearly", priority: 0.2 },
  ];

  const statics: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  return [
    ...statics,
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...localities.map((l) => ({
      url: `${base}/locations/${l.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...developers.map((d) => ({
      url: `${base}/developers/${d.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...SERVICES.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
