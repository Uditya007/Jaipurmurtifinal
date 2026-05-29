import { NextResponse } from 'next/server';
import { products } from '@/lib/products';

// Helper: Escape CSV field according to RFC 4180 specifications
function escapeCSVField(val: string | number | undefined | null): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).trim();
  // Escape double quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  // Enclose in double quotes to handle commas, newlines, and quotes
  return `"${escaped}"`;
}

export async function GET() {
  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
    'google_product_category'
  ];

  const rows = [headers.join(',')];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaipurmurti.me';

  for (const product of products) {
    // 1. Availability check
    const availability = product.inStock ? 'in stock' : 'out of stock';

    // 2. Format Price with Currency (INR since using Razorpay credentials)
    const priceFormatted = `${product.price} INR`;

    // 3. Absolute links
    const link = `${baseUrl}/products/${product.id}`;
    
    // Fallback: If image path is full URL, keep it, else prepend domain
    const primaryImage = product.images?.[0] || '/placeholder.png';
    const imageLink = primaryImage.startsWith('http') 
      ? primaryImage 
      : `${baseUrl}${primaryImage}`;

    // 4. Description cleanup - prioritize long description but fallback to short
    const desc = product.longDescription || product.description || '';
    // Clean any trailing carriage returns or double whitespaces for cleaner display
    const cleanedDesc = desc.replace(/\s+/g, ' ');

    const row = [
      escapeCSVField(product.id),
      escapeCSVField(product.name),
      escapeCSVField(cleanedDesc),
      escapeCSVField(availability),
      escapeCSVField('new'),
      escapeCSVField(priceFormatted),
      escapeCSVField(link),
      escapeCSVField(imageLink),
      escapeCSVField('Jaipur Murti'),
      escapeCSVField('Arts & Entertainment > Hobbies & Creative Arts > Artwork > Sculptures & Statues')
    ];

    rows.push(row.join(','));
  }

  // Convert array to standard CSV string joined by CRLF
  const csvContent = rows.join('\r\n');

  // Return response with correct Content-Type to ensure Commerce Manager parses it successfully
  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'inline; filename="meta_product_feed.csv"',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
