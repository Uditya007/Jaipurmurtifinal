import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Ganesh Murti Jaipur | Marble Ganesh, Hanuman, Lakshmi Idols Online',
  description: "Explore our full catalog of authentic Hindu deity statues. Hand-carved by Jaipur artisans for your sacred space. Browse the collection today.",
  keywords: [
    'ganesh murti jaipur', 'marble ganesh murti jaipur', 'ganesh statue jaipur',
    'buy ganesh murti', 'buy ganpati murti online', 'buy hanuman murti',
    'buy marble murti online', 'buy murti for mandir', 'buy murti online',
    'which ganesh murti is best for business', 'which ganesh murti is best for office',
    'ganesh idol for ganesh chaturthi', 'jaipur ganesh murti 2025',
    'buy durga idol online india', 'buy murti online india',
    'pooja murti online', 'best murti shop jaipur', 'buy murti near me'
  ],
  openGraph: {
    title: 'Buy Ganesh Murti Jaipur | Marble & Bronze Hindu Idols',
    description: 'Authentic handcrafted Ganesh, Lakshmi, Hanuman murtis from Jaipur. For home, mandir & office. Free shipping.',
    url: 'https://jaipurmurti.me/products',
    type: 'website',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
