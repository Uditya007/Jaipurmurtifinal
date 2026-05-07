import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account/', '/cart/'],
    },
    sitemap: 'https://jaipurmurti.me/sitemap.xml',
  };
}
