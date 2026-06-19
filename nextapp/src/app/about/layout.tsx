import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Sacred Art from Jaipur',
  description: "Learn how Jaipur Murti preserves India's ancient sculpting traditions. We connect master artisans with devotees worldwide. Discover our mission.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
