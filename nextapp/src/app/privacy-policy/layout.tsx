import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Data Protection',
  description: "Review our privacy policy. Jaipur Murti is committed to protecting your data while you shop for authentic, handcrafted Hindu deity statues.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
