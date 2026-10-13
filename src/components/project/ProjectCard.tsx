import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  LandPlot,
  MapPin,
  Ruler,
} from "lucide-react";
import type { Project } from "@/lib/types";
import { STATUS_LABEL, STATUS_TONE, cn, imageAlt, priceRange } from "@/lib/utils";

const FALLBACK = "/brand/placeholder.svg";

export function ProjectCard({
  project,
  priority = false,
  layout = "grid",
}: {
  project: Project;
  priority?: boolean;
  layout?: "grid" | "row";
}) {
  const img = project.images[0] ?? FALLBACK;
  const minArea = project.configurations.length
    ? Math.min(...project.configurations.map((c) => c.areaSqft))
    : null;
  const maxArea = project.configurations.length
    ? Math.max(...project.configurations.map((c) => c.areaSqft))
    : null;

  if (layout === "row") {
    return (
      <article className="card card-hover group overflow-hidden">
        <div className="grid sm:grid-cols-[18rem_1fr]">
          <Link
            href={`/projects/${project.slug}`}
            className="relative block aspect-[4/3] overflow-hidden bg-ink-100 sm:aspect-auto sm:h-full"
          >
            <Image
              src={img}
              alt={imageAlt(project, 0, project.images.length)}
              fill
              sizes="(max-width:640px) 100vw, 18rem"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              priority={priority}
            />
            <StatusBadge project={project} />
          </Link>

          <div className="flex flex-col p-5">
            <CardHead project={project} />
            <Specs
              project={project}
              minArea={minArea}
              maxArea={maxArea}
              className="mt-4"
            />
            <p className="mt-3 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-600">
              {project.tagline}
            </p>
            <CardFoot project={project} className="mt-auto pt-4" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-[16/11] overflow-hidden bg-ink-100"
      >
        <Image
          src={img}
          alt={imageAlt(project, 0, project.images.length)}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          priority={priority}
        />
        <StatusBadge project={project} />
        {project.featured && (
          <span className="badge absolute right-3 top-3 bg-white/95 text-ink-900 shadow-card">
            Featured
          </span>
        )}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-950/70 to-transparent"
        />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-white">
          <Building2 className="h-3.5 w-3.5 text-brand-400" strokeWidth={2.2} />
          {project.developer}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <CardHead project={project} />
        <Specs project={project} minArea={minArea} maxArea={maxArea} className="mt-4" />
        <CardFoot project={project} className="mt-auto pt-4" />
      </div>
    </article>
  );
}

function StatusBadge({ project }: { project: Project }) {
  return (
    <span
      className={cn(
        "badge absolute left-3 top-3 shadow-card",
        STATUS_TONE[project.status],
      )}
    >
      {STATUS_LABEL[project.status]}
    </span>
  );
}

function CardHead({ project }: { project: Project }) {
  return (
    <>
      <h3 className="font-display text-[1.0625rem] font-bold leading-snug">
        <Link
          href={`/projects/${project.slug}`}
          className="transition-colors hover:text-brand-700"
        >
          {project.name}
        </Link>
      </h3>
      <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-500">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-600" strokeWidth={2.2} />
        {project.sector}, {project.locality}
      </p>
    </>
  );
}

function Specs({
  project,
  minArea,
  maxArea,
  className,
}: {
  project: Project;
  minArea: number | null;
  maxArea: number | null;
  className?: string;
}) {
  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    {
      icon: <LandPlot className="h-3.5 w-3.5" strokeWidth={2.2} />,
      label: "Config",
      value: project.configurationsLabel || project.propertyType,
    },
    {
      icon: <Ruler className="h-3.5 w-3.5" strokeWidth={2.2} />,
      label: minArea ? "Area sq.ft." : "Land",
      value:
        minArea && maxArea
          ? minArea === maxArea
            ? minArea.toLocaleString("en-IN")
            : `${minArea.toLocaleString("en-IN")}-${maxArea.toLocaleString("en-IN")}`
          : project.landAcres
            ? `${project.landAcres} acres`
            : "On request",
    },
    {
      icon: <CalendarClock className="h-3.5 w-3.5" strokeWidth={2.2} />,
      label: "Possession",
      value: project.possession ?? "On request",
    },
  ];

  return (
    <dl className={cn("grid grid-cols-3 gap-px overflow-hidden bg-ink-200", className)}>
      {rows.map((r) => (
        <div key={r.label} className="bg-ink-50/70 px-2.5 py-2.5">
          <dt className="flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
            <span className="text-brand-600">{r.icon}</span>
            {r.label}
          </dt>
          <dd
            className="mt-1 truncate text-[0.75rem] font-semibold text-ink-900"
            title={r.value}
          >
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CardFoot({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-3 border-t border-ink-100",
        className,
      )}
    >
      <div>
        <p className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
          Starting at
        </p>
        <p className="font-display text-[1.0625rem] font-bold text-ink-950">
          {priceRange(project.priceMin, project.priceMax)}
        </p>
      </div>
      <Link
        href={`/projects/${project.slug}`}
        className="btn btn-outline btn-sm group/btn"
      >
        Details
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          strokeWidth={2.4}
        />
      </Link>
    </div>
  );
}
