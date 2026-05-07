import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Inter, Cinzel } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";

// Load heavy components client-side only to avoid blocking first paint
const ParticleBackground = dynamic(() => import("@/components/ui/ParticleBackground"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });
const DiscountPopup = dynamic(() => import("@/components/ui/DiscountPopup"), { ssr: false });

// next/font: zero render-blocking, self-hosted, automatic font-display:swap
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jaipur Murti | Buy Hindu Murtis Online | Ganesh, Lakshmi, Hanuman Idols",
  description:
    "Buy authentic handcrafted Hindu murtis online from Jaipur. Ganesh murti, marble Lakshmi, Hanuman idol, murtis for mandir & office. Best price, free shipping across India.",
  keywords: [
    // From autocomplete research
    "ganesh murti jaipur", "marble ganesh murti jaipur", "ganesh statue jaipur",
    "ganesh murti art jaipur", "buy murti online", "buy murti for mandir",
    "buy ganesh murti", "buy ganpati murti online", "buy hanuman murti",
    "buy marble murti online", "buy ganesh murti near me",
    "which ganesh murti is best for business", "which ganesh murti is best for office",
    "jaipur ganesh murti 2025", "ganesh idol for ganesh chaturthi",
    // Core keywords
    "buy hindu murti online", "handcrafted ganesha statue", "marble lakshmi murti",
    "bronze idol jaipur", "religious statues india", "temple art online",
    "buy durga idol", "sacred sculpture", "jaipur murti",
    "hindu god idols", "pooja murti", "authentic hindu statues"
  ],
  metadataBase: new URL("https://jaipurmurti.me"),
  alternates: { canonical: "https://jaipurmurti.me" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Jaipur Murti | Buy Ganesh, Lakshmi & Hanuman Murtis Online",
    description: "Authentic handcrafted Hindu murtis from Jaipur. Ganesh, Lakshmi, Hanuman idols for home & mandir. Worldwide shipping.",
    type: "website",
    url: "https://jaipurmurti.me",
    siteName: "Jaipur Murti",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Jaipur Murti - Premium Hindu Statues" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaipur Murti | Buy Hindu Idols & Statues Online",
    description: "Buy authentic handcrafted Hindu murtis online. Worldwide shipping.",
    images: ["/og-image.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${cormorant.variable} ${inter.variable} ${cinzel.variable}`}
    >
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
