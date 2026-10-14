import type { CityArt } from "@/data/content";

/**
 * Original, generic city silhouettes used as decorative art on the featured
 * city cards. These are abstract shapes — a highrise cluster, a domed
 * skyline, a cable bridge and a palm-lined coast — not depictions of any
 * specific landmark.
 */
export function CitySkyline({
  variant,
  className,
}: {
  variant: CityArt;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 200 70",
    preserveAspectRatio: "xMidYMax slice" as const,
    "aria-hidden": true,
    className,
    fill: "currentColor",
  };

  if (variant === "domes") {
    return (
      <svg {...common}>
        <path d="M0 70 V48 h12 v22z M18 70 V40 a8 8 0 0 1 16 0 v30z M40 70 V34 h6 l6-8 6 8 h6 v36z M66 70 V44 h10 v26z M82 70 V30 a10 10 0 0 1 20 0 v40z M108 70 V42 h8 v28z M122 70 V36 h5 l5-7 5 7 h5 v34z M148 70 V46 h12 v24z M166 70 V38 a7 7 0 0 1 14 0 v32z M186 70 V48 h14 v22z" />
        <rect x="88" y="18" width="2" height="8" />
        <rect x="128" y="24" width="2" height="6" />
      </svg>
    );
  }

  if (variant === "bridge") {
    return (
      <svg {...common}>
        <path d="M0 70 V58 h200 v12z" opacity="0.55" />
        <path d="M0 60 h200 v3 H0z" />
        <rect x="40" y="20" width="4" height="40" />
        <rect x="156" y="20" width="4" height="40" />
        <path d="M42 22 C 90 46 110 46 158 22" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M0 50 C 20 40 32 30 42 22" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M158 22 C 168 30 180 40 200 50" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <g strokeWidth="1" stroke="currentColor" opacity="0.6">
          <line x1="55" y1="30" x2="55" y2="60" />
          <line x1="70" y1="36" x2="70" y2="60" />
          <line x1="100" y1="40" x2="100" y2="60" />
          <line x1="130" y1="36" x2="130" y2="60" />
          <line x1="145" y1="30" x2="145" y2="60" />
        </g>
      </svg>
    );
  }

  if (variant === "coast") {
    return (
      <svg {...common}>
        <path d="M0 70 V62 h200 v8z" opacity="0.5" />
        <path d="M30 62 v-10 M30 52 c-6-2-9-6-9-6 M30 52 c6-2 9-6 9-6 M30 52 c-7 1-10 4-10 4 M30 52 c7 1 10 4 10 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M168 62 v-12 M168 50 c-7-2-10-6-10-6 M168 50 c7-2 10-6 10-6 M168 50 c-8 1-11 5-11 5 M168 50 c8 1 11 5 11 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M96 62 v-16 M96 46 c-8-2-12-7-12-7 M96 46 c8-2 12-7 12-7 M96 46 c-9 1-13 6-13 6 M96 46 c9 1 13 6 13 6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <rect x="52" y="48" width="18" height="14" rx="1" opacity="0.8" />
        <rect x="120" y="46" width="22" height="16" rx="1" opacity="0.8" />
      </svg>
    );
  }

  // towers — generic highrise cluster
  return (
    <svg {...common}>
      <path d="M0 70 V46 h14 v24z M18 70 V30 h12 v40z M34 70 V38 h10 v32z M48 70 V22 h14 v48z M66 70 V40 h10 v30z M80 70 V14 h12 v56z M96 70 V34 h10 v36z M110 70 V26 h14 v44z M128 70 V44 h10 v26z M142 70 V18 h12 v52z M158 70 V36 h10 v34z M172 70 V28 h14 v42z M190 70 V48 h10 v22z" />
      <g fill="var(--color-brand-400)" opacity="0.55">
        <rect x="83" y="20" width="2" height="3" />
        <rect x="87" y="20" width="2" height="3" />
        <rect x="145" y="24" width="2" height="3" />
        <rect x="149" y="24" width="2" height="3" />
        <rect x="52" y="28" width="2" height="3" />
      </g>
    </svg>
  );
}
