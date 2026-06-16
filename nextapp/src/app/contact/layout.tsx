import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Need help finding the perfect murti? Contact Jaipur Murti's support team for guidance on custom handcrafted idols. We're here to assist you.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
