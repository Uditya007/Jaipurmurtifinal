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
            background: '#FFFFFF',
            border: hovered
              ? '1px solid rgba(160, 114, 10, 0.35)'
              : '1px solid rgba(160, 114, 10, 0.12)',
            boxShadow: hovered
              ? '0 20px 60px rgba(0,0,0,0.1), 0 0 0 0px transparent, 0 0 30px rgba(160,114,10,0.08)'
              : '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.4s ease, border 0.3s ease',
          }}
        >
          {/* ── Image Area — consistent 1:1 square ratio ── */}
          <div className="relative w-full aspect-square overflow-hidden" style={{ background: '#F5EFE6' }}>

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

                {/* Subtle warm gradient at bottom for badge readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-50/60 via-transparent to-transparent z-10" />

                {/* Warm glow rim on hover */}
                <motion.div
                  animate={hovered ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 40px rgba(160,114,10,0.12)',
                    background: 'radial-gradient(ellipse at center, rgba(160,114,10,0.04) 0%, transparent 70%)',
                  }}
                />
              </>
            ) : (
              /* ── Placeholder when no image ── */
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F5EFE6 0%, #EDE5D8 100%)' }}>
                <motion.div
                  animate={hovered ? { rotateY: 15, scale: 1.08 } : { rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                  className="text-8xl"
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(160,114,10,0.3))' }}
                >
                  {categoryEmoji[product.category] ?? '🕉️'}
                </motion.div>
                <motion.div
                  animate={hovered ? { scale: 1.3, opacity: 0.5 } : { scale: 1, opacity: 0.2 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-t-2xl"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(160,114,10,0.15) 0%, transparent 70%)',
                  }}
                />
              </div>
            )}

            {/* ── Badges ── */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              {product.badge && (
                <span className={`text-[10px] tracking-widest px-3 py-1 rounded-full font-medium shadow-sm ${product.badge === 'Bestseller'
                    ? 'bg-amber-600 text-white'
                    : product.badge === 'New Arrival'
                      ? 'bg-emerald-500 text-white'
                      : product.badge === 'Limited Edition'
                        ? 'bg-violet-500 text-white'
                        : product.badge === 'Sold Out'
                          ? 'bg-stone-400 text-white'
                          : product.badge === 'Customer Favourite'
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-600 text-white'
                  }`}>
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="text-[10px] tracking-widest px-3 py-1 rounded-full bg-red-500 text-white shadow-sm">
                  −{discount}%
                </span>
              )}
            </div>

            {/* ── Wishlist ── */}
            <button
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 border border-stone-200 flex items-center justify-center transition-all duration-300 hover:bg-amber-50 hover:border-amber-300 shadow-sm"
              onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            >
              <Heart
                size={15}
                className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}
              />
            </button>

            {/* ── Quick View pill ── */}
            <motion.div
              animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            >
              <span className="flex items-center gap-2 text-[10px] tracking-widest text-amber-800 px-4 py-1.5 rounded-full bg-white/90 border border-amber-200 shadow-sm">
                <Eye size={11} /> VIEW DETAILS
              </span>
            </motion.div>
          </div>

          {/* ── Info Area ── */}
          <div className="p-3 md:p-5" style={{ background: '#FFFFFF' }}>

            {/* Category / origin metadata */}
            <div className="mb-1.5 flex flex-wrap items-center gap-1 md:gap-2">
              <span className="text-[8px] md:text-[9px] tracking-[0.2em] md:tracking-[0.4em] text-amber-700 uppercase font-medium">
                {product.material}
              </span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-[8px] md:text-[9px] tracking-[0.2em] md:tracking-[0.4em] text-stone-500 uppercase">
                {product.origin.split(',')[0]}
              </span>
            </div>

            {/* Name */}
            <h3 className="font-display text-sm md:text-xl text-stone-800 mb-0.5 group-hover:text-amber-700 transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-[10px] md:text-xs text-stone-500 mb-2 md:mb-3 line-clamp-2 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={9}
                    className={`md:w-3 md:h-3 ${i < Math.floor(product.rating)
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-stone-300 fill-stone-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[9px] md:text-[11px] text-stone-400">({product.reviews})</span>
            </div>

            {/* Price + CTA */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 xl:gap-0 mt-2">
              <div className="flex items-center gap-2 xl:block">
                <span className="font-display text-sm md:text-xl text-amber-700">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-[9px] md:text-xs text-stone-400 line-through xl:ml-2">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full xl:w-auto flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[11px] tracking-widest font-medium transition-all duration-300 ${
                  !product.inStock
                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                    : addedToCart
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-300'
                      : 'bg-amber-700 text-white hover:bg-amber-600 shadow-sm'
                }`}
              >
                <ShoppingCart size={11} className="md:w-3 md:h-3" />
                {!product.inStock ? 'SOLD OUT' : addedToCart ? 'ADDED ✓' : 'ADD'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
