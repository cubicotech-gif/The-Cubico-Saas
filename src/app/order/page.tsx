'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import { TEMPLATES, type Template } from '@/components/TemplatePreview';

export default function OrderPage() {
  return (
    <Suspense>
      <OrderFlow />
    </Suspense>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MULTI-STEP ORDER FLOW
   ═══════════════════════════════════════════════════════════════════ */

function OrderFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateKey = searchParams.get('template') || '';

  const supabase = createClient();

  // Steps: 0 = pick template, 1 = business info, 2 = review & submit
  const [step, setStep] = useState(templateKey ? 1 : 0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    TEMPLATES.find((t) => t.key === templateKey) || null,
  );

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [businessIndustry, setBusinessIndustry] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [contentNotes, setContentNotes] = useState('');
  const [colorPreferences, setColorPreferences] = useState('');
  const [domainInfo, setDomainInfo] = useState('need_new');
  const [existingDomain, setExistingDomain] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCheckingAuth(false);
    });
  }, [supabase.auth]);

  const selectTemplate = (t: Template) => {
    setSelectedTemplate(t);
    setStep(1);
  };

  const goToReview = () => {
    if (!businessName.trim()) {
      setError('Business name is required');
      return;
    }
    setError('');
    setStep(2);
  };

  const submitOrder = async () => {
    if (!selectedTemplate || !user) return;
    setLoading(true);
    setError('');

    try {
      // Upload logo if provided
      let logoUrl = '';
      if (logoFile) {
        const ext = logoFile.name.split('.').pop();
        const path = `${user.id}/${Date.now()}-logo.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('order-assets')
          .upload(path, logoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('order-assets')
          .getPublicUrl(path);
        logoUrl = urlData.publicUrl;
      }

      // Create order
      const { error: insertError } = await supabase.from('orders').insert({
        customer_id: user.id,
        template_key: selectedTemplate.key,
        business_name: businessName.trim(),
        business_industry: businessIndustry.trim(),
        business_description: businessDescription.trim(),
        content_notes: contentNotes.trim(),
        color_preferences: colorPreferences.trim(),
        domain_info:
          domainInfo === 'have_domain'
            ? `Has domain: ${existingDomain.trim()}`
            : 'Needs new domain',
        extra_notes: extraNotes.trim(),
        logo_url: logoUrl,
        status: 'pending',
      });

      if (insertError) throw insertError;

      // Redirect to dashboard
      router.push('/dashboard?new_order=true');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // If not logged in, redirect to login with return URL
  if (!checkingAuth && !user) {
    const returnUrl = `/order${templateKey ? `?template=${templateKey}` : ''}`;
    router.push(`/login?next=${encodeURIComponent(returnUrl)}`);
    return null;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-surface-500" size={24} />
      </div>
    );
  }

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
          <Link
            href="/"
            className="font-display font-bold text-white text-lg"
          >
            Cubico
          </Link>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-[#0F1D32] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex items-center gap-3">
            {['Template', 'Details', 'Review'].map((label, i) => (
              <div key={label} className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body font-medium transition-all ${
                      step > i
                        ? 'bg-[#FF6B4A] text-white'
                        : step === i
                          ? 'bg-[#FF6B4A]/20 text-[#FF6B4A] border border-[#FF6B4A]/40'
                          : 'bg-white/5 text-surface-600'
                    }`}
                  >
                    {step > i ? <Check size={14} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-body hidden sm:inline ${
                      step >= i ? 'text-white' : 'text-surface-600'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
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
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
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
                    <div
                      className="aspect-[16/10] flex items-end p-4"
                      style={{ background: t.gradient }}
                    >
                      <div>
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[9px] font-body font-medium uppercase tracking-wider mb-1"
                          style={{
                            backgroundColor: t.color + '30',
                            color: t.color,
                          }}
                        >
                          {t.industry}
                        </span>
                        <h3 className="font-display font-bold text-white text-base">
                          {t.name}
                        </h3>
                      </div>
                    </div>
                    <div className="p-3 bg-[#0F1D32]">
                      <p className="text-[11px] text-surface-400 font-body">
                        {t.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Business Info ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Selected template badge */}
              {selectedTemplate && (
                <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-[#0F1D32] border border-white/10">
                  <div
                    className="w-12 h-8 rounded"
                    style={{ background: selectedTemplate.gradient }}
                  />
                  <div>
                    <p className="text-xs text-surface-500 font-body">
                      Template selected
                    </p>
                    <p className="text-sm text-white font-body font-medium">
                      {selectedTemplate.name} — {selectedTemplate.industry}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(0)}
                    className="ml-auto text-xs text-[#FF6B4A] font-body hover:underline"
                  >
                    Change
                  </button>
                </div>
              )}

              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Tell Us About Your Business
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                We&apos;ll use this to build your website. Don&apos;t worry about
                getting it perfect — your developer will help.
              </p>

              {error && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                {/* Business Name */}
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">
                    Business Name <span className="text-[#FF6B4A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Ali's Restaurant, MedCare Clinic"
                    className="w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">
                    Industry / Type
                  </label>
                  <input
                    type="text"
                    value={businessIndustry}
                    onChange={(e) => setBusinessIndustry(e.target.value)}
                    placeholder="e.g. Restaurant, Clinic, School, Agency"
                    className="w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">
                    What does your business do? (1-2 lines)
                  </label>
                  <textarea
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    rows={2}
                    placeholder="A brief description of your business..."
                    className="w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors resize-none"
                  />
                </div>

                {/* Content notes */}
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">
                    What pages/sections do you need?
                  </label>
                  <textarea
                    value={contentNotes}
                    onChange={(e) => setContentNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g. Home, About, Services, Menu, Contact, Price list, Gallery..."
                    className="w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors resize-none"
                  />
                </div>

                {/* Color preferences */}
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">
                    Color preferences (optional)
                  </label>
                  <input
                    type="text"
                    value={colorPreferences}
                    onChange={(e) => setColorPreferences(e.target.value)}
                    placeholder="e.g. Blue and white, match my logo, no preference"
                    className="w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
                  />
                </div>

                {/* Domain */}
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">
                    Domain
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setDomainInfo('need_new')}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-body font-medium border transition-all ${
                        domainInfo === 'need_new'
                          ? 'border-[#FF6B4A]/50 bg-[#FF6B4A]/10 text-[#FF6B4A]'
                          : 'border-white/10 text-surface-400 hover:border-white/20'
                      }`}
                    >
                      Buy a domain for me
                    </button>
                    <button
                      type="button"
                      onClick={() => setDomainInfo('have_domain')}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-body font-medium border transition-all ${
                        domainInfo === 'have_domain'
                          ? 'border-[#FF6B4A]/50 bg-[#FF6B4A]/10 text-[#FF6B4A]'
                          : 'border-white/10 text-surface-400 hover:border-white/20'
                      }`}
                    >
                      I have a domain
                    </button>
                  </div>
                  {domainInfo === 'have_domain' && (
                    <input
                      type="text"
                      value={existingDomain}
                      onChange={(e) => setExistingDomain(e.target.value)}
                      placeholder="e.g. www.mybusiness.com"
                      className="w-full mt-2 px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
                    />
                  )}
                </div>

                {/* Logo upload */}
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">
                    Logo (optional)
                  </label>
                  <label className="flex items-center gap-3 px-3 py-3 bg-surface-950 border border-white/10 border-dashed rounded-lg cursor-pointer hover:border-[#FF6B4A]/30 transition-colors">
                    <Upload size={16} className="text-surface-500" />
                    <span className="text-xs text-surface-400 font-body">
                      {logoFile ? logoFile.name : 'Upload your logo (PNG, SVG, JPG)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setLogoFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>

                {/* Extra notes */}
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">
                    Anything else? (optional)
                  </label>
                  <textarea
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                    rows={2}
                    placeholder="Special requests, reference sites, deadline..."
                    className="w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-surface-400 hover:text-white font-body transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button
                  onClick={goToReview}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-semibold text-sm rounded-xl transition-all"
                >
                  Review Order
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Review & Submit ── */}
          {step === 2 && selectedTemplate && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Review Your Order
              </h1>
              <p className="text-surface-500 font-body text-sm mb-6">
                Make sure everything looks good. You can always chat with your
                developer later to change anything.
              </p>

              {error && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Template */}
                <div className="p-4 rounded-xl border border-white/10 bg-[#0F1D32]">
                  <p className="text-[10px] text-surface-500 font-body uppercase tracking-wider mb-2">
                    Template
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-9 rounded"
                      style={{ background: selectedTemplate.gradient }}
                    />
                    <div>
                      <p className="text-white font-body font-medium text-sm">
                        {selectedTemplate.name}
                      </p>
                      <p className="text-xs text-surface-500 font-body">
                        {selectedTemplate.industry}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business details */}
                <div className="p-4 rounded-xl border border-white/10 bg-[#0F1D32]">
                  <p className="text-[10px] text-surface-500 font-body uppercase tracking-wider mb-3">
                    Business Details
                  </p>
                  <div className="space-y-2">
                    <Row label="Business" value={businessName} />
                    {businessIndustry && (
                      <Row label="Industry" value={businessIndustry} />
                    )}
                    {businessDescription && (
                      <Row label="Description" value={businessDescription} />
                    )}
                    {contentNotes && (
                      <Row label="Pages/Sections" value={contentNotes} />
                    )}
                    {colorPreferences && (
                      <Row label="Colors" value={colorPreferences} />
                    )}
                    <Row
                      label="Domain"
                      value={
                        domainInfo === 'have_domain'
                          ? `Existing: ${existingDomain}`
                          : 'Buy a new domain for me'
                      }
                    />
                    {logoFile && (
                      <Row label="Logo" value={logoFile.name} />
                    )}
                    {extraNotes && (
                      <Row label="Notes" value={extraNotes} />
                    )}
                  </div>
                </div>

                {/* What happens next */}
                <div className="p-4 rounded-xl border border-[#FF6B4A]/20 bg-[#FF6B4A]/5">
                  <p className="text-sm font-display font-semibold text-white mb-2">
                    What happens next?
                  </p>
                  <ul className="space-y-1.5 text-xs text-surface-400 font-body">
                    <li className="flex items-start gap-2">
                      <Check
                        size={12}
                        className="text-[#FF6B4A] mt-0.5 flex-shrink-0"
                      />
                      A developer is assigned to your project immediately
                    </li>
                    <li className="flex items-start gap-2">
                      <Check
                        size={12}
                        className="text-[#FF6B4A] mt-0.5 flex-shrink-0"
                      />
                      You&apos;ll get a live preview link within hours
                    </li>
                    <li className="flex items-start gap-2">
                      <Check
                        size={12}
                        className="text-[#FF6B4A] mt-0.5 flex-shrink-0"
                      />
                      Chat with your developer anytime from your dashboard
                    </li>
                    <li className="flex items-start gap-2">
                      <Check
                        size={12}
                        className="text-[#FF6B4A] mt-0.5 flex-shrink-0"
                      />
                      Pay only when you&apos;re happy — full ownership, no lock-in
                    </li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-surface-400 hover:text-white font-body transition-colors"
                >
                  <ArrowLeft size={14} />
                  Edit Details
                </button>
                <button
                  onClick={submitOrder}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Helper ── */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-surface-500 font-body flex-shrink-0">
        {label}
      </span>
      <span className="text-xs text-white font-body text-right">{value}</span>
    </div>
  );
}
