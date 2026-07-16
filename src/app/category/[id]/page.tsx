'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { products, categories, collections } from '@/data/store';
import TiltCard from '@/components/TiltCard';

export default function Category() {
  const params = useParams();
  const id = params?.id as string;
  const [activeFilter, setActiveFilter] = useState('All');
  
  const category = [...categories, ...collections].find(c => c.id === id) || categories[0];
  const categoryProducts = products.filter(p => p.categoryId === id);
  let displayProducts = categoryProducts.length > 0 ? categoryProducts : products;

  const availableSubCategories = Array.from(new Set(categoryProducts.map(p => p.subCategory).filter(Boolean))) as string[];
  const filters = ['All', ...availableSubCategories.map(c => c.charAt(0).toUpperCase() + c.slice(1))];

  if (activeFilter !== 'All') {
    displayProducts = displayProducts.filter(p => p.subCategory === activeFilter.toLowerCase());
  }

  return (
    <div className="bg-cream min-h-screen pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="py-12 flex flex-col items-center text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-7xl text-charcoal mb-6">
            {category.name}
          </h1>
          <div className="w-12 h-[1px] bg-gold mb-6"></div>
          <p className="font-sans text-charcoal-light max-w-lg font-light text-lg">
            Explore our curated selection of premium {category.name.toLowerCase()} wear, crafted for elegance and poise.
          </p>
        </motion.div>

        {/* Subcategories (if any) */}
        <div className="flex flex-col items-center mb-16 w-full">
           {filters.length > 1 && (
             <div className="flex flex-wrap justify-center gap-6 md:gap-10 w-full">
               {filters.map((filterName) => (
                 <button
                   key={filterName}
                   onClick={() => setActiveFilter(filterName)}
                   className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 pb-1 border-b ${
                     activeFilter === filterName 
                       ? 'text-charcoal border-charcoal font-medium' 
                       : 'text-charcoal/50 border-transparent hover:text-charcoal'
                   }`}
                 >
                   {filterName}
                 </button>
               ))}
             </div>
           )}
        </div>

        {/* Standardized Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
          {displayProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={idx % 2 !== 0 ? "mt-12 sm:mt-16 md:mt-24 lg:mt-32" : ""}
            >
              <TiltCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

