'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/lib/products';

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-2 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-xs tracking-[0.5em] text-gold uppercase">Devotee Stories</span>
          <h2 className="font-display text-5xl md:text-6xl text-divine mt-4 mb-4">
            Voices of Faith
          </h2>
          <div className="divine-divider max-w-xs mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="glass rounded-2xl p-6 relative group hover:border-gold/30 transition-all duration-500 hover:-translate-y-1"
              style={{ borderColor: 'rgba(212,175,55,0.08)' }}
            >
              {/* Quote icon */}
              <Quote size={30} className="text-gold/20 mb-4" />

              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={12} className="fill-gold text-gold" />
                ))}
              </div>

              <p className="text-sm text-muted leading-relaxed mb-6 italic">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold font-display">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm text-divine font-medium">{t.name}</div>
                  <div className="text-[11px] text-muted">{t.location}</div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-divine-radial opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
