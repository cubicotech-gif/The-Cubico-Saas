import { supabase } from './supabase';
import { seedServices, seedSettings } from '@/data/seeds';
import type { Service, SiteSettings } from './types';

// ── Site Settings ─────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!supabase) return seedSettings;

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error || !data) return seedSettings;
  return data as SiteSettings;
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('site_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // update all rows

  return !error;
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  if (!supabase) return seedServices.filter((s) => s.is_active);

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error || !services) return seedServices.filter((s) => s.is_active);

  // Attach features & pricing for internal services
  const internal = services.filter((s) => s.link_type === 'internal');
  if (internal.length === 0) return services as Service[];

  const ids = internal.map((s) => s.id);

  const [{ data: features }, { data: pricing }] = await Promise.all([
    supabase
      .from('service_features')
      .select('*')
      .in('service_id', ids)
      .order('order_index'),
    supabase
      .from('service_pricing')
      .select('*')
      .in('service_id', ids)
      .order('order_index'),
  ]);

  return services.map((service) => ({
    ...service,
    features: features?.filter((f) => f.service_id === service.id) ?? [],
    pricing: pricing?.filter((p) => p.service_id === service.id) ?? [],
  })) as Service[];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  // Try seed data first if no Supabase
  if (!supabase) {
    return seedServices.find((s) => s.slug === slug && s.is_active) ?? null;
  }

  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !service) {
    return seedServices.find((s) => s.slug === slug && s.is_active) ?? null;
  }

  const [{ data: features }, { data: pricing }] = await Promise.all([
    supabase
      .from('service_features')
      .select('*')
      .eq('service_id', service.id)
      .order('order_index'),
    supabase
      .from('service_pricing')
      .select('*')
      .eq('service_id', service.id)
      .order('order_index'),
  ]);

  return {
    ...service,
    features: features ?? [],
    pricing: pricing ?? [],
  } as Service;
}

export async function getAllServiceSlugs(): Promise<string[]> {
  if (!supabase) {
    return seedServices
      .filter((s) => s.link_type === 'internal' && s.slug && s.is_active)
      .map((s) => s.slug!);
  }

  const { data } = await supabase
    .from('services')
    .select('slug')
    .eq('link_type', 'internal')
    .eq('is_active', true)
    .not('slug', 'is', null);

  if (!data) {
    return seedServices
      .filter((s) => s.link_type === 'internal' && s.slug && s.is_active)
      .map((s) => s.slug!);
  }

  return data.map((s) => s.slug).filter(Boolean);
}

// ── Admin mutations ───────────────────────────────────────────────────────────

export async function createService(
  service: Omit<Service, 'id'>
): Promise<Service | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single();

  if (error || !data) return null;
  return data as Service;
}

export async function updateService(
  id: string,
  updates: Partial<Service>
): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('services')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  return !error;
}

export async function deleteService(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from('services').delete().eq('id', id);
  return !error;
}
