'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface CollectionBannerProps {
  href: string;
  name: string;
  description?: string;
  image: string;
  index?: number;
}

// Editorial split banner: portrait image on one side, copy on the other, alternating.
export default function CollectionBanner({ href, name, description, image, index = 0 }: CollectionBannerProps) {
  const flip = index % 2 === 1;
  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'relative w-full overflow-hidden rounded-[1.75rem] bg-ivory',
          'aspect-[4/5] max-h-[62vh] sm:max-h-[56vh] md:aspect-auto md:h-[58vh] md:max-h-[520px]',
          flip && 'md:order-2'
        )}
      >
        <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover object-[center_25%]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={cn('flex flex-col', flip ? 'md:order-1 md:items-end md:text-right' : 'items-start text-left')}
      >
        <span className="eyebrow mb-5">Signature Collection</span>
        <span className="mb-6 h-px w-10 bg-gold" />
        <h3 className="display-md text-charcoal">{name}</h3>
        {description && (
          <p className="mt-5 max-w-md font-sans text-base font-light leading-relaxed text-charcoal/60">
            {description}
          </p>
        )}
        <Link
          href={href}
          className="group mt-8 inline-flex items-center gap-3 border-b border-charcoal/20 pb-2 font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal transition-colors hover:border-maroon hover:text-maroon"
        >
          Explore Collection
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  );
}
