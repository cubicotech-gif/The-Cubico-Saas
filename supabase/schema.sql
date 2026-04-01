-- ─────────────────────────────────────────────────────────────────────────────
-- Cubico Technologies — Supabase Schema
-- Run this in the Supabase SQL Editor to initialise the database.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── Site Settings ──────────────────────────────────────────────────────────────
create table if not exists site_settings (
  id          uuid        primary key default gen_random_uuid(),
  hero_title  text        not null default 'Technology That Moves You Forward',
  hero_subtitle text      not null default 'Cubico Technologies delivers enterprise-grade software for institutions, healthcare providers, and growing businesses across Pakistan.',
  contact_whatsapp text   not null default '+923001234567',
  contact_email    text   not null default 'hello@cubico.tech',
  footer_text      text   not null default '© 2026 Cubico Technologies. Built in Karachi, Pakistan.',
  updated_at  timestamptz not null default now()
);

-- Seed one row if empty
insert into site_settings (id)
select gen_random_uuid()
where not exists (select 1 from site_settings);

-- ── Services ───────────────────────────────────────────────────────────────────
create table if not exists services (
  id               uuid        primary key default gen_random_uuid(),
  title            text        not null,
  description      text        not null,
  category         text        not null check (category in ('institution','healthcare','individual','creative')),
  icon             text        not null default 'Box',
  link_type        text        not null check (link_type in ('external','internal')),
  link_url         text        not null,
  slug             text        unique,
  order_index      integer     not null default 0,
  is_active        boolean     not null default true,
  page_hero_title    text,
  page_hero_subtitle text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists services_category_idx   on services (category);
create index if not exists services_order_idx      on services (order_index);
create index if not exists services_slug_idx       on services (slug) where slug is not null;

-- ── Service Features ───────────────────────────────────────────────────────────
create table if not exists service_features (
  id          uuid        primary key default gen_random_uuid(),
  service_id  uuid        not null references services (id) on delete cascade,
  icon        text        not null default 'Star',
  title       text        not null,
  description text        not null,
  order_index integer     not null default 0
);

create index if not exists service_features_service_idx on service_features (service_id);

-- ── Service Pricing ────────────────────────────────────────────────────────────
create table if not exists service_pricing (
  id          uuid        primary key default gen_random_uuid(),
  service_id  uuid        not null references services (id) on delete cascade,
  name        text        not null,
  price       text        not null,
  period      text        not null default 'month',
  features    text[]      not null default '{}',
  is_featured boolean     not null default false,
  order_index integer     not null default 0
);

create index if not exists service_pricing_service_idx on service_pricing (service_id);

-- ── Row Level Security ─────────────────────────────────────────────────────────
-- Public read access; admin writes are done server-side with the service role key.
alter table site_settings  enable row level security;
alter table services        enable row level security;
alter table service_features enable row level security;
alter table service_pricing  enable row level security;

create policy "Public read site_settings"
  on site_settings for select using (true);

create policy "Public read services"
  on services for select using (is_active = true);

create policy "Public read service_features"
  on service_features for select using (true);

create policy "Public read service_pricing"
  on service_pricing for select using (true);

-- ── Seed Data ──────────────────────────────────────────────────────────────────
-- Institution services
insert into services (title, description, category, icon, link_type, link_url, order_index) values
  ('Cubico Manage', 'Complete school & college administration — admissions, fees, timetables, and HR in one unified platform.', 'institution', 'Building2', 'external', 'https://manage.cubico.tech', 1),
  ('Cubico Teach',  'Empower educators with smart lesson planning, attendance tracking, and student performance analytics.', 'institution', 'GraduationCap', 'external', 'https://teach.cubico.tech', 2),
  ('Cubico Learn',  'A full-featured LMS for online and blended learning — video lessons, quizzes, certificates, and progress tracking.', 'institution', 'BookOpen', 'external', 'https://learn.cubico.tech', 3),
  ('Cubico Market', 'Institutional marketing suite with campaign management, lead funnels, and enrolment conversion tools.', 'institution', 'Megaphone', 'external', 'https://market.cubico.tech', 4)
on conflict do nothing;

-- Healthcare services
insert into services (title, description, category, icon, link_type, link_url, slug, order_index, page_hero_title, page_hero_subtitle) values
  ('Hospital Management System', 'End-to-end HMS covering OPD/IPD, pharmacy, lab, billing, and ward management for hospitals of every size.', 'healthcare', 'Hospital', 'internal', '/services/hospital-management-system', 'hospital-management-system', 5, 'Hospital Management, Simplified', 'A comprehensive platform that digitises every touchpoint — from patient check-in to discharge and billing.'),
  ('Clinic EHR', 'Lightweight electronic health records for solo practitioners and small clinics — fast, compliant, and paperless.', 'healthcare', 'Stethoscope', 'internal', '/services/clinic-ehr', 'clinic-ehr', 6, 'Your Practice, Fully Digital', 'Clinic EHR replaces paper charts with a clean, fast interface designed for busy doctors.')
on conflict do nothing;

-- Individual services
insert into services (title, description, category, icon, link_type, link_url, slug, order_index, page_hero_title, page_hero_subtitle) values
  ('Website Development', 'Custom websites and web apps — from landing pages to complex portals — built with modern frameworks and SEO best practices.', 'individual', 'Globe', 'internal', '/services/website-development', 'website-development', 7, 'Websites That Work as Hard as You Do', 'We design and build fast, beautiful, and conversion-optimised websites tailored to your business goals.'),
  ('Client Portals',       'Secure, branded portals giving your clients real-time visibility into projects, invoices, and communications.', 'individual', 'LayoutDashboard', 'internal', '/services/client-portals', 'client-portals', 8, 'Give Clients a Front-Row Seat', 'Replace scattered emails and spreadsheets with a single branded portal your clients will love.'),
  ('CRM Systems',          'Purpose-built CRM to track leads, manage relationships, and close deals — tailored to your sales process.', 'individual', 'Users2', 'internal', '/services/crm-systems', 'crm-systems', 9, 'Close More Deals, Lose Fewer Leads', 'A CRM built around how you actually sell — flexible pipelines, smart follow-ups, and real insights.'),
  ('Digital Marketing',    'Data-driven marketing campaigns — SEO, social media, paid ads, and content — managed end to end by our team.', 'individual', 'TrendingUp', 'internal', '/services/digital-marketing', 'digital-marketing', 10, 'Growth You Can Measure', 'We run performance-focused marketing campaigns that bring real customers, not just clicks.')
on conflict do nothing;

-- Creative services
insert into services (title, description, category, icon, link_type, link_url, slug, order_index, page_hero_title, page_hero_subtitle) values
  ('Creative Studio',  'Brand identity, graphic design, and creative direction — built to make your business unforgettable.', 'creative', 'Brush', 'external', 'https://creative.cubico.tech', null, 11, null, null),
  ('Video Production', 'Corporate films, product demos, social reels, and motion graphics produced to broadcast quality.', 'creative', 'Video', 'internal', '/services/video-production', 'video-production', 12, 'Stories Worth Watching', 'From concept to final cut, we produce video content that captures attention and drives action.')
on conflict do nothing;
