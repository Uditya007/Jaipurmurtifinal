'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  const artisans = [
    { name: 'Raman Sthapati', craft: 'Chola Bronze Master', location: 'Swamimalai, Tamil Nadu', years: 42, emoji: '🕉️' },
    { name: 'Govind Sharma', craft: 'Marble Sculptor', location: 'Jaipur, Rajasthan', years: 35, emoji: '🌺' },
    { name: 'Suresh Bastar', craft: 'Dhokra Tribal Artist', location: 'Bastar, Chhattisgarh', years: 28, emoji: '⚱️' },
    { name: 'Ananta Rao', craft: 'Sandalwood Carver', location: 'Mysore, Karnataka', years: 31, emoji: '🪷' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <span className="text-xs tracking-[0.5em] text-gold uppercase">Our Story</span>
          <h1 className="font-display text-6xl md:text-7xl text-divine mt-4 mb-6 leading-none">
            The Craft of<br />
            <span className="shimmer">Sacred Art</span>
          </h1>
          <div className="divine-divider max-w-xs mx-auto mb-8" />
          <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
            Jaipur Murti was born from a single conviction: that India's most sacred artistic traditions 
            deserve to reach every devotee who seeks them — with full authenticity, full reverence, 
            and zero compromise.
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section ref={ref} className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.5em] text-gold uppercase">Our Mission</span>
            <h2 className="font-display text-4xl text-divine mt-4 mb-6">
              Preserving Living Traditions
            </h2>
            <div className="space-y-4 text-muted text-sm leading-relaxed">
              <p>
                India's temple artisans are among the world's most skilled craftspeople, yet their 
                work has remained largely inaccessible — confined to temples or regional markets with 
                no way to verify authenticity.
              </p>
              <p>
                We work directly with master artisans and their families across 12 states, providing 
                fair trade pricing, global exposure, and rigorous quality authentication. Every purchase 
                directly sustains an artisan family and a 2,000-year-old tradition.
              </p>
              <p>
                Each murti in our collection is examined by our team of art historians and Agama Shastra 
                scholars before listing — ensuring iconographic accuracy, material authenticity, and 
                spiritual integrity.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { number: '50+', label: 'Master Artisans', sub: 'across 12 states' },
              { number: '2,000+', label: 'Devotees Served', sub: 'across 40 countries' },
              { number: '₹1.2Cr+', label: 'Artisan Earnings', sub: 'directly paid' },
              { number: '100%', label: 'Authenticated', sub: 'every single piece' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-6 text-center group hover:border-gold/30 transition-all duration-300">
                <div className="font-display text-3xl text-gold shimmer mb-1">{stat.number}</div>
                <div className="text-sm text-divine mb-1">{stat.label}</div>
                <div className="text-[10px] text-muted">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Artisans */}
      <section className="bg-bg-2 py-32 mb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.5em] text-gold uppercase">The Masters</span>
            <h2 className="font-display text-5xl text-divine mt-4">Behind Every Murti</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {artisans.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass rounded-2xl p-8 text-center group hover:border-gold/30 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="text-5xl mb-5 float" style={{ animationDelay: `${i * 0.5}s` }}>
                  {a.emoji}
                </div>
                <h3 className="font-display text-xl text-divine mb-1">{a.name}</h3>
                <p className="text-gold text-xs tracking-wider mb-1">{a.craft}</p>
                <p className="text-muted text-xs mb-3">{a.location}</p>
                <div className="divine-divider mx-auto max-w-[60px] mb-3" />
                <p className="text-[10px] tracking-widest text-muted">{a.years} YEARS EXPERIENCE</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-4xl mb-6 float">🕉️</div>
          <h2 className="font-display text-4xl text-divine mb-4">
            Bring the Divine Home
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Every murti you choose supports a master artisan family and preserves a living tradition.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-black text-sm tracking-widest rounded-full font-medium hover:bg-gold-light transition-all shadow-gold hover:shadow-gold-strong"
          >
            EXPLORE COLLECTION <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
