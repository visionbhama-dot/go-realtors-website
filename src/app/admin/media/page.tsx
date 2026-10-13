import Image from "next/image";
import { redirect } from "next/navigation";
import { ImageIcon, Trash2 } from "lucide-react";
import { ActionForm, InlineAction } from "@/components/admin/ActionForm";
import { CopyUrl, MediaUploader } from "@/components/admin/MediaUploader";
import { AdminHeader, EmptyState, Panel } from "@/components/admin/ui";
import { deleteRow, updateMediaAlt } from "@/app/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Media library" };

export default async function AdminMediaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.permissions.includes("media.write")) {
    return (
      <EmptyState
        title="No access"
        description="Your role does not include permission to upload media."
      />
    );
  }

  const sb = await getServerSupabase();
  const { data: rows } = await sb!
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const folders = [
    ...new Set((rows ?? []).map((r) => String(r.folder || "general"))),
  ];

  const isImage = (mime: unknown) =>
    typeof mime === "string" && mime.startsWith("image/");

  return (
    <>
      <AdminHeader
        title="Media library"
        description="Upload project photography and brochures to Supabase Storage, then paste the public URL into a project or post."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Panel
          title={`Uploaded files${rows?.length ? ` (${rows.length})` : ""}`}
          description="Newest first. Deleting a row here removes the library record; files remain in the storage bucket."
        >
          {(rows ?? []).length === 0 ? (
            <EmptyState
              icon={<ImageIcon className="h-5 w-5" strokeWidth={2} />}
              title="Nothing uploaded yet"
              description="Use the uploader to add images. The 21 seeded projects already ship with 95 photographs bundled in the repository, so you only need to upload new material."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {(rows ?? []).map((m) => (
                <figure
                  key={String(m.id)}
                  className="overflow-hidden rounded-md border border-ink-200"
                >
                  <div className="relative aspect-[4/3] bg-ink-100">
                    {isImage(m.mime_type) ? (
                      <Image
                        src={String(m.url)}
                        alt={String(m.alt_text || m.file_name)}
                        fill
                        sizes="(max-width:640px) 100vw, 20rem"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[0.75rem] font-bold uppercase tracking-wider text-ink-400">
                          {String(m.mime_type ?? "file")}
                        </span>
                      </div>
                    )}
                  </div>
                  <figcaption className="p-3">
                    <p className="truncate text-[0.75rem] font-semibold text-ink-900">
                      {String(m.file_name)}
                    </p>
                    <p className="mt-0.5 text-[0.625rem] text-ink-400">
                      {String(m.folder)} ·{" "}
                      {m.size_bytes
                        ? `${Math.round(Number(m.size_bytes) / 1024)} KB`
                        : "—"}{" "}
                      · {relativeTime(String(m.created_at))}
                    </p>

                    <ActionForm
                      action={updateMediaAlt}
                      submitLabel="Save alt text"
                      submitClassName="btn btn-outline btn-sm"
                      pendingLabel="Saving…"
                      inlineFeedback={false}
                      className="mt-2.5"
                    >
                      <input type="hidden" name="id" value={String(m.id)} />
                      <input
                        type="hidden"
                        name="folder"
                        value={String(m.folder ?? "general")}
                      />
                      <label
                        className="field-label"
                        htmlFor={`alt-${String(m.id)}`}
                      >
                        Alt text
                      </label>
                      <input
                        id={`alt-${String(m.id)}`}
                        name="alt_text"
                        defaultValue={String(m.alt_text ?? "")}
                        maxLength={160}
                        placeholder="Describe what the image shows"
                        className={
                          m.alt_text
                            ? "field"
                            : "field border-amber-300 bg-amber-50/40"
                        }
                      />
                    </ActionForm>

                    <div className="mt-2">
                      <CopyUrl url={String(m.url)} />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <InlineAction
                        action={deleteRow}
                        fields={{ table: "media", id: String(m.id) }}
                        confirm="Remove this file from the media library?"
                        label={<Trash2 className="h-3.5 w-3.5" strokeWidth={2.3} />}
                        className="btn btn-outline btn-sm text-red-600 hover:border-red-300 hover:bg-red-50"
                      />
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </Panel>

        <aside className="space-y-6">
          <Panel title="Upload">
            <MediaUploader folders={folders.length ? folders : ["general"]} />
          </Panel>

          <Panel title="One-time storage setup">
            <ol className="space-y-2.5 text-[0.75rem] leading-relaxed text-ink-600">
              {[
                "In Supabase, open Storage and create a bucket named exactly “media”.",
                "Mark the bucket Public so image URLs render on the website without signed tokens.",
                "Keep individual images under about 500 KB — resize to 1600px wide before uploading.",
                "Supabase Storage hostnames are already allow-listed in next.config.ts, so next/image will optimise them.",
              ].map((s, i) => (
                <li key={s} className="flex gap-2">
                  <span className="font-bold text-brand-700">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </Panel>
        </aside>
      </div>
    </>
  );
}
