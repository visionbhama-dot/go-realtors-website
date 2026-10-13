"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Check, Copy, Loader2, TriangleAlert, Upload } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/client";

const BUCKET = "media";

export function MediaUploader({ folders }: { folders: string[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState("general");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);

  async function upload(files: FileList) {
    const sb = getBrowserSupabase();
    if (!sb) {
      setError("Supabase is not configured.");
      return;
    }
    setBusy(true);
    setError(null);
    setDone([]);
    const uploaded: string[] = [];

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
              ? `The "${BUCKET}" storage bucket does not exist yet. Create it in Supabase > Storage and mark it public.`
              : upErr.message,
          );
          break;
        }

        const {
          data: { publicUrl },
        } = sb.storage.from(BUCKET).getPublicUrl(path);

        await sb.from("media").insert({
          bucket: BUCKET,
          path,
          url: publicUrl,
          file_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          folder: folder || "general",
        });

        uploaded.push(publicUrl);
      }
      setDone(uploaded);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="field-label" htmlFor="media-folder">
            Folder
          </label>
          <input
            id="media-folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            list="folder-list"
            className="field"
            placeholder="general"
          />
          <datalist id="folder-list">
            {folders.map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
          <p className="mt-1.5 text-[0.6875rem] text-ink-400">
            Group uploads by project slug so files stay findable, e.g.{" "}
            <code className="font-mono">godrej-vrikshya-sector-103-gurgaon</code>.
          </p>
        </div>

        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition-colors ${
            busy
              ? "border-ink-200 bg-ink-50"
              : "border-ink-300 hover:border-brand-500 hover:bg-brand-50/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/avif,application/pdf"
            disabled={busy}
            onChange={(e) => e.target.files?.length && upload(e.target.files)}
            className="sr-only"
          />
          {busy ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-brand-600" strokeWidth={2.2} />
              <p className="mt-3 text-[0.8125rem] font-semibold text-ink-700">
                {progress || "Uploading…"}
              </p>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-ink-400" strokeWidth={2} />
              <p className="mt-3 text-[0.8125rem] font-semibold text-ink-900">
                Click to choose files
              </p>
              <p className="mt-1 text-[0.6875rem] text-ink-500">
                JPG, PNG, WebP, AVIF or PDF · multiple files supported
              </p>
            </>
          )}
        </label>

        {error && (
          <p className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-[0.8125rem] text-red-700">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
            {error}
          </p>
        )}

        {done.length > 0 && (
          <div className="rounded-sm border border-brand-200 bg-brand-50 p-3">
            <p className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-brand-800">
              <Check className="h-4 w-4" strokeWidth={2.6} />
              {done.length} file{done.length > 1 ? "s" : ""} uploaded
            </p>
            <p className="mt-1.5 text-[0.6875rem] text-brand-800">
              Copy the URLs below into a project&apos;s gallery, then add alt
              text for each file in the grid on the left.
            </p>
            <ul className="mt-2 space-y-1">
              {done.map((u) => (
                <li key={u}>
                  <CopyUrl url={u} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function CopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
      className="group flex w-full items-center gap-2 rounded-sm border border-ink-200 bg-white px-2 py-1.5 text-left transition-colors hover:border-brand-400"
      title="Copy URL"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-brand-600" strokeWidth={2.6} />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0 text-ink-400 group-hover:text-brand-600" strokeWidth={2.3} />
      )}
      <span className="truncate font-mono text-[0.6875rem] text-ink-700">
        {copied ? "Copied to clipboard" : url}
      </span>
    </button>
  );
}
