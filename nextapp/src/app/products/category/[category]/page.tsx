import { Metadata } from 'next';
import { products } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const title = `${category} Murtis — Handcrafted in Jaipur`;
  let description = '';
  if (params.category.toLowerCase() === 'marble') {
    description = 'Shop pristine white marble murtis handcrafted in Jaipur. Elevate your mandir with premium, sacred artistry. Enjoy free worldwide shipping.';
  } else if (params.category.toLowerCase() === 'bronze') {
    description = 'Discover traditional Panchaloha bronze deity statues. Authentic, masterfully cast murtis for your spiritual space. Browse the collection.';
  } else if (params.category.toLowerCase() === 'crystal') {
    description = 'Explore sacred Narmada crystal and sphatik murtis. Handcrafted to radiate pure spiritual energy. Shop premium idols with free shipping.';
  } else {
    description = `Shop our exclusive collection of museum-grade ${category} Hindu murtis. Hand-carved from authentic ${category === 'Marble' ? 'White Marble' : category} by master artisans. Worldwide shipping.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://jaipurmurti.me/products/category/${params.category}`,
    }
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const filteredProducts = products.filter(
    p => p.category.toLowerCase() === params.category.toLowerCase()
  );

  if (filteredProducts.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-bg-1 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-xs tracking-widest text-gold hover:gap-4 transition-all mb-12"
        >
          <ArrowLeft size={14} /> BACK TO ALL COLLECTIONS
        </Link>

        <div className="mb-16">
          <span className="text-xs tracking-[0.5em] text-gold uppercase">Collection</span>
          <h1 className="font-display text-5xl md:text-7xl text-divine mt-4 mb-6">
            {categoryName} <span className="shimmer">Murtis</span>
          </h1>
          <div className="divine-divider max-w-xs" />
          <p className="text-muted mt-8 max-w-2xl leading-relaxed">
            Discover our masterfully crafted {categoryName} deities, each adhering to the 
            strict iconographic principles of the Shilpa Shastras and carved with 
            unwavering devotion in the heart of Jaipur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
