import { Metadata } from 'next';
import { blogPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Jaipur Murti Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen pt-32 pb-24 relative bg-bg-1">
      <div className="absolute inset-0 bg-divine-radial opacity-5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-gold text-xs font-bold tracking-[0.2em] uppercase mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={14} />
          Back to Journal
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-[10px] tracking-widest text-muted uppercase mb-6">
            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-gold/60" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-gold/60" />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl text-divine mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-y border-gold/10 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-display text-lg">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs tracking-widest text-divine uppercase font-bold">{post.author}</p>
                <p className="text-[10px] text-muted">Editorial Team</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="text-muted hover:text-gold transition-colors"><Share2 size={18} /></button>
              <button className="text-muted hover:text-gold transition-colors"><Bookmark size={18} /></button>
            </div>
          </div>
        </header>

        <div className="relative aspect-video rounded-3xl overflow-hidden mb-16 border border-amber-200/30">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div 
          className="prose prose-stone prose-lg max-w-none 
                     prose-headings:font-display prose-headings:text-divine
                     prose-p:text-muted prose-p:leading-relaxed
                     prose-li:text-muted prose-strong:text-gold
                     prose-a:text-gold prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-20 pt-12 border-t border-gold/10">
          <div className="glass p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="max-w-xl text-center md:text-left">
              <h3 className="font-display text-2xl text-divine mb-3">Ready to bring the divine home?</h3>
              <p className="text-muted text-sm leading-relaxed">
                Explore our collection of museum-grade Hindu murtis, handcrafted by 
                master artisans in the heart of Jaipur.
              </p>
            </div>
            <Link 
              href="/products"
              className="px-8 py-4 bg-gold text-black font-bold text-xs tracking-[0.3em] rounded-full hover:bg-gold-light transition-all shadow-gold whitespace-nowrap"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}
