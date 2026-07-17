'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import GridCard from '@/components/GridCard';

export default function CategoryClient({ 
  products, 
  category 
}: { 
  products: any[], 
  category: any 
}) {
  const [activeFilter, setActiveFilter] = useState('All');

  const availableSubCategories = Array.from(new Set(products.map(p => p.subCategory).filter(Boolean))) as string[];
  const filters = ['All', ...availableSubCategories.map(c => c.charAt(0).toUpperCase() + c.slice(1))];

  let displayProducts = products;
  if (activeFilter !== 'All') {
    displayProducts = displayProducts.filter(p => p.subCategory === activeFilter.toLowerCase());
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-32">
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="py-12 flex flex-col items-center text-center mb-8 px-6"
        >
          <h1 className="font-sans text-5xl md:text-7xl text-charcoal mb-6">
            {category?.name || 'Collection'}
          </h1>
          <div className="w-12 h-[1px] bg-maroon mb-6"></div>
          <p className="font-sans text-charcoal/60 max-w-lg font-light text-lg">
            {category?.description || `Explore our curated selection of premium wear, crafted for elegance and poise.`}
          </p>
        </motion.div>

        {/* Subcategories (if any) */}
        <div className="flex flex-col items-center mb-16 w-full px-6">
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

        {/* Zero-Gap Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {displayProducts.map((product: any, idx: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: (idx % 4) * 0.1 }}
            >
              <GridCard product={product} />
            </motion.div>
          ))}
        </div>
    </div>
  );
}
