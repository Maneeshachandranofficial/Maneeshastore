import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone } from 'lucide-react';
import { Product } from '../context/StoreContext';

interface CustomiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function CustomiseModal({ isOpen, onClose, product }: CustomiseModalProps) {
  const whatsappNumber = '919526266369';
  const whatsappMessage = `Hi Maneesha, I would like to customise the ${product.name} (ID: ${product.id}).`;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-[500px] bg-cream z-50 overflow-hidden md:rounded-t-none rounded-t-3xl shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-2xl text-charcoal">Customise Order</h2>
                <button onClick={onClose} className="p-2 -mr-2 text-charcoal/60 hover:text-charcoal transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex gap-4 items-center mb-8 bg-ivory p-4 border border-charcoal/10">
                <div className="w-16 h-16 bg-cream border border-charcoal/10 shrink-0 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-serif text-charcoal text-lg leading-tight">{product.name}</p>
                  <p className="font-sans text-xs text-charcoal/60 tracking-widest uppercase mt-1">{product.price}</p>
                </div>
              </div>

              <p className="font-sans text-sm text-charcoal-light font-light mb-8 leading-relaxed">
                Connect directly with Maneesha to co-create this piece to your exact measurements and preferences.
              </p>

              <div className="flex flex-col gap-4">
                <a 
                  href="https://calendly.com/maneeshachandranweb/30min"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-maroon text-cream py-4 flex items-center justify-center gap-3 font-sans tracking-widest uppercase text-sm hover:bg-maroon/90 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Book Virtual Consultation
                </a>

                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white py-4 flex items-center justify-center gap-3 font-sans tracking-widest uppercase text-sm hover:bg-[#20bd5a] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  Chat on WhatsApp
                </a>
                
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <a href="tel:+919526266369" className="flex flex-col items-center justify-center py-4 border border-charcoal/10 hover:border-charcoal/30 transition-colors group">
                    <Phone className="w-5 h-5 text-charcoal/50 group-hover:text-charcoal mb-2" />
                    <span className="font-sans text-[10px] tracking-widest uppercase text-charcoal/60 group-hover:text-charcoal">Call</span>
                  </a>
                  <a href="mailto:maneeshachandranofficial@gmail.com" className="flex flex-col items-center justify-center py-4 border border-charcoal/10 hover:border-charcoal/30 transition-colors group">
                    <Mail className="w-5 h-5 text-charcoal/50 group-hover:text-charcoal mb-2" />
                    <span className="font-sans text-[10px] tracking-widest uppercase text-charcoal/60 group-hover:text-charcoal">Email</span>
                  </a>
                  <a href="https://instagram.com/maneesha_chandran_official" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center py-4 border border-charcoal/10 hover:border-charcoal/30 transition-colors group">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-charcoal/50 group-hover:text-charcoal mb-2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    <span className="font-sans text-[10px] tracking-widest uppercase text-charcoal/60 group-hover:text-charcoal">Insta</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
