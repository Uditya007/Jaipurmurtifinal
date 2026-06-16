import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: "Read our terms and conditions. Learn about our guarantees on authentic Jaipur handcrafted murtis and premium international shipping policies.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
