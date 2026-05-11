'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Share2, Globe, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/10 bg-bg-2 pt-20 pb-8 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-divine-radial opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <span className="font-display text-3xl shimmer block whitespace-nowrap">JAIPUR MURTI</span>
              <span className="text-xs tracking-[0.5em] text-muted uppercase whitespace-nowrap">Sacred Murtis</span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-sm mb-6">
              Premium handcrafted Hindu murtis from Jaipur, Rajasthan. 
              Specializing in museum-grade marble Ganesha, Hanuman, Lakshmi, and Saraswati idols 
              crafted with authentic Vedic proportions for home mandir and spiritual practice.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.instagram.com/jaipurmurthi?igsh=ZmFnNzVxdGJvMjhy&utm_source=qr"
                target="_blank"
                className="w-9 h-9 border border-gold/20 rounded-full flex items-center justify-center text-muted hover:text-gold hover:border-gold/50 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </Link>
              
              <Link
                href="/"
                className="w-9 h-9 border border-gold/20 rounded-full flex items-center justify-center text-muted hover:text-gold hover:border-gold/50 transition-all duration-300"
              >
                <Globe size={15} />
              </Link>
              
              <Link
                href="https://wa.me/917665941949"
                target="_blank"
                className="w-9 h-9 border border-gold/20 rounded-full flex items-center justify-center text-muted hover:text-gold hover:border-gold/50 transition-all duration-300"
              >
                <MessageCircle size={15} />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm tracking-[0.3em] text-gold mb-5">COLLECTION</h4>
            <ul className="space-y-3">
              {['Bronze Murtis', 'Marble Murtis', 'Crystal Lingams', 'Brass Idols', 'Wood Carvings', 'Special Editions'].map(item => (
                <li key={item}>
                  <Link href="/products" className="text-muted text-sm hover:text-gold transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#faq" className="text-muted text-sm hover:text-gold transition-colors duration-200">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm tracking-[0.3em] text-gold mb-5">CONNECT</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted text-sm">
                <Mail size={14} className="text-gold mt-0.5 flex-shrink-0" />
                <Link href="mailto:udityatanwar@gmail.com" className="hover:text-gold transition-colors break-all">udityatanwar@gmail.com</Link>
              </li>
              <li className="flex items-start gap-3 text-muted text-sm">
                <Phone size={14} className="text-gold mt-0.5 flex-shrink-0" />
                <Link href="https://wa.me/917665941949" className="hover:text-gold transition-colors">+91 76659 41949</Link>
              </li>
              <li className="flex items-start gap-3 text-muted text-sm">
                <MapPin size={14} className="text-gold mt-0.5 flex-shrink-0" />
                <span>17 Artisan Row, Jaipur 302001, Rajasthan, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divine-divider mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <span>© 2024 Jaipur Murti. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link>
            <Link href="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
