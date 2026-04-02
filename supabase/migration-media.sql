-- ─────────────────────────────────────────────────────────────────────────────
-- Cubico Technologies — Media Assets Migration
-- ─────────────────────────────────────────────────────────────────────────────
-- Paste this in Supabase SQL Editor if you ALREADY have the old schema.
-- If you're starting fresh, use schema.sql instead (it includes everything).
-- ─────────────────────────────────────────────────────────────────────────────


-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  1. MEDIA ASSETS TABLE                                                  ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

create table if not exists media_assets (
  id          uuid        primary key default gen_random_uuid(),
  slot_key    text        unique not null,
  url         text        not null,
  file_name   text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists media_assets_slot_idx on media_assets (slot_key);


-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  2. ROW LEVEL SECURITY — media_assets                                   ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

alter table media_assets enable row level security;

-- Anyone can read (public website needs to fetch URLs)
create policy "Public read media_assets"
  on media_assets for select using (true);

-- Anon key can insert/update/delete (admin panel is password-protected)
create policy "Anon insert media_assets"
  on media_assets for insert with check (true);

create policy "Anon update media_assets"
  on media_assets for update using (true);

create policy "Anon delete media_assets"
  on media_assets for delete using (true);


-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  3. STORAGE BUCKET — 'media'                                            ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,                    -- publicly accessible URLs
  52428800,                -- 50 MB max file size
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm'
  ]
)
on conflict (id) do nothing;


-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  4. STORAGE RLS — allow public reads + anon uploads                     ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

-- Public can view/download any file in the media bucket
create policy "Public read media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

-- Anon key can upload new files
create policy "Anon upload to media bucket"
  on storage.objects for insert
  with check (bucket_id = 'media');

-- Anon key can overwrite/replace existing files
create policy "Anon update media bucket"
  on storage.objects for update
  using (bucket_id = 'media');

-- Anon key can delete files
create policy "Anon delete from media bucket"
  on storage.objects for delete
  using (bucket_id = 'media');


-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  5. WRITE POLICIES FOR EXISTING TABLES (if missing)                     ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝
-- These allow the admin panel to write via the anon key.
-- They will skip if policies with these names already exist.

do $$
begin
  -- site_settings update
  if not exists (
    select 1 from pg_policies where tablename = 'site_settings' and policyname = 'Anon update site_settings'
  ) then
    create policy "Anon update site_settings" on site_settings for update using (true);
  end if;

  -- services insert/update/delete
  if not exists (
    select 1 from pg_policies where tablename = 'services' and policyname = 'Anon insert services'
  ) then
    create policy "Anon insert services" on services for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'services' and policyname = 'Anon update services'
  ) then
    create policy "Anon update services" on services for update using (true);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'services' and policyname = 'Anon delete services'
  ) then
    create policy "Anon delete services" on services for delete using (true);
  end if;
end $$;


-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  6. UPDATE GLOBAL TEXT TO GLOBAL POSITIONING                            ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

update site_settings set
  hero_subtitle = 'Cubico Technologies delivers enterprise-grade software for institutions, healthcare providers, and growing businesses worldwide.',
  footer_text   = '© 2026 Cubico Technologies. Headquartered in Pakistan, serving clients globally.',
  updated_at    = now();

update services set
  page_hero_title    = 'Websites Engineered by Psychology, Crafted by Design',
  page_hero_subtitle = 'We build brand-first websites rooted in colour science, cognitive psychology, and conversion architecture — every design decision has a reason behind it.',
  updated_at         = now()
where slug = 'website-development';


-- ─────────────────────────────────────────────────────────────────────────────
-- DONE! Your media system is ready.
--
-- Available media slots (27 total):
--
--   Web Dev Hero:
--     webdev-hero-video         → Hero background video (MP4/WebM, 1920x1080)
--     webdev-hero-mockup        → Hero device mockup image (PNG, 800x600)
--
--   Web Dev Problem:
--     webdev-problem-image      → Frustrated user / bad website (JPG, 640x480)
--
--   Web Dev Approach:
--     webdev-approach-branding  → Brand mood board / colour palette (JPG, 640x480)
--     webdev-approach-psychology→ Heatmap / eye tracking overlay (JPG, 640x480)
--     webdev-approach-conversion→ Design system / component library (JPG, 640x480)
--
--   Web Dev Process:
--     webdev-process-discovery  → Planning / whiteboard (JPG, 480x320)
--     webdev-process-design     → Figma wireframes (JPG, 480x320)
--     webdev-process-development→ Code editor screenshot (JPG, 480x320)
--     webdev-process-launch     → Analytics dashboard (JPG, 480x320)
--     webdev-process-video      → Design timelapse (MP4, 1280x720, optional)
--
--   Portfolio Screenshots:
--     portfolio-alnoor          → Al-Noor Academy (JPG, 800x500)
--     portfolio-medcare         → MedCare Clinic (JPG, 800x500)
--     portfolio-urbanthreads    → Urban Threads (JPG, 800x500)
--     portfolio-greenvolt       → GreenVolt Energy (JPG, 800x500)
--     portfolio-foodieshub      → Foodies Hub (JPG, 800x500)
--
--   Testimonials:
--     testimonial-client1-photo → Client 1 headshot (JPG, 200x200)
--     testimonial-client2-photo → Client 2 headshot (JPG, 200x200)
--
--   Tech Stack Logos:
--     logo-nextjs               → Next.js (SVG/PNG, 120x40)
--     logo-react                → React (SVG/PNG, 120x40)
--     logo-tailwind             → Tailwind CSS (SVG/PNG, 120x40)
--     logo-typescript           → TypeScript (SVG/PNG, 120x40)
--     logo-figma                → Figma (SVG/PNG, 120x40)
--     logo-vercel               → Vercel (SVG/PNG, 120x40)
--     logo-wordpress            → WordPress (SVG/PNG, 120x40)
--     logo-shopify              → Shopify (SVG/PNG, 120x40)
--
-- Upload via Admin Panel → Media tab, or directly to the 'media' bucket.
-- ─────────────────────────────────────────────────────────────────────────────
