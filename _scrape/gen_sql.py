"""Generate supabase/seed.sql from the TypeScript seed data."""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
WEB = ROOT  # the Next app lives at the repository root


def ts_to_json(rel_file, export_name):
    """Evaluate a generated TS data file with node and dump it as JSON."""
    script = f"""
const fs = require('fs');
let src = fs.readFileSync({json.dumps(os.path.join(WEB, rel_file))}, 'utf8');
src = src.replace(/^import[^;]*;$/gm, '').replace(/export const /, 'const ');
src = src.replace(/: [A-Za-z]+\\[\\] =/, ' =');
const mod = {{}};
eval(src + ';mod.data = {export_name};');
process.stdout.write(JSON.stringify(mod.data));
"""
    out = subprocess.run(
        ["node", "-e", script], capture_output=True, text=True, cwd=WEB
    )
    if out.returncode != 0:
        sys.exit(f"node failed for {rel_file}:\n{out.stderr}")
    return json.loads(out.stdout)


def q(v):
    """SQL literal."""
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(v)
    return "'" + str(v).replace("'", "''") + "'"


def arr(items):
    if not items:
        return "'{}'"
    inner = ",".join('"' + str(i).replace("\\", "\\\\").replace('"', '\\"') + '"' for i in items)
    return "'{" + inner.replace("'", "''") + "}'"


projects = ts_to_json("src/data/projects.generated.ts", "GENERATED_PROJECTS")
posts = ts_to_json("src/data/blog.generated.ts", "GENERATED_POSTS")

# content.ts exports several consts; pull them individually
content_src = open(os.path.join(WEB, "src/data/content.ts"), encoding="utf8").read()


def grab_const(name):
    script = f"""
const fs = require('fs');
let src = fs.readFileSync({json.dumps(os.path.join(WEB, 'src/data/content.ts'))}, 'utf8');
src = src.replace(/^import[^;]*?;$/gms, '');
// cut everything from the derived maps onward BEFORE rewriting exports, so
// trailing `export type`/`export const` additions never reach eval()
src = src.split('export const DEVELOPER_BY_NAME')[0];
src = src.replace(/export const /g, 'const ');
src = src.replace(/: (?:Developer|Locality|ServiceItem|TeamMember|Testimonial|Faq)\\[\\] =/g, ' =');
eval(src + ';process.stdout.write(JSON.stringify({name}));');
"""
    out = subprocess.run(["node", "-e", script], capture_output=True, text=True, cwd=WEB)
    if out.returncode != 0:
        sys.exit(f"node failed for {name}:\n{out.stderr}")
    return json.loads(out.stdout)


developers = grab_const("DEVELOPERS")
localities = grab_const("LOCALITIES")
team = grab_const("TEAM")
testimonials = grab_const("TESTIMONIALS")
home_faqs = grab_const("HOME_FAQS")

L = []
A = L.append

A("-- =====================================================================")
A("-- GoRealtors seed data")
A("-- Generated from the live gorealtors.in content. Run AFTER the migration.")
A("-- Safe to re-run: every insert is idempotent on its natural key.")
A("-- =====================================================================")
A("begin;")
A("")

# ------------------------------------------------------------- developers
A("-- ---------------------------------------------------------- developers")
for i, d in enumerate(developers):
    A(
        "insert into developers (slug, name, short_name, established, headquarters, description, specialities, sort_order, state) values\n"
        f"  ({q(d['slug'])}, {q(d['name'])}, {q(d['short'])}, {q(d.get('established'))}, "
        f"{q(d['headquarters'])}, {q(d['description'])}, {arr(d['specialities'])}, {i}, 'published')\n"
        "on conflict (slug) do update set name = excluded.name, short_name = excluded.short_name,\n"
        "  established = excluded.established, headquarters = excluded.headquarters,\n"
        "  description = excluded.description, specialities = excluded.specialities,\n"
        "  sort_order = excluded.sort_order, state = excluded.state;"
    )
A("")

