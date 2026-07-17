import CategoryClient from '@/components/CategoryClient';
import { client } from '@/sanity/client';
import { allProductsQuery, categoryByIdQuery } from '@/sanity/queries';

export const revalidate = 60;

export default async function Category({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let products = [];
  let category = { name: 'Collection', description: '', isCollection: false };

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
