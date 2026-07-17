import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface GridCardProps {
  product: any;
}

export default function GridCard({ product }: GridCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block relative overflow-hidden bg-charcoal w-full h-[60vh] md:h-[70vh]">
      {/* Background Image */}
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col items-center text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="font-sans text-white text-lg md:text-xl tracking-[0.2em] uppercase font-light mb-2">
          {product.name}
        </h3>
        
        {/* Hover Reveal Items */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center gap-3 mt-2">
           <span className="font-serif text-gold text-sm italic">{product.price}</span>
           <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white hover:bg-white hover:text-charcoal transition-colors mt-2">
             <ArrowUpRight className="w-4 h-4" />
           </span>
        </div>
      </div>
    </Link>
  );
}
