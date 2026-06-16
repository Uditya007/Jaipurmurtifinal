import { Metadata } from 'next';
import { products } from '@/lib/products';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = products.find(p => p.id === params.id);
  
  if (!product) {
    return {
      title: 'Product Not Found | Jaipur Murti',
    };
  }

  // Generate a dynamic SEO title: [Primary keyword] | [Secondary keyword] — [Brand]
  const deityName = product.deity.split('—')[0].trim();
  const title = `${product.height} ${product.material} ${deityName} Murti | Jaipur Murti`;
  
  // Create a unique meta description
  const description = `Buy this museum-grade ${product.height} ${product.material} ${deityName} murti. Hand-chiseled by master artisans from ${product.origin.replace('MADE IN ', '')}. Authentic sacred art for your home mandir. Free shipping.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.images[0], alt: `${product.material} ${deityName} Statue` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.images[0]],
    }
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  // Schema Markup (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.longDescription,
    url: `https://jaipurmurti.me/products/${product.id}`,
    image: product.images.map(img => `https://jaipurmurti.me${img}`),
    brand: {
      '@type': 'Brand',
      name: 'Jaipur Murti'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Jaipur Murti',
      url: 'https://jaipurmurti.me'
    },
    sku: product.id,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://jaipurmurti.me/products/${product.id}`,
      seller: {
        '@type': 'Organization',
        name: 'Jaipur Murti'
      },
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 5, maxValue: 10, unitCode: 'DAY' }
        },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Material', value: product.material },
      { '@type': 'PropertyValue', name: 'Height', value: product.height },
      { '@type': 'PropertyValue', name: 'Weight', value: product.weight },
      { '@type': 'PropertyValue', name: 'Origin', value: product.origin },
      { '@type': 'PropertyValue', name: 'Finish', value: product.finish },
      ...(product.purpose ? [{ '@type': 'PropertyValue', name: 'Purpose', value: product.purpose }] : [])
    ],
    keywords: product.keywords || `${product.deity.split('—')[0].trim().toLowerCase()} murti, ${product.material.toLowerCase()} idol, buy ${product.deity.split('—')[0].trim().toLowerCase()} idol online, ${product.category.toLowerCase()} murti, jaipur murti`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient product={product} />
    </>
  );
}
