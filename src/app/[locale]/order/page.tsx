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
import { useCurrency } from '@/hooks/useCurrency';
import { useLocale } from '@/i18n/LocaleProvider';

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

interface OrderPlan {
  name: string;
  subtitle: string;
  tagline: string;
  bullets: string[];
  featured: boolean;
  /** One-time development cost in PKR (base currency). */
  devCostPKR: number;
  /** Recurring monthly cost in PKR (0 for one-time-only plans). */
  monthlyPKR: number;
  /** Extra one-time fee added if e-commerce is requested. */
  ecommerceExtraPKR: number;
}

const PLANS: OrderPlan[] = [
  {
    name: 'Starter',
    subtitle: 'You bring domain & hosting',
    tagline: 'No monthly fees',
    bullets: ['Up to 4 pages', 'Mobile responsive', 'Contact form', '3 mo. free adjustments'],
    featured: false,
    devCostPKR: 12000,
    monthlyPKR: 0,
    ecommerceExtraPKR: 5000,
  },
  {
    name: 'Growth',
    subtitle: 'We handle hosting',
    tagline: 'Most Popular',
    bullets: ['Up to 4 pages', 'Brand-aligned design', 'Managed hosting + SSL', 'WhatsApp widget'],
    featured: true,
    devCostPKR: 10000,
    monthlyPKR: 1000,
    ecommerceExtraPKR: 5000,
  },
  {
    name: 'Professional',
    subtitle: 'We handle domain + hosting',
    tagline: 'Full Service',
    bullets: ['Domain + hosting included', 'Advanced SEO', 'Continuous support', 'Monthly reports'],
    featured: false,
    devCostPKR: 8000,
    monthlyPKR: 1500,
    ecommerceExtraPKR: 5000,
  },
];

function OrderFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template') || '';
  const planParam = searchParams.get('plan') || '';
  const returnedFromAuth = searchParams.get('authed') === '1';

  const supabase = createClient();
  const { format: formatPrice, loading: currencyLoading, isPakistan } = useCurrency();
  const { locale, dict } = useLocale();

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
          setAuthSuccess(dict.order.authConfirmEmail);
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
      setAuthError(err instanceof Error ? err.message : dict.order.authGenericError);
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
          extra_notes: (() => {
            const picked = PLANS.find((p) => p.name === form.planName);
            const priceLine = picked
              ? ` Price: ${formatPrice(picked.devCostPKR)} one-time${
                  picked.monthlyPKR > 0
                    ? ` + ${formatPrice(picked.monthlyPKR)}/mo`
                    : ''
                }.`
              : '';
            return `Plan: ${form.planName}.${priceLine} Language: ${form.preferredLanguage}. WhatsApp: ${form.whatsapp}. Email: ${form.contactEmail}`;
          })(),
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

  const stepLabels = [dict.order.stepTemplate, dict.order.stepBusiness, dict.order.stepAssets, dict.order.stepContact, dict.order.stepPlan, dict.order.stepReview];

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0F1D32]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link
            href={`/${locale}/services/website-development`}
            className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-white transition-colors font-body"
          >
            <ArrowLeft size={14} />
            {dict.order.backToTemplates}
          </Link>
          <Link href={`/${locale}`} className="font-display font-bold text-white text-lg">
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
                {dict.order.chooseTemplate}
              </h1>
              <p className="text-surface-500 font-body text-sm mb-8">
                {dict.order.chooseTemplateSub}
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
                {dict.order.aboutBusiness}
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                {dict.order.aboutBusinessSub}
              </p>

              {error && <ErrorBanner message={error} />}

              <div className="space-y-5">
                <Field label={dict.order.labelBusinessName} required>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => updateForm({ businessName: e.target.value })}
                    placeholder={dict.order.placeholderBusinessName}
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field label={dict.order.labelIndustry}>
                  <input
                    type="text"
                    value={form.businessIndustry}
                    onChange={(e) => updateForm({ businessIndustry: e.target.value })}
                    placeholder={dict.order.placeholderIndustry}
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field label={dict.order.labelBusinessDesc}>
                  <textarea
                    value={form.businessDescription}
                    onChange={(e) => updateForm({ businessDescription: e.target.value })}
                    rows={3}
                    placeholder={dict.order.placeholderBusinessDesc}
                    className={INPUT_CLASS + ' resize-none'}
                  />
                </Field>
              </div>

              <StepActions
                onBack={() => setStep(0)}
                onNext={() => { setError(''); setStep(2); }}
                nextDisabled={!canProceedStep1}
                nextLabel={dict.order.nextAssets}
              />
            </StepWrapper>
          )}

          {/* ── STEP 2: Assets ── */}
          {step === 2 && (
            <StepWrapper key="step2">
              <TemplateBadge template={selectedTemplate} onChangeStep={() => setStep(0)} />

              <h1 className="text-2xl font-display font-bold text-white mb-2">
                {dict.order.assetsTitle}
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                {dict.order.assetsSub}
              </p>

              <div className="space-y-5">
                <Field label={dict.order.labelLogo}>
                  <label className="flex items-center gap-3 px-3 py-3 bg-surface-950 border border-white/10 border-dashed rounded-lg cursor-pointer hover:border-[#FF6B4A]/30 transition-colors">
                    <Upload size={16} className="text-surface-500" />
                    <span className="text-xs text-surface-400 font-body">
                      {logoFile ? logoFile.name : dict.order.logoUploadText}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </Field>

                <Field label={dict.order.labelColors}>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.letTeamDecideColors}
                        onChange={(e) => updateForm({ letTeamDecideColors: e.target.checked })}
                        className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-[#FF6B4A] focus:ring-[#FF6B4A] focus:ring-offset-0"
                      />
                      <span className="text-xs text-surface-400 font-body">
                        {dict.order.letTeamDecide}
                      </span>
                    </label>
                    {!form.letTeamDecideColors && (
                      <input
                        type="text"
                        value={form.colorPreferences}
                        onChange={(e) => updateForm({ colorPreferences: e.target.value })}
                        placeholder={dict.order.placeholderColors}
                        className={INPUT_CLASS}
                      />
                    )}
                  </div>
                </Field>

                <Field label={dict.order.labelReferences}>
                  <textarea
                    value={form.referenceUrls}
                    onChange={(e) => updateForm({ referenceUrls: e.target.value })}
                    rows={2}
                    placeholder={dict.order.placeholderReferences}
                    className={INPUT_CLASS + ' resize-none'}
                  />
                </Field>
              </div>

              <StepActions
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                nextLabel={dict.order.nextContact}
              />
            </StepWrapper>
          )}

          {/* ── STEP 3: Contact Preference ── */}
          {step === 3 && (
            <StepWrapper key="step3">
              <TemplateBadge template={selectedTemplate} onChangeStep={() => setStep(0)} />

              <h1 className="text-2xl font-display font-bold text-white mb-2">
                {dict.order.contactTitle}
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                {dict.order.contactSub}
              </p>

              <div className="space-y-5">
                <Field label={dict.order.labelWhatsapp} required>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => updateForm({ whatsapp: e.target.value })}
                    placeholder={dict.order.placeholderWhatsapp}
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field label={dict.order.labelContactEmail}>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => updateForm({ contactEmail: e.target.value })}
                    placeholder={dict.order.placeholderContactEmail}
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field label={dict.order.labelLanguage}>
                  <div className="flex gap-2">
                    {([
                      { value: 'English', label: dict.order.langEnglish },
                      { value: 'Urdu', label: dict.order.langUrdu },
                      { value: 'Arabic', label: dict.order.langArabic },
                    ]).map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateForm({ preferredLanguage: value })}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-body font-medium border transition-all ${
                          form.preferredLanguage === value
                            ? 'border-[#FF6B4A]/50 bg-[#FF6B4A]/10 text-[#FF6B4A]'
                            : 'border-white/10 text-surface-400 hover:border-white/20'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <StepActions
                onBack={() => setStep(2)}
                onNext={() => { setError(''); setStep(4); }}
                nextDisabled={!canProceedStep3}
                nextLabel={dict.order.nextPlan}
              />
            </StepWrapper>
          )}

          {/* ── STEP 4: Pick Plan ── */}
          {step === 4 && (
            <StepWrapper key="step4">
              <TemplateBadge template={selectedTemplate} onChangeStep={() => setStep(0)} />

              <h1 className="text-2xl font-display font-bold text-white mb-2">
                {dict.order.pickPlanTitle}
              </h1>
              <p className="text-surface-500 font-body text-sm mb-3">
                {dict.order.pickPlanSub}
              </p>

              <div className="mb-6">
                {currencyLoading ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-surface-500 font-body">
                    <Loader2 size={11} className="animate-spin" />
                    {dict.order.detecting}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F1D32] border border-white/10 text-[11px] text-surface-400 font-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {dict.order.pricesIn.replace('{currency}', isPakistan ? 'PKR (Pakistan)' : 'USD (International)')}
                  </span>
                )}
              </div>

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

                      {/* Price block */}
                      <div className="mb-3 pb-3 border-b border-white/5">
                        <p className="text-xl font-display font-bold text-white leading-tight">
                          {formatPrice(p.devCostPKR)}
                        </p>
                        <p className="text-[10px] text-surface-500 font-body">
                          {dict.order.oneTimeDev}
                        </p>
                        {p.monthlyPKR > 0 ? (
                          <p className="mt-1.5 text-[12px] font-display font-semibold text-[#FF6B4A]">
                            + {formatPrice(p.monthlyPKR)}
                            <span className="text-surface-500 font-body font-normal">
                              {' '}{dict.order.perMonth}
                            </span>
                          </p>
                        ) : (
                          <p className="mt-1.5 text-[11px] text-green-400 font-body font-semibold">
                            {dict.order.noMonthlyFees}
                          </p>
                        )}
                        <p className="mt-1 text-[10px] text-surface-500 font-body">
                          {dict.order.ecommerceAddon.replace('{amount}', formatPrice(p.ecommerceExtraPKR))}
                        </p>
                      </div>

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
                          {dict.order.selected}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-surface-500 font-body mt-4 leading-relaxed">
                {dict.order.pricingNote}
              </p>

              <StepActions
                onBack={() => setStep(3)}
                onNext={() => { setError(''); setStep(5); }}
                nextDisabled={!canProceedStep4}
                nextLabel={dict.order.reviewOrder}
              />
            </StepWrapper>
          )}

          {/* ── STEP 5: Review & Submit ── */}
          {step === 5 && selectedTemplate && (
            <StepWrapper key="step5">
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                {dict.order.reviewTitle}
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                {dict.order.reviewSub}
              </p>

              {error && <ErrorBanner message={error} />}

              <div className="space-y-4">
                {/* Template */}
                <ReviewCard title={dict.order.reviewTemplate}>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-9 rounded" style={{ background: selectedTemplate.gradient }} />
                    <div>
                      <p className="text-white font-body font-medium text-sm">{selectedTemplate.name}</p>
                      <p className="text-xs text-surface-500 font-body">{selectedTemplate.industry}</p>
                    </div>
                  </div>
                </ReviewCard>

                {/* Business */}
                <ReviewCard title={dict.order.reviewBusiness}>
                  <Row label={dict.order.reviewName} value={form.businessName} />
                  {form.businessIndustry && <Row label={dict.order.reviewIndustry} value={form.businessIndustry} />}
                  {form.businessDescription && <Row label={dict.order.reviewDescription} value={form.businessDescription} />}
                </ReviewCard>

                {/* Assets */}
                <ReviewCard title={dict.order.reviewAssetsPrefs}>
                  {logoFile && <Row label={dict.order.reviewLogo} value={logoFile.name} />}
                  <Row
                    label={dict.order.reviewColors}
                    value={form.letTeamDecideColors ? dict.order.teamDecides : (form.colorPreferences || dict.order.notSpecified)}
                  />
                  {form.referenceUrls && <Row label={dict.order.reviewReferences} value={form.referenceUrls} />}
                </ReviewCard>

                {/* Contact */}
                <ReviewCard title={dict.order.reviewContact}>
                  {form.whatsapp && <Row label={dict.order.reviewWhatsapp} value={form.whatsapp} />}
                  {form.contactEmail && <Row label={dict.order.reviewEmail} value={form.contactEmail} />}
                  <Row label={dict.order.reviewLanguage} value={form.preferredLanguage} />
                </ReviewCard>

                {/* Plan */}
                <ReviewCard title={dict.order.reviewPlan}>
                  {(() => {
                    const picked = PLANS.find((p) => p.name === form.planName);
                    if (!picked) {
                      return <Row label={dict.order.reviewSelected} value={dict.order.notPicked} />;
                    }
                    return (
                      <>
                        <Row label={dict.order.reviewSelected} value={picked.name} />
                        <Row
                          label={dict.order.reviewDevelopment}
                          value={`${formatPrice(picked.devCostPKR)} ${dict.order.oneTime}`}
                        />
                        <Row
                          label={dict.order.reviewMonthly}
                          value={
                            picked.monthlyPKR > 0
                              ? `${formatPrice(picked.monthlyPKR)} ${dict.order.perMonth}`
                              : dict.order.noMonthly
                          }
                        />
                      </>
                    );
                  })()}
                </ReviewCard>

                {/* What happens next */}
                <div className="p-4 rounded-xl border border-[#FF6B4A]/20 bg-[#FF6B4A]/5">
                  <p className="text-sm font-display font-semibold text-white mb-2">
                    {dict.order.whatsNext}
                  </p>
                  <ul className="space-y-1.5 text-xs text-surface-400 font-body">
                    {dict.order.whatsNextItems.map((text: string) => (
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
                  {dict.order.editDetails}
                </button>
                <button
                  onClick={handleSubmitAttempt}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-50 text-white font-display font-semibold text-base rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FF6B4A]/25"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {dict.order.submitting}
                    </>
                  ) : (
                    <>
                      {dict.order.submit}
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
                {authMode === 'signup' ? dict.order.authCreateAccount : dict.order.authSignIn}
              </h2>
              <p className="text-xs text-surface-500 font-body mb-5">
                {dict.order.authSubtitle}
              </p>

              {/* Auth tabs */}
              <div className="flex mb-5 bg-surface-950 rounded-lg p-1">
                <button
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                  className={`flex-1 py-2 text-xs font-body font-medium rounded-md transition-all ${
                    authMode === 'login' ? 'bg-[#FF6B4A] text-white' : 'text-surface-400 hover:text-white'
                  }`}
                >
                  {dict.order.authTabLogIn}
                </button>
                <button
                  onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(''); }}
                  className={`flex-1 py-2 text-xs font-body font-medium rounded-md transition-all ${
                    authMode === 'signup' ? 'bg-[#FF6B4A] text-white' : 'text-surface-400 hover:text-white'
                  }`}
                >
                  {dict.order.authTabSignUp}
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
                    placeholder={dict.order.authPlaceholderName}
                    className={INPUT_CLASS}
                  />
                )}
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  placeholder={dict.order.authPlaceholderEmail}
                  className={INPUT_CLASS}
                />
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder={dict.order.authPlaceholderPassword}
                  className={INPUT_CLASS}
                />
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-50 text-white font-body font-semibold rounded-xl transition-all text-sm"
                >
                  {authLoading
                    ? dict.order.authSubmitting
                    : authMode === 'signup'
                      ? dict.order.authSubmitSignUp
                      : dict.order.authSubmitLogIn}
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
  const { dict } = useLocale();
  if (!template) return null;
  return (
    <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-[#0F1D32] border border-white/10">
      <div className="w-12 h-8 rounded" style={{ background: template.gradient }} />
      <div>
        <p className="text-xs text-surface-500 font-body">{dict.order.selected}</p>
        <p className="text-sm text-white font-body font-medium">
          {template.name} — {template.industry}
        </p>
      </div>
      <button
        onClick={onChangeStep}
        className="ml-auto text-xs text-[#FF6B4A] font-body hover:underline"
      >
        {dict.order.changeTemplate}
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
  nextLabel,
  nextDisabled = false,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  const { dict } = useLocale();
  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-surface-400 hover:text-white font-body transition-colors"
      >
        <ArrowLeft size={14} />
        {dict.order.back}
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-40 text-white font-body font-semibold text-sm rounded-xl transition-all"
      >
        {nextLabel || dict.order.next}
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
