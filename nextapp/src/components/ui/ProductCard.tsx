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
      className="product-card group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a0a 50%, #0f0f0f 100%)',
            boxShadow: hovered
              ? '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.25), 0 0 40px rgba(212,175,55,0.1)'
              : '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08)',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* ── Image Area ── */}
          <div className="relative w-full aspect-square overflow-hidden">

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
                <motion.div
                  animate={hovered ? { scale: 1.3, opacity: 0.7 } : { scale: 1, opacity: 0.3 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-t-2xl"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, transparent 70%)',
                  }}
                />
              </div>
            )}

            {/* ── Badges ── */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              {product.badge && (
                <span className={`text-[10px] tracking-widest px-3 py-1 rounded-full font-medium backdrop-blur-sm ${product.badge === 'Bestseller'
                    ? 'bg-gold text-black'
                    : product.badge === 'New Arrival'
                      ? 'bg-emerald-500/80 text-white border border-emerald-400/40'
                      : product.badge === 'Limited Edition'
                        ? 'bg-purple-500/80 text-white border border-purple-400/40'
                        : product.badge === 'Sold Out'
                          ? 'bg-black/60 text-white/50 border border-white/20'
                          : product.badge === 'Customer Favourite'
                            ? 'bg-rose-500/80 text-white border border-rose-400/40'
                            : 'bg-gold/80 text-black'
                  }`}>
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="text-[10px] tracking-widest px-3 py-1 rounded-full bg-red-600/80 text-white backdrop-blur-sm">
                  −{discount}%
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
          <div className="p-5 md:p-7 flex flex-col flex-1 min-h-[200px] md:min-h-[250px]">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] tracking-[0.3em] text-gold/60 uppercase whitespace-nowrap">{product.material}</span>
              <span className="w-1 h-1 rounded-full bg-gold/20" />
              <span className="text-[10px] tracking-[0.3em] text-stone-400 uppercase whitespace-nowrap">{product.origin.split(',')[0]}</span>
            </div>

            {/* Title - Fixed height for 2 lines to ensure perfect alignment */}
            <h3 className="font-display text-lg md:text-2xl text-stone-700 mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-2 h-14 md:h-16 leading-tight">
              {product.name}
            </h3>
            
            {/* Description - Fixed height */}
            <div className="h-12 md:h-16 overflow-hidden mb-4">
              <p className="text-xs md:text-sm text-stone-400 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={`${i < Math.floor(product.rating) ? 'fill-gold/80 text-gold/80' : 'text-stone-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-stone-300">({product.reviews})</span>
            </div>

            {/* Price + CTA - Pushed to bottom */}
            <div className="mt-auto flex items-center justify-between gap-4 pt-5 border-t border-stone-100">
              <div className="flex flex-col">
                <span className="font-display text-xl md:text-2xl text-gold/90 leading-none">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-stone-300 line-through mt-1">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[10px] md:text-xs tracking-widest font-semibold transition-all duration-300 ${!product.inStock
                    ? 'bg-stone-50 text-stone-300 cursor-not-allowed'
                    : addedToCart
                      ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                      : 'bg-gold/5 text-gold border border-gold/20 hover:bg-gold hover:text-black hover:border-gold shadow-sm'
                  }`}
              >
                <ShoppingCart size={13} />
                {!product.inStock ? 'SOLD OUT' : addedToCart ? 'ADDED' : 'ADD TO CART'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
