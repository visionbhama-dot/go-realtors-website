-- =====================================================================
-- GoRealtors — core schema
-- Everything the public site renders is editable from /admin.
-- =====================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------- enums
create type user_role as enum ('owner','admin','manager','agent','editor','viewer');
create type project_category as enum ('residential','commercial');
create type project_status as enum ('new-launch','under-construction','ready-to-move','sold-out');
create type publish_state as enum ('draft','published','archived');
create type lead_status as enum ('new','contacted','qualified','site-visit','negotiation','won','lost');
create type lead_priority as enum ('low','medium','high');

-- ------------------------------------------------------------- profiles
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null unique,
  full_name   text not null default '',
  phone       text,
  job_title   text,
  role        user_role not null default 'viewer',
  avatar_url  text,
  is_active   boolean not null default true,
  last_seen_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table profiles is 'Staff accounts. One row per auth user; role drives all permissions.';

-- --------------------------------------------------- permission matrix
create table role_permissions (
  role       user_role not null,
  permission text      not null,
  primary key (role, permission)
);

insert into role_permissions (role, permission)
select 'owner', p from unnest(array[
  'projects.read','projects.write','projects.publish','projects.delete',
  'leads.read','leads.write','leads.assign','leads.export',
  'blog.read','blog.write','blog.publish',
  'seo.read','seo.write','media.write',
  'team.read','team.write','users.read','users.write',
  'settings.write','audit.read']) p;

insert into role_permissions (role, permission)
select 'admin', p from unnest(array[
  'projects.read','projects.write','projects.publish','projects.delete',
  'leads.read','leads.write','leads.assign','leads.export',
  'blog.read','blog.write','blog.publish',
  'seo.read','seo.write','media.write',
  'team.read','team.write','users.read','users.write',
  'settings.write','audit.read']) p;

insert into role_permissions (role, permission)
select 'manager', p from unnest(array[
  'projects.read','projects.write','projects.publish',
  'leads.read','leads.write','leads.assign','leads.export',
  'blog.read','blog.write','blog.publish',
  'seo.read','seo.write','media.write',
  'team.read','team.write','users.read','audit.read']) p;

insert into role_permissions (role, permission)
select 'agent', p from unnest(array[
  'projects.read','leads.read','leads.write','blog.read','team.read']) p;

insert into role_permissions (role, permission)
select 'editor', p from unnest(array[
  'projects.read','projects.write',
  'blog.read','blog.write','blog.publish',
  'seo.read','seo.write','media.write','team.read','team.write']) p;

insert into role_permissions (role, permission)
select 'viewer', p from unnest(array[
  'projects.read','leads.read','blog.read','team.read','seo.read']) p;

-- ------------------------------------------------- security helpers
create or replace function current_user_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid() and is_active;
$$;

create or replace function has_permission(perm text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from role_permissions rp
    join profiles p on p.role = rp.role
    where p.id = auth.uid() and p.is_active and rp.permission = perm
  );
$$;

create or replace function is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and is_active);
$$;

