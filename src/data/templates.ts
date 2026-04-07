/**
 * Single source of truth for all website templates.
 *
 * To add a new template:
 *   1. Create a folder in `public/templates/<key>/` with at least
 *      `index.html` and a `thumb.png` (1280x800 recommended).
 *   2. Add an entry below.
 *   3. Everything (the website-development page strip, /templates
 *      browse page, /order flow, dashboards, admin) reads from here.
 */

export type TemplateCategory =
  | 'Restaurant'
  | 'Healthcare'
  | 'E-Commerce'
  | 'Education'
  | 'Portfolio'
  | 'Corporate'
  | 'Real Estate'
  | 'Fitness'
  | 'Beauty'
  | 'Agency';

export interface TemplatePage {
  label: string;
  /** path under public/, e.g. "/templates/restaurant/about.html" */
  file: string;
}

export interface Template {
  /** stable, URL-safe id */
  key: string;
  name: string;
  /** Free-text industry label shown to users */
  industry: string;
  /** Filterable category bucket */
  category: TemplateCategory;
  tags: string[];
  description: string;
  /** Accent hex used for chips, badges, modal accents */
  color: string;
  /**
   * CSS gradient string used as the loading-state placeholder under the
   * live iframe thumbnail (so cards never show a blank white flash).
   */
  gradient: string;
  /** Path to a static screenshot. Optional — falls back to live iframe. */
  thumb?: string;
  /** Entry HTML file rendered in the modal preview */
  file: string;
  /** Sub-pages (used by the modal "pages" tab and listed in metadata) */
  pages: TemplatePage[];
}

