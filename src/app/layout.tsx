import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      "GoRealtors — Property Consultant in Gurugram | Luxury & Investment Real Estate",
    template: "%s | GoRealtors",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "property consultant Gurugram",
    "real estate advisor Gurgaon",
    "luxury apartments Gurgaon",
    "commercial property Gurgaon",
    "SCO plots Gurgaon",
    "Dwarka Expressway projects",
    "Golf Course Road apartments",
    "new launch projects Gurgaon",
  ],
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: "GoRealtors — Property Consultant in Gurugram",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "GoRealtors — Property Consultant in Gurugram",
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  category: "real estate",
};

export const viewport: Viewport = {
  themeColor: "#0b0e12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${display.variable}`}>
      <body className="overflow-x-clip">{children}</body>
    </html>
  );
}
