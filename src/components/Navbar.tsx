'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LayoutDashboard, Package, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [initials, setInitials] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth state (only check if Supabase is configured)
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        const name = data.user.user_metadata?.full_name || '';
        if (name) {
          const parts = name.split(' ');
          setInitials(
            parts.length > 1
              ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
              : name.slice(0, 2).toUpperCase(),
          );
        } else if (data.user.email) {
          setInitials(data.user.email.slice(0, 2).toUpperCase());
        }
      }
    });
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileOpen(false);
    router.refresh();
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-950/90 backdrop-blur-md border-b border-surface-800'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-display font-bold text-white tracking-tight">
            cubico
            <span className="text-brand-400">.</span>
          </span>
          <span className="hidden sm:block text-xs text-surface-400 font-body tracking-widest uppercase mt-0.5">
            technologies
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-body">
          <a
            href="#services"
            className="text-surface-400 hover:text-white transition-colors"
          >
            Services
          </a>
          <a
            href="#about"
            className="text-surface-400 hover:text-white transition-colors"
          >
            About
          </a>

          {user ? (
            /* ── Profile dropdown ── */
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white text-xs font-body font-bold hover:bg-[#ff7f61] transition-colors"
              >
                {initials || <User size={16} />}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-xl border border-white/10 bg-[#0F1D32] shadow-xl shadow-black/30 py-1.5 z-50">
                  <p className="px-3 py-1.5 text-[10px] text-surface-500 font-body truncate">
                    {user.email}
                  </p>
                  <div className="border-t border-white/5 my-1" />

                  <DropdownLink
                    href="/dashboard"
                    icon={<LayoutDashboard size={14} />}
                    label="Dashboard"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownLink
                    href="/dashboard/orders"
                    icon={<Package size={14} />}
                    label="My Orders"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownLink
                    href="/dashboard/profile"
                    icon={<Settings size={14} />}
                    label="Account Settings"
                    onClick={() => setProfileOpen(false)}
                  />

                  <div className="border-t border-white/5 my-1" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-white/5 transition-colors font-body"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Not logged in ── */
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-full text-sm font-medium transition-colors"
            >
              Contact Us
            </a>
          )}
        </div>

        {/* Mobile: profile + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {user && (
            <Link
              href="/dashboard"
              className="w-8 h-8 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white text-[10px] font-body font-bold"
            >
              {initials || <User size={14} />}
            </Link>
          )}
          <button
            className="text-surface-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-950/95 backdrop-blur-md border-b border-surface-800 px-4 pb-4 space-y-1 font-body text-sm">
          <a
            href="#services"
            className="block py-2 text-surface-300 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </a>
          <a
            href="#about"
            className="block py-2 text-surface-300 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>

          {user ? (
            <>
              <div className="border-t border-white/5 my-2" />
              <Link
                href="/dashboard"
                className="block py-2 text-surface-300 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/orders"
                className="block py-2 text-surface-300 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </Link>
              <Link
                href="/dashboard/profile"
                className="block py-2 text-surface-300 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Account Settings
              </Link>
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false); }}
                className="block py-2 text-red-400"
              >
                Sign Out
              </button>
            </>
          ) : (
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-brand-400 font-medium"
            >
              Contact Us
            </a>
          )}
        </div>
      )}
    </header>
  );
}

function DropdownLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 text-xs text-surface-300 hover:text-white hover:bg-white/5 transition-colors font-body"
    >
      {icon}
      {label}
    </Link>
  );
}