export const TEMPLATES: Template[] = [
  {
    key: 'restaurant',
    name: 'Flavor House',
    industry: 'Restaurant',
    category: 'Restaurant',
    tags: ['restaurant', 'food', 'menu', 'reservation', 'cafe', 'dining'],
    description: 'Warm tones, menu cards, reservation form',
    color: '#C9A227',
    gradient: 'linear-gradient(135deg, #5C1A1B 0%, #8B2E2F 50%, #C9A227 100%)',
    thumb: '/templates/restaurant/thumb.jpg',
    file: '/templates/restaurant/index.html',
    pages: [
      { label: 'Home', file: '/templates/restaurant/index.html' },
      { label: 'Menu', file: '/templates/restaurant/menu.html' },
      { label: 'About', file: '/templates/restaurant/about.html' },
      { label: 'Contact', file: '/templates/restaurant/contact.html' },
    ],
  },
  {
    key: 'clinic',
    name: 'CareFirst Medical',
    industry: 'Healthcare',
    category: 'Healthcare',
    tags: ['clinic', 'doctor', 'medical', 'health', 'appointment', 'hospital'],
    description: 'Clean clinical layout, booking system, doctor profiles',
    color: '#0D9488',
    gradient: 'linear-gradient(135deg, #1E293B 0%, #0D9488 50%, #5EEAD4 100%)',
    thumb: '/templates/clinic/thumb.jpg',
    file: '/templates/clinic/index.html',
    pages: [
      { label: 'Home', file: '/templates/clinic/index.html' },
      { label: 'Services', file: '/templates/clinic/services.html' },
      { label: 'About', file: '/templates/clinic/about.html' },
      { label: 'Contact', file: '/templates/clinic/contact.html' },
    ],
  },
  {
    key: 'shop',
    name: 'Urban Threads',
    industry: 'E-Commerce',
    category: 'E-Commerce',
    tags: ['shop', 'ecommerce', 'store', 'fashion', 'clothing', 'cart'],
    description: 'Product grid, cart UI, newsletter signup',
    color: '#FF6B4A',
    gradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #FF6B4A 100%)',
    thumb: '/templates/shop/thumb.jpg',
    file: '/templates/shop/index.html',
    pages: [
      { label: 'Home', file: '/templates/shop/index.html' },
      { label: 'Shop', file: '/templates/shop/shop.html' },
      { label: 'About', file: '/templates/shop/about.html' },
      { label: 'Contact', file: '/templates/shop/contact.html' },
    ],
  },
  {
    key: 'school',
    name: 'Bright Minds',
    industry: 'Education',
    category: 'Education',
    tags: ['school', 'education', 'academy', 'kids', 'learning', 'admissions'],
    description: 'Programs, facilities, admissions form',
    color: '#FBBF24',
    gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #FBBF24 100%)',
    thumb: '/templates/school/thumb.jpg',
    file: '/templates/school/index.html',
    pages: [
      { label: 'Home', file: '/templates/school/index.html' },
      { label: 'Programs', file: '/templates/school/programs.html' },
      { label: 'About', file: '/templates/school/about.html' },
      { label: 'Contact', file: '/templates/school/contact.html' },
    ],
  },
  {
    key: 'portfolio',
    name: 'Alex Morgan',
    industry: 'Portfolio',
    category: 'Portfolio',
    tags: ['portfolio', 'designer', 'creative', 'personal', 'freelance'],
    description: 'Bold typography, project grid, creative layout',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #111111 0%, #1A1A1A 50%, #8B5CF6 100%)',
    thumb: '/templates/portfolio/thumb.jpg',
    file: '/templates/portfolio/index.html',
    pages: [
      { label: 'Home', file: '/templates/portfolio/index.html' },
      { label: 'Work', file: '/templates/portfolio/work.html' },
      { label: 'About', file: '/templates/portfolio/about.html' },
      { label: 'Contact', file: '/templates/portfolio/contact.html' },
    ],
  },
  {
    key: 'corporate',
    name: 'Nexus Solutions',
    industry: 'Corporate',
    category: 'Corporate',
    tags: ['corporate', 'business', 'consulting', 'enterprise', 'b2b'],
    description: 'Gradient mesh hero, services, case studies',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #3B82F6 100%)',
    thumb: '/templates/corporate/thumb.jpg',
    file: '/templates/corporate/index.html',
    pages: [
      { label: 'Home', file: '/templates/corporate/index.html' },
      { label: 'Services', file: '/templates/corporate/services.html' },
      { label: 'About', file: '/templates/corporate/about.html' },
      { label: 'Contact', file: '/templates/corporate/contact.html' },
    ],
  },
  {
    key: 'realestate',
    name: 'Prime Estates',
    industry: 'Real Estate',
    category: 'Real Estate',
    tags: ['real estate', 'property', 'homes', 'listings', 'agent'],
    description: 'Property listings, agent profiles, neighborhood guides',
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #082F49 0%, #075985 50%, #0EA5E9 100%)',
    thumb: '/templates/realestate/thumb.jpg',
    file: '/templates/realestate/index.html',
    pages: [
      { label: 'Home', file: '/templates/realestate/index.html' },
      { label: 'Listings', file: '/templates/realestate/listings.html' },
      { label: 'About', file: '/templates/realestate/about.html' },
      { label: 'Contact', file: '/templates/realestate/contact.html' },
    ],
  },
  {
    key: 'fitness',
    name: 'Iron Forge',
    industry: 'Fitness & Gym',
    category: 'Fitness',
    tags: ['fitness', 'gym', 'training', 'workout', 'crossfit', 'health'],
    description: 'Bold black & neon, class schedule, trainer cards',
    color: '#22C55E',
    gradient: 'linear-gradient(135deg, #0A0A0A 0%, #171717 50%, #22C55E 100%)',
    thumb: '/templates/fitness/thumb.jpg',
    file: '/templates/fitness/index.html',
    pages: [
      { label: 'Home', file: '/templates/fitness/index.html' },
      { label: 'Classes', file: '/templates/fitness/classes.html' },
      { label: 'About', file: '/templates/fitness/about.html' },
      { label: 'Contact', file: '/templates/fitness/contact.html' },
    ],
  },
  {
    key: 'salon',
    name: 'Lumière Beauty',
    industry: 'Beauty & Salon',
    category: 'Beauty',
    tags: ['salon', 'beauty', 'spa', 'hair', 'nails', 'makeup', 'wellness'],
    description: 'Soft pastels, service menu, online booking',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #500724 0%, #831843 50%, #EC4899 100%)',
    thumb: '/templates/salon/thumb.jpg',
    file: '/templates/salon/index.html',
    pages: [
      { label: 'Home', file: '/templates/salon/index.html' },
      { label: 'Services', file: '/templates/salon/services.html' },
      { label: 'About', file: '/templates/salon/about.html' },
      { label: 'Contact', file: '/templates/salon/contact.html' },
    ],
  },
  {
    key: 'agency',
    name: 'Northwind Studio',
    industry: 'Creative Agency',
    category: 'Agency',
    tags: ['agency', 'creative', 'studio', 'branding', 'design', 'marketing'],
    description: 'Editorial typography, case studies, team grid',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #1C1917 0%, #292524 50%, #F59E0B 100%)',
    thumb: '/templates/agency/thumb.jpg',
    file: '/templates/agency/index.html',
    pages: [
      { label: 'Home', file: '/templates/agency/index.html' },
      { label: 'Work', file: '/templates/agency/work.html' },
      { label: 'About', file: '/templates/agency/about.html' },
      { label: 'Contact', file: '/templates/agency/contact.html' },
    ],
  },
];

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'Restaurant',
  'Healthcare',
  'E-Commerce',
  'Education',
  'Portfolio',
  'Corporate',
  'Real Estate',
  'Fitness',
  'Beauty',
  'Agency',
];

export function getTemplate(key: string): Template | undefined {
  return TEMPLATES.find((t) => t.key === key);
}
