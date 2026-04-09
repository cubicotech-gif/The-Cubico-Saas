'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: string;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'My Orders', icon: Package },
  { href: '/dashboard/profile', label: 'Profile', icon: UserIcon },
];

export default function DashboardNav({
  user,
  profile,
}: {
  user: User;
  profile: Profile | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';

  const getLocale = () => {
    try {
      return document.cookie.match(/cubico_locale=(\w+)/)?.[1] || 'en';
    } catch { return 'en'; }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${getLocale()}`);
    router.refresh();
  };

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href);

  const navContent = (
    <>
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-white/5">
        <Link
          href={`/${getLocale()}`}
          className="font-display font-bold text-white text-xl hover:text-[#FF6B4A] transition-colors"
        >
          Cubico
        </Link>
      </div>

      {/* User */}
      <div className="px-5 py-4 border-b border-white/5">
        <p className="text-sm font-body font-medium text-white truncate">
          {displayName}
        </p>
        <p className="text-[11px] text-surface-500 font-body truncate">
          {user.email}
        </p>
      </div>

      {/* New order button */}
      <div className="px-4 pt-4">
        <Link
          href={`/${getLocale()}/services/website-development`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-medium text-xs rounded-lg transition-all"
          onClick={() => setMobileOpen(false)}
        >
          <Plus size={14} />
          New Website
        </Link>
      </div>

      {/* Nav links */}
      <nav className="px-3 py-4 flex-1">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all ${
                    active
                      ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] font-medium'
                      : 'text-surface-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-surface-500 hover:text-white hover:bg-white/5 font-body transition-all"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 bg-[#0F1D32] border-r border-white/5 z-30">
        {navContent}
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-30 h-14 bg-[#0F1D32] border-b border-white/5 flex items-center justify-between px-5">
        <Link
          href={`/${getLocale()}`}
          className="font-display font-bold text-white text-lg"
        >
          Cubico
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-surface-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute right-0 top-0 bottom-0 w-64 bg-[#0F1D32] flex flex-col">
            <div className="flex justify-end px-4 pt-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-surface-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
