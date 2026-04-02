import { supabase } from './supabase';
import type { MediaAsset } from './media';

const BUCKET = 'media';

// ── Read ─────────────────────────────────────────────────────────────────────

export async function getMediaAssets(): Promise<Record<string, MediaAsset>> {
  if (!supabase) return {};

  const { data, error } = await supabase
    .from('media_assets')
    .select('*');

  if (error || !data) return {};

  const map: Record<string, MediaAsset> = {};
  for (const row of data) {
    map[row.slot_key] = row as MediaAsset;
  }
  return map;
}

export async function getMediaAsset(slotKey: string): Promise<MediaAsset | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .eq('slot_key', slotKey)
    .single();

  if (error || !data) return null;
  return data as MediaAsset;
}

// ── Upload ───────────────────────────────────────────────────────────────────

export async function uploadMediaAsset(
  slotKey: string,
  file: File
): Promise<MediaAsset | null> {
  if (!supabase) return null;

  const ext = file.name.split('.').pop() ?? 'bin';
  const storagePath = `${slotKey}.${ext}`;

  // Upload to Supabase Storage (overwrite existing)
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { upsert: true, cacheControl: '3600' });

  if (uploadError) {
    console.error('Upload failed:', uploadError);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  const publicUrl = urlData.publicUrl;

  // Upsert into media_assets table
  const { data, error } = await supabase
    .from('media_assets')
    .upsert(
      {
        slot_key: slotKey,
        url: publicUrl,
        file_name: file.name,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slot_key' }
    )
    .select()
    .single();

  if (error || !data) return null;
  return data as MediaAsset;
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteMediaAsset(slotKey: string): Promise<boolean> {
  if (!supabase) return false;

  // Get current asset to know file path
  const asset = await getMediaAsset(slotKey);
  if (!asset) return false;

  // Delete from storage
  const ext = asset.file_name.split('.').pop() ?? 'bin';
  const storagePath = `${slotKey}.${ext}`;
  await supabase.storage.from(BUCKET).remove([storagePath]);

  // Delete from table
  const { error } = await supabase
    .from('media_assets')
    .delete()
    .eq('slot_key', slotKey);

  return !error;
}
