'use client';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { cn } from '../utils/cn';

export default function CategoryClient({
  products,
  category,
  subCategories = [],
}: {
  products: any[];
  category: any;
  subCategories?: { id: string; name: string }[];
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Which sub-categories actually have products shown here.
  const usedSubIds = new Set(products.map((p) => p.subCategory).filter(Boolean));
  // Prefer the client-defined sub-categories (ordered); fall back to any the
  // products carry that aren't in the list yet.
  const subs: { id: string; name: string }[] = [
    ...subCategories.filter((s) => usedSubIds.has(s.id)),
    ...Array.from(usedSubIds)
      .filter((id) => !subCategories.some((s) => s.id === id))
      .map((id) => {
        const p = products.find((x) => x.subCategory === id);
        return { id: id as string, name: (p?.subCategoryName || String(id)) as string };
      }),
  ];
  const filters = [{ id: 'all', name: 'All' }, ...subs];

  let displayProducts = products;
  if (activeFilter !== 'all') {
    displayProducts = displayProducts.filter((p) => p.subCategory === activeFilter);
  }

  return (
    <div className="min-h-screen bg-cream pb-32 pt-44 md:pt-[13.5rem]">
      {/* Editorial Header */}
      <Reveal className="mb-14 flex flex-col items-center px-6 text-center">
        <h1 className="display-lg text-charcoal">{category?.name || 'Couture'}</h1>
        <span className="my-6 h-px w-12 bg-gold" />
        <p className="max-w-lg font-sans text-base font-light leading-relaxed text-charcoal/60 md:text-lg">
          {category?.description || 'Explore our curated selection of premium wear, crafted for elegance and poise.'}
        </p>
      </Reveal>

      {/* Subcategory filter pills */}
      {filters.length > 1 && (
        <div className="mb-16 flex w-full flex-wrap justify-center gap-3 px-6">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                'rounded-full px-6 py-3 font-sans text-[11px] uppercase tracking-[0.18em] transition-all duration-300',
                activeFilter === f.id
                  ? 'bg-maroon text-cream'
                  : 'border border-charcoal/15 text-charcoal/60 hover:border-charcoal hover:text-charcoal'
              )}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      {/* Product grid */}
      {displayProducts.length > 0 ? (
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-6 md:px-8 lg:grid-cols-4">
          {displayProducts.map((product: any, idx: number) => (
            <Reveal key={product.id} delay={(idx % 4) * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center px-6 py-24 text-center">
          <p className="font-sans text-lg font-light text-charcoal/50">
            This collection is coming soon. Please check back shortly.
          </p>
        </div>
      )}
    </div>
  );
}
