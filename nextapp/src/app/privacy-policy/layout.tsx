import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: "Read Jaipur Murti's privacy policy. We are committed to protecting your personal data and ensuring a secure shopping experience.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
