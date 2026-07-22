'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  href: string;
  label: string;
  caption?: string;
  image: string;
  priority?: boolean;
}

// Tall editorial category tile with overlay label + Shop Now.
export default function CategoryCard({ href, label, caption, image, priority }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link href={href} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.75rem] bg-charcoal">
          <img
            src={image}
            alt={label}
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-7 text-center md:p-8">
            <h3 className="font-sans text-2xl font-light uppercase tracking-[0.14em] text-white md:text-[1.7rem]">
              {label}
            </h3>
            {caption && (
              <p className="mt-2 max-w-[16rem] font-sans text-xs font-light leading-relaxed text-white/70">
                {caption}
              </p>
            )}
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-6 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-black backdrop-blur-sm transition-colors duration-300 group-hover:bg-black group-hover:text-white">
              Shop Now <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
