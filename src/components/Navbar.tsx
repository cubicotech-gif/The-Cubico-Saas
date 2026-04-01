'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <Link
            href="/admin"
            className="text-surface-400 hover:text-white transition-colors"
          >
            Admin
          </Link>
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-full text-sm font-medium transition-colors"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-surface-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-950/95 backdrop-blur-md border-b border-surface-800 px-4 pb-4 space-y-3 font-body text-sm">
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
          <Link
            href="/admin"
            className="block py-2 text-surface-300 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </Link>
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 text-brand-400 font-medium"
          >
            Contact Us
          </a>
        </div>
      )}
    </header>
  );
}
