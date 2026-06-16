import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Divine Gallery',
  description: "View our divine photo gallery of premium marble murtis. Witness the intricate craftsmanship of Jaipur artisans. Find inspiration for your mandir.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
