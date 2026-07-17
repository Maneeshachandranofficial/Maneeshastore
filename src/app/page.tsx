import HomeClient from '@/components/HomeClient';
import { client } from '@/sanity/client';
import { allProductsQuery, siteSettingsQuery } from '@/sanity/queries';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let heroProducts = [];
  let featuredProducts = [];
  let siteSettings = null;

  try {
    const fetchedProducts = await client.fetch(allProductsQuery);
    featuredProducts = fetchedProducts.slice(0, 8);

    // Find products marked as hero, fallback to first 5 if none found
    const heroes = fetchedProducts.filter((p: any) => p.isHero);
    if (heroes.length > 0) {
      heroProducts = heroes;
    } else {
      heroProducts = fetchedProducts.slice(0, 5);
    }

    siteSettings = await client.fetch(siteSettingsQuery);
  } catch (err) {
    console.error("Sanity fetch error on server:", err);
  }

  return <HomeClient heroProducts={heroProducts} featuredProducts={featuredProducts} siteSettings={siteSettings} />;
}
