'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price?: string;
    image: string;
    priceOnRequest?: boolean;
  };
}

// Tall 3:4 rounded product card — the core grid unit across the site.
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-ivory">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          {/* Quick-view chip */}
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/80 text-charcoal opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100 group-hover:right-3.5">
            <ArrowUpRight className="h-4 w-4" />
          </span>

          {/* Label */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-5 text-center">
            <h3 className="translate-y-2 font-sans text-sm uppercase tracking-[0.18em] text-white transition-transform duration-500 group-hover:translate-y-0 md:text-base">
              {product.name}
            </h3>
            {(product.priceOnRequest || product.price) && (
              <span className="mt-1 max-h-0 overflow-hidden font-sans text-xs text-white opacity-0 transition-all duration-500 group-hover:max-h-8 group-hover:opacity-100">
                {product.priceOnRequest ? 'Price on Request' : product.price}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