# ------------------------------------------------------------- localities
A("-- ---------------------------------------------------------- localities")
for i, l in enumerate(localities):
    A(
        "insert into localities (slug, name, city, blurb, description, highlights, price_band, growth, sort_order, state) values\n"
        f"  ({q(l['slug'])}, {q(l['name'])}, {q(l['city'])}, {q(l['blurb'])}, {q(l['description'])}, "
        f"{arr(l['highlights'])}, {q(l['priceBand'])}, {q(l['growth'])}, {i}, 'published')\n"
        "on conflict (slug) do update set name = excluded.name, city = excluded.city,\n"
        "  blurb = excluded.blurb, description = excluded.description,\n"
        "  highlights = excluded.highlights, price_band = excluded.price_band,\n"
        "  growth = excluded.growth, sort_order = excluded.sort_order, state = excluded.state;"
    )
A("")

# --------------------------------------------------------------- projects
A("-- ------------------------------------------------------------ projects")
for i, p in enumerate(projects):
    A(
        "insert into projects (slug, legacy_slug, name, tagline, developer_name, locality_name, sector,\n"
        "  city, category, property_type, status, configurations_label, price_min, price_max,\n"
        "  land_acres, towers, units, possession, rera, overview, highlights, amenities,\n"
        "  why_invest, location_advantages, floor_plan_note, images, is_featured, is_trending,\n"
        "  sort_order, state, seo_title, seo_description) values\n"
        f"  ({q(p['slug'])}, {q(p.get('legacySlug'))}, {q(p['name'])}, {q(p['tagline'])},\n"
        f"   {q(p['developer'])}, {q(p['locality'])}, {q(p['sector'])}, {q(p['city'])},\n"
        f"   {q(p['category'])}, {q(p['propertyType'])}, {q(p['status'])}, {q(p['configurationsLabel'])},\n"
        f"   {q(p.get('priceMin'))}, {q(p.get('priceMax'))}, {q(p.get('landAcres'))},\n"
        f"   {q(p.get('towers'))}, {q(p.get('units'))}, {q(p.get('possession'))}, {q(p.get('rera'))},\n"
        f"   {arr(p['overview'])}, {arr(p['highlights'])}, {arr(p['amenities'])},\n"
        f"   {arr(p['whyInvest'])}, {arr(p['locationAdvantages'])}, {q(p.get('floorPlanNote'))},\n"
        f"   {arr(p['images'])}, {q(p['featured'])}, {q(p['trending'])}, {i}, 'published',\n"
        f"   {q(p['seoTitle'])}, {q(p['seoDescription'])})\n"
        "on conflict (slug) do update set\n"
        "  legacy_slug = excluded.legacy_slug, name = excluded.name, tagline = excluded.tagline,\n"
        "  developer_name = excluded.developer_name, locality_name = excluded.locality_name,\n"
        "  sector = excluded.sector, city = excluded.city, category = excluded.category,\n"
        "  property_type = excluded.property_type, status = excluded.status,\n"
        "  configurations_label = excluded.configurations_label, price_min = excluded.price_min,\n"
        "  price_max = excluded.price_max, land_acres = excluded.land_acres, towers = excluded.towers,\n"
        "  units = excluded.units, possession = excluded.possession, rera = excluded.rera,\n"
        "  overview = excluded.overview, highlights = excluded.highlights, amenities = excluded.amenities,\n"
        "  why_invest = excluded.why_invest, location_advantages = excluded.location_advantages,\n"
        "  floor_plan_note = excluded.floor_plan_note, images = excluded.images,\n"
        "  is_featured = excluded.is_featured, is_trending = excluded.is_trending,\n"
        "  sort_order = excluded.sort_order, state = excluded.state,\n"
        "  seo_title = excluded.seo_title, seo_description = excluded.seo_description;"
    )
A("")

# link FK columns
A("-- link projects to developer/locality rows by name")
A("update projects p set developer_id = d.id from developers d where d.name = p.developer_name;")
A("update projects p set locality_id = l.id from localities l where l.name = p.locality_name;")
A("")

# configurations + faqs (replace per project)
A("-- ------------------------------------------- configurations and FAQs")
for p in projects:
    slug = p["slug"]
    A(f"delete from project_configurations where project_id = (select id from projects where slug = {q(slug)});")
    for j, c in enumerate(p["configurations"]):
        A(
            "insert into project_configurations (project_id, unit_type, area_sqft, price, sort_order)\n"
            f"  select id, {q(c['type'])}, {q(c['areaSqft'])}, {q(c['price'])}, {j} from projects where slug = {q(slug)};"
        )
    A(f"delete from project_faqs where project_id = (select id from projects where slug = {q(slug)});")
    for j, f in enumerate(p["faqs"]):
        A(
            "insert into project_faqs (project_id, question, answer, sort_order)\n"
            f"  select id, {q(f['question'])}, {q(f['answer'])}, {j} from projects where slug = {q(slug)};"
        )
