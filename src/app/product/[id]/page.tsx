import ProductClient from '@/components/ProductClient';
import { client } from '@/sanity/client';
import { productByIdQuery } from '@/sanity/queries';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product = null;

  try {
    product = await client.fetch(productByIdQuery, { id });
  } catch (err) {
    console.error("Sanity fetch error on server:", err);
  }

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
