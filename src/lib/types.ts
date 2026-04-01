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
  features?: ServiceFeature[];
  pricing?: PricingTier[];
}

export interface SiteSettings {
  id?: string;
  hero_title: string;
  hero_subtitle: string;
  contact_whatsapp: string;
  contact_email: string;
  footer_text: string;
}
