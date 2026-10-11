"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  ChevronDown,
  ExternalLink,
  FileText,
  Globe2,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquareQuote,
  ScrollText,
  Settings,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { ROLE_LABEL } from "@/lib/roles";
import type { Permission, UserRole } from "@/lib/types";
import { cn, initialsOf } from "@/lib/utils";
import { getBrowserSupabase } from "@/lib/supabase/client";

type NavEntry = {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission: Permission;
  badge?: number;
};

type NavGroup = { heading: string; items: NavEntry[] };

export function AdminShell({
  user,
  newLeads,
  children,
}: {
  user: {
    fullName: string;
    email: string;
    role: UserRole;
    permissions: Permission[];
  };
  newLeads: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const groups: NavGroup[] = [
    {
      heading: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: <LayoutDashboard className="h-4 w-4" strokeWidth={2.1} />,
          permission: "projects.read",
        },
      ],
    },
    {
      heading: "Inventory",
      items: [
        {
          label: "Projects",
          href: "/admin/projects",
          icon: <Building2 className="h-4 w-4" strokeWidth={2.1} />,
          permission: "projects.read",
        },
        {
          label: "Developers",
          href: "/admin/developers",
          icon: <UsersRound className="h-4 w-4" strokeWidth={2.1} />,
          permission: "projects.read",
        },
        {
          label: "Locations",
          href: "/admin/locations",
          icon: <MapPin className="h-4 w-4" strokeWidth={2.1} />,
          permission: "projects.read",
        },
      ],
    },
    {
      heading: "Sales",
      items: [
        {
          label: "Leads",
          href: "/admin/leads",
          icon: <MessageSquareQuote className="h-4 w-4" strokeWidth={2.1} />,
          permission: "leads.read",
          badge: newLeads,
        },
      ],
    },
    {
      heading: "Content",
      items: [
        {
          label: "Blog posts",
          href: "/admin/blog",
          icon: <FileText className="h-4 w-4" strokeWidth={2.1} />,
          permission: "blog.read",
        },
        {
          label: "Testimonials",
          href: "/admin/testimonials",
          icon: <MessageSquareQuote className="h-4 w-4" strokeWidth={2.1} />,
          permission: "team.read",
        },
        {
          label: "Team profiles",
          href: "/admin/team",
          icon: <Users className="h-4 w-4" strokeWidth={2.1} />,
          permission: "team.read",
        },
        {
          label: "Media",
          href: "/admin/media",
          icon: <ImageIcon className="h-4 w-4" strokeWidth={2.1} />,
          permission: "media.write",
        },
      ],
    },
    {
      heading: "Growth",
      items: [
        {
          label: "SEO manager",
          href: "/admin/seo",
          icon: <Globe2 className="h-4 w-4" strokeWidth={2.1} />,
          permission: "seo.read",
        },
      ],
    },
    {
      heading: "Administration",
      items: [
        {
          label: "Team & access",
          href: "/admin/users",
          icon: <Users className="h-4 w-4" strokeWidth={2.1} />,
          permission: "users.read",
        },
        {
          label: "Site settings",
          href: "/admin/settings",
          icon: <Settings className="h-4 w-4" strokeWidth={2.1} />,
          permission: "settings.write",
        },
        {
          label: "Activity log",
          href: "/admin/audit",
          icon: <ScrollText className="h-4 w-4" strokeWidth={2.1} />,
          permission: "audit.read",
        },
      ],
    },
  ];

  const visible = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => user.permissions.includes(i.permission)),
    }))
    .filter((g) => g.items.length > 0);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function signOut() {
    const sb = getBrowserSupabase();
    await sb?.auth.signOut();
    window.location.href = "/admin/login";
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-ink-950">
      <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-5">
        <LogoMark className="h-7 w-7 text-white" />
        <span className="font-display text-[0.9375rem] font-extrabold tracking-tight text-white">
          Go<span className="text-brand-500">Realtors</span>
        </span>
        <span className="ml-auto rounded-sm bg-white/10 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-white/60">
          CMS
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin">
        {visible.map((g) => (
          <div key={g.heading} className="mb-5">
            <p className="px-2 pb-2 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-white/35">
              {g.heading}
            </p>
            <ul className="space-y-0.5">
              {g.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-[0.8125rem] font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-brand-600 text-white"
                        : "text-white/60 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    {item.icon}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={cn(
                          "inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[0.625rem] font-bold tabular-nums",
                          isActive(item.href)
                            ? "bg-white/25 text-white"
                            : "bg-brand-600 text-white",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-[0.8125rem] font-medium text-white/55 transition-colors hover:bg-white/8 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={2.1} />
          View live site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50/60">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 lg:block">
        {sidebar}
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-950/60"
          />
          <div className="absolute inset-y-0 left-0 w-60">
            {sidebar}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute right-2 top-3 inline-flex h-8 w-8 items-center justify-center rounded-sm text-white/70 hover:bg-white/10"
            >
              <X className="h-4 w-4" strokeWidth={2.3} />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-60">
        {/* top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-ink-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-ink-200 lg:hidden"
          >
            <Menu className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden rounded-sm border border-ink-200 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-ink-500 sm:inline-block">
              {ROLE_LABEL[user.role]}
            </span>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                aria-expanded={menu}
                className="flex items-center gap-2 rounded-sm px-1.5 py-1 transition-colors hover:bg-ink-50"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink-950 text-[0.6875rem] font-bold text-brand-400">
                  {initialsOf(user.fullName)}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block max-w-[10rem] truncate text-[0.8125rem] font-semibold leading-tight">
                    {user.fullName}
                  </span>
                  <span className="block max-w-[10rem] truncate text-[0.6875rem] leading-tight text-ink-400">
                    {user.email}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-ink-400 transition-transform",
                    menu && "rotate-180",
                  )}
                  strokeWidth={2.4}
                />
              </button>

              {menu && (
                <>
                  <button
                    type="button"
                    aria-hidden
                    tabIndex={-1}
                    onClick={() => setMenu(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />
                  <div className="absolute right-0 top-full z-20 mt-1.5 w-56 rounded-md border border-ink-200 bg-white p-1.5 shadow-rise">
                    <div className="border-b border-ink-100 px-2.5 py-2">
                      <p className="truncate text-[0.8125rem] font-bold">
                        {user.fullName}
                      </p>
                      <p className="truncate text-[0.6875rem] text-ink-500">
                        {user.email}
                      </p>
                      <p className="mt-1.5 inline-block rounded-sm bg-brand-50 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-brand-800">
                        {ROLE_LABEL[user.role]}
                      </p>
                    </div>
                    <Link
                      href="/admin/profile"
                      onClick={() => setMenu(false)}
                      className="mt-1 block rounded-sm px-2.5 py-2 text-[0.8125rem] text-ink-700 hover:bg-ink-50"
                    >
                      My profile
                    </Link>
                    <Link
                      href="/"
                      target="_blank"
                      className="block rounded-sm px-2.5 py-2 text-[0.8125rem] text-ink-700 hover:bg-ink-50"
                    >
                      View live site
                    </Link>
                    <button
                      type="button"
                      onClick={signOut}
                      className="flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-[0.8125rem] font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-3.5 w-3.5" strokeWidth={2.3} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