A("")

# ------------------------------------------------------------------- blog
A("-- ------------------------------------------------------- blog content")
cats = sorted({p["category"] for p in posts})
for i, c in enumerate(cats):
    cslug = re.sub(r"[^a-z0-9]+", "-", c.lower()).strip("-")
    A(
        f"insert into blog_categories (slug, name, sort_order) values ({q(cslug)}, {q(c)}, {i})\n"
        "on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;"
    )
A("")
for p in posts:
    A(
        "insert into blog_posts (slug, title, excerpt, category_name, author_name, cover_image,\n"
        "  body, tags, read_minutes, state, published_at, seo_title, seo_description) values\n"
        f"  ({q(p['slug'])}, {q(p['title'])}, {q(p['excerpt'])}, {q(p['category'])}, {q(p['author'])},\n"
        f"   {q(p['cover'])}, {arr(p['body'])}, {arr(p['tags'])}, {q(p['readMinutes'])}, 'published',\n"
        f"   {q(p['publishedAt'])}::timestamptz, {q(p['title'])}, {q(p['excerpt'])})\n"
        "on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt,\n"
        "  category_name = excluded.category_name, author_name = excluded.author_name,\n"
        "  cover_image = excluded.cover_image, body = excluded.body, tags = excluded.tags,\n"
        "  read_minutes = excluded.read_minutes, state = excluded.state,\n"
        "  published_at = excluded.published_at;"
    )
A("")
A("update blog_posts p set category_id = c.id from blog_categories c where c.name = p.category_name;")
A("")

# -------------------------------------------------------------- team
A("-- -------------------------------------------------------------- team")
for i, m in enumerate(team):
    A(
        "insert into team_members (slug, name, role_title, bio, focus, email, phone, photo_url, sort_order, state) values\n"
        f"  ({q(m['slug'])}, {q(m['name'])}, {q(m['role'])}, {q(m['bio'])}, {q(m['focus'])},\n"
        f"   {q(m.get('email'))}, {q(m.get('phone'))}, {q(m.get('photoUrl'))}, {i}, 'published')\n"
        "on conflict (slug) do update set name = excluded.name, role_title = excluded.role_title,\n"
        "  bio = excluded.bio, focus = excluded.focus, email = excluded.email,\n"
        "  phone = excluded.phone, photo_url = excluded.photo_url, sort_order = excluded.sort_order;"
    )
A("")

# ------------------------------------------------------ testimonials
A("-- ------------------------------------------------------ testimonials")
A("-- NOTE: illustrative placeholder copy. Replace with real, consented")
A("-- client quotes from /admin/testimonials before promoting the site.")
names = ",".join(q(t["name"]) for t in testimonials)
A(f"delete from testimonials where name in ({names});")
for i, t in enumerate(testimonials):
    A(
        "insert into testimonials (name, location, project_name, quote, rating, sort_order, state) values\n"
        f"  ({q(t['name'])}, {q(t['location'])}, {q(t['project'])}, {q(t['quote'])}, {q(t['rating'])}, {i}, 'published');"
    )
A("")

