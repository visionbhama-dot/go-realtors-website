-- =====================================================================
-- Per-image alt text
-- Additive and idempotent — safe to run on an existing database.
-- =====================================================================

-- Alt text for each entry in projects.images, index-aligned with it.
-- Kept as a parallel array rather than a child table so the existing
-- images text[] column and all current reads keep working unchanged.
alter table projects
  add column if not exists image_alts text[] not null default '{}';

comment on column projects.image_alts is
  'Alt text per gallery image, index-aligned with projects.images. '
  'A blank or missing entry falls back to a generated description.';

-- The media library already carries alt_text; make sure older databases have it.
alter table media
  add column if not exists alt_text text;

create index if not exists media_folder_idx on media (folder);
create index if not exists media_created_idx on media (created_at desc);
