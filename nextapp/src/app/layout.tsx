import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Inter, Cinzel } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";
import Script from "next/script";

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
  title: {
    default: "Jaipur Murti — Premium Handcrafted Marble Hindu Idols & Statues",
    template: "%s | Jaipur Murti"
  },
  description: "Authentic, museum-grade Hindu murtis handcrafted in Jaipur. Specializing in Makrana marble Ganesha, Lakshmi, Hanuman, and Saraswati idols with worldwide shipping. Jaipur Murthi - The home of sacred artistry.",
  keywords: [
    "Jaipur Murti", "Jaipur Murthi", "Jaipur Murti Online", "Jaipur Murthi Shop",
    "buy ganesh murti online", "marble ganesh murti jaipur", "buy marble murti online", 
    "buy murti for mandir", "hindu deity idols online", "handcrafted marble murtis",
    "jaipur murti", "marble ganesha statue", "buy lakshmi idol online", "hanuman murti jaipur",
    "luxury hindu idols for home", "authentic jaipur marble art", "ganpati murti price",
    "marble murti manufacturer jaipur", "custom marble statues india", "best marble murtis",
    "housewarming gift ideas", "griha pravesh murti", "new home mandir idols",
    "affordable luxury marble murtis", "premium murtis for middle class", "home inauguration gifts"
  ],
  metadataBase: new URL("https://jaipurmurti.me"),
  alternates: { canonical: "https://jaipurmurti.me" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Buy Authentic Hindu Murtis Online — Handcrafted for Devotion | Jaipur Murti",
    description: "Authentic handcrafted Hindu murtis from Jaipur. Ganesh, Lakshmi, Hanuman idols for home & mandir. Worldwide shipping.",
    type: "website",
    url: "https://jaipurmurti.me",
    siteName: "Jaipur Murti",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Jaipur Murti - Premium Hindu Statues" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaipur Murti | Buy Handcrafted Hindu Idols & Statues Online",
    description: "Buy authentic handcrafted Hindu murtis online. Worldwide shipping.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.png',
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
      <head>
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1002915938915228');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="noise">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1002915938915228&ev=PageView&noscript=1"
            alt="facebook pixel"
          />
        </noscript>
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
