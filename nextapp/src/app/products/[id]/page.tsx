'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Heart, ShieldCheck, Truck, ArrowLeft, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  if (!product) {
    notFound();
  }

  const nextImage = () => setActiveImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-bg-1">
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link href="/products" className="inline-flex items-center gap-2 text-muted text-xs tracking-widest hover:text-gold transition-colors mb-8">
          <ArrowLeft size={13} /> BACK TO COLLECTION
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/5] bg-black/40 rounded-3xl overflow-hidden border border-gold/10 group flex items-center justify-center"
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
                    alt={product.name} 
                    fill 
                    className="object-contain p-8"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              {product.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 p-2 rounded-full bg-black/50 text-white backdrop-blur border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                      activeImage === i ? 'border-gold opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" />
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
            
            <h1 className="font-display text-3xl md:text-4xl text-divine mt-4 mb-2">
              {product.name}
            </h1>

            <p className="text-muted font-display text-lg mb-6">{product.deity}</p>
            
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
              <div className="flex items-center gap-4 text-muted text-sm">
                <Truck className="text-gold" size={20} />
                <span>Free Fully Insured Worldwide Shipping</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
