import React, { useState } from 'react';
import { CartItem } from '@/context/StoreContext';
import type { Delivery } from '@/components/DeliveryDetails';

declare global {
  interface Window { Razorpay?: any }
}

export interface CheckoutActionProps {
  cart: CartItem[];
  standardItems?: CartItem[];
  customItems?: CartItem[];
  cartSubtotal: number;
  delivery?: Delivery;
  deliveryComplete?: boolean;
  onNeedDelivery?: () => void;
  onSuccess: () => void;
}

// Load the Razorpay checkout script once, on demand.
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutAction({ cart, standardItems, customItems, cartSubtotal, delivery, deliveryComplete = true, onNeedDelivery, onSuccess }: CheckoutActionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [error, setError] = useState('');

  const hasStandard = !standardItems || standardItems.length > 0;
  const hasCustom = customItems && customItems.length > 0;
  const isMixedCart = hasStandard && hasCustom;
  const needsDelivery = hasStandard && !deliveryComplete;

  const handleCheckoutClick = async () => {
    // Readymade items need a shipping address before we can take payment.
    if (hasStandard && !deliveryComplete) {
      setError('Please add your delivery address above so we can courier your order.');
      onNeedDelivery?.();
      return;
    }
    if (isMixedCart && !whatsappNumber.trim()) {
      setError('Please enter your WhatsApp number for the custom items.');
      return;
    }

    setError('');
    setIsProcessing(true);

    // For a mixed cart, forward the custom pieces to Maneesha as an inquiry.
    if (isMixedCart) {
      try {
        await fetch('/api/custom-inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ whatsappNumber, customItems })
        });
      } catch (err) {
        console.error('Failed to send inquiry', err);
      }
    }

    // Pay for the standard items via Razorpay.
    const payItems = (standardItems && standardItems.length ? standardItems : cart);
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error('Could not load the payment window. Please try again.');

      // 1) Create the order server-side (amount is computed there, not here).
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payItems.map((i) => ({ id: i.id, quantity: i.quantity })) }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order?.error || 'Could not start payment.');

      // 2) Open the Razorpay checkout popup.
      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'Maneesha Chandran',
        description: 'Couture order',
        theme: { color: '#4B272D' },
        prefill: {
          name: delivery?.name || undefined,
          contact: delivery?.phone || whatsappNumber || undefined,
        },
        handler: async (resp: any) => {
          // 3) Verify the payment signature server-side before confirming.
          try {
            const vRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                items: payItems.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, size: i.size })),
                delivery: delivery || null,
              }),
            });
            const v = await vRes.json();
            setIsProcessing(false);
            if (v.valid) onSuccess();
            else setError('We could not verify your payment. If money was deducted, please contact us.');
          } catch (err) {
            console.error('Verification error', err);
            setIsProcessing(false);
            setError('Payment verification failed. Please contact us.');
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });
      rzp.on('payment.failed', (resp: any) => {
        console.error('Razorpay payment failed', resp?.error);
        setIsProcessing(false);
        setError(resp?.error?.description || 'Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err: any) {
      console.error('Checkout error', err);
      setIsProcessing(false);
      setError(err?.message || 'Something went wrong starting the payment.');
    }
  };

  const getWhatsAppLink = () => {
    let header = 'Hello Maneesha Chandran team, I would like to place an order for the following items:\n\n';
    
    const itemsList = cart.map((item, index) => {
        const isCustom = customItems?.some(c => c.cartItemId === item.cartItemId);
        const type = isCustom ? '(Custom Piece)' : '(Standard)';
        return `*${index + 1}. ${item.name}* ${type}\n- Category: ${item.categoryId}\n- Size: ${item.size || 'One Size'}\n- Price: ${item.price}`;
      })
      .join('\n\n');
      
    let footer = `\n\n*Total Value:* ₹ ${cartSubtotal.toLocaleString('en-IN')}\n\nPlease let me know the availability and share payment/delivery details. Thank you!`;
    
    if (customItems && customItems.length > 0) {
      if (standardItems && standardItems.length > 0) {
        footer = `\n\n*Total for Standard Items:* ₹ ${cartSubtotal.toLocaleString('en-IN')}\n\nPlease let me know the availability of the standard items and provide consultation for the custom pieces. Thank you!`;
      } else {
        footer = `\n\nI would like to schedule a consultation for these custom pieces. Please let me know how to proceed. Thank you!`;
      }
    }
    
    const fullMessage = header + itemsList + footer;
    return `https://wa.me/919526266369?text=${encodeURIComponent(fullMessage)}`;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {isMixedCart && (
        <div className="mb-2">
          <label className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/50 mb-2">
            WhatsApp Number (for Custom Items)
          </label>
          <input
            type="tel"
            placeholder="+91"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="w-full bg-cream border border-charcoal/15 rounded-full py-3 px-5 text-base md:text-xs font-light text-charcoal outline-none focus:border-maroon transition-colors"
          />
          {error && <p className="text-maroon text-[10px] mt-1 tracking-wide">{error}</p>}
        </div>
      )}

      {hasStandard && (
        <button
          onClick={handleCheckoutClick}
          disabled={isProcessing}
          aria-disabled={needsDelivery}
          className={`w-full py-4 rounded-full text-xs tracking-[0.2em] uppercase inline-block text-center cursor-pointer transition-all duration-300 disabled:cursor-wait ${
            needsDelivery
              ? 'bg-charcoal/[0.08] text-charcoal/45 hover:bg-charcoal/[0.12]'
              : 'bg-maroon text-cream hover:bg-maroon-dark disabled:opacity-70'
          }`}
        >
          {isProcessing ? 'Processing Securely...' :
            (hasCustom ? 'Pay for Standard Items' : 'Pay Securely via Razorpay')
          }
        </button>
      )}

      {/* Soft hint until the delivery address is added */}
      {needsDelivery && !error && (
        <p className="text-center text-[11px] tracking-wide text-charcoal/50">Add your delivery address above to continue.</p>
      )}

      {/* Payment error (shown for standard-only carts too) */}
      {error && !isMixedCart && (
        <p className="text-maroon text-[11px] text-center tracking-wide">{error}</p>
      )}

      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-4 rounded-full text-xs tracking-[0.2em] uppercase inline-block text-center cursor-pointer transition-all duration-300 ${hasStandard ? 'bg-cream border border-charcoal/20 text-charcoal hover:border-maroon hover:text-maroon' : 'bg-maroon text-cream hover:bg-maroon-dark'}`}
      >
        {hasStandard ? 'Or Order via WhatsApp' : 'Consult via WhatsApp'}
      </a>

      <div className="mt-4 text-center">
        <a
          href="tel:+919526266369"
          className="text-[10px] uppercase tracking-[0.15em] text-charcoal/50 hover:text-maroon transition-colors duration-300 border-b border-transparent hover:border-maroon pb-px inline-flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-px">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Call +91 95262 66369
        </a>
      </div>
    </div>
  );
}
