import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login & Signup',
  description: 'Log in or create a Jaipur Murti account to track your orders, save your favorite handcrafted idols, and manage your spiritual collection.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
