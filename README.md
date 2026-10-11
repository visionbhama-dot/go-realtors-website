# GoRealtors — website & CMS

Production rebuild of [gorealtors.in](https://gorealtors.in): a real estate
advisory website for Gurugram, with a complete editing backend.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Supabase (Postgres + Auth + Storage) · deploys to Vercel.

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. **The site works immediately with no database** —
every page renders from content bundled in `src/data`. `/admin` shows a setup
checklist until Supabase is connected.

---

## Repository layout

```
.
├── src/
│   ├── app/(site)/        Public website
│   ├── app/admin/         CMS / dashboard
│   ├── app/actions/       Server actions (public forms + all CMS writes)
│   ├── components/        UI components
│   ├── data/              Bundled seed content (fallback when Supabase is absent)
│   └── lib/               Data access, auth/RBAC, SEO, utilities
├── public/projects/       95 project photographs migrated from the old site
├── supabase/
│   ├── migrations/        Schema, role-permission matrix, RLS policies
│   └── seed.sql           All real content, ready to import
└── _scrape/               The migration pipeline used to pull content across
```

---

## Content migrated from the previous site

Everything below was extracted from the live WordPress site, not invented:

| Content | Count |
| --- | --- |
| Projects (residential + commercial) | 21 |
| Unit configurations with real pricing | 29 |
| Project FAQs | 168 |
| Project photographs | 95 |
| Developer profiles | 17 |
| Corridor / micro-market guides | 6 |
| Blog articles (with original publish dates) | 13 |
| SEO records (one per route) | 18 |

Prices, carpet areas, RERA numbers, possession dates, land parcels and
tower/unit counts were all read off the source pages. Six projects publish no
public price, so they render **Price on Request** rather than an invented
figure.

---

## Public website

| Route | Purpose |
| --- | --- |
| `/` | Homepage — hero search, trending projects, corridors, services, process, testimonials, insights, FAQ |
| `/projects` | Directory with faceted filtering (budget, BHK, stage, corridor, asset type, developer) + sort + pagination |
| `/projects/[slug]` | Project detail — gallery with lightbox, quick facts, overview, highlights, price table, amenities, investment case, location + map, developer profile, RERA panel, FAQs, similar projects |
| `/residential`, `/commercial` | Category landings with grouped listings and category-specific FAQs |
| `/locations`, `/locations/[slug]` | Corridor comparison table + full micro-market guides |
| `/developers`, `/developers/[slug]` | Developer directory and profile pages |
| `/services`, `/services/[slug]` | Eight advisory service lines |
| `/blog`, `/blog/[slug]` | Market insights with category filtering |
| `/about`, `/team`, `/careers`, `/contact` | Company pages; careers includes a working application form |
| `/faqs` | Grouped buyer FAQs with `FAQPage` schema |
| `/compare` | Side-by-side comparison of up to three projects |
| `/tools/emi-calculator` | EMI plus full Haryana acquisition cost (GST, stamp duty, registration) |
| `/privacy-policy`, `/terms`, `/disclaimer` | Legal pages |
| `/sitemap.xml`, `/robots.txt` | Generated, revalidated hourly |

**SEO built in:** per-route metadata overridable from the CMS,
server-rendered JSON-LD (`RealEstateAgent` and `WebSite` on the homepage;
`Residence` + `BreadcrumbList` + `FAQPage` on every project; `BlogPosting` on
every article), Open Graph and Twitter cards throughout, and **54 permanent
redirects** from the old WordPress URLs so existing rankings and inbound links
survive the migration.

---

## Admin / CMS — `/admin`

Everything the public site renders is editable here.

| Screen | What it manages |
| --- | --- |
| **Dashboard** | Live inventory, pipeline and content counts; latest enquiries; pipeline by stage |
| **Projects** | Full CRUD across six tabs — basics, pricing & units, content, media, FAQs, SEO. Repeatable configuration and FAQ rows. Draft / published / archived |
| **Developers** | Profile pages, specialities, publish state |
| **Locations** | Corridor guides, price bands, growth outlook, highlights |
| **Leads** | Every website enquiry with the page it came from. Stage, priority, owner assignment, follow-up date, call notes, CSV export |
| **Blog posts** | Full editor with per-post SEO, categories, tags, cover image, scheduling |
| **Testimonials** | Client quotes with ratings and publish state |
| **Team profiles** | Public advisor profiles shown on `/team` |
| **Media** | Upload to Supabase Storage, copy public URLs straight into a project |
| **SEO manager** | Per-route meta title, description, keywords, canonical, OG image, noindex — with title-length scoring. Plus a redirect manager |
| **Team & access** | Create staff logins, assign roles, enable/disable accounts, full permission matrix |
| **Site settings** | Contact details, social profiles, brand copy and stats, analytics IDs, lead notification routing |
| **Activity log** | Append-only audit trail of every change, with actor and timestamp |

### Roles and permissions

Six roles, enforced by **Postgres row-level security** — not merely hidden in
the UI. A Content Editor cannot read a lead even by calling the API directly.

| Role | Intended for | Scope |
| --- | --- | --- |
| **Owner** | Business owner | Everything. Cannot be demoted or disabled from the UI |
| **Administrator** | Senior manager | Everything except transferring ownership |
| **Manager** | Operations lead | Projects, leads, content, SEO. Can view but not change user roles |
| **Sales Advisor** | Property advisor | Reads projects; reads and updates leads assigned to them |
| **Content Editor** | Marketing | Projects, blog, team profiles, SEO. **No access to leads** |
| **Viewer** | Auditor / new joiner | Read-only |

The matrix lives in `role_permissions` in the database and is mirrored in
`src/lib/roles.ts` so the UI can hide controls without an extra round trip.
**If you change one, change both.**

---

## Setup

### 1. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com). Choose the
   **Singapore (ap-southeast-1)** region for the lowest latency from India.
2. Open **SQL Editor** and run `supabase/migrations/20260101000000_init.sql`.
   This creates every table, the role-permission matrix, the dashboard view,
   triggers and all RLS policies.
3. Run `supabase/seed.sql`. This imports all 21 projects, 17 developers, 6
   corridors, 13 articles, SEO records, settings and navigation. It is
   idempotent — safe to re-run.
4. Open **Storage** and create a **public** bucket named exactly `media`.
   This is what the Media screen uploads to.

### 2. Add environment variables

From Supabase **Project Settings → API**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # server-side only, never commit
NEXT_PUBLIC_SITE_URL=https://gorealtors.in
```

> `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. It is used in exactly two places:
> writing enquiries from anonymous visitors, and creating staff accounts. Keep
> it out of the client bundle and out of git.

### 3. Create your owner account

In Supabase, go to **Authentication → Users → Add user**, enter your email and
a password, and tick *Auto Confirm User*.

**The first profile created automatically becomes the Owner** — handled by the
`handle_new_user` trigger. Every subsequent account defaults to Viewer until an
admin changes it.

Then sign in at `/admin/login` and invite your team from **Team & access**.

### 4. Deploy to Vercel

1. In Vercel, **Add New Project** and import this repository.
2. Leave **Root Directory** as the default — the app is at the repo root and
   Vercel auto-detects Next.js. No build configuration needed.
3. Add the four environment variables above for Production, Preview and
   Development.
4. Deploy, then add `gorealtors.in` under **Settings → Domains** and point your
   DNS at Vercel.

---

## How the data layer works

Every public read goes through `src/lib/repo/*`, which tries Supabase first and
falls back to the bundled seed content:

```ts
export async function getAllProjects(): Promise<Project[]> {
  const sb = getPublicSupabase();
  if (sb) {
    const { data, error } = await sb.from("projects")...;
    if (!error && data?.length) return data.map(mapProject);
  }
  return GENERATED_PROJECTS;   // bundled fallback
}
```

Two useful consequences:

- You can deploy and review the finished site before touching the database.
- If Supabase has an outage the public website keeps serving pages instead of
  returning 500s. Only `/admin` stops working.

Project and blog pages are statically generated with `revalidate = 3600`, so a
CMS edit appears within the hour — or immediately, because every write action
calls `revalidatePath()` on the affected routes.

---

## Before you go live

A short list that needs your input rather than mine:

1. **Replace the testimonials.** The six loaded by the seed are illustrative
   placeholders written to demonstrate the design. Swap them for real,
   attributable client quotes from **Admin → Testimonials**, and keep written
   consent on file for each.
2. **Add your team.** Only the founder profile is seeded. Add the rest from
   **Admin → Team profiles**, and create their logins under **Team & access**.
3. **Verify the headline statistics.** `1,200+ families advised`,
   `₹850 Cr+ transaction value`, `40+ developer partners` and `12+ years` are
   editable in **Admin → Site settings → Brand**. Set them to figures you can
   substantiate.
4. **Add your analytics IDs** (GA4, GTM, Meta Pixel, Search Console) in
   **Admin → Site settings → Analytics**.
5. **Check the RERA numbers.** Two projects carried a registration number on
   the source site; the rest show a generic badge. Add each project's real
   HARERA number in the project editor so the RERA panel renders properly.
6. **Confirm the office address** — `SVH Metro Street, 1522-1523, Sector 83,
   Gurugram, Haryana 122012` — renders correctly in the footer map embed.

---

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

### Regenerating the migrated content

The `_scrape/` pipeline is kept in the repo so the migration is reproducible:

```bash
python3 _scrape/parse.py      # scrape + structure the live project pages
python3 _scrape/gen_seed.py   # -> src/data/projects.generated.ts
python3 _scrape/gen_sql.py    # -> supabase/seed.sql
```

You will not normally need this — once content lives in Supabase, the CMS is
the source of truth.

---

## Conventions worth knowing

- **Brand colours** are defined once as Tailwind v4 theme tokens in
  `src/app/globals.css`: `brand-*` (the logo green, `#6abf4b`) and `ink-*`
  (the near-black wordmark colour). Use those rather than raw hex.
- **Component classes** (`.btn`, `.card`, `.field`, `.chip`, `.badge`,
  `.shell`, `.eyebrow`) also live in `globals.css`. Prefer them over
  re-deriving the same utility stacks.
- **Avoid literal `→` characters** in copy. The Inter latin subset does not
  include the glyph, so it falls back inconsistently. Use the lucide
  `ArrowRight` icon instead.
- **All CMS writes go through `src/app/actions/admin.ts`**, which checks
  `requirePermission()` before touching the database and writes an audit entry
  afterwards.
