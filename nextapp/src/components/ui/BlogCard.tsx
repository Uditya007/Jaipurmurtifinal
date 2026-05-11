'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/blog';

export default function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-amber-200/50 mb-6">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-[0.2em] text-gold uppercase rounded-full shadow-sm">
              {post.category}
            </span>
          </div>
        </div>
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-4 text-[10px] tracking-widest text-muted uppercase">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-gold/60" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-gold/60" />
            {post.readTime}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-display text-2xl text-divine group-hover:text-gold transition-colors leading-tight">
            {post.title}
          </h3>
        </Link>

        <p className="text-muted text-sm leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        <Link 
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-gold text-xs font-bold tracking-[0.2em] uppercase pt-2 group/btn"
        >
          Read Article
          <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
