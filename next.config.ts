import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2560],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      // Supabase Storage - project images uploaded through /admin
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // legacy WordPress media, kept so migrated records keep rendering
      { protocol: "https", hostname: "gorealtors.in", pathname: "/wp-content/**" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // immutable project imagery
        source: "/projects/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // Preserves inbound links and SEO equity from the previous WordPress site.
  async redirects() {
    return [
    { source: "/godrej-vrikshya-gurgaon-luxury-3-4-bhk-homes", destination: "/projects/godrej-vrikshya-sector-103-gurgaon", permanent: true },
    { source: "/godrej-vrikshya-sector-103-gurgaon", destination: "/projects/godrej-vrikshya-sector-103-gurgaon", permanent: true },
    { source: "/tulip-monsella-sector-53-gurgaon-premium-3-4-bhk-apartments", destination: "/projects/tulip-monsella-sector-53-gurgaon", permanent: true },
    { source: "/tulip-monsella-sector-53-gurgaon", destination: "/projects/tulip-monsella-sector-53-gurgaon", permanent: true },
    { source: "/m3m-altitude-sector-65-gurgaon-luxurious-4-bhk-apartments", destination: "/projects/m3m-altitude-sector-65-gurgaon", permanent: true },
    { source: "/m3m-altitude-sector-65-gurgaon", destination: "/projects/m3m-altitude-sector-65-gurgaon", permanent: true },
    { source: "/smart-world-one-dxp-sector-113-gurgaon", destination: "/projects/smart-world-one-dxp-sector-113-gurgaon", permanent: true },
    { source: "/sobha-aranya-sector-80-gurgaon-luxury-apartments-modern-living", destination: "/projects/sobha-aranya-sector-80-gurgaon", permanent: true },
    { source: "/sobha-aranya-sector-80-gurgaon", destination: "/projects/sobha-aranya-sector-80-gurgaon", permanent: true },
    { source: "/elan-the-presidential-gurgaon", destination: "/projects/elan-the-presidential-gurgaon", permanent: true },
    { source: "/hero-homes-the-palatial-luxurious-apartments-on-dwarka-expressway-gurugram", destination: "/projects/hero-homes-the-palatial-gurgaon", permanent: true },
    { source: "/hero-homes-the-palatial-gurgaon", destination: "/projects/hero-homes-the-palatial-gurgaon", permanent: true },
    { source: "/indiabulls-estate-and-club-104-gurgaon-luxury-apartments-on-dwarka-expressway", destination: "/projects/indiabulls-estate-and-club-104-gurgaon", permanent: true },
    { source: "/indiabulls-estate-and-club-104-gurgaon", destination: "/projects/indiabulls-estate-and-club-104-gurgaon", permanent: true },
    { source: "/ss-camasa-sector-90-gurgaon", destination: "/projects/ss-camasa-sector-90-gurgaon", permanent: true },
    { source: "/ss-cendana-sector-83-gurgaon", destination: "/projects/ss-cendana-sector-83-gurgaon", permanent: true },
    { source: "/ss-linden-floors-sector-84-gurgaon", destination: "/projects/ss-linden-floors-sector-84-gurgaon", permanent: true },
    { source: "/hcbs-twin-horizon-sector-102-gurgaon", destination: "/projects/hcbs-twin-horizon-sector-102-gurgaon", permanent: true },
    { source: "/bptp-gaia-residences-sector-102-gurgaon-luxury-3-bhk-apartments", destination: "/projects/bptp-gaia-residences-sector-102-gurgaon", permanent: true },
    { source: "/bptp-gaia-residences-sector-102-gurgaon", destination: "/projects/bptp-gaia-residences-sector-102-gurgaon", permanent: true },
    { source: "/central-park-104-gurgaon-premium-apartments-on-dwarka-expressway", destination: "/projects/central-park-104-gurgaon", permanent: true },
    { source: "/central-park-104-gurgaon", destination: "/projects/central-park-104-gurgaon", permanent: true },
    { source: "/aipl-lake-city-sector-103-luxury-apartments-on-dwarka-expressway", destination: "/projects/aipl-lake-city-sector-103-gurgaon", permanent: true },
    { source: "/aipl-lake-city-sector-103-gurgaon", destination: "/projects/aipl-lake-city-sector-103-gurgaon", permanent: true },
    { source: "/aipl-joy-district-gurgaon", destination: "/projects/aipl-joy-district-gurgaon", permanent: true },
    { source: "/conscient-soho-62-gurgaon", destination: "/projects/conscient-soho-62-gurgaon", permanent: true },
    { source: "/mvn-mall-37d-commercial-spaces-on-dwarka-expressway", destination: "/projects/mvn-mall-37d-gurgaon", permanent: true },
    { source: "/mvn-mall-37d-gurgaon", destination: "/projects/mvn-mall-37d-gurgaon", permanent: true },
    { source: "/reach-the-bazaria-68-gurgaon-premium-sco-plots-retail-spaces", destination: "/projects/reach-the-bazaria-68-gurgaon", permanent: true },
    { source: "/reach-the-bazaria-68-gurgaon", destination: "/projects/reach-the-bazaria-68-gurgaon", permanent: true },
    { source: "/reach-buzz-114-premium-sco-plots-in-sector-114-gurgaon", destination: "/projects/reach-buzz-114-sector-114-gurgaon", permanent: true },
    { source: "/reach-buzz-114-sector-114-gurgaon", destination: "/projects/reach-buzz-114-sector-114-gurgaon", permanent: true },
    { source: "/the-omaxe-state-sector-19b-dwarka", destination: "/projects/the-omaxe-state-sector-19b-dwarka", permanent: true },
    { source: "/about-us", destination: "/about", permanent: true },
    { source: "/contact-us", destination: "/contact", permanent: true },
    { source: "/blogs", destination: "/blog", permanent: true },
    { source: "/all-listings", destination: "/projects", permanent: true },
    { source: "/property-listing", destination: "/projects", permanent: true },
    { source: "/all-locations", destination: "/locations", permanent: true },
    { source: "/single-location", destination: "/locations", permanent: true },
    { source: "/premium-residential-properties-in-gurgaon", destination: "/residential", permanent: true },
    { source: "/explore-premium-commercial-properties-in-gurgaon", destination: "/commercial", permanent: true },
    { source: "/all-categories", destination: "/projects", permanent: true },
    { source: "/search-result", destination: "/search", permanent: true },
    { source: "/search-home", destination: "/search", permanent: true },
    { source: "/team-details", destination: "/team", permanent: true },
    { source: "/all-authors", destination: "/team", permanent: true },
    { source: "/single-agent", destination: "/team", permanent: true },
    { source: "/wishlist", destination: "/compare", permanent: true },
    { source: "/add-listing", destination: "/contact", permanent: true },
    { source: "/sign-in", destination: "/admin/login", permanent: true },
    { source: "/registration", destination: "/admin/login", permanent: true },
    { source: "/dashboard", destination: "/admin", permanent: true },
    { source: "/pricing-page", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
