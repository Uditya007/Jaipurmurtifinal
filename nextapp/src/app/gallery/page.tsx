'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, MessageCircle, X, Sparkles, Filter, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const galleryItems = [
  {
    id: 1,
    src: '/gallery/gallery-1.jpg',
    title: 'Maa Durga — The Cosmic Warrior',
    category: 'Durga Maa',
    material: 'Pristine White Marble',
    size: '39 inches (99 cm)',
    description: 'A magnificent carving representing Goddess Durga in her Mahishasuramardini avatar. Every hand holds a precise iconographic weapon chiseled to exact Shilpa Shastra proportions, riding her fierce lion vahana, highlighted with brilliant 24K gold leaf and royal red drapery.',
  },
  {
    id: 2,
    src: '/gallery/gallery-2.jpg',
    title: 'Shri Siddhivinayak Ganesha',
    category: 'Ganesha',
    material: 'Pristine White Marble',
    size: '18 inches (46 cm)',
    description: 'A detailed close-up of Lord Ganesha, capturing his tranquil omniscient gaze. Ornamented with deep-relief golden crown engravings (Mukut), emerald-studded jewelry detail, and a beautifully curved trunk holding a sweet modak, radiating serenity and good fortune.',
  },
  {
    id: 3,
    src: '/gallery/gallery-3.jpg',
    title: 'Maa Durga — Eternal Protector',
    category: 'Durga Maa',
    material: 'Pristine White Marble',
    size: '30 inches (76 cm)',
    description: 'Seated gracefully on her lion amidst sacred oil lamps, this deity sculpture represents the ultimate protector of the universe. The serene expression of the Goddess contrasts beautifully with the dynamic posture of her lion, symbolizing the balance of peace and strength.',
  },
  {
    id: 4,
    src: '/gallery/gallery-4.jpg',
    title: 'Murli Manohara Krishna',
    category: 'Krishna',
    material: 'Pratapgarh White Stone & Painted Enamel',
    size: '24 inches (61 cm)',
    description: 'Set in a sacred Vrindavan garden with a lifelike peacock, this masterpiece portrays Lord Krishna playing his divine flute. Every detail—from the peacock feather crown to the intricate flower garlands—is masterfully hand-painted to capture the eternal joy and magnetism of the Lord.',
  },
  {
    id: 5,
    src: '/gallery/gallery-5.jpg',
    title: 'Panchamukhi Hanuman',
    category: 'Hanuman',
    material: 'Sleek White Marble with Gold Accents',
    size: '19.5 inches (49.5 cm)',
    description: 'Depicting the exceptionally rare and powerful five-faced (Panchamukhi) form of Lord Hanuman in a kneeling devotional posture, carrying his iconic golden mace (Gada). Carved with precision, representing ultimate protection, mastery over all directions, and selfless devotion.',
  },
  {
    id: 6,
    src: '/gallery/gallery-6.jpg',
    title: 'Shiva Parivar — Divine Family Assembly',
    category: 'Shiva',
    material: 'Premium White White Marble',
    size: '24 inches (61 cm)',
    description: 'A breathtaking assembly of the Shiva Parivar—Lord Shiva, Goddess Parvati, Lord Ganesha, and Lord Kartikeya. Hand-carved in Jaipur from premium white White marble, highlighted with delicate gold leaf details and oil lamp reflections, radiating absolute domestic harmony and cosmic peace.',
  },
  {
    id: 7,
    src: '/gallery/gallery-7.jpg',
    title: 'Radha Krishna — Eternal Divine Love',
    category: 'Krishna',
    material: 'Pristine White Marble',
    size: '30 inches (76 cm)',
    description: 'Standing together in their iconic venugopal and blessing postures, Shri Radha and Lord Krishna represent the supreme spiritual union. Elaborately decorated with handmade rose garlands, golden headwear (crowns), and flowing off-white and gold marble garments.',
  },
  {
    id: 8,
    src: '/gallery/gallery-8.jpg',
    title: 'Goddess Saraswati — Wisdom & Harmony',
    category: 'Saraswati',
    material: 'Pure White White Marble',
    size: '21 inches (53 cm)',
    description: 'Seated gracefully on a blooming lotus alongside her sacred swan (Hamsa), Goddess Saraswati holds the Veena and Vedas. Carved from flawless white marble, this idol brings divine vibrations of knowledge, fine arts, and spiritual clarity to any home mandir.',
  },
  {
    id: 9,
    src: '/gallery/gallery-9.jpg',
    title: 'Ram Darbar — The Righteous Assembly',
    category: 'Rama',
    material: 'Pristine White Marble',
    size: '36 inches (91.5 cm)',
    description: 'A grand representation of Ram Darbar—featuring Lord Rama, his consort Sita, his devoted brother Laxmana, and Lord Hanuman kneeling in humble devotion. Highlighted with a magnificent golden umbrella (chhatra) and traditional temple arch (prabhavali).',
  },
  {
    id: 10,
    src: '/gallery/gallery-10.jpg',
    title: 'Lord Tirupati Balaji — Venkateshvara',
    category: 'Vishnu',
    material: 'Sacred Black Granite & Gold Leafing',
    size: '30 inches (76 cm)',
    description: 'A spectacular standing Venkateshvara (Tirupati Balaji) murti. Sculpted with divine precision from black granite stone, adorned with intricate gold-plated crown (kireetam), celestial weapons (Sudarshana Chakra and Panchajanya Conch), and multiple layers of flower garlands.',
  },
];

