'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import LightHero3D from '@/components/ui/LightHero3D';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden min-h-screen flex flex-col md:relative md:block"
      style={{ background: 'radial-gradient(ellipse at top, #F5EFE6 0%, #FAFAF7 60%)' }}
    >
      {/* 3D animation:
          mobile  → relative, h-[42vh], stacks above text
          desktop → position:absolute inset-0 (handled in CSS module) */}
      <LightHero3D />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6
                      pt-6 pb-10          /* mobile spacing */
                      md:absolute md:inset-0 md:flex md:items-center md:pt-32 md:pb-20">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs tracking-[0.5em] text-gold uppercase font-light">
              Handcrafted Sacred Art
            </span>
            <div className="h-px w-16 bg-gold/40" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="font-display text-4xl sm:text-6xl md:text-8xl xl:text-9xl leading-none mb-4 md:mb-6"
          >
            <span className="block text-divine">Where the</span>
            <span className="block shimmer">Divine</span>
            <span className="block text-divine/80 text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-serif italic mt-2">
              meets your home
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-muted text-base md:text-lg leading-relaxed max-w-lg mb-8 md:mb-10"
          >
            Museum-grade Hindu murtis handcrafted by master artisans across India,
            using 2,000-year-old techniques and sacred materials. Each piece carries
            living devotion.
          </motion.p>

          {/* CTAs — extra top margin on mobile to push button down */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="flex flex-wrap gap-4 mt-6 md:mt-0"
          >
            <Link
              href="/products"
              className="group flex items-center gap-3 px-8 py-4 bg-gold text-black font-medium text-sm tracking-widest rounded-full hover:bg-gold-light transition-all duration-300 shadow-gold hover:shadow-gold-strong"
            >
              EXPLORE COLLECTION
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-3 px-8 py-4 border border-gold/30 text-gold text-sm tracking-widest rounded-full hover:bg-gold/10 transition-all duration-300"
            >
              OUR CRAFT
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="grid grid-cols-2 md:flex gap-6 md:gap-10 mt-12 md:mt-16 pt-8 md:pt-10 border-t border-gold/10"
          >
            {[
              { number: '50+',   label: 'Master Artisans' },
              { number: '2000+', label: 'Happy Devotees' },
              { number: '100%',  label: 'Authentic Materials' },
              { number: '15+',   label: 'States of Origin' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl text-gold shimmer">{stat.number}</div>
                <div className="text-[10px] tracking-widest text-muted uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.5em] text-muted uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent"
        />
      </motion.div>

      {/* Bottom gradient fade — desktop only */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent z-5 pointer-events-none" />
    </section>
  );
}
