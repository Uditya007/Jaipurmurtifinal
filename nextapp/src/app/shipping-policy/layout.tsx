import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: "Learn about Jaipur Murti's shipping policies. We offer secure, fully insured, and fast worldwide shipping for all our handcrafted idols.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
