import type { Metadata } from "next";
import { getSeoForPath } from "@/lib/repo/content";

export type SeoDefaults = {
  /** Route path, used as the lookup key in the seo_pages table. */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  type?: "website" | "article";
};

/**
 * Builds page metadata from hard-coded defaults, then lets any matching
 * record in the `seo_pages` table override it. This is what makes the SEO
 * manager in /admin/seo actually take effect on the public site.
 */
export async function buildMetadata(defaults: SeoDefaults): Promise<Metadata> {
  const override = await getSeoForPath(defaults.path).catch(() => null);

  const title = override?.title?.trim() || defaults.title;
  const description = override?.description?.trim() || defaults.description;
  const keywords =
    override?.keywords && override.keywords.length
      ? override.keywords
      : defaults.keywords;
  const ogImage = override?.ogImage || defaults.ogImage;
  const canonical = override?.canonical || defaults.path;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical },
    ...(override?.noindex
      ? { robots: { index: false, follow: true } }
      : {}),
    openGraph: {
      title,
      description,
      url: canonical,
      type: defaults.type ?? "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
