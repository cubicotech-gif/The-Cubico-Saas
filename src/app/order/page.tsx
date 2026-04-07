'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Loader2,
  Globe,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import { TEMPLATES, type Template } from '@/data/templates';
import TemplateThumb from '@/components/TemplateThumb';

const STORAGE_KEY = 'cubico_order_draft';

export default function OrderPage() {
  return (
    <Suspense>
      <OrderFlow />
    </Suspense>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MULTI-STEP ORDER FLOW
   No auth wall — visitor fills everything freely.
   Auth only required at final submit.
   ═══════════════════════════════════════════════════════════════════ */

interface FormData {
  templateKey: string;
  // Screen 1 — Business Basics
  businessName: string;
  businessIndustry: string;
  businessDescription: string;
  // Screen 2 — Assets
  colorPreferences: string;
  letTeamDecideColors: boolean;
  referenceUrls: string;
  // Screen 3 — Contact
  whatsapp: string;
  contactEmail: string;
  preferredLanguage: string;
  // Screen 4 — Plan
  planName: string;
}

const defaultForm: FormData = {
  templateKey: '',
  businessName: '',
  businessIndustry: '',
  businessDescription: '',
  colorPreferences: '',
  letTeamDecideColors: false,
  referenceUrls: '',
  whatsapp: '',
  contactEmail: '',
  preferredLanguage: 'English',
  planName: '',
};

const PLANS = [
  {
    name: 'Starter',
    subtitle: 'You bring domain & hosting',
    tagline: 'No monthly fees',
    bullets: ['Up to 4 pages', 'Mobile responsive', 'Contact form', '3 mo. free adjustments'],
    featured: false,
  },
  {
    name: 'Growth',
    subtitle: 'We handle hosting',
    tagline: 'Most Popular',
    bullets: ['Up to 4 pages', 'Brand-aligned design', 'Managed hosting + SSL', 'WhatsApp widget'],
    featured: true,
  },
  {
    name: 'Professional',
    subtitle: 'We handle domain + hosting',
    tagline: 'Full Service',
    bullets: ['Domain + hosting included', 'Advanced SEO', 'Continuous support', 'Monthly reports'],
    featured: false,
  },
];

function OrderFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template') || '';
  const planParam = searchParams.get('plan') || '';
  const returnedFromAuth = searchParams.get('authed') === '1';

  const supabase = createClient();

  // Try restoring form from localStorage (for post-auth return)
  const restoredData = typeof window !== 'undefined'
    ? (() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          return saved ? (JSON.parse(saved) as FormData) : null;
        } catch { return null; }
      })()
    : null;

  const initialTemplate = restoredData?.templateKey || templateParam;
  const initialPlan = restoredData?.planName || planParam;

  // Steps: 0 = template, 1 = business, 2 = assets, 3 = contact, 4 = plan, 5 = review
  const [step, setStep] = useState(() => {
    if (returnedFromAuth && restoredData) return 5; // jump to review after auth
    if (initialTemplate) return 1;
    return 0;
  });

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    TEMPLATES.find((t) => t.key === initialTemplate) || null,
  );

  // Form state
  const [form, setForm] = useState<FormData>(() => ({
    ...defaultForm,
    ...(restoredData || {}),
    templateKey: initialTemplate || restoredData?.templateKey || '',
    planName: initialPlan || restoredData?.planName || '',
  }));
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        // If returned from auth with saved data, auto-submit
        if (returnedFromAuth && restoredData) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    });
  }, []);

  // Clean up localStorage on successful submit
  const clearDraft = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const updateForm = (updates: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const selectTemplate = (t: Template) => {
    setSelectedTemplate(t);
    updateForm({ templateKey: t.key });
    setStep(1);
  };

  const saveDraftToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  // Validate per screen
  const canProceedStep1 = form.businessName.trim().length > 0;
  const canProceedStep3 = form.whatsapp.trim().length > 0 || form.contactEmail.trim().length > 0;
  const canProceedStep4 = form.planName.trim().length > 0;

  const handleSubmitAttempt = async () => {
    if (!user) {
      // Save form to localStorage, show auth popup
      saveDraftToStorage();
      setShowAuthPopup(true);
      return;
    }
    await submitOrder();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: { full_name: authName, phone: form.whatsapp },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;

        // If email confirmation is required
        if (data.user && !data.session) {
          setAuthSuccess('Check your email to confirm, then come back and log in.');
          setAuthMode('login');
          setAuthLoading(false);
          return;
        }

        // Auto-confirmed (e.g. in dev mode)
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || '' });
          setShowAuthPopup(false);
          // Submit immediately
          await submitOrderWithUser(data.user.id);
          return;
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (signInError) throw signInError;
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || '' });
          setShowAuthPopup(false);
          await submitOrderWithUser(data.user.id);
          return;
        }
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setAuthLoading(false);
    }
  };

  const submitOrderWithUser = async (userId: string) => {
    setLoading(true);
    setError('');
    try {
      // Verify we actually have a valid session before inserting
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Your session has expired. Please log in again.');
      }

      // Ensure profile exists (the signup trigger may have failed)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            full_name: session.user.user_metadata?.full_name || '',
            phone: session.user.user_metadata?.phone || '',
          }, { onConflict: 'id' });
        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error('Could not create your profile. Please try again.');
        }
      }

      // Upload logo if provided
      let logoUrl = '';
      if (logoFile) {
        const ext = logoFile.name.split('.').pop();
        const path = `${userId}/${Date.now()}-logo.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('order-assets')
          .upload(path, logoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('order-assets')
          .getPublicUrl(path);
        logoUrl = urlData.publicUrl;
      }

      // Use .select() to verify the row was actually created
      const { data: inserted, error: insertError } = await supabase
        .from('orders')
        .insert({
          customer_id: userId,
          template_key: form.templateKey,
          business_name: form.businessName.trim(),
          business_industry: form.businessIndustry.trim(),
          business_description: form.businessDescription.trim(),
          content_notes: form.referenceUrls.trim(),
          color_preferences: form.letTeamDecideColors
            ? 'Let the team decide'
            : form.colorPreferences.trim(),
          domain_info: '',
          extra_notes: `Plan: ${form.planName}. Language: ${form.preferredLanguage}. WhatsApp: ${form.whatsapp}. Email: ${form.contactEmail}`,
          logo_url: logoUrl,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Order insert error:', insertError);
        throw new Error(insertError.message || 'Failed to create order');
      }

      if (!inserted) {
        throw new Error('Order was not created. This may be a permissions issue — please contact support.');
      }

      console.log('Order created successfully:', inserted.id);
      clearDraft();
      window.location.href = '/dashboard?new_order=true';
    } catch (err: unknown) {
      console.error('Order submission failed:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const submitOrder = async () => {
    if (!user) return;
    await submitOrderWithUser(user.id);
  };

  const stepLabels = ['Template', 'Business', 'Assets', 'Contact', 'Plan', 'Review'];

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0F1D32]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link
            href="/services/website-development"
            className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-white transition-colors font-body"
          >
            <ArrowLeft size={14} />
            Back to Templates
          </Link>
          <Link href="/" className="font-display font-bold text-white text-lg">
            Cubico
          </Link>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-[#0F1D32] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex items-center gap-2">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-body font-medium transition-all ${
                      step > i
                        ? 'bg-[#FF6B4A] text-white'
                        : step === i
                          ? 'bg-[#FF6B4A]/20 text-[#FF6B4A] border border-[#FF6B4A]/40'
                          : 'bg-white/5 text-surface-600'
                    }`}
                  >
                    {step > i ? <Check size={12} /> : i + 1}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-body hidden sm:inline ${
                      step >= i ? 'text-white' : 'text-surface-600'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className="flex-1 h-px bg-white/5">
                    <div
                      className="h-full bg-[#FF6B4A] transition-all duration-500"
                      style={{ width: step > i ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* ── STEP 0: Pick Template ── */}
          {step === 0 && (
            <StepWrapper key="step0">
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Choose Your Template
              </h1>
              <p className="text-surface-500 font-body text-sm mb-8">
                Pick the one closest to your industry. We&apos;ll customize everything.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => selectTemplate(t)}
                    className={`group text-left rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 ${
                      selectedTemplate?.key === t.key
                        ? 'border-[#FF6B4A] shadow-lg shadow-[#FF6B4A]/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <TemplateThumb template={t} className="absolute inset-0" />
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[9px] font-body font-medium uppercase tracking-wider mb-1"
                          style={{ backgroundColor: t.color + '30', color: t.color }}
                        >
                          {t.industry}
                        </span>
                        <h3 className="font-display font-bold text-white text-base drop-shadow-lg">
                          {t.name}
                        </h3>
                      </div>
                    </div>
                    <div className="p-3 bg-[#0F1D32]">
                      <p className="text-[11px] text-surface-400 font-body">{t.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {/* ── STEP 1: Business Basics ── */}
          {step === 1 && (
            <StepWrapper key="step1">
              <TemplateBadge template={selectedTemplate} onChangeStep={() => setStep(0)} />

              <h1 className="text-2xl font-display font-bold text-white mb-2">
                About Your Business
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                Just the basics — we&apos;ll figure out the rest together.
              </p>

              {error && <ErrorBanner message={error} />}

              <div className="space-y-5">
                <Field label="Business Name" required>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => updateForm({ businessName: e.target.value })}
                    placeholder="e.g. Ali's Restaurant, MedCare Clinic"
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field label="Industry / Type">
                  <input
                    type="text"
                    value={form.businessIndustry}
                    onChange={(e) => updateForm({ businessIndustry: e.target.value })}
                    placeholder="e.g. Restaurant, Clinic, School, Agency"
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field label="What does your business do? (2-3 sentences max)">
                  <textarea
                    value={form.businessDescription}
                    onChange={(e) => updateForm({ businessDescription: e.target.value })}
                    rows={3}
                    placeholder="A brief description of your business..."
                    className={INPUT_CLASS + ' resize-none'}
                  />
                </Field>
              </div>

              <StepActions
                onBack={() => setStep(0)}
                onNext={() => { setError(''); setStep(2); }}
                nextDisabled={!canProceedStep1}
                nextLabel="Next: Assets"
              />
            </StepWrapper>
          )}

          {/* ── STEP 2: Assets ── */}
          {step === 2 && (
            <StepWrapper key="step2">
              <TemplateBadge template={selectedTemplate} onChangeStep={() => setStep(0)} />

              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Assets & Preferences
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                All optional — skip what you don&apos;t have.
              </p>

              <div className="space-y-5">
                <Field label="Logo (optional)">
                  <label className="flex items-center gap-3 px-3 py-3 bg-surface-950 border border-white/10 border-dashed rounded-lg cursor-pointer hover:border-[#FF6B4A]/30 transition-colors">
                    <Upload size={16} className="text-surface-500" />
                    <span className="text-xs text-surface-400 font-body">
                      {logoFile ? logoFile.name : 'Upload your logo (PNG, SVG, JPG)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </Field>

                <Field label="Preferred Colors">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.letTeamDecideColors}
                        onChange={(e) => updateForm({ letTeamDecideColors: e.target.checked })}
                        className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-[#FF6B4A] focus:ring-[#FF6B4A] focus:ring-offset-0"
                      />
                      <span className="text-xs text-surface-400 font-body">
                        Let our team decide the best colors
                      </span>
                    </label>
                    {!form.letTeamDecideColors && (
                      <input
                        type="text"
                        value={form.colorPreferences}
                        onChange={(e) => updateForm({ colorPreferences: e.target.value })}
                        placeholder="e.g. Blue and white, match my logo, earthy tones"
                        className={INPUT_CLASS}
                      />
                    )}
                  </div>
                </Field>

                <Field label="Reference websites you like (optional)">
                  <textarea
                    value={form.referenceUrls}
                    onChange={(e) => updateForm({ referenceUrls: e.target.value })}
                    rows={2}
                    placeholder="Paste any website URLs you like the design of..."
                    className={INPUT_CLASS + ' resize-none'}
                  />
                </Field>
              </div>

              <StepActions
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                nextLabel="Next: Contact"
              />
            </StepWrapper>
          )}

          {/* ── STEP 3: Contact Preference ── */}
          {step === 3 && (
            <StepWrapper key="step3">
              <TemplateBadge template={selectedTemplate} onChangeStep={() => setStep(0)} />

              <h1 className="text-2xl font-display font-bold text-white mb-2">
                How Can We Reach You?
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                We need at least one way to contact you.
              </p>

              <div className="space-y-5">
                <Field label="WhatsApp Number" required>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => updateForm({ whatsapp: e.target.value })}
                    placeholder="+92 300 1234567"
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => updateForm({ contactEmail: e.target.value })}
                    placeholder="you@example.com"
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field label="Preferred Language">
                  <div className="flex gap-2">
                    {['English', 'Urdu', 'Arabic'].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => updateForm({ preferredLanguage: lang })}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-body font-medium border transition-all ${
                          form.preferredLanguage === lang
                            ? 'border-[#FF6B4A]/50 bg-[#FF6B4A]/10 text-[#FF6B4A]'
                            : 'border-white/10 text-surface-400 hover:border-white/20'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <StepActions
                onBack={() => setStep(2)}
                onNext={() => { setError(''); setStep(4); }}
                nextDisabled={!canProceedStep3}
                nextLabel="Next: Plan"
              />
            </StepWrapper>
          )}

          {/* ── STEP 4: Pick Plan ── */}
          {step === 4 && (
            <StepWrapper key="step4">
              <TemplateBadge template={selectedTemplate} onChangeStep={() => setStep(0)} />

              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Pick Your Plan
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                Choose what fits — you can upgrade anytime later.
              </p>

              <div className="grid sm:grid-cols-3 gap-3">
                {PLANS.map((p) => {
                  const selected = form.planName === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => updateForm({ planName: p.name })}
                      className={`relative text-left p-4 rounded-xl border transition-all ${
                        selected
                          ? 'border-[#FF6B4A] bg-[#FF6B4A]/5 shadow-lg shadow-[#FF6B4A]/10'
                          : 'border-white/10 bg-[#0F1D32] hover:border-white/20'
                      }`}
                    >
                      {p.featured && (
                        <span className="absolute -top-2 left-3 px-2 py-0.5 bg-[#FF6B4A] text-white text-[9px] font-body font-semibold rounded-full uppercase tracking-wider">
                          {p.tagline}
                        </span>
                      )}
                      <p className="font-display font-bold text-white text-base mb-1">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-surface-500 font-body mb-3">
                        {p.subtitle}
                      </p>
                      <ul className="space-y-1">
                        {p.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-1.5 text-[11px] text-surface-300 font-body"
                          >
                            <Check size={11} className="text-[#FF6B4A] mt-0.5 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                      {selected && (
                        <div className="mt-3 flex items-center gap-1 text-[10px] text-[#FF6B4A] font-body font-semibold">
                          <Check size={11} />
                          Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <StepActions
                onBack={() => setStep(3)}
                onNext={() => { setError(''); setStep(5); }}
                nextDisabled={!canProceedStep4}
                nextLabel="Review Order"
              />
            </StepWrapper>
          )}

          {/* ── STEP 5: Review & Submit ── */}
          {step === 5 && selectedTemplate && (
            <StepWrapper key="step5">
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Review Your Order
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                Make sure everything looks good. You can chat with your developer later to change anything.
              </p>

              {error && <ErrorBanner message={error} />}

              <div className="space-y-4">
                {/* Template */}
                <ReviewCard title="Template">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-9 rounded" style={{ background: selectedTemplate.gradient }} />
                    <div>
                      <p className="text-white font-body font-medium text-sm">{selectedTemplate.name}</p>
                      <p className="text-xs text-surface-500 font-body">{selectedTemplate.industry}</p>
                    </div>
                  </div>
                </ReviewCard>

                {/* Business */}
                <ReviewCard title="Business">
                  <Row label="Name" value={form.businessName} />
                  {form.businessIndustry && <Row label="Industry" value={form.businessIndustry} />}
                  {form.businessDescription && <Row label="Description" value={form.businessDescription} />}
                </ReviewCard>

                {/* Assets */}
                <ReviewCard title="Assets & Preferences">
                  {logoFile && <Row label="Logo" value={logoFile.name} />}
                  <Row
                    label="Colors"
                    value={form.letTeamDecideColors ? 'Team decides' : (form.colorPreferences || 'Not specified')}
                  />
                  {form.referenceUrls && <Row label="References" value={form.referenceUrls} />}
                </ReviewCard>

                {/* Contact */}
                <ReviewCard title="Contact">
                  {form.whatsapp && <Row label="WhatsApp" value={form.whatsapp} />}
                  {form.contactEmail && <Row label="Email" value={form.contactEmail} />}
                  <Row label="Language" value={form.preferredLanguage} />
                </ReviewCard>

                {/* Plan */}
                <ReviewCard title="Plan">
                  <Row label="Selected" value={form.planName || 'Not picked'} />
                </ReviewCard>

                {/* What happens next */}
                <div className="p-4 rounded-xl border border-[#FF6B4A]/20 bg-[#FF6B4A]/5">
                  <p className="text-sm font-display font-semibold text-white mb-2">
                    What happens next?
                  </p>
                  <ul className="space-y-1.5 text-xs text-surface-400 font-body">
                    {[
                      'A developer is assigned to your project immediately',
                      "You'll get a live preview link within hours",
                      'Chat with your developer anytime from your dashboard',
                      "Pay only when you're happy — full ownership, no lock-in",
                    ].map((text) => (
                      <li key={text} className="flex items-start gap-2">
                        <Check size={12} className="text-[#FF6B4A] mt-0.5 flex-shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-surface-400 hover:text-white font-body transition-colors"
                >
                  <ArrowLeft size={14} />
                  Edit Details
                </button>
                <button
                  onClick={handleSubmitAttempt}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-50 text-white font-display font-semibold text-base rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FF6B4A]/25"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Order
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>
      </div>

      {/* ── AUTH POPUP (only shows when submitting without auth) ── */}
      <AnimatePresence>
        {showAuthPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAuthPopup(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0F1D32] p-6 relative"
            >
              <button
                onClick={() => setShowAuthPopup(false)}
                className="absolute top-4 right-4 text-surface-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <h2 className="text-lg font-display font-bold text-white mb-1">
                {authMode === 'signup' ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-xs text-surface-500 font-body mb-5">
                Quick account to track your order and chat with your developer.
              </p>

              {/* Auth tabs */}
              <div className="flex mb-5 bg-surface-950 rounded-lg p-1">
                <button
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                  className={`flex-1 py-2 text-xs font-body font-medium rounded-md transition-all ${
                    authMode === 'login' ? 'bg-[#FF6B4A] text-white' : 'text-surface-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(''); }}
                  className={`flex-1 py-2 text-xs font-body font-medium rounded-md transition-all ${
                    authMode === 'signup' ? 'bg-[#FF6B4A] text-white' : 'text-surface-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {authError && <ErrorBanner message={authError} />}
              {authSuccess && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-body">
                  {authSuccess}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'signup' && (
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Full Name"
                    className={INPUT_CLASS}
                  />
                )}
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className={INPUT_CLASS}
                />
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Password (min 6 chars)"
                  className={INPUT_CLASS}
                />
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-50 text-white font-body font-semibold rounded-xl transition-all text-sm"
                >
                  {authLoading
                    ? 'Please wait...'
                    : authMode === 'signup'
                      ? 'Create Account & Submit'
                      : 'Sign In & Submit'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SHARED SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════════ */

const INPUT_CLASS =
  'w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors';

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function TemplateBadge({
  template,
  onChangeStep,
}: {
  template: Template | null;
  onChangeStep: () => void;
}) {
  if (!template) return null;
  return (
    <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-[#0F1D32] border border-white/10">
      <div className="w-12 h-8 rounded" style={{ background: template.gradient }} />
      <div>
        <p className="text-xs text-surface-500 font-body">Template selected</p>
        <p className="text-sm text-white font-body font-medium">
          {template.name} — {template.industry}
        </p>
      </div>
      <button
        onClick={onChangeStep}
        className="ml-auto text-xs text-[#FF6B4A] font-body hover:underline"
      >
        Change
      </button>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-surface-400 font-body mb-1.5">
        {label}
        {required && <span className="text-[#FF6B4A] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function StepActions({
  onBack,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-surface-400 hover:text-white font-body transition-colors"
      >
        <ArrowLeft size={14} />
        Back
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-40 text-white font-body font-semibold text-sm rounded-xl transition-all"
      >
        {nextLabel}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body">
      {message}
    </div>
  );
}

function ReviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-[#0F1D32]">
      <p className="text-[10px] text-surface-500 font-body uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-surface-500 font-body flex-shrink-0">{label}</span>
      <span className="text-xs text-white font-body text-right">{value}</span>
    </div>
  );
}
