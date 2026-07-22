'use client';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { cn } from '../utils/cn';

export default function CategoryClient({
  products,
  category,
}: {
  products: any[];
  category: any;
}) {
  const [activeFilter, setActiveFilter] = useState('All');

  const availableSubCategories = Array.from(new Set(products.map((p) => p.subCategory).filter(Boolean))) as string[];
  const filters = ['All', ...availableSubCategories.map((c) => c.charAt(0).toUpperCase() + c.slice(1))];

  let displayProducts = products;
  if (activeFilter !== 'All') {
    displayProducts = displayProducts.filter((p) => p.subCategory === activeFilter.toLowerCase());
  }

  return (
    <div className="min-h-screen bg-cream pb-32 pt-36 md:pt-44">
      {/* Editorial Header */}
      <Reveal className="mb-14 flex flex-col items-center px-6 text-center">
        <span className="eyebrow mb-6">Maison de Couture</span>
        <h1 className="display-lg text-charcoal">{category?.name || 'Couture'}</h1>
        <span className="my-6 h-px w-12 bg-gold" />
        <p className="max-w-lg font-sans text-base font-light leading-relaxed text-charcoal/60 md:text-lg">
          {category?.description || 'Explore our curated selection of premium wear, crafted for elegance and poise.'}
        </p>
      </Reveal>

      {/* Subcategory filter pills */}
      {filters.length > 1 && (
        <div className="mb-16 flex w-full flex-wrap justify-center gap-3 px-6">
          {filters.map((filterName) => (
            <button
              key={filterName}
              onClick={() => setActiveFilter(filterName)}
              className={cn(
                'rounded-full px-6 py-3 font-sans text-[11px] uppercase tracking-[0.18em] transition-all duration-300',
                activeFilter === filterName
                  ? 'bg-maroon text-cream'
                  : 'border border-charcoal/15 text-charcoal/60 hover:border-charcoal hover:text-charcoal'
              )}
            >
              {filterName}
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
