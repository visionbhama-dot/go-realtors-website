"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { ActionForm } from "@/components/admin/ActionForm";
import { Field, Panel } from "@/components/admin/ui";
import { ImageManager, type GalleryImage } from "@/components/admin/ImageManager";
import { saveProject } from "@/app/actions/admin";
import { slugify } from "@/lib/utils";

export type ProjectFormValues = {
  id?: string;
  slug: string;
  legacy_slug: string;
  name: string;
  tagline: string;
  developer_name: string;
  locality_name: string;
  sector: string;
  city: string;
  category: string;
  property_type: string;
  status: string;
  configurations_label: string;
  price_min: string;
  price_max: string;
  land_acres: string;
  towers: string;
  units: string;
  possession: string;
  rera: string;
  overview: string;
  highlights: string;
  amenities: string;
  why_invest: string;
  location_advantages: string;
  floor_plan_note: string;
  gallery: GalleryImage[];
  brochure_url: string;
  video_url: string;
  map_embed_url: string;
  is_featured: boolean;
  is_trending: boolean;
  sort_order: string;
  state: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image: string;
  noindex: boolean;
  configurations: { unit_type: string; area_sqft: string; carpet_sqft: string; price: string }[];
  plans: { type: string; title: string; size: string; image: string }[];
  faqs: { question: string; answer: string }[];
};

export const EMPTY_PROJECT: ProjectFormValues = {
  slug: "",
  legacy_slug: "",
  name: "",
  tagline: "",
  developer_name: "",
  locality_name: "",
  sector: "",
  city: "Gurugram",
  category: "residential",
  property_type: "Apartment",
  status: "under-construction",
  configurations_label: "",
  price_min: "",
  price_max: "",
  land_acres: "",
  towers: "",
  units: "",
  possession: "",
  rera: "",
  overview: "",
  highlights: "",
  amenities: "",
  why_invest: "",
  location_advantages: "",
  floor_plan_note: "",
  gallery: [],
  brochure_url: "",
  video_url: "",
  map_embed_url: "",
  is_featured: false,
  is_trending: false,
  sort_order: "0",
  state: "draft",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  og_image: "",
  noindex: false,
  configurations: [],
  plans: [],
  faqs: [],
};

const TABS = [
  { id: "basics", label: "Basics" },
  { id: "pricing", label: "Pricing & units" },
  { id: "content", label: "Content" },
  { id: "media", label: "Media" },
  { id: "faqs", label: "FAQs" },
  { id: "seo", label: "SEO" },
] as const;

