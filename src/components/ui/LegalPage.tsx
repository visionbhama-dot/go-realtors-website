import { PageHero } from "@/components/ui/PageHero";
import { SITE } from "@/lib/site";

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({
  title,
  intro,
  updated,
  sections,
  crumbLabel,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  crumbLabel: string;
}) {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={title}
        description={intro}
        crumbs={[{ label: crumbLabel }]}
        image="/brand/band-residential.jpg"
        size="compact"
      />

      <section className="shell py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
          <nav
            aria-label="Sections"
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
              Contents
            </p>
            <ol className="mt-3 space-y-0.5">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#s-${i + 1}`}
                    className="block rounded-sm px-2.5 py-2 text-[0.8125rem] text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
                  >
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-ink-200 pt-4 text-[0.75rem] text-ink-500">
              Last updated
              <br />
              <strong className="font-semibold text-ink-900">{updated}</strong>
            </p>
          </nav>

          <div className="min-w-0 max-w-3xl">
            {sections.map((s, i) => (
              <section
                key={s.heading}
                id={`s-${i + 1}`}
                className="scroll-mt-32 border-b border-ink-200 py-8 first:pt-0 last:border-b-0"
              >
                <h2 className="font-display text-[1.25rem] font-bold">
                  {i + 1}. {s.heading}
                </h2>
                <div className="prose-go mt-3.5">
                  {s.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-8 rounded-md border border-ink-200 bg-ink-50/60 p-6">
              <h2 className="font-display text-[1rem] font-bold">
                Questions about this policy?
              </h2>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">
                Write to{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-semibold text-brand-700 underline"
                >
                  {SITE.email}
                </a>{" "}
                or call{" "}
                <a
                  href={`tel:${SITE.phone}`}
                  className="font-semibold text-brand-700 underline"
                >
                  {SITE.phoneDisplay}
                </a>
                . Our registered office is at {SITE.addressOneLine}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
