import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { allProductsQuery } from '@/sanity/queries';

export const revalidate = 60;

// Server-side search catalogue (products + categories/collections).
// Fetched same-origin by the nav search so it never trips browser CORS.
export async function GET() {
  try {
    const [prods, cats] = await Promise.all([
      client.fetch(allProductsQuery),
      client.fetch('*[_type == "category"]{ "id": id, name, isCollection }'),
    ]);

    const items = [
      ...(cats || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        type: c.isCollection ? 'collection' : 'category',
        link: `/category/${c.id}`,
      })),
      ...(prods || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        type: 'product',
        link: `/product/${p.id}`,
      })),
    ];

    return NextResponse.json({ items });
  } catch (err) {
    console.error('search-index error:', err);
    return NextResponse.json({ items: [] });
  }
}
