import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Linkedin } from "@/components/brand/SocialIcons";
import type { TeamMember } from "@/lib/types";

/**
 * Leadership strip. Renders a real photo when one has been uploaded through
 * Admin > Team profiles, and a branded initials avatar until then — so the
 * section looks finished without fabricating anyone's likeness.
 */
export function Leadership({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {members.map((m) => (
        <article
          key={m.slug}
          className="group flex flex-col overflow-hidden rounded-lg border border-ink-200 bg-white"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
            {m.photoUrl ? (
              <Image
                src={m.photoUrl}
                alt={`${m.name} — ${m.role}`}
                fill
                sizes="(max-width:1024px) 100vw, 33vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-950">
                <span className="font-display text-[3rem] font-extrabold text-brand-500/90">
                  {m.initials}
                </span>
              </div>
            )}
            <span className="absolute left-3 top-3 rounded-sm bg-brand-600 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-white">
              {m.role.split(/[,&]/)[0]?.trim() || "Leadership"}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-[1.125rem] font-bold leading-snug">
              {m.name}
            </h3>
            <p className="mt-0.5 text-[0.8125rem] font-semibold text-brand-700">
              {m.role}
            </p>
            {m.bio && (
              <p className="mt-3 line-clamp-4 flex-1 text-[0.8125rem] leading-relaxed text-ink-600">
                {m.bio}
              </p>
            )}
            {(m.phone || m.email) && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="btn btn-outline btn-sm">
                    <Phone className="h-3.5 w-3.5" strokeWidth={2.3} />
                    Call
                  </a>
                )}
                {m.email && (
                  <a href={`mailto:${m.email}`} className="btn btn-outline btn-sm">
                    <Mail className="h-3.5 w-3.5" strokeWidth={2.3} />
                    Email
                  </a>
                )}
                <span className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-sm text-ink-300">
                  <Linkedin className="h-4 w-4" strokeWidth={2} />
                </span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export function LeadershipCta() {
  return (
    <Link
      href="/team"
      className="inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-brand-700 hover:underline"
    >
      Meet the full team
      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
    </Link>
  );
}
