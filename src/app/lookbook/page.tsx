'use client';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import GridCard from '@/components/GridCard';
import { client } from '@/sanity/client';
import { allProductsQuery } from '@/sanity/queries';

export default function Lookbook() {
  const [displayProducts, setDisplayProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await client.fetch(allProductsQuery);
        // Show only products that belong to a collection
        setDisplayProducts(products.filter((p: any) => !!p.collection));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center pt-20"><div className="w-12 h-12 border-4 border-charcoal border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-32">
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="py-12 flex flex-col items-center text-center mb-16 px-6"
        >
          <h1 className="font-serif text-5xl md:text-7xl text-charcoal mb-6">
            Lookbooks
          </h1>
          <div className="w-12 h-[1px] bg-maroon mb-6"></div>
          <p className="font-sans text-charcoal/60 max-w-lg font-light text-lg">
            Explore our curated selection of bespoke, customisable pieces.
          </p>
        </motion.div>

        {/* Zero-Gap Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {displayProducts.map((product, idx) => (
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
