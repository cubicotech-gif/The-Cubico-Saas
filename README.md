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

## PayPal Integration

Payments on order completion are processed through PayPal. To enable them:

1. Create a REST API app at [developer.paypal.com](https://developer.paypal.com)
   → **Apps & Credentials**.
2. Copy the **Client ID** and **Secret** (use Sandbox credentials while testing).
3. Add these to `.env.local`:
   ```
   PAYPAL_CLIENT_ID=...
   PAYPAL_CLIENT_SECRET=...
   PAYPAL_ENVIRONMENT=sandbox          # or "live" in production
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=...     # same value as PAYPAL_CLIENT_ID
   PKR_TO_USD_RATE=280                  # PKR orders are charged in USD
   ```

The server exposes two API routes that the PaymentModal uses:
- `POST /api/paypal/create-order` — creates a PayPal order for the logged-in
  customer's order, returns the PayPal order id.
- `POST /api/paypal/capture-order` — captures the approved payment, records a
  row in `transactions`, and marks the order `is_paid = true`.

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_ENVIRONMENT` (`sandbox` or `live`)
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `PKR_TO_USD_RATE` (optional, defaults to 280)
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