# ------------------------------------------------------------ careers
A("-- ----------------------------------------------------------- careers")
openings = [
    (
        "senior-property-advisor", "Senior Property Advisor", "Sales", "3-7 years",
        "Own client mandates end to end across Gurugram's luxury residential corridors — from discovery call through registry.",
        ["Run discovery calls and build comparison sheets for qualified buyers",
         "Conduct accompanied site visits across shortlisted projects",
         "Negotiate pricing, payment plans and charges with developer sales teams",
         "Maintain accurate pipeline hygiene in the internal CRM"],
        ["3+ years selling primary residential real estate in the NCR",
         "Working knowledge of HARERA, carpet-area norms and loading",
         "Existing developer or channel-partner relationships preferred",
         "Fluent English and Hindi; own conveyance required"],
    ),
    (
        "commercial-investment-analyst", "Commercial Investment Analyst", "Advisory", "2-5 years",
        "Build the yield and exit models behind every commercial and SCO recommendation we make.",
        ["Model rental yield, exit cap and IRR for retail, office and SCO assets",
         "Assess footfall catchment and anchor-tenant mix",
         "Produce client-facing investment memos",
         "Track transacted rentals and capital values across corridors"],
        ["Strong Excel and financial modelling skills",
         "Exposure to commercial real estate or REIT research",
         "CFA / MBA Finance / commerce background preferred",
         "Clear written communication for investor memos"],
    ),
    (
        "digital-marketing-executive", "Digital Marketing Executive", "Marketing", "1-4 years",
        "Run performance campaigns and the content engine that feeds our advisory pipeline.",
        ["Manage Meta and Google campaigns against cost-per-qualified-lead targets",
         "Publish project pages and market insights through the in-house CMS",
         "Own on-page SEO for project and locality landing pages",
         "Report funnel performance from impression to site visit"],
        ["Hands-on experience with Meta Ads Manager and Google Ads",
         "Understanding of technical and on-page SEO",
         "Comfortable writing real estate copy in clear English",
         "Real estate or high-ticket lead-gen experience is a plus"],
    ),
]
for i, (slug, title, dept, exp, desc, resp, req) in enumerate(openings):
    A(
        "insert into job_openings (slug, title, department, location, employment_type, experience,\n"
        "  description, responsibilities, requirements, sort_order, state) values\n"
        f"  ({q(slug)}, {q(title)}, {q(dept)}, 'Sector 83, Gurugram', 'Full-time', {q(exp)},\n"
        f"   {q(desc)}, {arr(resp)}, {arr(req)}, {i}, 'published')\n"
        "on conflict (slug) do update set title = excluded.title, department = excluded.department,\n"
        "  experience = excluded.experience, description = excluded.description,\n"
        "  responsibilities = excluded.responsibilities, requirements = excluded.requirements;"
    )
A("")

