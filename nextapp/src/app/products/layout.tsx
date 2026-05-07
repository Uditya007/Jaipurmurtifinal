import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Hindu Murtis Online | Handcrafted Ganesha, Lakshmi & More | Jaipur Murti',
  description: 'Buy authentic handcrafted Hindu murtis online from Jaipur. Ganesha, Lakshmi, Durga, Shiva idols in Bronze, Marble & Crystal. Free shipping in India. Best price guaranteed.',
  keywords: [
    'buy ganesha murti online', 'handcrafted lakshmi idol jaipur', 'marble murti shop',
    'buy durga idol online india', 'bronze shiva statue jaipur', 'religious idols jaipur',
    'buy murti online india', 'pooja murti online', 'best murti shop jaipur',
    'buy murti jaipur', 'authentic hindu idols online'
  ],
  alternates: { canonical: 'https://jaipurmurti.me/products' },
  openGraph: {
    title: 'Buy Hindu Murtis Online | Jaipur Murti',
    description: 'Authentic handcrafted Hindu idols — Ganesha, Lakshmi, Durga & more. Shipped across India.',
    url: 'https://jaipurmurti.me/products',
    type: 'website',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
