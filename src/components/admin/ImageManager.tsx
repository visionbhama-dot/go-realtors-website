"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ImagePlus,
  Link2,
  Loader2,
  Star,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const BUCKET = "media";

export type GalleryImage = { url: string; alt: string };

/**
 * Gallery editor for a project: drag-free reordering, per-image alt text, and
 * direct upload to Supabase Storage. Emits positional hidden inputs
 * (img_url / img_alt) so blank alt entries keep their index alignment.
 */
export function ImageManager({
  initial,
  folder,
}: {
  initial: GalleryImage[];
  folder: string;
}) {
  const [items, setItems] = useState<GalleryImage[]>(initial);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pasteUrl, setPasteUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (i: number, patch: Partial<GalleryImage>) =>
    setItems((list) => list.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const remove = (i: number) =>
    setItems((list) => list.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) =>
    setItems((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = list.slice();
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });

  const makeCover = (i: number) =>
    setItems((list) => {
      if (i === 0) return list;
      const next = list.slice();
      const [picked] = next.splice(i, 1);
      return [picked!, ...next];
    });

  async function upload(files: FileList) {
    const sb = getBrowserSupabase();
    if (!sb) {
      setError(
        "Supabase is not configured in this environment, so uploads are unavailable. You can still paste image URLs below.",
      );
      return;
    }

    setBusy(true);
    setError(null);
    const added: GalleryImage[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]!;
        setProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);

        const safe = file.name
          .toLowerCase()
          .replace(/[^a-z0-9.]+/g, "-")
          .replace(/^-+|-+$/g, "");
        const path = `${folder || "general"}/${Date.now()}-${safe}`;

        const { error: upErr } = await sb.storage
          .from(BUCKET)
          .upload(path, file, { cacheControl: "31536000", upsert: false });

        if (upErr) {
          setError(
            /bucket not found/i.test(upErr.message)
              ? `The "${BUCKET}" storage bucket does not exist yet. Create it in Supabase under Storage and mark it public.`
              : upErr.message,
          );
          break;
        }

        const {
          data: { publicUrl },
        } = sb.storage.from(BUCKET).getPublicUrl(path);

        // register in the media library so it is reusable elsewhere
        await sb.from("media").insert({
          bucket: BUCKET,
          path,
          url: publicUrl,
          file_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          folder: folder || "general",
        });

        added.push({ url: publicUrl, alt: "" });
      }

      if (added.length) setItems((list) => [...list, ...added]);
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  const addUrl = () => {
    const u = pasteUrl.trim();
    if (!u) return;
    setItems((list) => [...list, { url: u, alt: "" }]);
    setPasteUrl("");
  };

  const missingAlt = items.filter((i) => !i.alt.trim()).length;

  return (
    <div>
      {/* positional hidden inputs consumed by saveProject */}
      {items.map((it, i) => (
        <div key={`${it.url}-${i}`}>
          <input type="hidden" name="img_url" value={it.url} />
          <input type="hidden" name="img_alt" value={it.alt} />
        </div>
      ))}

      {/* uploader */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition-colors",
            busy
              ? "border-ink-200 bg-ink-50"
              : "border-ink-300 hover:border-brand-500 hover:bg-brand-50/50",
          )}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/avif"
            disabled={busy}
            onChange={(e) => e.target.files?.length && upload(e.target.files)}
            className="sr-only"
          />
          {busy ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-brand-600" strokeWidth={2.2} />
              <span className="mt-2 text-[0.8125rem] font-semibold text-ink-700">
                {progress || "Uploading…"}
              </span>
            </>
          ) : (
            <>
              <ImagePlus className="h-5 w-5 text-ink-400" strokeWidth={2} />
              <span className="mt-2 text-[0.8125rem] font-semibold text-ink-900">
                Upload images
              </span>
              <span className="mt-0.5 text-[0.6875rem] text-ink-500">
                JPG, PNG, WebP or AVIF · multiple files · goes to{" "}
                <code className="font-mono">{folder || "general"}/</code>
              </span>
            </>
          )}
        </label>

        <div className="sm:w-64">
          <label className="field-label" htmlFor="paste-url">
            Or paste an image URL
          </label>
          <div className="flex gap-2">
            <input
              id="paste-url"
              value={pasteUrl}
              onChange={(e) => setPasteUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="/projects/… or https://…"
              className="field font-mono text-[0.75rem]"
            />
            <button
              type="button"
              onClick={addUrl}
              className="btn btn-outline btn-sm shrink-0"
              aria-label="Add image URL"
            >
              <Link2 className="h-3.5 w-3.5" strokeWidth={2.3} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-[0.8125rem] text-red-700">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
          {error}
        </p>
      )}

      {/* list */}
      <div className="mt-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.75rem] font-semibold text-ink-600">
            {items.length} {items.length === 1 ? "image" : "images"}
            {items.length > 0 && (
              <span className="ml-2 font-normal text-ink-400">
                first image is the card thumbnail and social preview
              </span>
            )}
          </p>
          {missingAlt > 0 && (
            <p className="inline-flex items-center gap-1.5 rounded-sm border border-amber-200 bg-amber-50 px-2 py-1 text-[0.6875rem] font-semibold text-amber-800">
              <TriangleAlert className="h-3 w-3" strokeWidth={2.4} />
              {missingAlt} without alt text
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <p className="rounded-md border border-dashed border-ink-300 bg-ink-50/60 px-4 py-8 text-center text-[0.8125rem] text-ink-500">
            No images yet. Upload files or paste a URL above.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li
                key={`${it.url}-${i}`}
                className="grid gap-3 rounded-sm border border-ink-200 p-3 sm:grid-cols-[6rem_1fr_auto] sm:items-start"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-ink-100 sm:w-24">
                  <Image
                    src={it.url}
                    alt=""
                    fill
                    sizes="6rem"
                    className="object-cover"
                    unoptimized
                  />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 inline-flex items-center gap-0.5 rounded-sm bg-brand-600 px-1 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-white">
                      <Star className="h-2.5 w-2.5 fill-white" strokeWidth={0} />
                      Cover
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <label
                    className="field-label"
                    htmlFor={`alt-${i}`}
                  >
                    Alt text{" "}
                    <span className="font-normal text-ink-400">
                      — describe what is in the image
                    </span>
                  </label>
                  <input
                    id={`alt-${i}`}
                    value={it.alt}
                    onChange={(e) => update(i, { alt: e.target.value })}
                    placeholder="e.g. Infinity-edge pool deck at dusk with tower behind"
                    className={cn(
                      "field",
                      !it.alt.trim() && "border-amber-300 bg-amber-50/40",
                    )}
                    maxLength={160}
                  />
                  <p className="mt-1 flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-[0.625rem] text-ink-400">
                      {it.url}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-[0.625rem] font-semibold",
                        it.alt.trim() ? "text-brand-700" : "text-amber-700",
                      )}
                    >
                      {it.alt.trim() ? (
                        <span className="inline-flex items-center gap-0.5">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          {it.alt.length}/160
                        </span>
                      ) : (
                        "falls back to auto description"
                      )}
                    </span>
                  </p>
                </div>

                <div className="flex gap-1 sm:flex-col">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move image ${i + 1} up`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-ink-200 text-ink-500 transition-colors hover:border-ink-400 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.3} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label={`Move image ${i + 1} down`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-ink-200 text-ink-500 transition-colors hover:border-ink-400 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" strokeWidth={2.3} />
                  </button>
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(i)}
                      aria-label={`Make image ${i + 1} the cover`}
                      title="Make cover"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-ink-200 text-ink-500 transition-colors hover:border-brand-500 hover:text-brand-700"
                    >
                      <Star className="h-3.5 w-3.5" strokeWidth={2.3} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label={`Remove image ${i + 1}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-ink-200 text-ink-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2.3} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 rounded-sm bg-ink-50 p-3 text-[0.6875rem] leading-relaxed text-ink-500">
        <strong className="font-semibold text-ink-700">On alt text:</strong>{" "}
        describe what the image actually shows, not the project name — screen
        readers already announce the heading. &ldquo;Infinity pool deck at dusk
        with the north tower behind&rdquo; is useful; &ldquo;Godrej Vrikshya
        image 1&rdquo; is not. Leave it blank and the site falls back to a
        generated description so the image is never unlabelled.
      </p>
    </div>
  );
}
