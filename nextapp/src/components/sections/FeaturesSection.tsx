'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Landmark, Scroll, Sparkles, Globe } from 'lucide-react';

const features = [
  {
    icon: Landmark,
    title: 'Museum Grade',
    desc: 'Every murti inspected for correct iconographic proportions per Shilpa Shastras.',
  },
  {
    icon: Scroll,
    title: 'Certified Authentic',
    desc: 'Certificate of authenticity with every purchase — origin, material, artisan.',
  },
  {
    icon: Sparkles,
    title: 'Consecration Ready',
    desc: 'Optional prana pratishtha by qualified temple priests.',
  },
  {
    icon: Globe,
    title: 'Global Delivery',
    desc: 'Museum-grade packaging with climate control. Ships to 50+ countries.',
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden bg-bg">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Recommended Positioning Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] border p-8 md:p-12 lg:p-16 mb-20 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          style={{ borderColor: 'rgba(212,175,55,0.15)' }}
        >
          {/* Subtle warm glow orb */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <span className="inline-block px-3.5 py-1.5 rounded-full border text-[10px] tracking-[0.2em] font-semibold text-gold uppercase bg-gold/5 border-gold/30">
              Recommended Positioning
            </span>

            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-stone-100 leading-tight">
              "Museum-Grade Devotion. <span className="shimmer">Jaipur Heritage.</span>"
            </h2>

            <p className="text-stone-400 text-base md:text-lg leading-relaxed max-w-4xl font-light">
              Positioning Jaipur Murti at the intersection of <strong className="text-gold font-medium">luxury craftsmanship</strong> and <strong className="text-gold font-medium">spiritual authenticity</strong>. We are not just a murti seller — we are the <span className="italic font-serif text-stone-300">custodians of 2,000-year-old Vedic artistry</span>. While others offer mass-manufactured or unverified local statues, we occupy the premium, story-driven, and highly sacred space your home temple deserves.
            </p>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass rounded-[24px] p-8 md:p-10 group hover:border-gold/30 transition-all duration-500 hover:-translate-y-1.5 flex flex-col md:flex-row gap-6 items-start"
              style={{ borderColor: 'rgba(212,175,55,0.08)' }}
            >
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-gold/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300 border border-gold/10 flex-shrink-0">
                <f.icon size={24} className="text-gold animate-pulse-slow" />
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <h3 className="font-display text-xl text-divine group-hover:text-gold transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed font-light">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
