export type ServiceCategory = 'institution' | 'healthcare' | 'individual' | 'creative';
export type LinkType = 'external' | 'internal';

export interface ServiceFeature {
  id?: string;
  icon: string;
  title: string;
  description: string;
  order_index?: number;
}

export interface PricingTier {
  id?: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  is_featured: boolean;
  order_index?: number;
}

export type HomeAccent =
  | 'brand'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'teal'
  | 'cyan'
  | 'fuchsia'
  | 'sky';

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  icon: string;
  link_type: LinkType;
  link_url: string;
  slug?: string;
  order_index: number;
  is_active: boolean;
  page_hero_title?: string;
  page_hero_subtitle?: string;
  // Homepage-specific
  home_video_url?: string | null;
  home_tagline?: string | null;
  home_accent?: HomeAccent;
  show_on_home?: boolean;
  home_order?: number;
  features?: ServiceFeature[];
  pricing?: PricingTier[];
}

export interface HomeStat {
  icon: string;
  value: string;
  label: string;
}

export interface MiniFeature {
  icon: string;
  text: string;
}

export interface SiteSettings {
  id?: string;
  // Hero
  hero_title: string;
  hero_subtitle: string;
  hero_eyebrow: string;
  hero_morph_words: string[];
  hero_cta_primary_label: string;
  hero_cta_primary_url: string;
  hero_cta_secondary_label: string;
  hero_cta_secondary_url: string;
  // Services section
  services_eyebrow: string;
  services_title: string;
  services_subtitle: string;
  // About section
  about_eyebrow: string;
  about_title: string;
  about_body: string;
  about_cta_label: string;
  about_cta_url: string;
  stats: HomeStat[];
  mini_features: MiniFeature[];
  // Footer / contact
  contact_whatsapp: string;
  contact_email: string;
  footer_text: string;
}
