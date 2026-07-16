'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { products } from '@/data/store';
import { X, ChevronRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateCartQuantity } = useStore();

  const subtotal = cartItems.reduce((total, item) => {
    const priceStr = item.price.replace(/[^\d]/g, '');
    const priceNum = parseInt(priceStr, 10) || 0;
    return total + (priceNum * item.quantity);
  }, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="bg-cream min-h-screen pt-40 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 pb-8 border-b border-charcoal/10"
        >
           <h1 className="font-serif text-5xl text-charcoal mb-4">Your Cart</h1>
           <p className="font-sans text-charcoal-light font-light">2 items eligible for complimentary shipping.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            {cartItems.length === 0 ? (
              <p className="font-sans text-charcoal/50 text-lg">Your cart is empty.</p>
            ) : (
              cartItems.map((item, i) => (
                <motion.div 
                  key={item.cartItemId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-8 items-start relative group"
                >
                  <Link href={`/product/${item.id}`} className="w-24 md:w-32 aspect-[9/16] overflow-hidden shrink-0 bg-ivory">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </Link>
                  
                  <div className="flex-grow flex flex-col justify-between h-full py-2">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <Link href={`/product/${item.id}`} className="font-serif text-charcoal hover:text-charcoal-light transition-colors text-xl md:text-2xl leading-tight">
                          {item.name}
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-charcoal/40 hover:text-charcoal transition-colors"
                        >
                          <X className="w-5 h-5" strokeWidth={1} />
                        </button>
                      </div>
                      <p className="font-sans text-charcoal-light text-sm mt-3 font-light">Size: {item.size}</p>
                    </div>
                    
                    <div className="flex items-end justify-between mt-8">
                      <div className="flex items-center border border-charcoal/20">
                        <button 
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
                        >
                          -
                        </button>
                        <span className="font-sans text-sm w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <span className="font-sans text-charcoal text-xl tracking-wide">{item.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Checkout Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <div className="bg-ivory p-8 md:p-10 sticky top-40">
              <h2 className="font-sans font-medium tracking-widest uppercase text-sm text-charcoal mb-8 border-b border-charcoal/10 pb-4">Order Summary</h2>
              
              <div className="space-y-6 font-sans text-sm font-light text-charcoal-light mb-8 pb-8 border-b border-charcoal/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-charcoal tracking-wide">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-charcoal tracking-wide">Complimentary</span>
                </div>
              </div>
              
              <div className="flex justify-between mb-10 font-sans">
                <span className="text-lg text-charcoal">Total</span>
                <span className="text-2xl text-charcoal tracking-wide">{formatPrice(subtotal)}</span>
              </div>
              
              <Link href="/checkout" className="w-full bg-charcoal text-cream py-5 text-center font-sans tracking-widest uppercase text-sm hover:bg-charcoal-light transition-colors flex items-center justify-center gap-2">
                Checkout <ChevronRight className="w-4 h-4" />
              </Link>
              
              <p className="font-sans text-xs text-charcoal/50 text-center mt-6 font-light">
                Taxes and duties calculated at checkout.
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}

