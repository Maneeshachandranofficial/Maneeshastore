import type { Metadata } from "next";
import { Cinzel, Jost } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600"], variable: '--font-cinzel' });
const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: '--font-jost' });

export const metadata: Metadata = {
  title: "Maneesha Chandran | Luxury Couture",
  description: "Discover the exclusive world of Maneesha Chandran. Luxury couture, bridal elegance, and premium fashion collections.",
};

import { StoreProvider } from '@/context/StoreContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${cinzel.variable} ${jost.variable} antialiased`}>
        <StoreProvider>
          <Navigation />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
