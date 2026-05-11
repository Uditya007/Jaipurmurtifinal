'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Calendar, Award } from 'lucide-react';

export default function HeritageSection() {
  return (
    <section className="py-24 bg-bg-2 overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-divine-radial opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-gold/20 group shadow-2xl">
              <Image
                src="/about/storefront.jpg"
                alt="Jaipur Murti Storefront"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 glass p-4 rounded-2xl border border-gold/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest text-gold uppercase">Location</p>
                    <p className="text-sm font-display text-divine">Jaipur, Rajasthan</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Om */}
            <div className="absolute -top-10 -left-10 md:-top-14 md:-left-14 text-7xl md:text-9xl text-gold/5 pointer-events-none select-none z-10">
              🕉️
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs tracking-[0.5em] text-gold uppercase block mb-4">Our Legacy</span>
            <h2 className="font-display text-5xl md:text-6xl text-divine leading-tight mb-8">
              A Tradition of <span className="shimmer">Sacred Artistry</span>
            </h2>
            
            <p className="text-muted leading-relaxed mb-10 text-lg">
              Located in the heart of Jaipur, the world's capital for marble artistry, 
              Jaipur Murti is more than just a store—it is a sanctuary of tradition. 
              Our storefront stands as a gateway to 2,000 years of Vedic heritage, 
              where every sculpture is born from the finest Makrana marble and a 
              lifetime of devotion.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold">
                  <Calendar size={20} />
                  <span className="font-display text-lg">Generational Wisdom</span>
                </div>
                <p className="text-sm text-muted">
                  Our master artisans have passed down their sacred techniques through five generations.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold">
                  <Award size={20} />
                  <span className="font-display text-lg">Museum Quality</span>
                </div>
                <p className="text-sm text-muted">
                  Every piece is inspected for perfect iconographic proportions as per the Shilpa Shastras.
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 glass rounded-2xl border-l-4 border-gold bg-gold/5">
              <p className="italic text-divine/80 text-sm">
                "We don't just sell statues; we facilitate the presence of the Divine in your sacred space."
              </p>
              <p className="mt-4 font-display text-gold text-xs tracking-widest">— THE JAIPUR MURTI PROMISE</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
