export interface Product {
  id: string;
  name: string;
  deity: string;
  price: number;
  originalPrice?: number;
  material: string;
  height: string;
  weight: string;
  description: string;
  longDescription: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
  category: string;
  finish: string;
  origin: string;
  features: string[];
  keywords?: string;
  purpose?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