# ---------------------------------------------------------------- SEO
A("-- ---------------------------------------------------------------- SEO")
seo_rows = [
    ("/", "Homepage",
     "Property Consultant in Gurugram | Luxury & Investment Real Estate",
     "GoRealtors is a Gurugram real estate advisory for luxury apartments, commercial retail and SCO plots across Dwarka Expressway, Golf Course Road and New Gurgaon. RERA-verified projects, zero brokerage on new launches.",
     ["property consultant gurugram", "real estate advisor gurgaon", "luxury apartments gurgaon", "sco plots gurgaon"]),
    ("/projects", "Project directory",
     "All Property Projects in Gurugram | Residential & Commercial",
     "Browse every residential and commercial project GoRealtors represents in Gurugram and Delhi. Filter by budget, location, developer, configuration and construction stage.",
     ["projects in gurgaon", "new projects gurugram", "property listing gurgaon"]),
    ("/residential", "Residential landing",
     "Residential Properties in Gurugram | Luxury Apartments & Floors",
     "Luxury residential projects in Gurugram — 2 to 5 BHK apartments, penthouses and independent floors across Dwarka Expressway, Golf Course Road and New Gurgaon.",
     ["residential property gurgaon", "luxury apartments gurugram", "3 bhk gurgaon", "4 bhk gurgaon"]),
    ("/commercial", "Commercial landing",
     "Commercial Property in Gurugram | Retail, Offices & SCO Plots",
     "Commercial real estate investment in Gurugram and Delhi — high-street retail, office floors, SCO plots and anchor malls. Yield modelling and catchment analysis before you buy.",
     ["commercial property gurgaon", "sco plots gurugram", "retail shops gurgaon", "office space gurgaon"]),
    ("/locations", "Locations index",
     "Property Locations in Gurugram | Corridor & Micro-Market Guides",
     "Compare Gurugram's property corridors — Dwarka Expressway, Golf Course Road, Golf Course Extension Road, Sohna Road, New Gurgaon and Dwarka Delhi — on pricing, infrastructure and growth outlook.",
     ["dwarka expressway property", "golf course road gurgaon", "new gurgaon sectors"]),
    ("/developers", "Developers index",
     "Real Estate Developers in Gurugram | Our Channel Partners",
     "GoRealtors is an authorised channel partner for Godrej Properties, M3M, Sobha, Elan, Smartworld, SS Group, AIPL, BPTP, Reach, Omaxe and more across Gurugram and Delhi.",
     ["builders in gurgaon", "real estate developers gurugram", "godrej gurgaon", "m3m gurgaon"]),
    ("/services", "Services index",
     "Real Estate Advisory Services in Gurugram | GoRealtors",
     "Residential and commercial advisory, SCO plot guidance, NRI services, legal due diligence, home loan assistance, portfolio management and leasing — all under one Gurugram advisory.",
     ["real estate consultant gurgaon", "nri property services india", "property legal due diligence"]),
    ("/blog", "Blog index",
     "Market Insights & Property Blog | Gurugram Real Estate",
     "Corridor analysis, project breakdowns and buyer guides for Gurugram real estate. Written by advisors who transact in these markets rather than report on them.",
     ["gurgaon property market", "real estate news gurugram", "property investment tips"]),
    ("/about", "About us",
     "About GoRealtors | Property Consultant & Real Estate Advisors, Gurugram",
     "GoRealtors is a Gurugram real estate advisory representing buyers and investors across luxury residential, commercial retail and SCO plotted markets. Numbers-first advice, zero buyer brokerage on new launches.",
     ["about gorealtors", "property consultant sector 83 gurugram"]),
    ("/team", "Our team", "Our Team | GoRealtors Property Advisors, Gurugram",
     "Meet the advisory team behind GoRealtors — property consultants covering luxury residential, commercial investment and NRI mandates across Gurugram.",
     ["gorealtors team", "property advisors gurugram"]),
    ("/contact", "Contact",
     "Contact GoRealtors | Property Consultant in Sector 83, Gurugram",
     "Talk to GoRealtors about property in Gurugram. Call +91 95606 27388, email tarun.gorealtors@gmail.com or visit us at SVH Metro Street, Sector 83, Gurugram.",
     ["contact gorealtors", "property consultant near me gurugram"]),
    ("/careers", "Careers", "Careers at GoRealtors | Real Estate Jobs in Gurugram",
     "Join GoRealtors in Gurugram. Open roles for property advisors, commercial investment analysts and digital marketing executives at a buyer-side real estate advisory.",
     ["real estate jobs gurgaon", "property advisor jobs gurugram"]),
    ("/faqs", "FAQs", "Property Buyer FAQs | Gurugram Real Estate Questions Answered",
     "Straight answers on carpet versus super area, loading, HARERA verification, stamp duty in Haryana, NRI purchase, SCO plots and brokerage — from GoRealtors advisors.",
     ["carpet area vs super area", "haryana stamp duty property", "harera verification"]),
    ("/compare", "Compare tool", "Compare Property Projects in Gurugram | Side-by-Side Comparison",
     "Compare up to three Gurugram projects side by side on price, area, configuration, possession, land parcel and RERA status. Free tool from GoRealtors.",
     ["compare projects gurgaon", "property comparison tool"]),
    ("/tools/emi-calculator", "EMI calculator",
     "Home Loan EMI Calculator | Gurugram Property Cost Calculator",
     "Calculate your home loan EMI plus the full acquisition cost of a Gurugram property — GST, Haryana stamp duty and registration included.",
     ["home loan emi calculator", "property cost calculator gurgaon", "stamp duty calculator haryana"]),
    ("/privacy-policy", "Privacy policy", "Privacy Policy | GoRealtors",
     "How GoRealtors collects, uses, stores and protects the personal information you share through this website and our advisory process.", []),
    ("/terms", "Terms of use", "Terms of Use | GoRealtors",
     "The terms governing your use of the GoRealtors website, the nature of the information published here, and the limits of our role as a real estate advisory.", []),
    ("/disclaimer", "Disclaimer", "Disclaimer | GoRealtors",
     "Important disclosures about the project information published on the GoRealtors website, our channel-partner role and the verification you should carry out before buying.", []),
]
for path, label, title, desc, kw in seo_rows:
    A(
        "insert into seo_pages (path, label, title, description, keywords) values\n"
        f"  ({q(path)}, {q(label)}, {q(title)}, {q(desc)}, {arr(kw)})\n"
        "on conflict (path) do update set label = excluded.label, title = excluded.title,\n"
        "  description = excluded.description, keywords = excluded.keywords;"
    )
