"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "@/components/brand/SocialIcons";
import { Logo } from "@/components/brand/Logo";
import {
  MegaMobile,
  MegaPanel,
  type HeaderNavItem,
} from "./MegaMenu";
import { LiveSearch, SearchTrigger } from "@/components/search/LiveSearch";
import type { SearchItem } from "@/lib/search";
import { SITE, WHATSAPP_LINK } from "@/lib/site";
import { cn } from "@/lib/utils";

export type {
  HeaderNavItem,
  MegaColumn,
  NavChild,
} from "./MegaMenu";

export function Header({
  nav,
  searchIndex,
}: {
  nav: HeaderNavItem[];
  searchIndex: SearchItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setOpen(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setDrawer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  const activeMega = open ? nav.find((n) => n.label === open) : undefined;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* ---------- utility bar ---------- */}
      <div className="hidden bg-ink-950 text-white lg:block">
        <div className="shell flex h-10 items-center justify-between text-[0.75rem]">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-white/70">
              <MapPin className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.2} />
              {SITE.address.line1}, {SITE.address.line2}, {SITE.address.city}
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/70">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.2} />
              {SITE.rera}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center gap-1.5 font-semibold transition-colors hover:text-brand-400"
            >
              <Phone className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.2} />
              {SITE.phoneDisplay}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-1.5 text-white/70 transition-colors hover:text-brand-400"
            >
              <Mail className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.2} />
              {SITE.email}
            </a>
            <span aria-hidden className="h-4 w-px bg-white/15" />
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: SITE.social.instagram, label: "Instagram" },
                { Icon: Facebook, href: SITE.social.facebook, label: "Facebook" },
                { Icon: Linkedin, href: SITE.social.linkedin, label: "LinkedIn" },
                { Icon: Youtube, href: SITE.social.youtube, label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/60 transition-colors hover:text-brand-400"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- main bar ---------- */}
      <div
        className={cn(
          "border-b bg-white/95 backdrop-blur transition-shadow duration-200",
          scrolled ? "border-ink-200 shadow-card" : "border-transparent",
        )}
      >
        <div className="shell relative flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <Logo />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.mega && enter(item.label)}
                  onMouseLeave={leave}
                >
                  <Link
                    href={item.href}
                    aria-expanded={item.mega ? open === item.label : undefined}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-sm px-3 py-2 text-[0.8125rem] font-semibold transition-colors",
                      active
                        ? "text-brand-700"
                        : "text-ink-800 hover:text-brand-700",
                    )}
                  >
                    {item.label}
                    {item.mega && (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          open === item.label && "rotate-180",
                        )}
                        strokeWidth={2.4}
                      />
                    )}
                  </Link>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-[1px] h-[2px] bg-brand-600"
                    />
                  )}

                </div>
              );
            })}
          </nav>

          {/* One panel for the whole bar, centred on the container. Anchoring
              to the trigger pushed wide menus off-screen for left-hand items. */}
          {activeMega?.mega && (
            <div
              className="absolute left-1/2 top-full z-50 hidden -translate-x-1/2 pt-3 lg:block"
              onMouseEnter={() => enter(activeMega.label)}
              onMouseLeave={leave}
            >
              <MegaPanel
                columns={activeMega.mega}
                width={activeMega.width}
                onNavigate={() => setOpen(null)}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <SearchTrigger index={searchIndex} />
            <a
              href={`tel:${SITE.phone}`}
              className="btn btn-outline btn-sm hidden xl:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={2.2} />
              Call
            </a>
            <a
              href={WHATSAPP_LINK("Hi GoRealtors, I'd like to discuss a property in Gurugram.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm hidden sm:inline-flex"
            >
              Enquire Now
            </a>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-ink-200 text-ink-900 lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- mobile drawer ---------- */}
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-ink-950/60"
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(21rem,88vw)] flex-col bg-white shadow-rise">
            <div className="flex items-center justify-between border-b border-ink-200 px-4 py-3">
              <Logo withTagline={false} />
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-ink-200"
              >
                <X className="h-4.5 w-4.5" strokeWidth={2.2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-3">
              <div className="px-1 pb-3">
                <LiveSearch
                  index={searchIndex}
                  placeholder="Search projects…"
                  onClose={() => setDrawer(false)}
                />
              </div>
              {nav.map((item) => (
                <MobileItem key={item.label} item={item} />
              ))}
              <div className="mt-4 space-y-2 border-t border-ink-200 px-2 pt-4">
                <Link href="/contact" className="btn btn-primary w-full">
                  Book a Consultation
                </Link>
                <a href={`tel:${SITE.phone}`} className="btn btn-outline w-full">
                  <Phone className="h-4 w-4" strokeWidth={2.2} />
                  {SITE.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="border-t border-ink-200 px-4 py-3 text-[0.75rem] text-ink-500">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" strokeWidth={2.2} />
                {SITE.addressOneLine}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileItem({ item }: { item: HeaderNavItem }) {
  const [expanded, setExpanded] = useState(false);
  if (!item.mega) {
    return (
      <Link
        href={item.href}
        className="block rounded-sm px-3 py-2.5 text-sm font-semibold text-ink-900 hover:bg-ink-50"
      >
        {item.label}
      </Link>
    );
  }
  return (
    <div>
      <div className="flex items-center">
        <Link
          href={item.href}
          className="flex-1 rounded-sm px-3 py-2.5 text-sm font-semibold text-ink-900 hover:bg-ink-50"
        >
          {item.label}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={`Toggle ${item.label}`}
          aria-expanded={expanded}
          className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-sm text-ink-500 hover:bg-ink-50"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
            strokeWidth={2.4}
          />
        </button>
      </div>
      {expanded && (
        <div className="mb-2 ml-3 border-l border-ink-200 pl-3">
          <MegaMobile columns={item.mega} />
        </div>
      )}
    </div>
  );
}
