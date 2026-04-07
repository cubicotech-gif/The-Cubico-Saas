-- ─────────────────────────────────────────────────────────────────────────────
-- Cubico Technologies — Home Content + Per-Service Video Migration
-- Adds editable home content fields to site_settings, and home/video fields
-- to services so the admin can manage every section of the homepage.
-- Run this in the Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Extend site_settings ─────────────────────────────────────────────────────
alter table site_settings
  add column if not exists hero_eyebrow text                  default 'Web · Portals · CRM · Marketing',
  add column if not exists hero_cta_primary_label text        default 'Explore Services',
  add column if not exists hero_cta_primary_url   text        default '#services',
  add column if not exists hero_cta_secondary_label text      default 'Talk to Us',
  add column if not exists hero_cta_secondary_url   text      default '',
  add column if not exists services_eyebrow  text             default 'What We Build',
  add column if not exists services_title    text             default 'Digital solutions that drive real growth',
  add column if not exists services_subtitle text             default 'From websites to CRMs — every product is engineered with brand psychology, clean code, and conversion science.',
  add column if not exists about_eyebrow text                 default 'About Cubico',
  add column if not exists about_title   text                 default 'Design meets science. Code meets strategy.',
  add column if not exists about_body    text                 default 'Cubico Technologies is a global software company headquartered in Pakistan. We build websites, portals, CRMs, and marketing systems for businesses that want to grow — not just exist online. Every product shares the same DNA — brand-first design, psychology-driven UX, blazing performance, and the flexibility to scale with your ambition.',
  add column if not exists about_cta_label text               default 'Get in touch',
  add column if not exists about_cta_url   text               default 'mailto:hello@cubico.tech',
  add column if not exists stats         jsonb  not null      default '[
    {"icon":"Building2","value":"50+","label":"Projects delivered"},
    {"icon":"Users","value":"10k+","label":"Active users"},
    {"icon":"Globe","value":"12+","label":"Countries reached"},
    {"icon":"Award","value":"5+","label":"Years in market"}
  ]'::jsonb,
  add column if not exists mini_features jsonb  not null      default '[
    {"icon":"Palette","text":"Brand-first design"},
    {"icon":"Zap","text":"Blazing fast"},
    {"icon":"Shield","text":"Secure & maintained"},
    {"icon":"BarChart2","text":"Data-driven"}
  ]'::jsonb,
  add column if not exists hero_morph_words jsonb not null    default '[
    "websites",
    "client portals",
    "CRMs",
    "marketing engines"
  ]'::jsonb;

-- Switch the hero title to use a {morph} placeholder so the cycling word
-- renders in the new Hero component. Only updates rows that still have the
-- original schema defaults — custom titles set by the admin are left alone.
update site_settings
   set hero_title = 'We build {morph} that grow your business'
 where hero_title in (
   'Technology That Moves You Forward',
   'We Build Digital Products That Grow Businesses'
 );

-- ── Extend services ──────────────────────────────────────────────────────────
alter table services
  add column if not exists home_video_url text,
  add column if not exists home_tagline   text,
  add column if not exists home_accent    text    not null default 'brand'
    check (home_accent in ('brand','violet','emerald','amber','rose','teal','cyan','fuchsia','sky')),
  add column if not exists show_on_home   boolean not null default false,
  add column if not exists home_order     integer not null default 0;

create index if not exists services_show_on_home_idx
  on services (show_on_home, home_order);

-- ── Mark the four default homepage services ─────────────────────────────────
update services
   set show_on_home = true,
       home_order   = 1,
       home_accent  = 'brand',
       home_tagline = coalesce(home_tagline, 'Psychology-driven, brand-first websites')
 where slug = 'website-development';

update services
   set show_on_home = true,
       home_order   = 2,
       home_accent  = 'violet',
       home_tagline = coalesce(home_tagline, 'Give clients a front-row seat')
 where slug = 'client-portals';

update services
   set show_on_home = true,
       home_order   = 3,
       home_accent  = 'emerald',
       home_tagline = coalesce(home_tagline, 'Close more deals, lose fewer leads')
 where slug = 'crm-systems';

update services
   set show_on_home = true,
       home_order   = 4,
       home_accent  = 'amber',
       home_tagline = coalesce(home_tagline, 'Growth you can measure')
 where slug = 'digital-marketing';
