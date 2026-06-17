import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "GoAmrit | Purest Organic Dairy & Farm Fresh Products",
    template: "%s | GoAmrit"
  },
  description: "Experience the tradition of pure, organic dairy products and farm-fresh goodness delivered straight from GoAmrit farms. Vedic A2 Ghee, Pure Milk, and Organic Spices.",
  keywords: ["Organic Dairy", "Vedic Ghee", "Farm Fresh Milk", "Pure Organic Spices", "GoAmrit", "A2 Ghee India", "Organic Farm Products"],
  authors: [{ name: "GoAmrit Team" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://goamrit.com",
    siteName: "GoAmrit",
    images: [{
      url: "https://goamrit.com/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "GoAmrit - Purity In Every Drop"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "GoAmrit | Purest Organic Dairy",
    description: "Pure, organic dairy products and farm-fresh goodness delivered straight from our heart to yours.",
    images: ["https://goamrit.com/og-image.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen bg-brand-cream text-brand-deep flex flex-col selection:bg-brand-primary selection:text-brand-cream">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow relative z-0 pt-[120px] lg:pt-[170px]">
               {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
