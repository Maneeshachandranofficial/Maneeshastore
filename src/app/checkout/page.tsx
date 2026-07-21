'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import CheckoutAction from '@/components/CheckoutAction';

export default function CheckoutPage() {
  const { cartItems, removeFromCart, clearCart } = useStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [customItemsData, setCustomItemsData] = useState<any[]>([]);

  const priceOf = (item: any) => parseInt(item.price.replace(/[^\d]/g, ''), 10) || 0;

  const standardItems = cartItems.filter((item) => priceOf(item) > 0 && item.sizingType !== 'customise');
  const customItems = cartItems.filter((item) => priceOf(item) === 0 || item.sizingType === 'customise');
  const cartSubtotal = standardItems.reduce((total, item) => total + priceOf(item) * item.quantity, 0);

  const handleSuccess = () => {
    if (customItems.length > 0) setCustomItemsData(customItems);
    setIsSuccess(true);
    clearCart();
  };

  const getSuccessWhatsAppLink = () => {
    const list = customItemsData.map((item, idx) => `*${idx + 1}. ${item.name}* (${item.size || 'One Size'})`).join('%0A');
    const msg = `Hi, I just completed a payment for my standard items. I would also like to schedule a consultation for the custom pieces that were in my bag:%0A%0A${list}`;
    return `https://wa.me/919526266369?text=${msg}`;
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-ivory">
            <Check className="h-8 w-8 text-gold-dark" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="display-md mb-4 text-maroon">Order Confirmed</h1>
            <p className="text-sm leading-relaxed tracking-wide text-charcoal/60">
              Thank you for shopping with Maneesha Chandran. We have received your order and will process it shortly.
              {customItemsData.length > 0 && (
                <span className="mt-4 block text-maroon">
                  Your custom piece inquiry has been sent to our team. You can also send the details via WhatsApp below.
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {customItemsData.length > 0 && (
              <a
                href={getSuccessWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-all hover:bg-[#128C7E]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Send Custom Request
              </a>
            )}
            <Link
              href="/lookbook"
              className={`inline-block w-full rounded-full py-4 text-center text-[11px] uppercase tracking-[0.2em] transition-all ${
                customItemsData.length > 0
                  ? 'border border-charcoal/15 text-charcoal hover:bg-ivory'
                  : 'bg-maroon text-cream hover:bg-maroon-dark'
              }`}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-36 text-charcoal sm:px-8 md:px-16 md:pt-44 lg:px-24">
      <main className="mx-auto max-w-[1100px]">
        {/* Title */}
        <div className="mb-10 text-center md:mb-14">
          <span className="eyebrow mb-4 block">Secure Checkout</span>
          <h1 className="display-md text-maroon">Shopping Bag</h1>
          {cartItems.length > 0 && (
            <p className="mt-5 text-[11px] uppercase tracking-[0.25em] text-charcoal/50">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </p>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center md:py-28">
            <span className="mb-8 h-14 w-px bg-gold/50" />
            <h2 className="mb-3 font-sans text-lg font-light text-maroon md:text-xl">Your bag is empty</h2>
            <p className="mb-10 max-w-[300px] text-sm leading-relaxed tracking-wide text-charcoal/60">
              Explore our curated collections and discover pieces crafted with heritage and intention.
            </p>
            <Link href="/lookbook" className="inline-block rounded-full bg-maroon px-12 py-4 text-[11px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-maroon-dark">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            {/* Items */}
            <div className="flex-1">
              <div className="mb-0 flex justify-between border-b border-charcoal/10 pb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-charcoal/50">Item</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-charcoal/50">Price</span>
              </div>

              {standardItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-5 border-b border-charcoal/10 py-7 md:gap-6 md:py-8">
                  <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-ivory">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <p className="mb-1 text-[9.5px] uppercase tracking-[0.3em] text-gold-dark">{item.categoryId}</p>
                      <h3 className="font-sans text-base font-light leading-snug text-charcoal md:text-lg">{item.name}</h3>
                      {item.size && (
                        <p className="mt-2 text-[11px] tracking-wide text-charcoal/60">
                          Size — <span className="text-charcoal">{item.size}</span>
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex items-end justify-between sm:mt-3">
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="border-b border-transparent pb-px text-[10px] uppercase tracking-[0.15em] text-charcoal/50 transition-colors duration-300 hover:border-maroon hover:text-maroon"
                      >
                        Remove
                      </button>
                      <span className="text-[15px] tracking-widest text-gold-dark">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}

              {customItems.length > 0 && (
                <div className="mt-12">
                  <h3 className="mb-6 border-b border-charcoal/10 pb-2 font-sans text-sm uppercase tracking-[0.25em] text-maroon">
                    Requires Consultation
                  </h3>
                  {customItems.map((item, index) => (
                    <div key={`${item.id}-custom-${index}`} className="flex gap-5 border-b border-charcoal/10 py-5 opacity-80 md:gap-6">
                      <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-ivory">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover grayscale" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div>
                          <p className="mb-1 text-[9px] uppercase tracking-[0.3em] text-gold-dark">{item.categoryId}</p>
                          <h3 className="font-sans text-sm font-light leading-snug text-charcoal md:text-base">{item.name}</h3>
                        </div>
                        <div className="mt-2 flex items-end justify-between">
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-[9px] uppercase tracking-[0.15em] text-charcoal/50 transition-colors duration-300 hover:text-maroon">
                            Remove
                          </button>
                          <span className="text-xs italic text-charcoal/50">Custom Order</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="w-full flex-shrink-0 lg:w-[360px]">
              <div className="rounded-2xl border border-charcoal/10 bg-ivory p-8 md:p-10">
                <h2 className="mb-8 border-b border-charcoal/10 pb-5 font-sans text-sm uppercase tracking-[0.25em] text-gold-dark">Order Summary</h2>
                <div className="space-y-4 text-[13.5px] text-charcoal/60">
                  <div className="flex justify-between">
                    <span className="tracking-wide">Subtotal</span>
                    <span className="tracking-wider text-charcoal">₹ {cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="tracking-wide">Shipping</span>
                    <span className="text-xs italic tracking-wider text-gold-dark">Complimentary</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="tracking-wide">Taxes</span>
                    <span className="text-xs tracking-wide">Calculated at checkout</span>
                  </div>
                </div>
                <div className="my-7 h-px bg-charcoal/10" />
                <div className="mb-9 flex items-baseline justify-between">
                  <span className="text-[13px] uppercase tracking-[0.2em] text-charcoal">Total</span>
                  <span className="text-2xl font-light tracking-widest text-maroon md:text-[26px]">₹ {cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <CheckoutAction
                  cart={cartItems}
                  standardItems={standardItems}
                  customItems={customItems}
                  cartSubtotal={cartSubtotal}
                  onSuccess={handleSuccess}
                />
                <div className="mt-6 flex flex-col items-center gap-1">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-charcoal/50">Secure SSL Checkout</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal/50">Powered by Razorpay</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-2.5 text-center">
                <p className="text-xs tracking-wide text-charcoal/60">Need assistance with sizing?</p>
                <a href="mailto:maneeshachandranofficial@gmail.com" className="border-b border-maroon/40 pb-0.5 text-xs uppercase tracking-wider text-maroon transition-colors duration-300 hover:border-maroon">
                  Contact a Stylist
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
