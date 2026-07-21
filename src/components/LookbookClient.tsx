'use client';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';

export default function LookbookClient({ displayProducts }: { displayProducts: any[] }) {
  return (
    <div className="min-h-screen bg-cream pb-32 pt-36 md:pt-44">
      {/* Editorial Header */}
      <Reveal className="mb-16 flex flex-col items-center px-6 text-center">
        <span className="eyebrow mb-6">The Atelier</span>
        <h1 className="display-lg text-charcoal">Lookbook</h1>
        <span className="my-6 h-px w-12 bg-gold" />
        <p className="max-w-lg font-sans text-base font-light leading-relaxed text-charcoal/60 md:text-lg">
          Explore our curated selection of bespoke, customisable pieces.
        </p>
      </Reveal>

      {/* Product grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-6 md:px-8 lg:grid-cols-4">
        {displayProducts.map((product: any, idx: number) => (
          <Reveal key={product.id} delay={(idx % 4) * 0.08}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