export function ProjectForm({
  initial,
  developers,
  localities,
  canPublish,
}: {
  initial: ProjectFormValues;
  developers: string[];
  localities: string[];
  canPublish: boolean;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("basics");
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [slugLocked, setSlugLocked] = useState(Boolean(initial.slug));
  const [configs, setConfigs] = useState(
    initial.configurations.length
      ? initial.configurations
      : [{ unit_type: "", area_sqft: "", carpet_sqft: "", price: "" }],
  );
  const [faqs, setFaqs] = useState(
    initial.faqs.length ? initial.faqs : [{ question: "", answer: "" }],
  );
  const [plans, setPlans] = useState(initial.plans ?? []);

  const isNew = !initial.id;

  return (
    <ActionForm
      action={saveProject}
      submitLabel={isNew ? "Create project" : "Save changes"}
      redirectOnSuccess={isNew ? "/admin/projects" : undefined}
      secondary={
        <>
          <Link href="/admin/projects" className="btn btn-outline">
            Cancel
          </Link>
          {!isNew && initial.slug && (
            <Link
              href={`/projects/${initial.slug}`}
              target="_blank"
              className="btn btn-outline"
            >
              View on site
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.3} />
            </Link>
          )}
        </>
      }
    >
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      {/* tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-ink-200 no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "whitespace-nowrap border-b-2 border-brand-600 px-3.5 py-2.5 text-[0.8125rem] font-bold text-brand-700"
                : "whitespace-nowrap border-b-2 border-transparent px-3.5 py-2.5 text-[0.8125rem] font-semibold text-ink-500 hover:text-ink-900"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---------------- BASICS ---------------- */}
      <div hidden={tab !== "basics"} className="space-y-5">
        <Panel title="Identity">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project name" required className="sm:col-span-2">
              <input
                name="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugLocked) setSlug(slugify(e.target.value));
                }}
                className="field"
                placeholder="Godrej Vrikshya"
              />
            </Field>

            <Field
              label="URL slug"
              required
              hint={`Public URL: /projects/${slug || "your-project-slug"}`}
            >
              <input
                name="slug"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugLocked(true);
                }}
                className="field font-mono text-[0.8125rem]"
                placeholder="godrej-vrikshya-sector-103-gurgaon"
              />
            </Field>

            <Field
              label="Legacy slug"
              hint="Old WordPress slug. Visitors hitting the old URL are served this project."
            >
              <input
                name="legacy_slug"
                defaultValue={initial.legacy_slug}
                className="field font-mono text-[0.8125rem]"
              />
            </Field>

            <Field
              label="Tagline"
              className="sm:col-span-2"
              hint="One line shown on cards and under the project title."
            >
              <input
                name="tagline"
                defaultValue={initial.tagline}
                className="field"
                placeholder="Eco-luxury residences wrapped around 800+ mature trees"
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Classification">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Developer" required hint="Must match a developer name exactly to link the profile page.">
              <input
                name="developer_name"
                required
                defaultValue={initial.developer_name}
                list="dev-list"
                className="field"
              />
              <datalist id="dev-list">
                {developers.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </Field>

            <Field label="Corridor / locality" required hint="Must match a location name exactly.">
              <input
                name="locality_name"
                required
                defaultValue={initial.locality_name}
                list="loc-list"
                className="field"
              />
              <datalist id="loc-list">
                {localities.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </Field>

            <Field label="Sector">
              <input name="sector" defaultValue={initial.sector} className="field" placeholder="Sector 103" />
            </Field>

            <Field label="City">
              <input name="city" defaultValue={initial.city} className="field" />
            </Field>

            <Field label="Category" required>
              <select name="category" defaultValue={initial.category} className="field">
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </Field>

            <Field label="Asset type" hint="Apartment, Independent Floor, SCO Plots, Retail &amp; Office…">
              <input name="property_type" defaultValue={initial.property_type} className="field" />
            </Field>

            <Field label="Construction stage" required>
              <select name="status" defaultValue={initial.status} className="field">
                <option value="new-launch">New Launch</option>
                <option value="under-construction">Under Construction</option>
                <option value="ready-to-move">Ready to Move</option>
                <option value="sold-out">Sold Out</option>
              </select>
            </Field>

            <Field label="Configuration label" hint="Shown on cards, e.g. “3 &amp; 4 BHK”.">
              <input
                name="configurations_label"
                defaultValue={initial.configurations_label}
                className="field"
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Visibility">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Publish state"
              hint={
                canPublish
                  ? "Only published projects appear on the public website."
                  : "Your role can save drafts but cannot publish."
              }
            >
              <select name="state" defaultValue={initial.state} className="field">
                <option value="draft">Draft</option>
                {canPublish && <option value="published">Published</option>}
                <option value="archived">Archived</option>
              </select>
            </Field>

            <Field label="Sort order" hint="Lower numbers appear first in listings.">
              <input
                name="sort_order"
                type="number"
                defaultValue={initial.sort_order}
                className="field"
              />
            </Field>

            <div className="space-y-3 sm:col-span-2">
              <Toggle
                name="is_featured"
                defaultChecked={initial.is_featured}
                label="Featured project"
                hint="Appears in the homepage advisor spotlight and the Residential mega-menu."
              />
              <Toggle
                name="is_trending"
                defaultChecked={initial.is_trending}
                label="Trending project"
                hint="Appears in the homepage “Trending projects” grid."
              />
            </div>
          </div>
        </Panel>
      </div>

      {/* ---------------- PRICING ---------------- */}
      <div hidden={tab !== "pricing"} className="space-y-5">
        <Panel
          title="Headline pricing"
          description="Used for cards, filters and sorting. Enter plain numbers in rupees."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Starting price (₹)" hint="36100000 renders as ₹3.61 Cr. Leave blank for “Price on Request”.">
              <input
                name="price_min"
                inputMode="numeric"
                defaultValue={initial.price_min}
                className="field"
                placeholder="36100000"
              />
            </Field>
            <Field label="Top-end price (₹)" hint="Optional. Set to show a range instead of a single figure.">
              <input
                name="price_max"
                inputMode="numeric"
                defaultValue={initial.price_max}
                className="field"
              />
            </Field>
          </div>
        </Panel>

        <Panel
          title="Unit configurations"
          description="Rendered as the price table on the project page."
          actions={
            <button
              type="button"
              onClick={() =>
                setConfigs((c) => [
                  ...c,
                  { unit_type: "", area_sqft: "", carpet_sqft: "", price: "" },
                ])
              }
              className="btn btn-outline btn-sm"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
              Add row
            </button>
          }
        >
          <div className="space-y-3">
            {configs.map((c, i) => (
              <div
                key={i}
                className="grid gap-3 rounded-sm border border-ink-200 p-3 sm:grid-cols-[1fr_1fr_1fr_1.2fr_auto]"
              >
                <Field label="Unit type">
                  <input
                    name="cfg_type"
                    defaultValue={c.unit_type}
                    className="field"
                    placeholder="3 BHK"
                  />
                </Field>
                <Field label="Super area (sq.ft.)">
                  <input
                    name="cfg_area"
                    inputMode="numeric"
                    defaultValue={c.area_sqft}
                    className="field"
                    placeholder="1947"
                  />
                </Field>
                <Field label="Carpet area (sq.ft.)">
                  <input
                    name="cfg_carpet"
                    inputMode="numeric"
                    defaultValue={c.carpet_sqft}
                    className="field"
                  />
                </Field>
                <Field label="Display price">
                  <input
                    name="cfg_price"
                    defaultValue={c.price}
                    className="field"
                    placeholder="₹3.60 Cr"
                  />
                </Field>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() =>
                      setConfigs((rows) => rows.filter((_, idx) => idx !== i))
                    }
                    aria-label={`Remove configuration row ${i + 1}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-ink-200 text-ink-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            ))}
            {configs.length === 0 && (
              <p className="py-3 text-[0.8125rem] text-ink-500">
                No configurations. The project page will show a &ldquo;price on
                request&rdquo; panel instead of a table.
              </p>
            )}
          </div>
        </Panel>

        <Panel title="Project scale & approvals">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Land area (acres)">
              <input name="land_acres" defaultValue={initial.land_acres} className="field" />
            </Field>
            <Field label="Towers">
              <input name="towers" inputMode="numeric" defaultValue={initial.towers} className="field" />
            </Field>
            <Field label="Total units">
              <input name="units" inputMode="numeric" defaultValue={initial.units} className="field" />
            </Field>
            <Field label="Possession" hint="Free text, e.g. “June 2031”.">
              <input name="possession" defaultValue={initial.possession} className="field" />
            </Field>
            <Field label="RERA registration number" className="sm:col-span-2 lg:col-span-4">
              <input
                name="rera"
                defaultValue={initial.rera}
                className="field font-mono text-[0.8125rem]"
                placeholder="RC/REP/HARERA/GGM/846/578/2024/73"
              />
            </Field>
          </div>
        </Panel>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div hidden={tab !== "content"} className="space-y-5">
        <Panel
          title="Overview"
          description="One paragraph per line. Blank lines are ignored."
        >
          <textarea
            name="overview"
            rows={9}
            defaultValue={initial.overview}
            className="field resize-y font-sans"
            placeholder={"Godrej Vrikshya Sector 103 Gurgaon is a premium residential project…\nDesigned around 800 mature trees, the project blends…"}
          />
        </Panel>

        <Panel title="Key highlights" description="One bullet per line.">
          <textarea name="highlights" rows={8} defaultValue={initial.highlights} className="field resize-y" />
        </Panel>

        <Panel title="Amenities" description="One amenity per line.">
          <textarea name="amenities" rows={8} defaultValue={initial.amenities} className="field resize-y" />
        </Panel>

        <Panel title="Investment case" description="One bullet per line. Shown as the “Why consider” section.">
          <textarea name="why_invest" rows={6} defaultValue={initial.why_invest} className="field resize-y" />
        </Panel>

        <Panel title="Location advantages" description="One bullet per line.">
          <textarea
            name="location_advantages"
            rows={7}
            defaultValue={initial.location_advantages}
            className="field resize-y"
          />
        </Panel>

        <Panel title="Floor plan note" description="Short paragraph shown beneath the price table.">
          <textarea
            name="floor_plan_note"
            rows={4}
            defaultValue={initial.floor_plan_note}
            className="field resize-y"
          />
        </Panel>
      </div>

      {/* ---------------- MEDIA ---------------- */}
      <div hidden={tab !== "media"} className="space-y-5">
        <Panel
          title="Gallery images"
          description="Upload images and give each one alt text. The first image is the card thumbnail and social preview."
        >
          <ImageManager
            initial={initial.gallery}
            folder={slug || "general"}
          />
        </Panel>

        <Panel title="Documents & embeds">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brochure URL">
              <input name="brochure_url" defaultValue={initial.brochure_url} className="field" />
            </Field>
            <Field label="Walkthrough video URL">
              <input name="video_url" defaultValue={initial.video_url} className="field" />
            </Field>
            <Field
              label="Custom map embed URL"
              className="sm:col-span-2"
              hint="Optional. Leave blank to auto-generate a Google Maps embed from the project name and sector."
            >
              <input name="map_embed_url" defaultValue={initial.map_embed_url} className="field" />
            </Field>
          </div>
        </Panel>

        <Panel
          title="Plans"
          description="Floor plans, master plan, unit plans and layout images — shown in the Plans section of the project page. Paste an image URL (upload under Media first, or use any hosted image)."
          actions={
            <button
              type="button"
              onClick={() =>
                setPlans((p) => [
                  ...p,
                  { type: "Floor Plan", title: "", size: "", image: "" },
                ])
              }
              className="btn btn-outline btn-sm"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
              Add plan
            </button>
          }
        >
          <div className="space-y-3">
            {plans.map((p, i) => (
              <div
                key={i}
                className="grid gap-3 rounded-sm border border-ink-200 p-3 sm:grid-cols-[1fr_1.2fr_1fr_1.6fr_auto]"
              >
                <Field label="Type">
                  <select name="plan_type" defaultValue={p.type} className="field">
                    {[
                      "Floor Plan",
                      "Master Plan",
                      "Unit Plan",
                      "Location Plan",
                      "Site Plan",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Title / label">
                  <input
                    name="plan_title"
                    defaultValue={p.title}
                    className="field"
                    placeholder="3 BHK + Study"
                  />
                </Field>
                <Field label="Size">
                  <input
                    name="plan_size"
                    defaultValue={p.size}
                    className="field"
                    placeholder="1,947 sq.ft."
                  />
                </Field>
                <Field label="Image URL">
                  <input
                    name="plan_image"
                    defaultValue={p.image}
                    className="field"
                    placeholder="https://…/floor-plan.jpg"
                  />
                </Field>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() =>
                      setPlans((rows) => rows.filter((_, idx) => idx !== i))
                    }
                    aria-label={`Remove plan ${i + 1}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-ink-200 text-ink-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            ))}
            {plans.length === 0 && (
              <p className="py-3 text-[0.8125rem] text-ink-500">
                No plans added yet. Use “Add plan” to attach floor plans, a
                master plan or layout images with their type and size.
              </p>
            )}
          </div>
        </Panel>
      </div>

      {/* ---------------- FAQS ---------------- */}
      <div hidden={tab !== "faqs"}>
        <Panel
          title="Project FAQs"
          description="Published as an FAQPage schema block, which makes them eligible for rich results in Google."
          actions={
            <button
              type="button"
              onClick={() => setFaqs((f) => [...f, { question: "", answer: "" }])}
              className="btn btn-outline btn-sm"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
              Add FAQ
            </button>
          }
        >
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-sm border border-ink-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-ink-400">
                    FAQ {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFaqs((rows) => rows.filter((_, idx) => idx !== i))}
                    aria-label={`Remove FAQ ${i + 1}`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-ink-200 text-ink-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </button>
                </div>
                <Field label="Question">
                  <input name="faq_q" defaultValue={f.question} className="field" />
                </Field>
                <Field label="Answer" className="mt-3">
                  <textarea name="faq_a" rows={3} defaultValue={f.answer} className="field resize-y" />
                </Field>
              </div>
            ))}
            {faqs.length === 0 && (
              <p className="py-3 text-[0.8125rem] text-ink-500">
                No FAQs yet. Adding six to eight genuine buyer questions is one
                of the highest-return SEO actions on a project page.
              </p>
            )}
          </div>
        </Panel>
      </div>

      {/* ---------------- SEO ---------------- */}
      <div hidden={tab !== "seo"}>
        <Panel
          title="Search engine settings"
          description="Leave blank to fall back to sensible defaults generated from the project data."
        >
          <div className="space-y-4">
            <Field
              label="Meta title"
              hint="Aim for 50-60 characters. Include the project name, sector and city."
            >
              <input
                name="seo_title"
                defaultValue={initial.seo_title}
                className="field"
                maxLength={70}
                placeholder="Godrej Vrikshya Sector 103 Gurgaon | 3 & 4 BHK Price & Floor Plans"
              />
            </Field>
            <Field label="Meta description" hint="Aim for 140-160 characters.">
              <textarea
                name="seo_description"
                rows={3}
                defaultValue={initial.seo_description}
                className="field resize-y"
                maxLength={320}
              />
            </Field>
            <Field label="Focus keywords" hint="Comma separated.">
              <input
                name="seo_keywords"
                defaultValue={initial.seo_keywords}
                className="field"
                placeholder="godrej vrikshya, sector 103 gurgaon, dwarka expressway apartments"
              />
            </Field>
            <Field
              label="Open Graph image"
              hint="Optional override for social sharing. Defaults to the first gallery image. Recommended 1200×630."
            >
              <input name="og_image" defaultValue={initial.og_image} className="field font-mono text-[0.8125rem]" />
            </Field>
            <Toggle
              name="noindex"
              defaultChecked={initial.noindex}
              label="Hide from search engines"
              hint="Adds a noindex directive. Use for pages you want live but not indexed."
            />
          </div>
        </Panel>
      </div>
    </ActionForm>
  );
}

function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 rounded-sm border border-ink-200 p-3.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
      />
      <span>
        <span className="block text-[0.8125rem] font-semibold text-ink-900">
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block text-[0.6875rem] leading-relaxed text-ink-500">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
