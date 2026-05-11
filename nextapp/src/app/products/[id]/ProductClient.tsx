'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Heart, ShieldCheck, Truck, ArrowLeft, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

import { Product } from '@/types';

export default function ProductClient({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();


  const nextImage = () => setActiveImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-bg-1">
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex text-xs tracking-widest text-muted mb-8 uppercase gap-2 items-center">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-gold transition-colors">Products</Link>
          <ChevronRight size={12} />
          <span className="text-gold truncate">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-amber-200 group flex items-center justify-center"
              style={{ background: '#F5EFE6' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  <Image 
                    src={product.images[activeImage]} 
                    alt={`${product.material.toLowerCase()} ${product.deity.toLowerCase().replace(/—.*/, '').trim()} murti statue ${product.height} ${product.origin.toLowerCase().replace('made in ', '')} - view ${activeImage + 1}`}
                    fill 
                    className="object-contain p-8"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              {product.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 p-2 rounded-full bg-white/90 text-stone-700 backdrop-blur border border-stone-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-50 hover:border-amber-300">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 p-2 rounded-full bg-white/90 text-stone-700 backdrop-blur border border-stone-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-50 hover:border-amber-300">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? 'border-amber-600 shadow-sm'
                        : 'border-stone-200 opacity-60 hover:opacity-100 hover:border-amber-300'
                    }`}
                    style={{ background: '#F5EFE6' }}
                  >
                    <Image src={img} alt={`${product.material.toLowerCase()} ${product.deity.toLowerCase().replace(/—.*/, '').trim()} idol thumbnail ${i + 1}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2">
              <span className="text-[10px] tracking-[0.3em] text-gold uppercase px-3 py-1 rounded-full border border-gold/30 bg-gold/5">
                {product.category}
              </span>
            </div>
            
            <h1 className="font-display text-3xl md:text-5xl text-divine mt-4 mb-2">
              {product.height} {product.material} {product.deity.split('—')[0].trim()} Murti
            </h1>

            <p className="text-muted font-display text-lg mb-6 italic">{product.deity.split('—')[1]?.trim() || product.deity}</p>
            
            <div className="flex items-center gap-2 mb-6 text-sm text-muted">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-gold" : ""} />
                ))}
              </div>
              <span>{product.rating} ({product.reviews} Reviews)</span>
            </div>

            <div className="text-3xl text-gold font-display mb-8 flex items-end gap-3">
              ₹{product.price.toLocaleString('en-IN')}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted line-through mb-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            <div className="prose prose-invert prose-p:text-muted prose-p:text-sm prose-p:leading-relaxed mb-8">
              <p>{product.longDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass rounded-2xl p-4">
                <p className="text-[10px] tracking-widest text-muted uppercase mb-1">Height</p>
                <p className="text-divine text-sm">{product.height}</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-[10px] tracking-widest text-muted uppercase mb-1">Weight</p>
                <p className="text-divine text-sm">{product.weight}</p>
              </div>
              <div className="glass rounded-2xl p-4 col-span-2">
                <p className="text-[10px] tracking-widest text-muted uppercase mb-1">Material & Finish</p>
                <p className="text-divine text-sm">{product.finish}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 flex items-center justify-center gap-3 bg-gold text-black font-medium py-4 rounded-full text-sm tracking-widest hover:bg-gold-light transition-all shadow-gold"
              >
                <ShoppingCart size={16} />
                ADD TO CART
              </button>
              <button className="flex items-center justify-center w-14 h-14 rounded-full border border-gold/20 text-gold hover:bg-gold/10 transition-colors shrink-0">
                <Heart size={20} />
              </button>
            </div>

            <div className="space-y-4 pt-8 border-t border-gold/10">
              <div className="flex items-center gap-4 text-muted text-sm">
                <ShieldCheck className="text-gold" size={20} />
                <span>100% Authentic Handcrafted Artwork</span>
              </div>
            </div>

            {/* SEO Content Sections: Symbolism, Care, FAQ */}
            <div className="space-y-6 pt-8 border-t border-gold/10">
              {/* Symbolism */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="font-display text-xl text-divine mb-3">Divine Symbolism</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Every element of this {product.deity.split('—')[0].trim()} murti is crafted strictly according to Agama Shastra. The posture, mudras, and divine implements hold deep spiritual significance, making this not just a piece of art, but a sacred presence that brings auspiciousness, peace, and spiritual energy to your space.
                </p>
              </div>
              
              {/* Care Instructions */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="font-display text-xl text-divine mb-3">Care Instructions</h3>
                <ul className="text-sm text-muted space-y-2 list-disc list-inside">
                  <li>Wipe gently with a soft, dry cotton cloth.</li>
                  <li>Avoid using harsh chemicals or abrasive cleaners.</li>
                  <li>For marble: Keep away from turmeric or sindoor to prevent staining (unless specifically part of your daily puja ritual where stains are considered sacred).</li>
                  <li>For bronze/brass: Natural oxidation (patina) will occur over time. This is normal and adds to the antique character. Use a specialized brass/bronze polish only if a bright shine is desired.</li>
                </ul>
              </div>

              {/* Placement & Vastu FAQ */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="font-display text-xl text-divine mb-3">Vastu & Placement FAQ</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gold mb-1">Where should I place this murti?</h4>
                    <p className="text-sm text-muted">Ideally placed in the Northeast corner (Ishan Kone) of your home or office. Ensure the deity faces West or South, so you face East or North while praying.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gold mb-1">Is this suitable for a home mandir?</h4>
                    <p className="text-sm text-muted">Yes, the size ({product.height}) and material ({product.material}) are perfect for daily puja and home mandir installation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Preview */}
            <div className="mt-8 pt-8 border-t border-gold/10">
              <h3 className="font-display text-2xl text-divine mb-4">Customer Reviews</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < Math.floor(product.rating) ? "fill-gold" : ""} />
                  ))}
                </div>
                <span className="text-divine font-medium">{product.rating} out of 5</span>
                <span className="text-muted text-sm">({product.reviews} reviews)</span>
              </div>
              <div className="glass p-4 rounded-xl">
                <div className="flex text-gold mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-gold" />
                  ))}
                </div>
                <p className="text-sm text-muted italic mb-2">"Absolutely divine. The craftsmanship on this {product.deity.split('—')[0].trim()} murti is breathtaking. Fast shipping and careful packaging."</p>
                <p className="text-xs text-gold/80">- Verified Buyer</p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
