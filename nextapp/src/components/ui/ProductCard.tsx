'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

// Emoji fallback per category when image isn't available
const categoryEmoji: Record<string, string> = {
  Bronze: '🕉️',
  Marble: '🌺',
  Crystal: '💎',
  Brass: '⚱️',
  Wood: '🪷',
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const hasImage = product.images?.length > 0 && product.images[0] && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="product-card group h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <div
          className="rounded-2xl overflow-hidden relative flex flex-col h-full"
          style={{
            background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a0a 50%, #0f0f0f 100%)',
            boxShadow: hovered
              ? '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.25), 0 0 40px rgba(212,175,55,0.1)'
              : '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08)',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* ── Image Area ── */}
          <div className="relative w-full aspect-square overflow-hidden flex-shrink-0">

            {hasImage ? (
              <>
                {/* Real product image */}
                <motion.div
                  animate={hovered ? { scale: 1.06 } : { scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-6"
                    onError={() => setImgError(true)}
                  />
                </motion.div>

                {/* Gradient overlays for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />

                {/* Divine glow rim on hover */}
                <motion.div
                  animate={hovered ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 40px rgba(212,175,55,0.2)',
                    background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 70%)',
                  }}
                />
              </>
            ) : (
              /* ── Placeholder when no image ── */
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-amber-950/30 via-amber-900/10 to-transparent">
                <motion.div
                  animate={hovered ? { rotateY: 15, scale: 1.08 } : { rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                  className="text-8xl"
                  style={{ filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.5))' }}
                >
                  {categoryEmoji[product.category] ?? '🕉️'}
                </motion.div>
              </div>
            )}

            {/* ── Badges ── */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              {product.badge && (
                <span className="text-[10px] tracking-widest px-3 py-1 rounded-full font-medium backdrop-blur-sm bg-gold text-black">
                  {product.badge}
                </span>
              )}
            </div>

            {/* ── Wishlist ── */}
            <button
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full backdrop-blur-md bg-black/40 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-gold/20 hover:border-gold/40"
              onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            >
              <Heart
                size={15}
                className={wishlisted ? 'fill-gold text-gold' : 'text-white/70'}
              />
            </button>

            {/* ── Quick View pill ── */}
            <motion.div
              animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            >
              <span className="flex items-center gap-2 text-[10px] tracking-widest text-gold/90 px-4 py-1.5 rounded-full backdrop-blur-md bg-black/50 border border-gold/25">
                <Eye size={11} /> VIEW DETAILS
              </span>
            </motion.div>
          </div>

          {/* ── Info ── */}
          <div className="p-6 md:p-8 flex flex-col flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] tracking-[0.3em] text-gold/70 uppercase whitespace-nowrap font-medium">{product.material}</span>
              <span className="w-1 h-1 rounded-full bg-gold/30" />
              <span className="text-[10px] tracking-[0.3em] text-stone-500 uppercase whitespace-nowrap font-medium">MADE IN INDIA</span>
            </div>

            {/* Title - Strict fixed height for 2 lines */}
            <h3 className="font-display text-xl md:text-2xl text-stone-100 mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2 h-14 md:h-16 leading-tight">
              {product.name}
            </h3>
            
            {/* Description - Strict fixed height */}
            <div className="h-12 md:h-16 overflow-hidden mb-6">
              <p className="text-xs md:text-sm text-stone-500 line-clamp-2 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={`${i < Math.floor(product.rating) ? 'fill-gold/90 text-gold/90' : 'text-stone-800'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-stone-600 font-medium">({product.reviews})</span>
            </div>

            {/* Price + CTA - Bottom Aligned */}
            <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-white/5">
              <div className="flex flex-col">
                <span className="font-display text-2xl md:text-3xl text-gold/90 tracking-wide leading-none">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] text-stone-600 line-through mt-1 tracking-widest font-medium">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-[10px] md:text-xs tracking-[0.2em] font-bold transition-all duration-500 shadow-lg ${!product.inStock
                    ? 'bg-stone-900 text-stone-700 cursor-not-allowed'
                    : addedToCart
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                      : 'bg-black text-gold border border-gold/30 hover:bg-gold hover:text-black hover:border-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]'
                  }`}
              >
                <ShoppingCart size={14} className="mb-0.5" />
                {!product.inStock ? 'SOLD OUT' : addedToCart ? 'ADDED' : 'ADD TO CART'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
