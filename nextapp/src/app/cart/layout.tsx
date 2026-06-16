import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your selected handcrafted marble murtis and proceed to secure checkout. Enjoy insured worldwide shipping from Jaipur.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