A("")

# ----------------------------------------------------------- settings
A("-- ----------------------------------------------------------- settings")
settings = [
    ("contact.phone", "+91 95606 27388", "contact"),
    ("contact.phone_raw", "+919560627388", "contact"),
    ("contact.whatsapp", "919560627388", "contact"),
    ("contact.email", "tarun.gorealtors@gmail.com", "contact"),
    ("contact.address_line1", "SVH Metro Street, 1522-1523", "contact"),
    ("contact.address_line2", "Sector 83", "contact"),
    ("contact.city", "Gurugram", "contact"),
    ("contact.state", "Haryana", "contact"),
    ("contact.postal_code", "122012", "contact"),
    ("contact.hours", "Mon - Sat, 10:00 AM - 7:30 PM IST", "contact"),
    ("social.instagram", "https://www.instagram.com/gorealtors.official/", "social"),
    ("social.facebook", "https://www.facebook.com/people/Gorealtorsofficial/61578859582715/", "social"),
    ("social.linkedin", "https://www.linkedin.com/company/gorealtorsofficial", "social"),
    ("social.youtube", "https://www.youtube.com/@GoRealtors.Official/shorts", "social"),
    ("brand.tagline", "Let's Go Real", "brand"),
    ("brand.rera_label", "RERA Registered Advisory", "brand"),
    ("brand.stat_units", "1,200+", "brand"),
    ("brand.stat_gmv", "₹850 Cr+", "brand"),
    ("brand.stat_developers", "40+", "brand"),
    ("brand.stat_years", "12+", "brand"),
    ("leads.notify_emails", "tarun.gorealtors@gmail.com", "leads"),
    ("leads.auto_reply",
     "Thank you for contacting GoRealtors. An advisor will call you within one working day with a shortlist that matches your brief.",
     "leads"),
]
for k, v, g in settings:
    A(
        f"insert into settings (key, value, group_name) values ({q(k)}, to_jsonb({q(v)}::text), {q(g)})\n"
        "on conflict (key) do update set value = excluded.value, group_name = excluded.group_name;"
    )
A("")

# -------------------------------------------------------- navigation
A("-- -------------------------------------------------------- navigation")
A("insert into nav_menus (slug, name) values ('primary', 'Primary navigation')\n"
  "on conflict (slug) do nothing;")
A("insert into nav_menus (slug, name) values ('footer', 'Footer navigation')\n"
  "on conflict (slug) do nothing;")
nav = [
    ("Home", "/"), ("Residential", "/residential"), ("Commercial", "/commercial"),
    ("Locations", "/locations"), ("Developers", "/developers"),
    ("Services", "/services"), ("About", "/about"), ("Blog", "/blog"),
    ("Contact", "/contact"),
]
A("delete from nav_items where menu_id = (select id from nav_menus where slug = 'primary');")
for i, (label, href) in enumerate(nav):
    A(
        "insert into nav_items (menu_id, label, href, sort_order)\n"
        f"  select id, {q(label)}, {q(href)}, {i} from nav_menus where slug = 'primary';"
    )
A("")

A("commit;")
A("")
A("-- Verification")
A("select 'projects' as table_name, count(*) from projects")
A("union all select 'developers', count(*) from developers")
A("union all select 'localities', count(*) from localities")
A("union all select 'configurations', count(*) from project_configurations")
A("union all select 'project_faqs', count(*) from project_faqs")
A("union all select 'blog_posts', count(*) from blog_posts")
A("union all select 'team_members', count(*) from team_members")
A("union all select 'testimonials', count(*) from testimonials")
A("union all select 'job_openings', count(*) from job_openings")
A("union all select 'seo_pages', count(*) from seo_pages")
A("union all select 'settings', count(*) from settings;")

dest = os.path.join(ROOT, "supabase", "seed.sql")
os.makedirs(os.path.dirname(dest), exist_ok=True)
open(dest, "w", encoding="utf8").write("\n".join(L) + "\n")
print("wrote", dest)
print(
    f"projects={len(projects)} developers={len(developers)} localities={len(localities)} "
    f"posts={len(posts)} team={len(team)} testimonials={len(testimonials)} faqs={len(home_faqs)}"
)
