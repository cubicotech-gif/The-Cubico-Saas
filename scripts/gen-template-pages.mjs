/* eslint-disable */
/**
 * Generates the *sub-pages* (about / services / contact / etc.) for every
 * template, sharing the same structure but skinned with each template's
 * brand colors via CSS variables.
 *
 * Run:  node scripts/gen-template-pages.mjs
 *
 * Index pages (the rich, distinctive landing page for each template) are
 * NOT touched by this script — they are authored by hand.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', 'public', 'templates');

/** All templates that need sub-pages generated. */
const templates = [
  {
    key: 'restaurant',
    name: 'Flavor House',
    tagline: 'Crafted flavors, curated experience',
    brand: '#C9A227', brandDark: '#a07d18', accent: '#5C1A1B',
    pages: ['menu', 'about', 'contact'],
    services: [
      { icon: '🍷', title: 'Fine Dining', body: 'A 5-course tasting menu, hand-paired wines, and a chef’s table experience.' },
      { icon: '🥂', title: 'Private Events', body: 'Birthdays, anniversaries, corporate dinners — booked end-to-end by our team.' },
      { icon: '🍰', title: 'Pastry Atelier', body: 'In-house pâtisserie. Whole cakes and viennoiseries available to order.' },
      { icon: '🍽️', title: 'Catering', body: 'Off-site catering for 20 to 200 guests, fully staffed.' },
    ],
  },
  {
    key: 'clinic',
    name: 'CareFirst Medical',
    tagline: 'Modern healthcare, trusted hands',
    brand: '#0D9488', brandDark: '#0b766b', accent: '#1E293B',
    pages: ['services', 'about', 'contact'],
    services: [
      { icon: '🩺', title: 'General Practice', body: 'Family medicine, annual physicals, and preventive care for all ages.' },
      { icon: '💉', title: 'Vaccinations', body: 'Adult and pediatric vaccines, travel shots, and seasonal flu campaigns.' },
      { icon: '🔬', title: 'Lab & Diagnostics', body: 'On-site bloodwork, urinalysis, and imaging — most results within 24 hours.' },
      { icon: '🧠', title: 'Mental Health', body: 'Confidential counseling and therapy sessions with licensed clinicians.' },
    ],
  },
  {
    key: 'shop',
    name: 'Urban Threads',
    tagline: 'Streetwear with a story',
    brand: '#FF6B4A', brandDark: '#cc4f33', accent: '#0A0A0A',
    pages: ['shop', 'about', 'contact'],
    services: [
      { icon: '👕', title: 'New Arrivals', body: 'Fresh drops every Friday. Limited runs, never restocked.' },
      { icon: '🚚', title: 'Free Shipping', body: 'Free worldwide shipping on orders over $80.' },
      { icon: '🔁', title: '30-Day Returns', body: 'Doesn’t fit? Send it back free within 30 days, no questions.' },
      { icon: '💬', title: 'Style Help', body: 'DM us for fit advice — real humans, real answers.' },
    ],
  },
  {
    key: 'school',
    name: 'Bright Minds',
    tagline: 'Where curiosity becomes confidence',
    brand: '#FBBF24', brandDark: '#d99e0d', accent: '#1E40AF',
    pages: ['programs', 'about', 'contact'],
    services: [
      { icon: '🌱', title: 'Early Years', body: 'Play-based learning for ages 3–5. Small classes, big imaginations.' },
      { icon: '📚', title: 'Primary', body: 'A balanced curriculum in literacy, numeracy, science, and the arts.' },
      { icon: '🔬', title: 'STEM Lab', body: 'Hands-on robotics, coding, and science fair projects every term.' },
      { icon: '🎨', title: 'Creative Arts', body: 'Music, dance, theater, and visual arts taught by working artists.' },
    ],
  },
  {
    key: 'portfolio',
    name: 'Alex Morgan',
    tagline: 'Designer & creative director',
    brand: '#8B5CF6', brandDark: '#6d44c4', accent: '#111111',
    pages: ['work', 'about', 'contact'],
    services: [
      { icon: '🎨', title: 'Brand Identity', body: 'Logos, type systems, and brand guidelines that scale.' },
      { icon: '💻', title: 'Web Design', body: 'Editorial, marketing, and product sites built around your story.' },
      { icon: '📱', title: 'Product Design', body: 'End-to-end UX for mobile and SaaS, from research to ship.' },
      { icon: '✏️', title: 'Art Direction', body: 'Campaign concepts, photo direction, and editorial design.' },
    ],
  },
  {
    key: 'corporate',
    name: 'Nexus Solutions',
    tagline: 'Enterprise-grade strategy & systems',
    brand: '#3B82F6', brandDark: '#2563eb', accent: '#0F172A',
    pages: ['services', 'about', 'contact'],
    services: [
      { icon: '📊', title: 'Strategy Consulting', body: 'Market entry, growth, and operating-model engagements for Fortune 500s.' },
      { icon: '⚙️', title: 'Digital Transformation', body: 'Cloud migration, ERP, and process automation across global teams.' },
      { icon: '🛡️', title: 'Risk & Compliance', body: 'Cybersecurity audits, GDPR/SOC2, and enterprise risk frameworks.' },
      { icon: '🤝', title: 'M&A Advisory', body: 'Due diligence, integration planning, and post-merger value capture.' },
    ],
  },
  {
    key: 'realestate',
    name: 'Prime Estates',
    tagline: 'Find the home that finds you',
    brand: '#0EA5E9', brandDark: '#0284c7', accent: '#082F49',
    pages: ['listings', 'about', 'contact'],
    services: [
      { icon: '🏡', title: 'Buy a Home', body: 'Hand-picked listings, neighborhood guides, and a buyer’s agent in your corner.' },
      { icon: '🔑', title: 'Sell with Us', body: 'Pro photography, marketing, and a track record of above-asking sales.' },
      { icon: '🏢', title: 'Commercial', body: 'Retail, office, and industrial leases negotiated by sector specialists.' },
      { icon: '📈', title: 'Investment Advice', body: 'Yield analysis, portfolio reviews, and 1031 exchange guidance.' },
    ],
  },
  {
    key: 'fitness',
    name: 'Iron Forge',
    tagline: 'Train hard. Recover smart. Stay forged.',
    brand: '#22C55E', brandDark: '#16a34a', accent: '#0A0A0A',
    pages: ['classes', 'about', 'contact'],
    services: [
      { icon: '🏋️', title: 'Strength', body: 'Powerlifting, Olympic lifts, and hypertrophy programs for every level.' },
      { icon: '🥊', title: 'Boxing & MMA', body: 'Striking, conditioning, and sparring with credentialed coaches.' },
      { icon: '🧘', title: 'Mobility & Yoga', body: 'Recovery flows, mobility drills, and breathwork sessions daily.' },
      { icon: '🥗', title: 'Nutrition Coaching', body: 'Personal macros, meal plans, and weekly check-ins with a coach.' },
    ],
  },
  {
    key: 'salon',
    name: 'Lumière Beauty',
    tagline: 'Soft luxury. Quiet confidence.',
    brand: '#EC4899', brandDark: '#db2777', accent: '#500724',
    pages: ['services', 'about', 'contact'],
    services: [
      { icon: '💇', title: 'Hair Studio', body: 'Cut, color, balayage, and editorial styling by senior stylists.' },
      { icon: '💅', title: 'Nail Atelier', body: 'Gel, structured manicures, art and nail health treatments.' },
      { icon: '✨', title: 'Skin & Facials', body: 'Medical-grade facials, peels, and personalized skincare consultations.' },
      { icon: '🧖', title: 'Spa & Massage', body: 'Deep tissue, lymphatic, hot stone, and signature lumière rituals.' },
    ],
  },
  {
    key: 'agency',
    name: 'Northwind Studio',
    tagline: 'Brands built with intent',
    brand: '#F59E0B', brandDark: '#d97706', accent: '#1C1917',
    pages: ['work', 'about', 'contact'],
    services: [
      { icon: '🧭', title: 'Brand Strategy', body: 'Positioning, narrative, and messaging that earn attention.' },
      { icon: '🎨', title: 'Identity Design', body: 'Visual systems, logo, type, and brand guidelines built to last.' },
      { icon: '🎬', title: 'Content & Film', body: 'Photography, video, and editorial campaigns produced in-house.' },
      { icon: '🌐', title: 'Digital Experience', body: 'Websites, e-commerce, and product design — strategy through ship.' },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const niceTitle = (slug) =>
  ({ menu: 'Menu', shop: 'Shop', listings: 'Listings',
     classes: 'Classes', programs: 'Programs', work: 'Selected Work',
     services: 'Services', about: 'About Us', contact: 'Get in Touch'
   }[slug] || cap(slug));

function navLinks(t, current) {
  const labels = ['Home', ...t.pages.map(niceTitle)];
  const files = ['index.html', ...t.pages.map((p) => `${p}.html`)];
  return labels
    .map((label, i) => {
      const href = files[i];
      const active = href === current ? ' active' : '';
      return `<a href="${href}" class="${active}">${label}</a>`;
    })
    .join('\n        ') + `\n        <a href="contact.html" class="tpl-nav-cta">Book Now</a>`;
}

function shell(t, slug, body) {
  const file = `${slug}.html`;
  const title = niceTitle(slug);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — ${t.name}</title>
  <link rel="stylesheet" href="/templates/_shared/inner.css">
  <style>
    :root {
      --brand: ${t.brand};
      --brand-dark: ${t.brandDark};
      --brand-light: ${t.brand};
      --accent: ${t.accent};
    }
  </style>
</head>
<body>
  <nav class="tpl-nav">
    <div class="tpl-nav-inner">
      <a href="index.html" class="tpl-logo">${t.name.split(' ')[0]}<span>.</span></a>
      <div class="tpl-nav-links">
        ${navLinks(t, file)}
      </div>
    </div>
  </nav>

  ${body}

  <footer class="tpl-footer">
    <div class="tpl-logo">${t.name}</div>
    <div>
      ${['index.html', ...t.pages.map((p) => `${p}.html`)]
        .map((f, i) => `<a href="${f}">${i === 0 ? 'Home' : niceTitle(t.pages[i - 1])}</a>`)
        .join('')}
    </div>
    <div class="tpl-copy">© ${new Date().getFullYear()} ${t.name}. Built with Cubico.</div>
  </footer>
</body>
</html>
`;
}

function aboutBody(t) {
  return `
  <header class="tpl-page-header">
    <span class="tpl-eyebrow">About Us</span>
    <h1>${t.tagline}</h1>
    <p>We started ${t.name} with a simple idea: do the work properly, treat people well, and let the results speak for themselves.</p>
  </header>

  <section class="tpl-section">
    <div class="tpl-two-col">
      <div class="tpl-illustration"></div>
      <div>
        <h2>Our Story</h2>
        <p>What began as a small team of obsessives has grown into a tight studio of practitioners who care deeply about craft. Every project gets our full attention — no juniors quietly running the show, no shortcuts dressed up as efficiency.</p>
        <p style="margin-top:1rem;color:var(--text-soft)">We believe the best work happens when ambition meets discipline, and when clients are treated as collaborators instead of inboxes.</p>
        <a href="contact.html" class="tpl-btn" style="margin-top:1.5rem">Work with us →</a>
      </div>
    </div>
  </section>

  <section class="tpl-section alt">
    <div class="tpl-inner">
      <h2>By the numbers</h2>
      <p>Real outcomes, not vanity metrics.</p>
      <div class="tpl-stats">
        <div class="tpl-stat"><div class="num">12+</div><div class="label">Years operating</div></div>
        <div class="tpl-stat"><div class="num">240</div><div class="label">Projects shipped</div></div>
        <div class="tpl-stat"><div class="num">98%</div><div class="label">Client retention</div></div>
        <div class="tpl-stat"><div class="num">4.9★</div><div class="label">Average rating</div></div>
      </div>
    </div>
  </section>

  <section class="tpl-section">
    <h2>The team</h2>
    <p>People you can call by name.</p>
    <div class="tpl-grid cols-4">
      ${['Sara', 'Daniel', 'Maya', 'Theo']
        .map(
          (n, i) => `
      <div class="tpl-card" style="text-align:center">
        <div style="width:88px;height:88px;margin:0 auto 1rem;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--accent))"></div>
        <h3>${n} ${['Khan', 'Reyes', 'Chen', 'Okafor'][i]}</h3>
        <p style="font-size:.85rem">${['Founder', 'Lead Practitioner', 'Operations', 'Senior Specialist'][i]}</p>
      </div>`,
        )
        .join('')}
    </div>
  </section>
  `;
}

function servicesBody(t) {
  return `
  <header class="tpl-page-header">
    <span class="tpl-eyebrow">${niceTitle(t.pages.find((p) => p === 'services' || p === 'menu' || p === 'shop' || p === 'classes' || p === 'programs' || p === 'work' || p === 'listings') || 'services')}</span>
    <h1>What we do, in detail</h1>
    <p>End-to-end delivery from a single, accountable team. Pick what you need — or talk to us about a custom engagement.</p>
  </header>

  <section class="tpl-section">
    <div class="tpl-grid cols-2">
      ${t.services
        .map(
          (s) => `
      <div class="tpl-card">
        <div class="tpl-icon">${s.icon}</div>
        <h3>${s.title}</h3>
        <p>${s.body}</p>
      </div>`,
        )
        .join('')}
    </div>
  </section>

  <section class="tpl-section alt">
    <div class="tpl-inner" style="text-align:center">
      <h2 style="margin:0 auto">Not sure what fits?</h2>
      <p style="margin:1rem auto 2rem">Talk to us for 15 minutes. We’ll point you to what actually solves your problem — even if it isn’t us.</p>
      <a href="contact.html" class="tpl-btn">Book a consultation</a>
    </div>
  </section>
  `;
}

function contactBody(t) {
  return `
  <header class="tpl-page-header">
    <span class="tpl-eyebrow">Contact</span>
    <h1>Let’s talk</h1>
    <p>Tell us what you have in mind. We reply within one business day — usually faster.</p>
  </header>

  <section class="tpl-section">
    <div class="tpl-two-col">
      <div>
        <h2>Reach out</h2>
        <p>Whether you’re ready to start or just exploring, drop us a line. No pressure, no hard sell.</p>
        <ul style="margin-top:2rem;list-style:none;display:grid;gap:1.2rem">
          <li><strong style="color:var(--accent)">Email</strong><br><a href="mailto:hello@${t.key}.example">hello@${t.key}.example</a></li>
          <li><strong style="color:var(--accent)">Phone</strong><br><a href="tel:+10000000000">+1 (000) 000-0000</a></li>
          <li><strong style="color:var(--accent)">Studio</strong><br>123 Main Street, Suite 400<br>Karachi, Pakistan</li>
        </ul>
      </div>
      <form class="tpl-form" onsubmit="event.preventDefault();this.querySelector('button').textContent='Sent ✓';">
        <div class="tpl-field">
          <label>Your name</label>
          <input type="text" required placeholder="Jane Doe">
        </div>
        <div class="tpl-field">
          <label>Email</label>
          <input type="email" required placeholder="you@company.com">
        </div>
        <div class="tpl-field">
          <label>How can we help?</label>
          <textarea required placeholder="Tell us about your project…"></textarea>
        </div>
        <button class="tpl-btn" type="submit">Send message →</button>
      </form>
    </div>
  </section>
  `;
}

// Generic "list page" used for menu/shop/listings/classes/programs/work
function listBody(t, slug) {
  const items = t.services; // reuse the 4 services as a generic list
  return `
  <header class="tpl-page-header">
    <span class="tpl-eyebrow">${niceTitle(slug)}</span>
    <h1>${niceTitle(slug)}</h1>
    <p>Everything we offer, in one place. ${t.tagline}.</p>
  </header>

  <section class="tpl-section">
    <div class="tpl-grid cols-3">
      ${items
        .concat(items)
        .map(
          (s, i) => `
      <div class="tpl-card">
        <div style="aspect-ratio:16/10;border-radius:10px;margin:-.4rem -.4rem 1rem;background:linear-gradient(135deg,var(--brand),var(--accent));display:flex;align-items:center;justify-content:center;font-size:2.5rem">${s.icon}</div>
        <h3>${s.title} ${i >= items.length ? 'Plus' : ''}</h3>
        <p>${s.body}</p>
        <a href="contact.html" style="display:inline-block;margin-top:.8rem;font-weight:600;font-size:.88rem">Enquire →</a>
      </div>`,
        )
        .join('')}
    </div>
  </section>
  `;
}

// ──────────────────────────────────────────────────────────────────
// Generate
// ──────────────────────────────────────────────────────────────────
let written = 0;
for (const t of templates) {
  const dir = join(ROOT, t.key);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  for (const slug of t.pages) {
    let body;
    if (slug === 'about') body = aboutBody(t);
    else if (slug === 'contact') body = contactBody(t);
    else if (slug === 'services') body = servicesBody(t);
    else body = listBody(t, slug);
    const html = shell(t, slug, body);
    writeFileSync(join(dir, `${slug}.html`), html);
    written++;
  }
}
console.log(`✅ Generated ${written} sub-pages across ${templates.length} templates.`);
