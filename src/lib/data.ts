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
  // Merge with seed defaults so any new field added later doesn't crash the UI
  // before the migration is run.
  return { ...seedSettings, ...(data as Partial<SiteSettings>) } as SiteSettings;
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

// ── Homepage services ────────────────────────────────────────────────────────

export async function getHomeServices(): Promise<Service[]> {
  if (!supabase) {
    return seedServices
      .filter((s) => s.is_active && s.show_on_home)
      .sort((a, b) => (a.home_order ?? 0) - (b.home_order ?? 0));
  }

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .eq('show_on_home', true)
    .order('home_order', { ascending: true });

  if (error || !data) return [];
  return data as Service[];
}

// ── Per-service video upload (stored in the existing 'media' bucket) ─────────

const SERVICE_VIDEO_BUCKET = 'media';
const SERVICE_VIDEO_MAX_BYTES = 50 * 1024 * 1024; // matches the bucket file_size_limit
const SERVICE_VIDEO_ALLOWED_TYPES = ['video/mp4', 'video/webm'];

export async function uploadServiceVideo(
  serviceId: string,
  file: File
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  // Client-side validation so the user gets a clear error instead of a silent
  // storage rejection.
  if (!file.type.startsWith('video/')) {
    throw new Error('Please choose a video file.');
  }
  if (!SERVICE_VIDEO_ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only MP4 or WebM videos are allowed.');
  }
  if (file.size > SERVICE_VIDEO_MAX_BYTES) {
    const mb = Math.round(file.size / (1024 * 1024));
    throw new Error(`File is ${mb} MB — the limit is 50 MB.`);
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4';
  const path = `services/${serviceId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SERVICE_VIDEO_BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type });

  if (uploadError) {
    throw new Error(uploadError.message || 'Upload to storage failed.');
  }

  // Cache-bust so the browser picks up the replacement immediately
  const { data: urlData } = supabase.storage.from(SERVICE_VIDEO_BUCKET).getPublicUrl(path);
  const publicUrl = `${urlData.publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from('services')
    .update({ home_video_url: publicUrl, updated_at: new Date().toISOString() })
    .eq('id', serviceId);

  if (updateError) {
    throw new Error(`Saved video but failed to attach it to the service: ${updateError.message}`);
  }

  return publicUrl;
}

export async function deleteServiceVideo(
  serviceId: string,
  currentUrl: string | null | undefined
): Promise<boolean> {
  if (!supabase) return false;

  if (currentUrl) {
    // Strip the cache-busting query and any leading bucket URL prefix
    const cleaned = currentUrl.split('?')[0];
    const marker = `/${SERVICE_VIDEO_BUCKET}/`;
    const idx = cleaned.indexOf(marker);
    if (idx !== -1) {
      const path = cleaned.substring(idx + marker.length);
      await supabase.storage.from(SERVICE_VIDEO_BUCKET).remove([path]);
    }
  }

  const { error } = await supabase
    .from('services')
    .update({ home_video_url: null, updated_at: new Date().toISOString() })
    .eq('id', serviceId);

  return !error;
}
