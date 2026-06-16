import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Jaipur Murti. Contact us for custom marble idols, wholesale inquiries, or support with your sacred murti order.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
