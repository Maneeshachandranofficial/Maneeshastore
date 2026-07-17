'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStore } from '@/context/StoreContext';
import CustomiseModal from '@/components/CustomiseModal';

export default function ProductClient({ product }: { product: any }) {
  const navigate = useRouter();
  const { addToCart, addToSaved, isSaved } = useStore();

  const [selectedSize, setSelectedSize] = useState('M');
  const [showCustomiseModal, setShowCustomiseModal] = useState(false);
  const isCustomiseOnly = product?.sizingType === 'customise';

  const saved = product ? isSaved(product.id, selectedSize) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product as any, selectedSize);
    navigate.push('/cart');
  };

  const handleToggleSave = () => {
    if (!product) return;
    if (!saved) {
      addToSaved(product as any, selectedSize);
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pb-12 flex items-center gap-3 text-xs tracking-widest uppercase text-charcoal/50 font-sans"
        >
          <Link href="/" className="hover:text-charcoal transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Home
          </Link>
          <span>/</span>
          <Link href={`/category/${product.categoryId}`} className="hover:text-charcoal transition-colors">
            {product.categoryId}
          </Link>
          <span>/</span>
          <span className="text-charcoal truncate">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full bg-ivory p-4 md:p-8 flex justify-center items-center">
                <div className="w-full max-h-[75vh] relative overflow-hidden flex justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-auto h-auto max-w-full max-h-[75vh] object-contain hover:scale-105 transition-transform duration-1000 ease-[0.16,1,0.3,1]"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 sticky top-40 flex flex-col pt-8"
          >
            <div className="mb-12">
              <h1 className="font-sans text-4xl md:text-5xl text-charcoal mb-4 leading-tight">{product.name}</h1>
              <p className="font-sans text-xl font-normal text-gold-dark mb-8 tracking-wide">{product.price}</p>
              <p className="font-sans text-charcoal-light font-light leading-relaxed text-base md:text-lg">
                {product.description}
              </p>
            </div>

            {!isCustomiseOnly && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-sans tracking-widest text-xs uppercase text-charcoal font-medium">Select Size</h3>
                   <button className="text-xs font-sans tracking-widest uppercase text-charcoal/60 hover:text-charcoal transition-colors border-b border-charcoal/20 pb-1">
                     Size Guide
                   </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-14 h-14 border flex items-center justify-center font-sans text-sm transition-all duration-200",
                        selectedSize === size
                          ? "bg-charcoal text-cream border-charcoal"
                          : "border-charcoal/20 hover:border-charcoal hover:-translate-y-0.5 text-charcoal"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 mb-16">
              {isCustomiseOnly ? (
                <button
                  onClick={() => setShowCustomiseModal(true)}
                  className="w-full bg-charcoal text-cream py-5 text-center font-sans tracking-widest uppercase text-sm hover:bg-maroon transition-colors duration-300"
                >
                  Customise Order
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-charcoal text-cream py-5 text-center font-sans tracking-widest uppercase text-sm hover:bg-maroon transition-colors duration-300"
                >
                  Add to Cart
                </button>
              )}
              <div className="flex gap-4">
                <button
                  onClick={handleToggleSave}
                  className="flex-1 bg-transparent border border-charcoal/20 py-4 flex items-center justify-center gap-2 font-sans tracking-widest uppercase text-xs text-charcoal hover:border-maroon transition-colors duration-300"
                >
                  <Heart className={cn("w-3 h-3 transition-colors", saved ? "text-maroon fill-maroon" : "")} />
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button className="flex-1 bg-transparent border border-charcoal/20 py-4 flex items-center justify-center gap-2 font-sans tracking-widest uppercase text-xs text-charcoal hover:border-maroon transition-colors duration-300">
                  <Share2 className="w-3 h-3" /> Share
                </button>
              </div>
            </div>

            <div className="space-y-8 font-sans text-sm font-light text-charcoal/70 border-t border-charcoal/10 pt-8">
              <div>
                <h4 className="tracking-widest uppercase text-xs text-charcoal mb-3">Shipping &amp; Returns</h4>
                <p className="leading-relaxed">Complimentary shipping on all orders. Returns accepted within 14 days of delivery in original condition.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CustomiseModal
        isOpen={showCustomiseModal}
        onClose={() => setShowCustomiseModal(false)}
        product={product as any}
      />
    </div>
  );
}
