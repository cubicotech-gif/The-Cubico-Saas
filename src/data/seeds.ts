import type { Service, SiteSettings } from '@/lib/types';

export const seedSettings: SiteSettings = {
  hero_title: 'Technology That Moves You Forward',
  hero_subtitle:
    'Cubico Technologies delivers enterprise-grade software for institutions, healthcare providers, and growing businesses worldwide.',
  contact_whatsapp: '+923001234567',
  contact_email: 'hello@cubico.tech',
  footer_text: '© 2026 Cubico Technologies. Headquartered in Pakistan, serving clients globally.',
};

export const seedServices: Service[] = [
  // ── Institution ──────────────────────────────────────────────────────────
  {
    id: 'inst-manage',
    title: 'Cubico Manage',
    description:
      'Complete school & college administration — admissions, fees, timetables, and HR in one unified platform.',
    category: 'institution',
    icon: 'Building2',
    link_type: 'external',
    link_url: 'https://manage.cubico.tech',
    order_index: 1,
    is_active: true,
  },
  {
    id: 'inst-teach',
    title: 'Cubico Teach',
    description:
      'Empower educators with smart lesson planning, attendance tracking, and student performance analytics.',
    category: 'institution',
    icon: 'GraduationCap',
    link_type: 'external',
    link_url: 'https://teach.cubico.tech',
    order_index: 2,
    is_active: true,
  },
  {
    id: 'inst-learn',
    title: 'Cubico Learn',
    description:
      'A full-featured LMS for online and blended learning — video lessons, quizzes, certificates, and progress tracking.',
    category: 'institution',
    icon: 'BookOpen',
    link_type: 'external',
    link_url: 'https://learn.cubico.tech',
    order_index: 3,
    is_active: true,
  },
  {
    id: 'inst-market',
    title: 'Cubico Market',
    description:
      'Institutional marketing suite with campaign management, lead funnels, and enrolment conversion tools.',
    category: 'institution',
    icon: 'Megaphone',
    link_type: 'external',
    link_url: 'https://market.cubico.tech',
    order_index: 4,
    is_active: true,
  },

  // ── Healthcare ────────────────────────────────────────────────────────────
  {
    id: 'health-hms',
    title: 'Hospital Management System',
    description:
      'End-to-end HMS covering OPD/IPD, pharmacy, lab, billing, and ward management for hospitals of every size.',
    category: 'healthcare',
    icon: 'Hospital',
    link_type: 'internal',
    link_url: '/services/hospital-management-system',
    slug: 'hospital-management-system',
    order_index: 5,
    is_active: true,
    page_hero_title: 'Hospital Management, Simplified',
    page_hero_subtitle:
      'A comprehensive platform that digitises every touchpoint — from patient check-in to discharge and billing.',
    features: [
      {
        icon: 'Users',
        title: 'Patient Registry',
        description:
          'Unified patient records with full history, allergies, and insurance details always at your fingertips.',
        order_index: 1,
      },
      {
        icon: 'FlaskConical',
        title: 'Lab & Radiology',
        description:
          'Integrated lab orders, result delivery, and PACS-ready radiology workflows with auto-reporting.',
        order_index: 2,
      },
      {
        icon: 'Pill',
        title: 'Pharmacy Module',
        description:
          'Real-time inventory, prescription validation, drug-interaction alerts, and automated reorder triggers.',
        order_index: 3,
      },
      {
        icon: 'CreditCard',
        title: 'Billing & Insurance',
        description:
          'Multi-payer billing, insurance claim submission, co-pay collection, and revenue cycle reporting.',
        order_index: 4,
      },
      {
        icon: 'BarChart3',
        title: 'Analytics Dashboard',
        description:
          'Live KPIs — bed occupancy, revenue, appointment trends — in a single executive view.',
        order_index: 5,
      },
      {
        icon: 'Shield',
        title: 'Role-Based Access',
        description:
          'Granular permissions per department with full audit logs for compliance and accreditation.',
        order_index: 6,
      },
    ],
    pricing: [
      {
        name: 'Clinic',
        price: 'PKR 15,000',
        period: 'month',
        features: [
          'Up to 10 users',
          'OPD & Appointments',
          'Basic Billing',
          'Patient Registry',
          'Email Support',
        ],
        is_featured: false,
        order_index: 1,
      },
      {
        name: 'Hospital',
        price: 'PKR 45,000',
        period: 'month',
        features: [
          'Unlimited users',
          'Full OPD + IPD',
          'Lab & Pharmacy',
          'Insurance Billing',
          'Analytics Dashboard',
          'Priority Support',
        ],
        is_featured: true,
        order_index: 2,
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        features: [
          'Multi-branch support',
          'Custom integrations',
          'Dedicated account manager',
          'On-site training',
          'SLA guarantee',
        ],
        is_featured: false,
        order_index: 3,
      },
    ],
  },
  {
    id: 'health-ehr',
    title: 'Clinic EHR',
    description:
      'Lightweight electronic health records for solo practitioners and small clinics — fast, compliant, and paperless.',
    category: 'healthcare',
    icon: 'Stethoscope',
    link_type: 'internal',
    link_url: '/services/clinic-ehr',
    slug: 'clinic-ehr',
    order_index: 6,
    is_active: true,
    page_hero_title: 'Your Practice, Fully Digital',
    page_hero_subtitle:
      'Clinic EHR replaces paper charts with a clean, fast interface designed for busy doctors.',
    features: [
      {
        icon: 'FileText',
        title: 'SOAP Notes',
        description:
          'Structured clinical notes with templates, voice-to-text, and auto-save on every keystroke.',
        order_index: 1,
      },
      {
        icon: 'Calendar',
        title: 'Smart Scheduling',
        description:
          'Online booking, SMS/WhatsApp reminders, and automatic waitlist management.',
        order_index: 2,
      },
      {
        icon: 'Activity',
        title: 'Vitals & History',
        description:
          'Visual timeline of vitals, diagnoses, and prescriptions for every patient visit.',
        order_index: 3,
      },
      {
        icon: 'Printer',
        title: 'Prescription Pad',
        description:
          'Digital prescriptions with drug database, dosage suggestions, and one-click print.',
        order_index: 4,
      },
    ],
    pricing: [
      {
        name: 'Solo',
        price: 'PKR 5,000',
        period: 'month',
        features: [
          '1 Practitioner',
          'Up to 500 patients',
          'SOAP Notes',
          'Appointments',
          'Prescriptions',
        ],
        is_featured: false,
        order_index: 1,
      },
      {
        name: 'Group Practice',
        price: 'PKR 12,000',
        period: 'month',
        features: [
          'Up to 5 Practitioners',
          'Unlimited patients',
          'All Solo features',
          'Lab integration',
          'WhatsApp reminders',
          'Priority Support',
        ],
        is_featured: true,
        order_index: 2,
      },
    ],
  },

  // ── Individual ────────────────────────────────────────────────────────────
  {
    id: 'ind-websites',
    title: 'Website Development',
    description:
      'Custom websites and web apps — from landing pages to complex portals — built with modern frameworks and SEO best practices.',
    category: 'individual',
    icon: 'Globe',
    link_type: 'internal',
    link_url: '/services/website-development',
    slug: 'website-development',
    order_index: 7,
    is_active: true,
    page_hero_title: 'Websites Engineered by Psychology, Crafted by Design',
    page_hero_subtitle:
      'We build brand-first websites rooted in colour science, cognitive psychology, and conversion architecture — every design decision has a reason behind it.',
    features: [
      {
        icon: 'Palette',
        title: 'Custom Design',
        description:
          'Bespoke UI/UX crafted to reflect your brand identity — no templates, no compromises.',
        order_index: 1,
      },
      {
        icon: 'Zap',
        title: 'Lightning Fast',
        description:
          'Next.js and edge-optimised delivery for sub-second load times globally.',
        order_index: 2,
      },
      {
        icon: 'Search',
        title: 'SEO Ready',
        description:
          'Structured data, sitemap, Core Web Vitals optimisation, and meta strategy baked in.',
        order_index: 3,
      },
      {
        icon: 'Smartphone',
        title: 'Fully Responsive',
        description:
          'Pixel-perfect across all screen sizes from mobile to 4K displays.',
        order_index: 4,
      },
      {
        icon: 'ShieldCheck',
        title: 'Secure & Maintained',
        description:
          'SSL, security headers, monthly dependency updates, and uptime monitoring included.',
        order_index: 5,
      },
      {
        icon: 'BarChart2',
        title: 'Analytics & CRO',
        description:
          'Integrated analytics, heatmaps, and A/B testing to keep improving conversion rates.',
        order_index: 6,
      },
    ],
    pricing: [
      {
        name: 'Starter',
        price: 'PKR 80,000',
        period: 'one-time',
        features: [
          'Up to 5 pages',
          'Mobile responsive',
          'Contact form',
          'Basic SEO',
          '1 month support',
        ],
        is_featured: false,
        order_index: 1,
      },
      {
        name: 'Business',
        price: 'PKR 200,000',
        period: 'one-time',
        features: [
          'Up to 20 pages',
          'CMS integration',
          'Advanced SEO',
          'Analytics setup',
          'WhatsApp chat widget',
          '3 months support',
        ],
        is_featured: true,
        order_index: 2,
      },
      {
        name: 'Custom',
        price: 'Get a Quote',
        period: '',
        features: [
          'Unlimited pages',
          'Custom integrations',
          'E-commerce / portals',
          'Dedicated team',
          '12 months support',
        ],
        is_featured: false,
        order_index: 3,
      },
    ],
  },
  {
    id: 'ind-portals',
    title: 'Client Portals',
    description:
      'Secure, branded portals giving your clients real-time visibility into projects, invoices, and communications.',
    category: 'individual',
    icon: 'LayoutDashboard',
    link_type: 'internal',
    link_url: '/services/client-portals',
    slug: 'client-portals',
    order_index: 8,
    is_active: true,
    page_hero_title: 'Give Clients a Front-Row Seat',
    page_hero_subtitle:
      'Replace scattered emails and spreadsheets with a single branded portal your clients will love.',
    features: [
      {
        icon: 'FolderOpen',
        title: 'Document Vault',
        description:
          'Secure file sharing with version control, e-signature, and expiry date management.',
        order_index: 1,
      },
      {
        icon: 'CheckSquare',
        title: 'Project Tracker',
        description:
          'Live milestone boards with progress percentages and automatic status notifications.',
        order_index: 2,
      },
      {
        icon: 'Receipt',
        title: 'Invoice & Payments',
        description:
          'Send invoices, accept online payments, and manage receipts all within the portal.',
        order_index: 3,
      },
      {
        icon: 'MessageSquare',
        title: 'Messaging',
        description:
          'Threaded, topic-based messaging that keeps all conversations contextual and searchable.',
        order_index: 4,
      },
    ],
    pricing: [
      {
        name: 'Starter',
        price: 'PKR 25,000',
        period: 'month',
        features: [
          'Up to 10 clients',
          'File sharing',
          'Project tracker',
          'Basic invoicing',
        ],
        is_featured: false,
        order_index: 1,
      },
      {
        name: 'Growth',
        price: 'PKR 55,000',
        period: 'month',
        features: [
          'Unlimited clients',
          'Custom branding',
          'Online payments',
          'Messaging',
          'API access',
          'Priority support',
        ],
        is_featured: true,
        order_index: 2,
      },
    ],
  },
  {
    id: 'ind-crm',
    title: 'CRM Systems',
    description:
      'Purpose-built CRM to track leads, manage relationships, and close deals — tailored to your sales process.',
    category: 'individual',
    icon: 'Users2',
    link_type: 'internal',
    link_url: '/services/crm-systems',
    slug: 'crm-systems',
    order_index: 9,
    is_active: true,
    page_hero_title: 'Close More Deals, Lose Fewer Leads',
    page_hero_subtitle:
      'A CRM built around how you actually sell — flexible pipelines, smart follow-ups, and real insights.',
    features: [
      {
        icon: 'Kanban',
        title: 'Visual Pipeline',
        description:
          'Drag-and-drop Kanban boards that mirror your exact sales stages.',
        order_index: 1,
      },
      {
        icon: 'Bell',
        title: 'Smart Follow-ups',
        description:
          'Automated reminders via WhatsApp or email so no lead ever goes cold.',
        order_index: 2,
      },
      {
        icon: 'TrendingUp',
        title: 'Revenue Forecasting',
        description:
          'Predict monthly revenue with deal-weighted forecasts and trend analysis.',
        order_index: 3,
      },
      {
        icon: 'Link',
        title: 'Integrations',
        description:
          'Connect with WhatsApp Business, Google Workspace, and your existing tools via API.',
        order_index: 4,
      },
    ],
    pricing: [
      {
        name: 'Solo',
        price: 'PKR 8,000',
        period: 'month',
        features: ['1 user', '500 contacts', 'Pipeline board', 'Basic reports'],
        is_featured: false,
        order_index: 1,
      },
      {
        name: 'Team',
        price: 'PKR 22,000',
        period: 'month',
        features: [
          'Up to 10 users',
          'Unlimited contacts',
          'Automations',
          'Forecasting',
          'WhatsApp integration',
          'Priority support',
        ],
        is_featured: true,
        order_index: 2,
      },
    ],
  },
  {
    id: 'ind-marketing',
    title: 'Digital Marketing',
    description:
      'Data-driven marketing campaigns — SEO, social media, paid ads, and content — managed end to end by our team.',
    category: 'individual',
    icon: 'TrendingUp',
    link_type: 'internal',
    link_url: '/services/digital-marketing',
    slug: 'digital-marketing',
    order_index: 10,
    is_active: true,
    page_hero_title: 'Growth You Can Measure',
    page_hero_subtitle:
      'We run performance-focused marketing campaigns that bring real customers, not just clicks.',
    features: [
      {
        icon: 'Search',
        title: 'SEO & Content',
        description:
          'Keyword research, on-page optimisation, and content calendars that rank and convert.',
        order_index: 1,
      },
      {
        icon: 'Share2',
        title: 'Social Media',
        description:
          'Strategy, design, scheduling, and community management across all major platforms.',
        order_index: 2,
      },
      {
        icon: 'Target',
        title: 'Paid Ads',
        description:
          'Google Ads and Meta campaigns optimised for lowest cost per acquisition.',
        order_index: 3,
      },
      {
        icon: 'Mail',
        title: 'Email Marketing',
        description:
          'Automated drip campaigns, newsletters, and transactional emails with A/B testing.',
        order_index: 4,
      },
    ],
    pricing: [
      {
        name: 'Essentials',
        price: 'PKR 30,000',
        period: 'month',
        features: [
          'SEO audit & fixes',
          '8 social posts/month',
          'Monthly report',
          'Email support',
        ],
        is_featured: false,
        order_index: 1,
      },
      {
        name: 'Growth',
        price: 'PKR 75,000',
        period: 'month',
        features: [
          'Full SEO management',
          '20 social posts/month',
          'Google & Meta Ads',
          'Email campaigns',
          'Weekly reporting',
          'Dedicated strategist',
        ],
        is_featured: true,
        order_index: 2,
      },
    ],
  },

  // ── Creative ──────────────────────────────────────────────────────────────
  {
    id: 'creative-studio',
    title: 'Creative Studio',
    description:
      'Brand identity, graphic design, and creative direction — built to make your business unforgettable.',
    category: 'creative',
    icon: 'Brush',
    link_type: 'external',
    link_url: 'https://creative.cubico.tech',
    order_index: 11,
    is_active: true,
  },
  {
    id: 'creative-video',
    title: 'Video Production',
    description:
      'Corporate films, product demos, social reels, and motion graphics produced to broadcast quality.',
    category: 'creative',
    icon: 'Video',
    link_type: 'internal',
    link_url: '/services/video-production',
    slug: 'video-production',
    order_index: 12,
    is_active: true,
    page_hero_title: 'Stories Worth Watching',
    page_hero_subtitle:
      'From concept to final cut, we produce video content that captures attention and drives action.',
    features: [
      {
        icon: 'Film',
        title: 'Corporate Films',
        description:
          'Brand documentaries and company profiles that build trust and credibility.',
        order_index: 1,
      },
      {
        icon: 'Smartphone',
        title: 'Social Reels',
        description:
          'Short-form vertical content engineered for maximum reach on Instagram and TikTok.',
        order_index: 2,
      },
      {
        icon: 'MonitorPlay',
        title: 'Product Demos',
        description:
          'Explainer videos and product showcases that turn viewers into customers.',
        order_index: 3,
      },
      {
        icon: 'Sparkles',
        title: 'Motion Graphics',
        description:
          'Animated infographics, logo animations, and 2D/3D motion for ads and presentations.',
        order_index: 4,
      },
    ],
    pricing: [
      {
        name: 'Reel',
        price: 'PKR 35,000',
        period: 'per video',
        features: [
          'Up to 60 seconds',
          'Script & storyboard',
          'Professional shoot',
          '2 revisions',
        ],
        is_featured: false,
        order_index: 1,
      },
      {
        name: 'Corporate Film',
        price: 'PKR 120,000',
        period: 'per video',
        features: [
          'Up to 5 minutes',
          'Full production crew',
          'Professional voiceover',
          'Motion graphics',
          'Colour grading',
          '3 revisions',
        ],
        is_featured: true,
        order_index: 2,
      },
    ],
  },
];