-- ------------------------------------------------- updated_at trigger
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ----------------------------------------------------------- developers
create table developers (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  short_name    text,
  logo_url      text,
  established   text,
  headquarters  text,
  description   text default '',
  specialities  text[] not null default '{}',
  website       text,
  sort_order    int not null default 0,
  is_partner    boolean not null default true,
  state         publish_state not null default 'published',
  seo_title     text,
  seo_description text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------- localities
create table localities (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  city         text not null default 'Gurugram',
  blurb        text default '',
  description  text default '',
  highlights   text[] not null default '{}',
  price_band   text,
  growth       text,
  hero_image   text,
  sort_order   int not null default 0,
  state        publish_state not null default 'published',
  seo_title    text,
  seo_description text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ------------------------------------------------------------ projects
create table projects (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,
  legacy_slug          text,
  name                 text not null,
  tagline              text default '',
  developer_id         uuid references developers on delete set null,
  locality_id          uuid references localities on delete set null,
  developer_name       text not null default '',
  locality_name        text not null default '',
  sector               text,
  city                 text not null default 'Gurugram',
  category             project_category not null default 'residential',
  property_type        text,
  status               project_status not null default 'under-construction',
  configurations_label text,
  price_min            bigint,
  price_max            bigint,
  land_acres           numeric(8,2),
  towers               int,
  units                int,
  possession           text,
  rera                 text,
  overview             text[] not null default '{}',
  highlights           text[] not null default '{}',
  amenities            text[] not null default '{}',
  why_invest           text[] not null default '{}',
  location_advantages  text[] not null default '{}',
  floor_plan_note      text,
  images               text[] not null default '{}',
  brochure_url         text,
  map_embed_url        text,
  video_url            text,
  is_featured          boolean not null default false,
  is_trending          boolean not null default false,
  sort_order           int not null default 0,
  view_count           int not null default 0,
  state                publish_state not null default 'published',
  seo_title            text,
  seo_description      text,
  seo_keywords         text[] not null default '{}',
  og_image             text,
  noindex              boolean not null default false,
  created_by           uuid references profiles on delete set null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index projects_state_idx     on projects (state);
create index projects_category_idx  on projects (category);
create index projects_status_idx    on projects (status);
create index projects_locality_idx  on projects (locality_name);
create index projects_developer_idx on projects (developer_name);
create index projects_price_idx     on projects (price_min);
create index projects_search_idx    on projects using gin (name gin_trgm_ops);

create table project_configurations (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects on delete cascade,
  unit_type   text not null,
  area_sqft   int,
  carpet_sqft int,
  price       text,
  price_value bigint,
  floor_plan_url text,
  sort_order  int not null default 0
);
create index project_configurations_project_idx on project_configurations (project_id);

create table project_faqs (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  question   text not null,
  answer     text not null,
  sort_order int not null default 0
);
create index project_faqs_project_idx on project_faqs (project_id);

-- ---------------------------------------------------------------- blog
create table blog_categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  description text,
  sort_order int not null default 0
);

create table blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text default '',
  category_id   uuid references blog_categories on delete set null,
  category_name text default '',
  author_id     uuid references profiles on delete set null,
  author_name   text not null default 'GoRealtors',
  cover_image   text,
  body          text[] not null default '{}',
  tags          text[] not null default '{}',
  read_minutes  int not null default 4,
  is_featured   boolean not null default false,
  view_count    int not null default 0,
  state         publish_state not null default 'published',
  published_at  timestamptz not null default now(),
  seo_title     text,
  seo_description text,
  seo_keywords  text[] not null default '{}',
  og_image      text,
  noindex       boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index blog_posts_state_idx on blog_posts (state, published_at desc);

-- -------------------------------------------------------- team members
create table team_members (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  role_title  text not null default '',
  bio         text default '',
  focus       text,
  email       text,
  phone       text,
  photo_url   text,
  linkedin    text,
  profile_id  uuid references profiles on delete set null,
  sort_order  int not null default 0,
  state       publish_state not null default 'published',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -------------------------------------------------------- testimonials
create table testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  location   text,
  project_name text,
  quote      text not null,
  rating     int not null default 5 check (rating between 1 and 5),
  photo_url  text,
  sort_order int not null default 0,
  state      publish_state not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------- leads
create table leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text,
  phone         text not null,
  message       text,
  source        text not null default 'website',
  source_path   text,
  project_id    uuid references projects on delete set null,
  project_name  text,
  budget        text,
  requirement   text,
  status        lead_status not null default 'new',
  priority      lead_priority not null default 'medium',
  assigned_to   uuid references profiles on delete set null,
  follow_up_at  timestamptz,
  consent       boolean not null default true,
  utm           jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index leads_status_idx   on leads (status, created_at desc);
create index leads_assigned_idx on leads (assigned_to);

create table lead_notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references leads on delete cascade,
  author_id  uuid references profiles on delete set null,
  author_name text,
  note       text not null,
  created_at timestamptz not null default now()
);
create index lead_notes_lead_idx on lead_notes (lead_id, created_at desc);

-- ------------------------------------------------------- newsletter
create table subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text default 'footer',
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------- careers
create table job_openings (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  department  text,
  location    text default 'Gurugram, Haryana',
  employment_type text default 'Full-time',
  experience  text,
  description text default '',
  responsibilities text[] not null default '{}',
  requirements     text[] not null default '{}',
  state       publish_state not null default 'published',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table job_applications (
  id         uuid primary key default gen_random_uuid(),
  opening_id uuid references job_openings on delete set null,
  name       text not null,
  email      text not null,
  phone      text,
  resume_url text,
  cover_note text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------- SEO
create table seo_pages (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,
  label       text not null,
  title       text not null default '',
  description text not null default '',
  keywords    text[] not null default '{}',
  og_image    text,
  canonical   text,
  noindex     boolean not null default false,
  schema_json jsonb,
  updated_at  timestamptz not null default now()
);
comment on table seo_pages is 'Per-route meta overrides. path is the URL path, e.g. /projects';

create table redirects (
  id          uuid primary key default gen_random_uuid(),
  source      text not null unique,
  destination text not null,
  permanent   boolean not null default true,
  hits        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------ settings
create table settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  group_name text not null default 'general',
  label      text,
  updated_at timestamptz not null default now()
);
comment on table settings is 'Global key/value site configuration: contact, social, analytics, homepage copy.';

-- ------------------------------------------------------- navigation
create table nav_menus (
  id       uuid primary key default gen_random_uuid(),
  slug     text not null unique,
  name     text not null
);

create table nav_items (
  id         uuid primary key default gen_random_uuid(),
  menu_id    uuid not null references nav_menus on delete cascade,
  parent_id  uuid references nav_items on delete cascade,
  label      text not null,
  href       text not null,
  note       text,
  sort_order int not null default 0,
  is_visible boolean not null default true
);

-- ----------------------------------------------------------- media
create table media (
  id          uuid primary key default gen_random_uuid(),
  bucket      text not null default 'media',
  path        text not null,
  url         text not null,
  file_name   text not null,
  mime_type   text,
  size_bytes  bigint,
  width       int,
  height      int,
  alt_text    text,
  folder      text default 'general',
  uploaded_by uuid references profiles on delete set null,
  created_at  timestamptz not null default now(),
  unique (bucket, path)
);

-- -------------------------------------------------------- audit log
create table audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references profiles on delete set null,
  actor_email text,
  action      text not null,
  entity      text not null,
  entity_id   text,
  summary     text,
  diff        jsonb,
  created_at  timestamptz not null default now()
);
create index audit_log_created_idx on audit_log (created_at desc);

-- ------------------------------------------------- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['profiles','developers','localities','projects','blog_posts',
                           'team_members','testimonials','leads','job_openings',
                           'seo_pages','settings']
  loop
    execute format(
      'create trigger %1$s_touch before update on %1$s
       for each row execute function touch_updated_at()', t);
  end loop;
end $$;

-- --------------------------------------- new auth user -> profile row
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    -- the very first account to sign up becomes the owner
    case when (select count(*) from public.profiles) = 0
         then 'owner'::user_role
         else coalesce((new.raw_user_meta_data->>'role')::user_role, 'viewer'::user_role)
    end
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ==================================================================
-- Row Level Security
-- ==================================================================
alter table profiles              enable row level security;
alter table role_permissions      enable row level security;
alter table developers            enable row level security;
alter table localities            enable row level security;
alter table projects              enable row level security;
alter table project_configurations enable row level security;
alter table project_faqs          enable row level security;
alter table blog_categories       enable row level security;
alter table blog_posts            enable row level security;
alter table team_members          enable row level security;
alter table testimonials          enable row level security;
alter table leads                 enable row level security;
alter table lead_notes            enable row level security;
alter table subscribers           enable row level security;
alter table job_openings          enable row level security;
alter table job_applications      enable row level security;
alter table seo_pages             enable row level security;
alter table redirects             enable row level security;
alter table settings              enable row level security;
alter table nav_menus             enable row level security;
alter table nav_items             enable row level security;
alter table media                 enable row level security;
alter table audit_log             enable row level security;

-- profiles: you can always read yourself; staff with users.read see all
create policy profiles_self_read on profiles for select
  using (id = auth.uid() or has_permission('users.read'));
create policy profiles_self_update on profiles for update
  using (id = auth.uid()) with check (id = auth.uid() and role = current_user_role());
create policy profiles_admin_write on profiles for all
  using (has_permission('users.write')) with check (has_permission('users.write'));

create policy role_permissions_read on role_permissions for select using (is_staff());

-- ---- public catalogue: anonymous read of published rows only
create policy developers_public_read on developers for select
  using (state = 'published' or is_staff());
create policy developers_write on developers for all
  using (has_permission('projects.write')) with check (has_permission('projects.write'));

create policy localities_public_read on localities for select
  using (state = 'published' or is_staff());
create policy localities_write on localities for all
  using (has_permission('projects.write')) with check (has_permission('projects.write'));

create policy projects_public_read on projects for select
  using (state = 'published' or is_staff());
create policy projects_write on projects for all
  using (has_permission('projects.write')) with check (has_permission('projects.write'));

create policy project_cfg_public_read on project_configurations for select
  using (exists (select 1 from projects p
                 where p.id = project_id and (p.state = 'published' or is_staff())));
create policy project_cfg_write on project_configurations for all
  using (has_permission('projects.write')) with check (has_permission('projects.write'));

create policy project_faqs_public_read on project_faqs for select
  using (exists (select 1 from projects p
                 where p.id = project_id and (p.state = 'published' or is_staff())));
create policy project_faqs_write on project_faqs for all
  using (has_permission('projects.write')) with check (has_permission('projects.write'));

create policy blog_cat_public_read on blog_categories for select using (true);
create policy blog_cat_write on blog_categories for all
  using (has_permission('blog.write')) with check (has_permission('blog.write'));

create policy blog_public_read on blog_posts for select
  using ((state = 'published' and published_at <= now()) or is_staff());
create policy blog_write on blog_posts for all
  using (has_permission('blog.write')) with check (has_permission('blog.write'));

create policy team_public_read on team_members for select
  using (state = 'published' or is_staff());
create policy team_write on team_members for all
  using (has_permission('team.write')) with check (has_permission('team.write'));

create policy testimonials_public_read on testimonials for select
  using (state = 'published' or is_staff());
create policy testimonials_write on testimonials for all
  using (has_permission('team.write')) with check (has_permission('team.write'));

create policy jobs_public_read on job_openings for select
  using (state = 'published' or is_staff());
create policy jobs_write on job_openings for all
  using (has_permission('settings.write')) with check (has_permission('settings.write'));

create policy seo_public_read on seo_pages for select using (true);
create policy seo_write on seo_pages for all
  using (has_permission('seo.write')) with check (has_permission('seo.write'));

create policy redirects_public_read on redirects for select using (true);
create policy redirects_write on redirects for all
  using (has_permission('seo.write')) with check (has_permission('seo.write'));

create policy settings_public_read on settings for select using (true);
create policy settings_write on settings for all
  using (has_permission('settings.write')) with check (has_permission('settings.write'));

create policy nav_menus_public_read on nav_menus for select using (true);
create policy nav_menus_write on nav_menus for all
  using (has_permission('settings.write')) with check (has_permission('settings.write'));
create policy nav_items_public_read on nav_items for select using (true);
create policy nav_items_write on nav_items for all
  using (has_permission('settings.write')) with check (has_permission('settings.write'));

create policy media_staff_read on media for select using (is_staff());
create policy media_write on media for all
  using (has_permission('media.write')) with check (has_permission('media.write'));

-- ---- leads: anyone may submit, only staff may read
create policy leads_public_insert on leads for insert with check (true);
create policy leads_staff_read on leads for select
  using (has_permission('leads.read') or assigned_to = auth.uid());
create policy leads_staff_update on leads for update
  using (has_permission('leads.write') or assigned_to = auth.uid())
  with check (has_permission('leads.write') or assigned_to = auth.uid());
create policy leads_admin_delete on leads for delete using (has_permission('projects.delete'));

create policy lead_notes_staff_read on lead_notes for select using (has_permission('leads.read'));
create policy lead_notes_staff_write on lead_notes for insert
  with check (has_permission('leads.write'));

create policy subscribers_public_insert on subscribers for insert with check (true);
create policy subscribers_staff_read on subscribers for select using (has_permission('leads.read'));

create policy applications_public_insert on job_applications for insert with check (true);
create policy applications_staff_read on job_applications for select using (has_permission('leads.read'));

create policy audit_read on audit_log for select using (has_permission('audit.read'));
create policy audit_insert on audit_log for insert with check (is_staff());

-- ==================================================================
-- Aggregate view powering the admin dashboard
-- ==================================================================
create or replace view dashboard_counts
with (security_invoker = true) as
select
  (select count(*) from projects where state = 'published')      as published_projects,
  (select count(*) from projects where state = 'draft')          as draft_projects,
  (select count(*) from leads)                                   as total_leads,
  (select count(*) from leads where status = 'new')              as new_leads,
  (select count(*) from leads where created_at > now() - interval '7 days') as leads_7d,
  (select count(*) from leads where status = 'won')               as won_leads,
  (select count(*) from blog_posts where state = 'published')     as published_posts,
  (select count(*) from profiles where is_active)                 as active_users,
  (select count(*) from subscribers where is_active)              as subscribers;
