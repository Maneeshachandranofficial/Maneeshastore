import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        <StoreProvider>
          <Navigation />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
