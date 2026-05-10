'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, Heart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/client';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { totalItems } = useCart();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Collection' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 backdrop-blur-xl bg-white/90 border-b border-amber-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start group">
            <span className="font-display text-base md:text-lg tracking-[0.2em] md:tracking-[0.3em] text-gold leading-none shimmer whitespace-nowrap">
              JAIPUR MURTI
            </span>
            <span className="text-[8px] md:text-[9px] tracking-[0.4em] md:tracking-[0.5em] text-muted uppercase mt-0.5 whitespace-nowrap">
              Sacred Murtis
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/70 border border-amber-200/60 rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-6 py-2.5 text-[11px] font-medium tracking-[0.2em] uppercase text-stone-600 hover:text-black transition-colors duration-500 rounded-full group overflow-hidden"
              >
                <span className="relative z-10 transition-colors duration-300">{link.label}</span>
                {/* Hover animated background - turns into a solid amber pill */}
                <span className="absolute inset-0 bg-gold-gradient rounded-full translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 md:gap-4">
            <button className="p-1 md:p-2 text-stone-500 hover:text-amber-700 transition-colors duration-200">
              <Search className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </button>
            <button className="p-1 md:p-2 text-stone-500 hover:text-amber-700 transition-colors duration-200">
              <Heart className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </button>
            <Link href={user ? "/account" : "/auth"} className="p-1 md:p-2 text-stone-500 hover:text-amber-700 transition-colors duration-200">
              <User className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </Link>
            <Link href="/cart" className="relative p-1 md:p-2 text-stone-500 hover:text-amber-700 transition-colors duration-200">
              <ShoppingCart className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-amber-700 text-white text-[8px] md:text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              className="md:hidden p-1 text-stone-500 hover:text-amber-700 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu — warm white overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed inset-0 z-40 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
            style={{ background: 'rgba(250, 250, 247, 0.97)' }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  className="font-display text-4xl text-stone-800 hover:text-amber-700 transition-colors tracking-widest"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
