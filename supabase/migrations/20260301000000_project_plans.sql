-- Structured plans (floor plan, master plan, unit plan, etc.) per project.
-- Stored as a JSON array of { type, title, image, size } objects so the admin
-- can add any number of labelled plan images without a separate table.

alter table projects
  add column if not exists plans jsonb not null default '[]'::jsonb;

comment on column projects.plans is
  'Array of { type, title, image, size } plan images shown in the Plans section of the project page.';
