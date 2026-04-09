'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { useLocale } from '@/i18n/LocaleProvider';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const { locale, dict } = useLocale();

  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        setSuccess(dict.login.successSignUp);
        setMode('login');
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        // Check user role to redirect admin vs customer
        if (signInData.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', signInData.user.id)
            .single();

          if (profile?.role === 'admin') {
            window.location.href = '/admin';
            return;
          }
        }

        window.location.href = next;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : dict.login.genericError;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-600/[0.05] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Logo / back */}
        <div className="text-center mb-8">
          <Link
            href={`/${locale}`}
            className="inline-block text-2xl font-display font-bold text-white hover:text-[#FF6B4A] transition-colors"
          >
            Cubico
          </Link>
          <p className="text-surface-500 font-body text-sm mt-2">
            {mode === 'login'
              ? dict.login.signInTitle
              : dict.login.signUpTitle}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0F1D32] p-6 sm:p-8">
          {/* Tabs */}
          <div className="flex mb-6 bg-surface-950 rounded-lg p-1">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-sm font-body font-medium rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-[#FF6B4A] text-white'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              {dict.login.tabLogIn}
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-sm font-body font-medium rounded-md transition-all ${
                mode === 'signup'
                  ? 'bg-[#FF6B4A] text-white'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              {dict.login.tabSignUp}
            </button>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-body">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">
                    {dict.login.labelFullName}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder={dict.login.placeholderName}
                    className="w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">
                    {dict.login.labelPhone}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={dict.login.placeholderPhone}
                    className="w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs text-surface-400 font-body mb-1.5">
                {dict.login.labelEmail}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={dict.login.placeholderEmail}
                className="w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-surface-400 font-body mb-1.5">
                {dict.login.labelPassword}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder={dict.login.placeholderPassword}
                className="w-full px-3 py-2.5 bg-surface-950 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-semibold rounded-xl transition-all text-sm"
            >
              {loading
                ? dict.login.submitting
                : mode === 'login'
                  ? dict.login.submitLogIn
                  : dict.login.submitSignUp}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-surface-600 font-body mt-6">
          {dict.login.terms}
        </p>
      </motion.div>
    </div>
  );
}
