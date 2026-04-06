'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

const STORAGE_KEY = 'cubico_order_draft';

/**
 * Checks localStorage for a pending order draft (saved during signup flow).
 * If found and user is authenticated, auto-submits it and clears the draft.
 */
export default function DraftOrderSubmitter() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (!draft) return;

    let form: Record<string, string>;
    try {
      form = JSON.parse(draft);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    // Must have at least a template key and business name
    if (!form.templateKey || !form.businessName) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const supabase = createClient();

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setSubmitting(true);

      try {
        const { error } = await supabase.from('orders').insert({
          customer_id: user.id,
          template_key: form.templateKey,
          business_name: (form.businessName || '').trim(),
          business_industry: (form.businessIndustry || '').trim(),
          business_description: (form.businessDescription || '').trim(),
          content_notes: (form.referenceUrls || '').trim(),
          color_preferences: String(form.letTeamDecideColors) === 'true'
            ? 'Let the team decide'
            : (form.colorPreferences || '').trim(),
          domain_info: '',
          extra_notes: `Language: ${form.preferredLanguage || 'English'}. WhatsApp: ${form.whatsapp || ''}. Email: ${form.contactEmail || ''}`,
          logo_url: '',
          status: 'pending',
        });

        if (error) {
          console.error('Draft order submission failed:', error);
        } else {
          setDone(true);
        }
      } catch (err) {
        console.error('Draft order submission error:', err);
      } finally {
        localStorage.removeItem(STORAGE_KEY);
        setSubmitting(false);
        // Refresh the page so server components re-fetch with the new order
        setTimeout(() => {
          setDone(false);
          router.refresh();
        }, 2000);
      }
    })();
  }, [router]);

  if (!submitting && !done) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl border border-white/10 bg-[#0F1D32] shadow-xl shadow-black/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
      {submitting ? (
        <>
          <Loader2 size={18} className="text-[#FF6B4A] animate-spin" />
          <span className="text-sm text-white font-body">Submitting your order...</span>
        </>
      ) : done ? (
        <>
          <CheckCircle size={18} className="text-green-400" />
          <span className="text-sm text-white font-body">Order submitted successfully!</span>
        </>
      ) : null}
    </div>
  );
}
