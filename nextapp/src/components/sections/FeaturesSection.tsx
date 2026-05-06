'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Truck, Award, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Certified Authentic',
    desc: 'Every murti comes with a certificate of authenticity verifying origin, materials, and artisan credentials.',
  },
  {
    icon: Shield,
    title: 'Consecration Available',
    desc: 'Optional Vedic consecration (prana pratishtha) performed by qualified temple priests.',
  },
  {
    icon: Truck,
    title: 'White-Glove Delivery',
    desc: 'Climate-controlled, insured shipping with real-time tracking. Delivered in museum-grade packaging.',
  },
  {
    icon: RefreshCw,
    title: '30-Day Returns',
    desc: 'If your murti arrives damaged or misrepresented, we arrange a full refund or replacement.',
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-xs tracking-[0.5em] text-gold uppercase">Why Choose Jaipur Murti</span>
          <h2 className="font-display text-5xl md:text-6xl text-divine mt-4 mb-4">
            Our Sacred Promise
          </h2>
          <div className="divine-divider max-w-xs mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="glass rounded-2xl p-8 group hover:border-gold/30 transition-all duration-500 hover:-translate-y-2"
              style={{ borderColor: 'rgba(212,175,55,0.08)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors duration-300">
                <f.icon size={20} className="text-gold" />
              </div>
              <h3 className="font-display text-lg text-divine mb-3">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
