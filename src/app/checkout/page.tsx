'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import CheckoutAction from '@/components/CheckoutAction';

export default function CheckoutPage() {
  const { cartItems, removeFromCart, clearCart } = useStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [customItemsData, setCustomItemsData] = useState<any[]>([]);

  const standardItems = cartItems.filter(item => {
    const priceStr = item.price.replace(/[^\d]/g, '');
    const priceNum = parseInt(priceStr, 10) || 0;
    return priceNum > 0 && item.sizingType !== 'customise';
  });

  const customItems = cartItems.filter(item => {
    const priceStr = item.price.replace(/[^\d]/g, '');
    const priceNum = parseInt(priceStr, 10) || 0;
    return priceNum === 0 || item.sizingType === 'customise';
  });

  const cartSubtotal = standardItems.reduce((total, item) => {
    const priceStr = item.price.replace(/[^\d]/g, '');
    const priceNum = parseInt(priceStr, 10) || 0;
    return total + (priceNum * item.quantity);
  }, 0);

  const lastVisited = "/";

  const handleSuccess = () => {
    if (customItems.length > 0) {
      setCustomItemsData(customItems);
    }
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
      <div className="bg-[var(--cream)] min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 bg-[var(--ivory)] rounded-full flex items-center justify-center mx-auto border border-[var(--line)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--gold)]">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-medium text-[var(--oxblood-deep)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Order Confirmed
            </h1>
            <p className="text-[13px] text-[var(--text-muted)] tracking-wide leading-relaxed">
              Thank you for shopping with Maneesha Chandran. We have received your order and will process it shortly.
              {customItemsData.length > 0 && (
                <span className="block mt-4 text-oxblood">
                  Your custom piece inquiry has been sent to our team. You can also send the details via WhatsApp below.
                </span>
              )}
            </p>
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
            {customItemsData.length > 0 && (
              <a 
                href={getSuccessWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 text-[11px] tracking-[0.2em] uppercase inline-flex justify-center items-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Send Custom Request
              </a>
            )}
            
            <Link href={lastVisited || "/lookbook"} className={`w-full py-4 text-[11px] tracking-[0.2em] uppercase inline-block text-center transition-all ${customItemsData.length > 0 ? 'bg-[var(--ivory)] text-[var(--near-black)] border border-[var(--line)] hover:bg-[var(--line)]' : 'bg-[var(--near-black)] text-[var(--cream)] hover:bg-black border border-[var(--near-black)]'}`}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--cream)] min-h-screen text-[var(--near-black)] px-4 sm:px-8 md:px-16 lg:px-24 pt-24">

      {/* ─── Main Content ─── */}
      <main className="max-w-[1100px] mx-auto pb-14 md:pb-20">

        {/* Page Title */}
        <div className="text-center mb-8 md:mb-12">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[var(--gold)] block mb-4">Secure Checkout</span>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl leading-tight font-medium text-[var(--oxblood-deep)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Shopping Bag
          </h1>
          {cartItems.length > 0 && (
            <p className="text-[11px] tracking-[0.25em] uppercase text-[var(--text-muted)] mt-6">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </p>
          )}
        </div>

        {/* ─── Empty State ─── */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20 md:py-28 flex flex-col items-center">
            <div className="w-px h-14 bg-[var(--gold)]/50 mb-8" />
            <h2
              className="text-lg md:text-xl font-medium text-[var(--oxblood-deep)] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Your bag is empty
            </h2>
            <p className="text-sm text-[var(--text-muted)] tracking-wide max-w-[300px] leading-relaxed mb-10">
              Explore our curated collections and discover pieces crafted with heritage and intention.
            </p>
            <Link
              href={lastVisited || '/lookbook'}
              className="btn-primary px-12 py-4 text-[11px] tracking-[0.2em] inline-block"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* ─── Cart Items (Left) ─── */}
            <div className="flex-1">
              {/* Column Headers */}
              <div className="flex justify-between border-b border-[var(--line)] pb-4 mb-0">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                  Item
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                  Price
                </span>
              </div>

              {/* Standard Items */}
              {standardItems.length > 0 && standardItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex gap-5 md:gap-6 py-7 md:py-8 border-b border-[var(--line)]"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-28 bg-[var(--ivory)] flex-shrink-0 overflow-hidden shadow-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <p className="text-[9.5px] uppercase tracking-[0.3em] text-[var(--gold)] mb-1">
                        {item.categoryId}
                      </p>
                      <h3
                        className="text-base md:text-lg leading-snug font-medium text-[var(--near-black)]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-[11px] text-[var(--text-muted)] mt-2 tracking-wide">
                          Size — <span className="text-[var(--near-black)]">{item.size}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-end mt-4 sm:mt-3">
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--oxblood)] transition-colors duration-300 border-b border-transparent hover:border-[var(--oxblood)] pb-px"
                      >
                        Remove
                      </button>
                      <span className="text-[14px] md:text-[15px] tracking-widest text-[var(--near-black)]">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Custom Items */}
              {customItems.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-sm tracking-[0.25em] uppercase text-oxblood mb-6 pb-2 border-b border-[var(--line)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Requires Consultation
                  </h3>
                  {customItems.map((item, index) => (
                    <div
                      key={`${item.id}-custom-${index}`}
                      className="flex gap-5 md:gap-6 py-5 border-b border-[var(--line)] opacity-80"
                    >
                      <div className="w-16 h-20 bg-[var(--ivory)] flex-shrink-0 overflow-hidden shadow-sm">
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full grayscale" />
                      </div>
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--gold)] mb-1">{item.categoryId}</p>
                          <h3 className="text-sm md:text-base leading-snug font-medium text-[var(--near-black)]" style={{ fontFamily: 'var(--font-heading)' }}>
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--oxblood)] transition-colors duration-300"
                          >
                            Remove
                          </button>
                          <span className="text-xs italic text-[var(--text-muted)]">Custom Order</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Order Summary (Right) ─── */}
            <div className="lg:w-[360px] flex-shrink-0 w-full">
              <div className="bg-[var(--ivory)] border border-[var(--line)] p-8 md:p-10 shadow-sm">

                {/* Summary Heading */}
                <h2
                  className="text-sm tracking-[0.25em] uppercase text-[var(--gold)] mb-8 pb-5 border-b border-[var(--line)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Order Summary
                </h2>

                {/* Line Items */}
                <div className="space-y-4 text-[13.5px] text-[var(--text-muted)]">
                  <div className="flex justify-between">
                    <span className="tracking-wide">Subtotal</span>
                    <span className="text-[var(--near-black)] tracking-wider">₹ {cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="tracking-wide">Shipping</span>
                    <span className="text-[var(--gold)] italic text-xs tracking-wider">Complimentary</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="tracking-wide">Taxes</span>
                    <span className="text-xs tracking-wide">Calculated at checkout</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--line)] my-7" />

                {/* Total */}
                <div className="flex justify-between items-baseline mb-9">
                  <span
                    className="text-[13px] tracking-[0.2em] uppercase text-[var(--near-black)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Total
                  </span>
                  <span
                    className="text-2xl md:text-[26px] font-medium text-[var(--oxblood-deep)] tracking-widest"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    ₹ {cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* CTA */}
                <CheckoutAction 
                  cart={cartItems} 
                  standardItems={standardItems}
                  customItems={customItems}
                  cartSubtotal={cartSubtotal} 
                  onSuccess={handleSuccess} 
                />

                {/* Trust Badge */}
                <div className="mt-6 flex flex-col items-center gap-1">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    Secure SSL Checkout
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Powered by Razorpay
                  </p>
                </div>
              </div>

              {/* Stylist CTA */}
              <div className="mt-8 text-center flex flex-col items-center gap-2.5">
                <p className="text-xs text-[var(--text-muted)] tracking-wide">
                  Need assistance with sizing?
                </p>
                <a
                  href="#contact"
                  className="text-xs text-[var(--oxblood)] border-b border-[var(--oxblood)]/40 hover:border-[var(--oxblood)] pb-0.5 transition-colors duration-300 tracking-wider uppercase"
                >
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
