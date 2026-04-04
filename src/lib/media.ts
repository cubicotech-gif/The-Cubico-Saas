import type { LucideIcon } from 'lucide-react';

// Every uploadable slot on the site, with metadata for the admin UI
export interface MediaSlot {
  key: string;           // unique identifier, used as storage path
  label: string;         // human-readable label
  section: string;       // which page/section it belongs to
  accept: string;        // MIME types: "image/*" or "video/mp4"
  hint: string;          // size/format guidance
  width: number;         // recommended px width
  height: number;        // recommended px height
}

export interface MediaAsset {
  id?: string;
  slot_key: string;
  url: string;           // Supabase storage public URL
  file_name: string;
  updated_at?: string;
}

// ── All media slots used across the site ─────────────────────────────────────

export const MEDIA_SLOTS: MediaSlot[] = [
  // ── Web Dev Hero ──
  {
    key: 'webdev-hero-video',
    label: 'Hero Background Video',
    section: 'Web Dev — Hero',
    accept: 'video/mp4,video/webm',
    hint: 'Looping showreel/screen-recording. 10-15 sec, muted. MP4 or WebM.',
    width: 1920,
    height: 1080,
  },
  {
    key: 'webdev-hero-mockup',
    label: 'Hero Device Mockup',
    section: 'Web Dev — Hero',
    accept: 'image/*',
    hint: 'Laptop or phone mockup showing a finished website. PNG with transparency preferred.',
    width: 800,
    height: 600,
  },

  // ── Pain Points Story Cards ──
  {
    key: 'paincard-1-video',
    label: 'Story Card 1 — Broken Builder (Video)',
    section: 'Web Dev — Pain Points',
    accept: 'video/mp4,video/webm',
    hint: 'Screen recording of broken website builder layout. Loop, muted, max 1.5MB. MP4 H.264.',
    width: 600,
    height: 450,
  },
  {
    key: 'paincard-2-image',
    label: 'Story Card 2 — Ghosted Messages (Image)',
    section: 'Web Dev — Pain Points',
    accept: 'image/webp,image/*',
    hint: 'WhatsApp/email screenshot showing unanswered messages with visible dates. WebP, max 200KB.',
    width: 600,
    height: 450,
  },
  {
    key: 'paincard-3-image',
    label: 'Story Card 3 — Billing Screenshot (Image)',
    section: 'Web Dev — Pain Points',
    accept: 'image/webp,image/*',
    hint: 'Billing page showing recurring monthly charge with red circle annotation. WebP, max 200KB.',
    width: 600,
    height: 450,
  },
  {
    key: 'paincard-4-video',
    label: 'Story Card 4 — Tab Overload (Video)',
    section: 'Web Dev — Pain Points',
    accept: 'video/mp4,video/webm',
    hint: 'Screen recording of browser with 15+ open tabs: tutorials, dashboards, billing. Loop, muted, max 1.5MB.',
    width: 600,
    height: 450,
  },

  // ── Process Browser Animation ──
  {
    key: 'process-sample-logo',
    label: 'Browser Animation — Sample Logo',
    section: 'Web Dev — Process',
    accept: 'image/webp,image/png,image/svg+xml',
    hint: 'A professional sample logo for the browser animation. PNG/SVG with transparency, max 100KB.',
    width: 120,
    height: 40,
  },
  {
    key: 'process-hero-image',
    label: 'Browser Animation — Hero Image',
    section: 'Web Dev — Process',
    accept: 'image/webp,image/*',
    hint: 'Sample hero image that fills in during Stage 2. WebP, max 150KB.',
    width: 900,
    height: 400,
  },
  {
    key: 'process-hero-swap',
    label: 'Browser Animation — Swap Image',
    section: 'Web Dev — Process',
    accept: 'image/webp,image/*',
    hint: 'Alternative hero image for the Stage 3 swap animation. WebP, max 150KB.',
    width: 900,
    height: 400,
  },

  // ── Development Approach (zigzag) ──
  {
    key: 'webdev-approach-branding',
    label: 'Branding & Colour Science',
    section: 'Web Dev — Approach',
    accept: 'image/*',
    hint: 'Brand mood board, colour palette extraction, or Pantone swatches.',
    width: 640,
    height: 480,
  },
  {
    key: 'webdev-approach-psychology',
    label: 'Psychology & UX Patterns',
    section: 'Web Dev — Approach',
    accept: 'image/*',
    hint: 'Website heatmap overlay, eye-tracking pattern, or F-pattern diagram.',
    width: 640,
    height: 480,
  },
  {
    key: 'webdev-approach-conversion',
    label: 'Conversion Architecture',
    section: 'Web Dev — Approach',
    accept: 'image/*',
    hint: 'Figma component library, design tokens panel, or conversion funnel diagram.',
    width: 640,
    height: 480,
  },

  // ── Process Timeline ──
  {
    key: 'webdev-process-discovery',
    label: 'Discovery Phase',
    section: 'Web Dev — Process',
    accept: 'image/*',
    hint: 'Whiteboard planning, sticky notes, or brand questionnaire photo.',
    width: 480,
    height: 320,
  },
  {
    key: 'webdev-process-design',
    label: 'Design Phase',
    section: 'Web Dev — Process',
    accept: 'image/*',
    hint: 'Figma wireframes or design tool screenshot.',
    width: 480,
    height: 320,
  },
  {
    key: 'webdev-process-development',
    label: 'Development Phase',
    section: 'Web Dev — Process',
    accept: 'image/*',
    hint: 'VS Code editor with code or terminal with build output.',
    width: 480,
    height: 320,
  },
  {
    key: 'webdev-process-launch',
    label: 'Launch Phase',
    section: 'Web Dev — Process',
    accept: 'image/*',
    hint: 'Analytics dashboard or deployment screenshot.',
    width: 480,
    height: 320,
  },
  {
    key: 'webdev-process-video',
    label: 'Process Timelapse Video (optional)',
    section: 'Web Dev — Process',
    accept: 'video/mp4,video/webm',
    hint: 'Figma design timelapse at 4x speed, 20-30 seconds.',
    width: 1280,
    height: 720,
  },

  // ── Portfolio Project Screenshots ──
  {
    key: 'portfolio-alnoor',
    label: 'Al-Noor Academy Screenshot',
    section: 'Web Dev — Portfolio',
    accept: 'image/*',
    hint: 'Full-page screenshot or best section crop of the project.',
    width: 800,
    height: 500,
  },
  {
    key: 'portfolio-medcare',
    label: 'MedCare Clinic Screenshot',
    section: 'Web Dev — Portfolio',
    accept: 'image/*',
    hint: 'Full-page screenshot or best section crop of the project.',
    width: 800,
    height: 500,
  },
  {
    key: 'portfolio-urbanthreads',
    label: 'Urban Threads Screenshot',
    section: 'Web Dev — Portfolio',
    accept: 'image/*',
    hint: 'Full-page screenshot or best section crop of the project.',
    width: 800,
    height: 500,
  },
  {
    key: 'portfolio-greenvolt',
    label: 'GreenVolt Energy Screenshot',
    section: 'Web Dev — Portfolio',
    accept: 'image/*',
    hint: 'Full-page screenshot or best section crop of the project.',
    width: 800,
    height: 500,
  },
  {
    key: 'portfolio-foodieshub',
    label: 'Foodies Hub Screenshot',
    section: 'Web Dev — Portfolio',
    accept: 'image/*',
    hint: 'Full-page screenshot or best section crop of the project.',
    width: 800,
    height: 500,
  },

  // ── Social Proof / Testimonials ──
  {
    key: 'testimonial-client1-photo',
    label: 'Client 1 Photo',
    section: 'Web Dev — Testimonials',
    accept: 'image/*',
    hint: 'Client headshot or avatar. Square crop, min 200x200.',
    width: 200,
    height: 200,
  },
  {
    key: 'testimonial-client2-photo',
    label: 'Client 2 Photo',
    section: 'Web Dev — Testimonials',
    accept: 'image/*',
    hint: 'Client headshot or avatar. Square crop, min 200x200.',
    width: 200,
    height: 200,
  },

  // ── Tech Logos ──
  {
    key: 'logo-nextjs',
    label: 'Next.js Logo',
    section: 'Web Dev — Tech Stack',
    accept: 'image/svg+xml,image/png',
    hint: 'SVG preferred. White or light version for dark background.',
    width: 120,
    height: 40,
  },
  {
    key: 'logo-react',
    label: 'React Logo',
    section: 'Web Dev — Tech Stack',
    accept: 'image/svg+xml,image/png',
    hint: 'SVG preferred. White or light version for dark background.',
    width: 120,
    height: 40,
  },
  {
    key: 'logo-tailwind',
    label: 'Tailwind CSS Logo',
    section: 'Web Dev — Tech Stack',
    accept: 'image/svg+xml,image/png',
    hint: 'SVG preferred. White or light version for dark background.',
    width: 120,
    height: 40,
  },
  {
    key: 'logo-typescript',
    label: 'TypeScript Logo',
    section: 'Web Dev — Tech Stack',
    accept: 'image/svg+xml,image/png',
    hint: 'SVG preferred. White or light version for dark background.',
    width: 120,
    height: 40,
  },
  {
    key: 'logo-figma',
    label: 'Figma Logo',
    section: 'Web Dev — Tech Stack',
    accept: 'image/svg+xml,image/png',
    hint: 'SVG preferred. White or light version for dark background.',
    width: 120,
    height: 40,
  },
  {
    key: 'logo-vercel',
    label: 'Vercel Logo',
    section: 'Web Dev — Tech Stack',
    accept: 'image/svg+xml,image/png',
    hint: 'SVG preferred. White or light version for dark background.',
    width: 120,
    height: 40,
  },
  {
    key: 'logo-wordpress',
    label: 'WordPress Logo',
    section: 'Web Dev — Tech Stack',
    accept: 'image/svg+xml,image/png',
    hint: 'SVG preferred. White or light version for dark background.',
    width: 120,
    height: 40,
  },
  {
    key: 'logo-shopify',
    label: 'Shopify Logo',
    section: 'Web Dev — Tech Stack',
    accept: 'image/svg+xml,image/png',
    hint: 'SVG preferred. White or light version for dark background.',
    width: 120,
    height: 40,
  },
];

// Helper: group slots by section
export function getSlotsBySection(): Record<string, MediaSlot[]> {
  const grouped: Record<string, MediaSlot[]> = {};
  for (const slot of MEDIA_SLOTS) {
    if (!grouped[slot.section]) grouped[slot.section] = [];
    grouped[slot.section].push(slot);
  }
  return grouped;
}
