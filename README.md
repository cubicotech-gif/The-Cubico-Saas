# Cubico Technologies — SaaS Website

> Role-based wayfinding website for Cubico Technologies. Shows different service directions for institutions, healthcare, individuals, and creative work — each linking to dedicated sites or internal service pages.

## Tech Stack

- **Next.js 14** (App Router, SSR + ISR)
- **TypeScript**
- **Tailwind CSS** (custom design system)
- **Framer Motion** (animations)
- **Supabase** (PostgreSQL database + real-time)
- **Vercel** (deployment)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site works with seed data even without Supabase.

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from **Settings > API**
4. Paste them into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

## Admin Panel

Visit `/admin` and enter the password set in `NEXT_PUBLIC_ADMIN_PASSWORD` (default: `cubico-admin-2026`).

From the admin panel you can:
- **Services**: Add, edit, delete, reorder service cards
- **Service Pages**: View and manage internal service landing pages
- **Site Settings**: Update hero text, contact info, footer

> Without Supabase configured, the admin shows seed data in read-only mode.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (wayfinding)
│   ├── admin/page.tsx        # Admin panel
│   ├── services/[slug]/      # Dynamic service pages
│   └── not-found.tsx         # 404 page
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── CategorySection.tsx
│   ├── ServiceCard.tsx
│   ├── ServicePageContent.tsx
│   ├── AboutSection.tsx
│   ├── Footer.tsx
│   └── ui/DynamicIcon.tsx
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── data.ts               # Data access layer (Supabase + fallback)
│   └── types.ts              # TypeScript types
└── data/
    └── seeds.ts              # Static seed data
```

## Service Architecture

| Category       | Examples                         | Link Type |
|----------------|----------------------------------|-----------|
| Institution    | Cubico Manage/Teach/Learn/Market | External  |
| Healthcare     | HMS, Clinic EHR                  | Mixed     |
| Individual     | Websites, Portals, CRM, Marketing| Internal  |
| Creative       | Creative Studio, Video Production| Mixed     |

- **External** links go to existing Cubico product sites
- **Internal** links render dedicated landing pages at `/services/[slug]`

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
4. Deploy

Pages use ISR with 60-second revalidation — content updates from admin reflect within a minute.

## Customization

- **Colors**: Edit `tailwind.config.ts` → `colors.brand`
- **Fonts**: Edit `globals.css` → Google Fonts imports
- **Services**: Edit `src/data/seeds.ts` or use the admin panel
- **External URLs**: Update `link_url` in services to point to your live sites
- **WhatsApp**: Update the contact number in site settings

---

Built by **Cubico Technologies** — Karachi, Pakistan
