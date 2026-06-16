import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: "Review your handcrafted Jaipur murtis in the cart. Secure your authentic Hindu deity statues today with complimentary worldwide shipping.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