const categories = ['All', 'Durga Maa', 'Ganesha', 'Krishna', 'Hanuman', 'Shiva', 'Saraswati', 'Rama', 'Vishnu'];

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [activeItem, setActiveItem] = useState<any>(null);

  const filteredItems = filter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-bg">
      {/* Divine radial glow background */}
      <div className="absolute inset-0 bg-divine-radial opacity-15 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-gold">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-xs tracking-[0.6em] uppercase font-light">Sacred Masterpieces</span>
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-divine leading-none">
            Divine Gallery
          </h1>
          <p className="text-muted text-sm md:text-base leading-relaxed max-w-xl mx-auto font-light">
            Step into the sacred repository of our finest, museum-grade marble and stone sculptures. Each piece is crafted by Jaipur’s finest hereditary artisans using authentic Vedic iconographical specifications.
          </p>
          <div className="divine-divider max-w-md mx-auto pt-4" />
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-16"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/15 bg-gold/5 text-gold text-xs tracking-wider uppercase font-medium mr-2">
            <Filter size={12} />
            <span>Filter</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-xs tracking-[0.15em] uppercase transition-all duration-300 font-medium ${
                filter === cat
                  ? 'bg-gold text-black shadow-[0_4px_15px_rgba(212,175,55,0.35)]'
                  : 'bg-white/40 border border-amber-200/40 text-stone-600 hover:bg-gold/10 hover:border-gold/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative flex flex-col h-full rounded-[24px] overflow-hidden bg-black/40 border border-gold/10 hover:border-gold/30 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:-translate-y-2 cursor-pointer"
                onClick={() => setActiveItem(item)}
              >
                {/* Image Wrapper */}
                <div className="relative aspect-[4/5] w-full overflow-hidden flex-shrink-0 bg-stone-950">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-90"
                    priority={index < 3}
                  />
                  {/* Subtle shadows & radial glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent z-10" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="text-[9px] tracking-widest px-3 py-1 rounded-full font-medium backdrop-blur-md bg-black/50 text-gold border border-gold/20">
                      {item.category}
                    </span>
                  </div>

                  {/* Open Lightbox Button */}
                  <div className="absolute top-4 right-4 z-20">
                    <button className="w-9 h-9 rounded-full backdrop-blur-md bg-black/40 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-gold/20 hover:border-gold/40">
                      <Maximize2 size={14} className="text-white/80 group-hover:text-gold transition-colors" />
                    </button>
                  </div>
                  
                  {/* Click to expand overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="flex items-center gap-2 text-[10px] tracking-widest text-gold/90 px-4 py-1.5 rounded-full backdrop-blur-md bg-black/60 border border-gold/25 whitespace-nowrap">
                      <Sparkles size={11} className="animate-spin-slow text-gold" /> VIEW MASTERPIECE
                    </span>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="p-6 md:p-8 flex flex-col flex-1 relative z-20 bg-stone-950/60">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] tracking-[0.25em] text-gold uppercase font-medium">{item.material}</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl text-stone-100 mb-3 group-hover:text-gold transition-colors duration-300 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-light line-clamp-3 mb-6">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] tracking-widest text-stone-500 font-medium">SIZE: {item.size}</span>
                    <span className="text-[10px] tracking-widest text-gold font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      INQUIRE NOW <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Storytelling Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 relative overflow-hidden rounded-[32px] border p-8 md:p-12 lg:p-16 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center max-w-5xl mx-auto"
          style={{ borderColor: 'rgba(212,175,55,0.15)' }}
        >
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            <span className="inline-block px-3.5 py-1.5 rounded-full border text-[10px] tracking-[0.2em] font-semibold text-gold uppercase bg-gold/5 border-gold/30">
              Custom Commissions & Vedic Authenticity
            </span>
            <h2 className="font-display text-3xl md:text-5xl text-stone-100 leading-tight">
              Looking for a custom <span className="shimmer">sacred idol?</span>
            </h2>
            <p className="text-stone-400 text-sm md:text-base leading-relaxed font-light">
              We specialize in custom sizing, marble selection (Premium White or White Alabaster), and specific posture commissioning based strictly on your home temple’s Vastu and Agama Shastra guidelines. Connect with our sacred advisors to draft your custom legacy murti.
            </p>
            <div className="pt-6 flex flex-wrap gap-4 justify-center">
              <Link 
                href="https://wa.me/917665941949" 
                target="_blank"
                className="flex items-center gap-3 px-8 py-4 bg-gold text-black font-semibold text-xs tracking-widest rounded-full hover:bg-gold-light transition-all duration-300 shadow-gold"
              >
                <MessageCircle size={16} />
                INQUIRE VIA WHATSAPP
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center gap-3 px-8 py-4 border border-gold/30 text-gold font-semibold text-xs tracking-widest rounded-full hover:bg-gold/10 transition-all duration-300"
              >
                CONTACT US
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Lightbox / Immersive Detail Overlay */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/98 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          >
            {/* Close trigger on empty area */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveItem(null)} />

            {/* Lightbox Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl rounded-[32px] overflow-hidden border border-gold/20 bg-stone-900 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>

              {/* Left Side: Image */}
              <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-auto relative bg-stone-950 flex-shrink-0">
                <Image
                  src={activeItem.src}
                  alt={activeItem.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-2 md:p-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Right Side: Details & Storytelling */}
              <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-center space-y-6 bg-stone-900 text-left">
                <div className="space-y-2">
                  <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-semibold bg-gold/5 border border-gold/20 px-3.5 py-1 rounded-full inline-block">
                    {activeItem.category}
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-stone-100 leading-tight">
                    {activeItem.title}
                  </h2>
                </div>

                <div className="divine-divider" />

                <p className="text-stone-300 text-sm leading-relaxed font-light">
                  {activeItem.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="p-4 rounded-2xl bg-black/25 border border-white/5">
                    <span className="text-[9px] tracking-widest text-stone-500 uppercase block mb-1">Authentic Material</span>
                    <span className="text-xs md:text-sm text-gold font-medium">{activeItem.material}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/25 border border-white/5">
                    <span className="text-[9px] tracking-widest text-stone-500 uppercase block mb-1">Sculpture Size</span>
                    <span className="text-xs md:text-sm text-gold font-medium">{activeItem.size}</span>
                  </div>
                </div>

                {/* Lightbox CTA */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`https://wa.me/917665941949?text=Hello%20Jaipur%20Murti%2C%20I%20am%20interested%20in%20inquiring%20about%20the%20${encodeURIComponent(activeItem.title)}%20sculpture%20featured%20in%20your%20Divine%20Gallery.`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 bg-gold text-black font-semibold py-3.5 px-6 rounded-full text-xs tracking-widest hover:bg-gold-light transition-all duration-300 shadow-gold"
                  >
                    <MessageCircle size={15} />
                    INQUIRE NOW
                  </Link>
                  <a
                    href={activeItem.src}
                    download={`jaipur-murti-${activeItem.id}.jpg`}
                    className="flex items-center justify-center gap-2 border border-white/10 text-white/80 hover:text-gold hover:border-gold/30 hover:bg-white/5 transition-all py-3.5 px-6 rounded-full text-xs tracking-widest"
                  >
                    <Download size={15} />
                    SAVE PHOTO
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
