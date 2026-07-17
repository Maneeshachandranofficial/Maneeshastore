import LookbookClient from '@/components/LookbookClient';
import { client } from '@/sanity/client';
import { allProductsQuery } from '@/sanity/queries';

export const revalidate = 60;

export default async function Lookbook() {
  let displayProducts = [];
  try {
    const products = await client.fetch(allProductsQuery);
    // Show only products that belong to a collection
    displayProducts = products.filter((p: any) => !!p.collection);
  } catch (err) {
    console.error("Sanity fetch error on server:", err);
  }

  return <LookbookClient displayProducts={displayProducts} />;
}
