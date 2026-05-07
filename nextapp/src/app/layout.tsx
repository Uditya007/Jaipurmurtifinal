import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ParticleBackground from "@/components/ui/ParticleBackground";
import CustomCursor from "@/components/ui/CustomCursor";
import DiscountPopup from "@/components/ui/DiscountPopup";

export const metadata: Metadata = {
  title: "Jaipur Murti | Premium Hindu Idols & Statues Online",
  description:
    "Buy authentic handcrafted Hindu murtis online. Museum-grade Ganesha, Lakshmi, Durga & more in Bronze, Marble & Crystal — consecrated by master artisans in Jaipur. Worldwide shipping.",
  keywords: [
    "buy hindu murti online", "handcrafted ganesha statue", "marble lakshmi murti", "bronze idol jaipur",
    "religious statues india", "temple art online", "buy durga idol", "sacred sculpture", "jaipur murti",
    "hindu god idols", "pooja murti", "authentic hindu statues", "buy murti online india"
  ],
  metadataBase: new URL("https://jaipurmurti.me"),
  alternates: { canonical: "https://jaipurmurti.me" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Jaipur Murti | Premium Hindu Idols & Statues",
    description: "Where the Divine meets your home — premium handcrafted Hindu murtis. Worldwide shipping.",
    type: "website",
    url: "https://jaipurmurti.me",
    siteName: "Jaipur Murti",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Jaipur Murti - Premium Hindu Statues" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaipur Murti | Premium Hindu Idols & Statues",
    description: "Buy authentic handcrafted Hindu murtis online. Worldwide shipping.",
    images: ["/og-image.jpg"],
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
