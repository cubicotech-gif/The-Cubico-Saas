'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Save, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  business_name: string;
  role: string;
}

export default function ProfileForm({
  user,
  profile,
}: {
  user: User;
  profile: Profile | null;
}) {
  const supabase = createClient();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [businessName, setBusinessName] = useState(profile?.business_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName.trim(),
        phone: phone.trim(),
        business_name: businessName.trim(),
      });

    setSaving(false);

    if (updateError) {
      setError('Failed to save. Please try again.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
          Profile
        </h1>
        <p className="text-surface-500 font-body text-sm">
          Manage your account information.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-white/10 bg-[#0F1D32] p-5 sm:p-6 max-w-xl"
      >
        {/* Email (read-only) */}
        <div className="mb-5 pb-5 border-b border-white/5">
          <label className="block text-[11px] text-surface-500 font-body mb-1">
            Email
          </label>
          <p className="text-sm text-white font-body">{user.email}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs text-surface-400 font-body font-medium mb-1.5"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-2.5 bg-[#0A1628] border border-white/10 rounded-lg text-sm text-white font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs text-surface-400 font-body font-medium mb-1.5"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 1234567"
              className="w-full px-4 py-2.5 bg-[#0A1628] border border-white/10 rounded-lg text-sm text-white font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="businessName"
              className="block text-xs text-surface-400 font-body font-medium mb-1.5"
            >
              Business Name
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your company or brand name"
              className="w-full px-4 py-2.5 bg-[#0A1628] border border-white/10 rounded-lg text-sm text-white font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 font-body">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-50 text-white font-body font-medium text-sm rounded-lg transition-all"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check size={14} />
                Saved!
              </>
            ) : (
              <>
                <Save size={14} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
