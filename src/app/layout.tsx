import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maneesha Chandran | Luxury Couture",
  description: "Discover the exclusive world of Maneesha Chandran. Luxury couture, bridal elegance, and premium fashion collections.",
};

import { StoreProvider } from '@/context/StoreContext';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import { client } from '@/sanity/client';
import { navCategoriesQuery } from '@/sanity/queries';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let navCategories: { id: string; name: string }[] = [];
  try {
    navCategories = (await client.fetch(navCategoriesQuery)) || [];
  } catch (err) {
    console.error('Nav categories fetch error:', err);
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <StoreProvider>
          <Navigation navCategories={navCategories} />
          <BackButton />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
