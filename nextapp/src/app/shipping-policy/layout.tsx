import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: "Read our shipping policy for handcrafted Hindu statues. We ensure secure, fully insured, and free worldwide shipping direct from Jaipur.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
