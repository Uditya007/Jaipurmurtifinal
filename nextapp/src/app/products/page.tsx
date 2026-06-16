'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { products, categories } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import { useSearchParams } from 'next/navigation';


function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All');

  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.5em] text-gold uppercase">Handcrafted in Jaipur, India</span>
          <h1 className="font-display text-4xl md:text-5xl text-divine mt-4 mb-4">Handcrafted Hindu Deity Statues — Shop All Murtis</h1>
          <p className="text-muted text-sm max-w-xl mx-auto">
            Authentic handcrafted Ganesha, Lakshmi, Durga &amp; more — Bronze, Marble &amp; Crystal idols shipped across India
          </p>
          <div className="divine-divider max-w-sm mx-auto mt-8" />
        </motion.div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-gold text-black font-medium shadow-gold' 
                  : 'bg-black/40 text-muted border border-gold/20 hover:border-gold/50 hover:text-divine'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-gold">Loading Collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
