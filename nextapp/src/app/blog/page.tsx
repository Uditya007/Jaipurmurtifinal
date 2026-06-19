import { Metadata } from 'next';
import { blogPosts } from '@/lib/blog';
import BlogCard from '@/components/ui/BlogCard';

export const metadata: Metadata = {
  title: 'Sacred Art Blog | Vastu & Murti Guides',
  description: "Read the Jaipur Murti blog for expert guides on Vastu shastra, murti materials, and placement tips. Discover the sacred art of idol carving.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative bg-bg-1">
      {/* Background elements */}
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="max-w-3xl mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gold/40" />
            <span className="text-xs tracking-[0.4em] text-gold uppercase font-light">Insights & Guides</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-divine mb-6 leading-none">
            The Sacred <span className="shimmer">Journal</span>
          </h1>
          <p className="text-muted text-lg leading-relaxed">
            Exploring the ancient traditions of murti-making, Vastu Shastra, and the spiritual 
            significance of sacred art in the modern home.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {blogPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
