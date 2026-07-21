import HomeClient from '@/components/HomeClient';
import { client } from '@/sanity/client';
import { allProductsQuery, siteSettingsQuery, allCollectionsQuery } from '@/sanity/queries';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let products = [];
  let heroProducts = [];
  let featuredProducts = [];
  let collections = [];
  let siteSettings = null;

  try {
    const [fetchedProducts, fetchedCollections, fetchedSettings] = await Promise.all([
      client.fetch(allProductsQuery),
      client.fetch(allCollectionsQuery),
      client.fetch(siteSettingsQuery),
    ]);

    products = fetchedProducts;
    featuredProducts = fetchedProducts.slice(0, 8);
    collections = fetchedCollections || [];
    siteSettings = fetchedSettings;

    // Find products marked as hero, fallback to first 5 if none found
    const heroes = fetchedProducts.filter((p: any) => p.isHero);
    heroProducts = heroes.length > 0 ? heroes : fetchedProducts.slice(0, 5);
  } catch (err) {
    console.error('Sanity fetch error on server:', err);
  }

  return (
    <HomeClient
      products={products}
      heroProducts={heroProducts}
      featuredProducts={featuredProducts}
      collections={collections}
      siteSettings={siteSettings}
    />
  );
}
