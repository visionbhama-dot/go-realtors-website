import type { CityArt } from "@/data/content";

/**
 * Original, generic city artwork used on the featured-city cards.
 *
 * These are abstract compositions drawn from scratch — a highrise cluster, a
 * domed skyline, a cable-stayed bridge and a palm-lined coast — layered with a
 * sun, haze and a water reflection so the cards read as artwork rather than
 * flat silhouettes. They deliberately do not depict any specific real landmark.
 *
 * Rendered in `currentColor` so each card can tint them to its own gradient.
 */
export function CitySkyline({
  variant,
  className,
}: {
  variant: CityArt;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 200 90",
    preserveAspectRatio: "xMidYMax slice" as const,
    "aria-hidden": true,
    className,
    fill: "currentColor",
  };

  /** Sun + soft haze bands shared by every variant. */
  const sky = (
    <g>
      <circle cx="152" cy="26" r="9" opacity="0.5" />
      <circle cx="152" cy="26" r="15" opacity="0.18" />
      <g opacity="0.22">
        <rect x="0" y="40" width="200" height="1.2" />
        <rect x="0" y="47" width="200" height="1.2" />
      </g>
    </g>
  );

  /** Mirrored waterline under a skyline band. */
  const water = (
    <g opacity="0.3">
      <rect x="0" y="78" width="200" height="12" />
      <g opacity="0.5">
        <rect x="14" y="82" width="26" height="1" />
        <rect x="58" y="85" width="34" height="1" />
        <rect x="112" y="81" width="22" height="1" />
        <rect x="150" y="86" width="30" height="1" />
      </g>
    </g>
  );

  if (variant === "domes") {
    return (
      <svg {...common}>
        {sky}
        <g opacity="0.45">
          <path d="M0 78 V58 h10 v20z M20 78 V54 h8 v24z M44 78 V50 h9 v28z M70 78 V56 h10 v22z M100 78 V52 h8 v26z M126 78 V58 h10 v20z M158 78 V54 h9 v24z M182 78 V60 h12 v18z" />
        </g>
        <path d="M0 78 V62 h12 v16z M18 78 V54 a8 8 0 0 1 16 0 v24z M40 78 V48 h6 l6-8 6 8 h6 v30z M66 78 V58 h10 v20z M82 78 V44 a10 10 0 0 1 20 0 v34z M108 78 V56 h8 v22z M122 78 V50 h5 l5-7 5 7 h5 v28z M148 78 V60 h12 v18z M166 78 V52 a7 7 0 0 1 14 0 v26z M186 78 V62 h14 v16z" />
        <rect x="91" y="30" width="2" height="8" />
        <rect x="131" y="38" width="2" height="6" />
        <g fill="var(--color-brand-400)" opacity="0.6">
          <rect x="24" y="60" width="2" height="2" />
          <rect x="88" y="52" width="2" height="2" />
          <rect x="96" y="52" width="2" height="2" />
          <rect x="171" y="58" width="2" height="2" />
        </g>
        {water}
      </svg>
    );
  }

  if (variant === "bridge") {
    return (
      <svg {...common}>
        {sky}
        {/* far skyline behind the bridge */}
        <g opacity="0.4">
          <path d="M0 70 V56 h12 v14z M16 70 V50 h9 v20z M30 70 V58 h10 v12z M168 70 V54 h10 v16z M182 70 V48 h12 v22z" />
        </g>
        <path d="M0 78 h200 v3 H0z" />
        <rect x="40" y="30" width="4" height="48" />
        <rect x="156" y="30" width="4" height="48" />
        <path
          d="M42 32 C 90 58 110 58 158 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M0 62 C 20 52 32 42 42 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M158 32 C 168 42 180 52 200 62"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <g strokeWidth="1" stroke="currentColor" opacity="0.6">
          <line x1="55" y1="41" x2="55" y2="78" />
          <line x1="70" y1="47" x2="70" y2="78" />
          <line x1="100" y1="52" x2="100" y2="78" />
          <line x1="130" y1="47" x2="130" y2="78" />
          <line x1="145" y1="41" x2="145" y2="78" />
        </g>
        <g fill="var(--color-brand-400)" opacity="0.7">
          <rect x="40" y="27" width="4" height="2" />
          <rect x="156" y="27" width="4" height="2" />
        </g>
        {water}
      </svg>
    );
  }

  if (variant === "coast") {
    return (
      <svg {...common}>
        {sky}
        {/* headland */}
        <g opacity="0.35">
          <path d="M0 78 C 24 62 44 58 70 60 L 70 78z" />
          <path d="M200 78 C 176 64 158 60 134 62 L 134 78z" />
        </g>
        <path d="M0 78 V72 h200 v6z" opacity="0.5" />
        {/* palms */}
        <path
          d="M30 72 v-12 M30 60 c-6-2-9-6-9-6 M30 60 c6-2 9-6 9-6 M30 60 c-7 1-10 4-10 4 M30 60 c7 1 10 4 10 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M168 72 v-14 M168 58 c-7-2-10-6-10-6 M168 58 c7-2 10-6 10-6 M168 58 c-8 1-11 5-11 5 M168 58 c8 1 11 5 11 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M96 72 v-18 M96 54 c-8-2-12-7-12-7 M96 54 c8-2 12-7 12-7 M96 54 c-9 1-13 6-13 6 M96 54 c9 1 13 6 13 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        {/* low resort blocks */}
        <rect x="52" y="58" width="18" height="14" rx="1" opacity="0.8" />
        <rect x="120" y="56" width="22" height="16" rx="1" opacity="0.8" />
        <g fill="var(--color-brand-400)" opacity="0.6">
          <rect x="57" y="62" width="2" height="2" />
          <rect x="63" y="62" width="2" height="2" />
          <rect x="126" y="60" width="2" height="2" />
          <rect x="133" y="60" width="2" height="2" />
        </g>
        {water}
      </svg>
    );
  }

  // towers — generic highrise cluster
  return (
    <svg {...common}>
      {sky}
      {/* back layer */}
      <g opacity="0.4">
        <path d="M6 78 V52 h12 v26z M26 78 V44 h10 v34z M54 78 V40 h11 v38z M86 78 V46 h10 v32z M116 78 V38 h12 v40z M150 78 V48 h10 v30z M176 78 V42 h12 v36z" />
      </g>
      {/* front layer */}
      <path d="M0 78 V58 h14 v20z M18 78 V42 h12 v36z M34 78 V50 h10 v28z M48 78 V34 h14 v44z M66 78 V52 h10 v26z M80 78 V26 h12 v52z M96 78 V46 h10 v32z M110 78 V38 h14 v40z M128 78 V56 h10 v22z M142 78 V30 h12 v48z M158 78 V48 h10 v30z M172 78 V40 h14 v38z M190 78 V60 h10 v18z" />
      {/* lit windows */}
      <g fill="var(--color-brand-400)" opacity="0.6">
        <rect x="83" y="32" width="2" height="3" />
        <rect x="87" y="32" width="2" height="3" />
        <rect x="145" y="36" width="2" height="3" />
        <rect x="149" y="36" width="2" height="3" />
        <rect x="52" y="40" width="2" height="3" />
        <rect x="57" y="40" width="2" height="3" />
        <rect x="114" y="44" width="2" height="3" />
        <rect x="119" y="44" width="2" height="3" />
        <rect x="176" y="46" width="2" height="3" />
      </g>
      {/* mast lights */}
      <g opacity="0.8">
        <rect x="85" y="22" width="2" height="4" />
        <rect x="147" y="26" width="2" height="4" />
      </g>
      {water}
    </svg>
  );
}
