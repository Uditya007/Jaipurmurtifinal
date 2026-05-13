'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FAQSection from '@/components/sections/FAQSection';
import ProductCard from '@/components/ui/ProductCard';
import { products } from '@/lib/products';

function FeaturedProducts() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const featured = products.slice(0, 9);

  return (
    <section ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16"
        >
          <div>
            <span className="text-xs tracking-[0.5em] text-gold uppercase">Sacred Collection</span>
            <h2 className="font-display text-5xl md:text-6xl text-divine mt-4">
              Chosen by Devotees
            </h2>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-gold text-sm tracking-widest hover:gap-4 transition-all duration-300 mt-4 md:mt-0"
          >
            VIEW ALL
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MantraSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Full bleed gold line */}
      <div className="divine-divider mb-24" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="text-5xl mb-8 float">🕉️</div>
          <p className="font-serif text-3xl md:text-5xl text-divine/80 italic leading-relaxed mb-8">
            "Where devotion and artistry converge,<br />
            <span className="gold-gradient not-italic font-display text-2xl md:text-4xl tracking-wider">
              the divine takes form
            </span>"
          </p>
          <p className="text-muted text-sm tracking-widest">
            — Master Sculptor, Swamimalai Temple Art School, Est. 1200 CE
          </p>
        </motion.div>
      </div>

      <div className="divine-divider mt-24" />
    </section>
  );
}

function CraftSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    { num: '01', title: 'Sacred Clay Model', desc: 'Artisans sculpt the form in clay, guided by ancient Agama Shastra iconographic texts.' },
    { num: '02', title: 'Lost-Wax Casting', desc: 'The model is coated in beeswax, then clay-fired. Molten Panchaloha poured in the wax cavity.' },
    { num: '03', title: 'Hand Chiseling', desc: 'Every feature — from eyelashes to finger nails — is chiseled by hand over weeks.' },
    { num: '04', title: 'Consecration', desc: 'A qualified Acharya performs prana pratishtha, invoking divine energy into the murti.' },
  ];

  return (
    <section ref={ref} className="py-32 bg-bg-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-divine-radial opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-xs tracking-[0.5em] text-gold uppercase">2000 Years of Tradition</span>
          <h2 className="font-display text-5xl md:text-6xl text-divine mt-4 mb-4">
            The Jaipur Murti <span className="shimmer">Sacred Process</span>
          </h2>
          <div className="divine-divider max-w-xs mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative px-8 py-10 group"
            >
              {/* Step line connector */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 right-0 w-full h-px bg-gold/10" />
              )}

              <div className="font-display text-6xl text-gold/10 mb-4">{step.num}</div>
              <h3 className="font-display text-xl text-divine mb-3 group-hover:text-gold transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>

              {/* Step indicator dot */}
              <div className="absolute top-14 left-0 w-2 h-2 rounded-full bg-gold/30 group-hover:bg-gold transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gold/10 border border-gold/30 text-gold text-sm tracking-widest rounded-full hover:bg-gold hover:text-black transition-all duration-300"
          >
            BROWSE THE COLLECTION <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ShippingMarquee() {
  const content = [
    'Worldwide Shipping', '✦', 'Domestic Delivery: 20 Days', '✦', 'International Delivery: 20-30 Days', '✦',
    'Worldwide Shipping', '✦', 'Domestic Delivery: 20 Days', '✦', 'International Delivery: 20-30 Days', '✦',
    'Worldwide Shipping', '✦', 'Domestic Delivery: 20 Days', '✦', 'International Delivery: 20-30 Days', '✦',
  ];

  return (
    <div className="bg-gold text-black py-2.5 overflow-hidden flex whitespace-nowrap relative z-20 border-y border-gold/40">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
        className="flex items-center gap-8 md:gap-12 font-medium tracking-[0.2em] text-[10px] md:text-[11px] uppercase w-max"
      >
        {content.map((item, i) => (
          <span key={i} className={item === '✦' ? 'text-black/40' : ''}>{item}</span>
        ))}
      </motion.div>
    </div>
  );
}

import HeritageSection from '@/components/sections/HeritageSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ShippingMarquee />
      <FeaturedProducts />
      <HeritageSection />
      <FeaturesSection />
      <MantraSection />
      <CraftSection />
      <FAQSection />
      <TestimonialsSection />
    </>
  );
}
