import CategoryClient from '@/components/CategoryClient';
import { client } from '@/sanity/client';
import { allProductsQuery, categoryByIdQuery } from '@/sanity/queries';

export const revalidate = 60;

// Turn a URL slug into a readable title, e.g. "ethnic" -> "Ethnic",
// "onam-2026-chaayam" -> "Onam 2026 Chaayam". Used when a category has no
// Sanity document yet so the page never shows a generic "Collection".
function titleFromSlug(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function Category({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let products = [];
  let category = { name: titleFromSlug(id), description: '', isCollection: false };

  try {
    const [fetchedProducts, fetchedCategory] = await Promise.all([
      client.fetch(allProductsQuery),
      client.fetch(categoryByIdQuery, { id })
    ]);

    category = fetchedCategory || category;

    // Filter products
    products = fetchedProducts.filter((p: any) =>
      category.isCollection ? p.collection === id : p.categoryId === id
    );
  } catch (err) {
    console.error("Sanity fetch error on server:", err);
  }

  return <CategoryClient products={products} category={category} />;
}
