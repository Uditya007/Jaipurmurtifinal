import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ParticleBackground from "@/components/ui/ParticleBackground";
import CustomCursor from "@/components/ui/CustomCursor";
import DiscountPopup from "@/components/ui/DiscountPopup";

export const metadata: Metadata = {
  title: "Jaipur Murti | Premium Hindu Idols & Statues",
  description:
    "Discover museum-grade Hindu murtis handcrafted by master artisans. Bronze, Marble, Crystal & Wood sacred sculptures — consecrated and certified authentic.",
  keywords: ["hindu murtis", "sacred statues", "bronze ganesha", "marble lakshmi", "religious idols", "temple art"],
  openGraph: {
    title: "Jaipur Murti",
    description: "Where the Divine meets your home — premium handcrafted Hindu murtis.",
    type: "website",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&family=Cinzel:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise">
        <CartProvider>
          <CustomCursor />
          <ParticleBackground />
          <DiscountPopup />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
