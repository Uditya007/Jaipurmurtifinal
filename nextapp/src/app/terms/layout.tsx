import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Review the terms and conditions for shopping with Jaipur Murti. Find information on our policies, guarantees, and service terms.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
