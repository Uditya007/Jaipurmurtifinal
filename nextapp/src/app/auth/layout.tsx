import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login & Signup | Your Sacred Account',
  description: "Log in or sign up to track your sacred murti orders. Join Jaipur Murti to build your premium handcrafted Hindu deity collection.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
