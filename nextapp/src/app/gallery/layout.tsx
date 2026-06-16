import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Divine Gallery',
  description: 'Explore our Divine Gallery. View high-resolution photos of our museum-grade handcrafted marble murtis, straight from our Jaipur workshop.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
