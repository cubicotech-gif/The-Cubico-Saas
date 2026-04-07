'use client';

import { useEffect, useState } from 'react';
import { Loader2, Check, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '@/lib/data';
import { seedSettings } from '@/data/seeds';
import type { SiteSettings, HomeStat, MiniFeature } from '@/lib/types';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function AdminSettings({ hasSupabase }: { hasSupabase: boolean }) {
  const [settings, setSettings] = useState<SiteSettings>(seedSettings);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }
    getSiteSettings()
      .then((s) => setSettings(s))
      .finally(() => setLoading(false));
  }, [hasSupabase]);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaveState('idle');
  }

  function updateStat(idx: number, field: keyof HomeStat, value: string) {
    const next = [...settings.stats];
    next[idx] = { ...next[idx], [field]: value };
    update('stats', next);
  }

  function addStat() {
    update('stats', [...settings.stats, { icon: 'Star', value: '0+', label: 'New stat' }]);
  }

  function removeStat(idx: number) {
    update('stats', settings.stats.filter((_, i) => i !== idx));
  }

  function updateFeature(idx: number, field: keyof MiniFeature, value: string) {
    const next = [...settings.mini_features];
    next[idx] = { ...next[idx], [field]: value };
    update('mini_features', next);
  }

  function addFeature() {
    update('mini_features', [...settings.mini_features, { icon: 'Star', text: 'New feature' }]);
  }

  function removeFeature(idx: number) {
    update('mini_features', settings.mini_features.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setSaveState('saving');
    setErrorMsg('');
    try {
      // Strip id/timestamps so we don't send unknown columns
      const { id: _id, ...payload } = settings;
      const ok = await updateSiteSettings(payload);
      if (!ok) {
        setSaveState('error');
        setErrorMsg('Save failed — check Supabase RLS policies for site_settings.');
        return;
      }
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    } catch (e: any) {
      setSaveState('error');
      setErrorMsg(e?.message ?? 'Unknown error');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-surface-400 text-sm font-body">
        <Loader2 size={14} className="animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-3xl">
      {/* ── Header + Save bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between sticky top-14 -mt-2 py-2 bg-surface-950 z-30">
        <h2 className="text-lg font-display font-semibold text-white">Site Settings</h2>
        <div className="flex items-center gap-3">
          {saveState === 'saved' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-body">
              <Check size={12} /> Saved
            </span>
          )}
          {saveState === 'error' && (
            <span className="flex items-center gap-1 text-xs text-rose-400 font-body">
              <AlertCircle size={12} /> {errorMsg || 'Error'}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasSupabase || saveState === 'saving'}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors font-body text-sm flex items-center gap-2"
          >
            {saveState === 'saving' ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      <Section title="Hero">
        <Field label="Eyebrow" value={settings.hero_eyebrow} onChange={(v) => update('hero_eyebrow', v)} />
        <Field
          label="Title (use {morph} as a placeholder for the cycling word)"
          value={settings.hero_title}
          onChange={(v) => update('hero_title', v)}
        />
        <div>
          <Label>Morph Words (cycle through this list)</Label>
          <div className="space-y-2">
            {settings.hero_morph_words.map((word, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={inputCls + ' flex-1'}
                  placeholder="websites"
                  value={word}
                  onChange={(e) => {
                    const next = [...settings.hero_morph_words];
                    next[i] = e.target.value;
                    update('hero_morph_words', next);
                  }}
                />
                <button
                  onClick={() =>
                    update(
                      'hero_morph_words',
                      settings.hero_morph_words.filter((_, j) => j !== i)
                    )
                  }
                  className="p-2 text-surface-500 hover:text-rose-400 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() =>
              update('hero_morph_words', [...settings.hero_morph_words, 'new word'])
            }
            className="mt-2 flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-body"
          >
            <Plus size={12} /> Add word
          </button>
        </div>
        <Field
          label="Subtitle"
          value={settings.hero_subtitle}
          onChange={(v) => update('hero_subtitle', v)}
          textarea
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label="Primary CTA Label"
            value={settings.hero_cta_primary_label}
            onChange={(v) => update('hero_cta_primary_label', v)}
          />
          <Field
            label="Primary CTA URL"
            value={settings.hero_cta_primary_url}
            onChange={(v) => update('hero_cta_primary_url', v)}
          />
          <Field
            label="Secondary CTA Label"
            value={settings.hero_cta_secondary_label}
            onChange={(v) => update('hero_cta_secondary_label', v)}
          />
          <Field
            label="Secondary CTA URL (blank = WhatsApp)"
            value={settings.hero_cta_secondary_url}
            onChange={(v) => update('hero_cta_secondary_url', v)}
          />
        </div>
      </Section>

      <Section title="Services Section">
        <Field label="Eyebrow" value={settings.services_eyebrow} onChange={(v) => update('services_eyebrow', v)} />
        <Field label="Title" value={settings.services_title} onChange={(v) => update('services_title', v)} />
        <Field
          label="Subtitle"
          value={settings.services_subtitle}
          onChange={(v) => update('services_subtitle', v)}
          textarea
        />
        <div>
          <Label>Mini Features (bottom strip)</Label>
          <div className="space-y-2">
            {settings.mini_features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={inputCls}
                  placeholder="Lucide icon"
                  value={f.icon}
                  onChange={(e) => updateFeature(i, 'icon', e.target.value)}
                />
                <input
                  className={inputCls + ' flex-1'}
                  placeholder="Text"
                  value={f.text}
                  onChange={(e) => updateFeature(i, 'text', e.target.value)}
                />
                <button
                  onClick={() => removeFeature(i)}
                  className="p-2 text-surface-500 hover:text-rose-400 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addFeature}
            className="mt-2 flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-body"
          >
            <Plus size={12} /> Add feature
          </button>
        </div>
      </Section>

      <Section title="About Section">
        <Field label="Eyebrow" value={settings.about_eyebrow} onChange={(v) => update('about_eyebrow', v)} />
        <Field label="Title" value={settings.about_title} onChange={(v) => update('about_title', v)} />
        <Field label="Body" value={settings.about_body} onChange={(v) => update('about_body', v)} textarea rows={5} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label="CTA Label"
            value={settings.about_cta_label}
            onChange={(v) => update('about_cta_label', v)}
          />
          <Field label="CTA URL" value={settings.about_cta_url} onChange={(v) => update('about_cta_url', v)} />
        </div>
        <div>
          <Label>Stats</Label>
          <div className="space-y-2">
            {settings.stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={inputCls + ' w-32'}
                  placeholder="Icon"
                  value={s.icon}
                  onChange={(e) => updateStat(i, 'icon', e.target.value)}
                />
                <input
                  className={inputCls + ' w-24'}
                  placeholder="Value"
                  value={s.value}
                  onChange={(e) => updateStat(i, 'value', e.target.value)}
                />
                <input
                  className={inputCls + ' flex-1'}
                  placeholder="Label"
                  value={s.label}
                  onChange={(e) => updateStat(i, 'label', e.target.value)}
                />
                <button
                  onClick={() => removeStat(i)}
                  className="p-2 text-surface-500 hover:text-rose-400 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addStat}
            className="mt-2 flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-body"
          >
            <Plus size={12} /> Add stat
          </button>
        </div>
      </Section>

      <Section title="Footer & Contact">
        <Field
          label="WhatsApp Number"
          value={settings.contact_whatsapp}
          onChange={(v) => update('contact_whatsapp', v)}
        />
        <Field
          label="Contact Email"
          value={settings.contact_email}
          onChange={(v) => update('contact_email', v)}
        />
        <Field
          label="Footer Text"
          value={settings.footer_text}
          onChange={(v) => update('footer_text', v)}
          textarea
        />
      </Section>
    </div>
  );
}

// ── Small primitives ─────────────────────────────────────────────────────────

const inputCls =
  'px-3 py-2 bg-surface-900 border border-surface-700 rounded-lg text-white font-body text-sm outline-none focus:border-brand-500 disabled:opacity-50';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs text-surface-500 font-body mb-1.5 uppercase tracking-widest">
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-display font-semibold text-white mb-4 pb-2 border-b border-surface-800">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {textarea ? (
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={inputCls + ' w-full resize-none'}
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls + ' w-full'}
        />
      )}
    </div>
  );
}
