import Image from "next/image";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { IMAGE_CREDITS } from "@/data/imageCredits";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/image-credits",
    title: "Image Credits",
    description:
      "Attribution for the Creative Commons photographs used on the GoRealtors website.",
  });
}

export default function ImageCreditsPage() {
  return (
    <>
      <PageHero
        size="compact"
        eyebrow="Credits"
        title="Image credits"
        description="The city photographs on our homepage are Creative Commons works from Wikimedia Commons. Each one is credited below, with a link to the original file and its licence."
        crumbs={[{ label: "Image credits" }]}
      />

      <section className="shell py-12 lg:py-16">
        <div className="prose-go max-w-2xl">
          <p>
            Photographs of the cities we are expanding into are reused under
            Creative Commons licences. They have been cropped and
            colour-corrected to fit our layout, which makes each one an
            adaptation of the original work.
          </p>
          <p>
            Everything else on this site — project galleries, team photography,
            brand assets and the homepage video — is either owned by GoRealtors
            or licensed for commercial use without attribution.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {IMAGE_CREDITS.map((c) => (
            <li
              key={c.city}
              className="overflow-hidden rounded-lg border border-ink-200 bg-white"
            >
              <div className="relative h-36 bg-ink-100">
                <Image
                  src={c.file}
                  alt={`${c.city} — photograph by ${c.author}`}
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="font-display text-[0.9375rem] font-bold">
                  {c.city}
                </p>
                <p className="mt-1 text-[0.8125rem] text-ink-600">
                  by {c.author}
                </p>
                <p className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.75rem]">
                  {c.licenseUrl ? (
                    <a
                      href={c.licenseUrl}
                      rel="license noopener noreferrer"
                      target="_blank"
                      className="font-semibold text-brand-700 hover:underline"
                    >
                      {c.license}
                    </a>
                  ) : (
                    <span className="font-semibold text-ink-700">
                      {c.license}
                    </span>
                  )}
                  {c.source && (
                    <a
                      href={c.source}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-ink-500 hover:text-ink-900 hover:underline"
                    >
                      Original file
                    </a>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
