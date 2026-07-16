'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';
import Logo from './Logo';
import { categories, collections, products } from '../data/store';
import { useStore } from '../context/StoreContext';

export default function Navigation() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = usePathname();
  const navigate = useRouter();
  const { savedItems, cartItems, moveToCart, removeFromSaved } = useStore();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsSavedOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  const allSearchableItems = [
    ...categories.map(c => ({ ...c, type: 'category' as const, link: `/category/${c.id}` })),
    ...collections.map(c => ({ ...c, type: 'collection' as const, link: `/category/${c.id}` })),
    ...products.map(p => ({ ...p, type: 'product' as const, link: `/product/${p.id}` }))
  ];

  const filteredItems = searchQuery
    ? allSearchableItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => {
      setIsScrolled(v > 60);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Spring animations for the nav container
  const springConfig = { stiffness: 300, damping: 30 };
  const navWidth = useSpring(useTransform(scrollY, [0, 80], ["100%", "70%"]), springConfig);
  const navTop = useSpring(useTransform(scrollY, [0, 80], ["0px", "20px"]), springConfig);
  const navRadius = useSpring(useTransform(scrollY, [0, 80], ["0px", "40px"]), springConfig);
  const paddingX = useSpring(useTransform(scrollY, [0, 80], ["40px", "24px"]), springConfig);
  const paddingY = useSpring(useTransform(scrollY, [0, 80], ["24px", "12px"]), springConfig);

  return (
    <div ref={navRef} className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <motion.header
        style={{ 
          width: navWidth,
          top: navTop,
          borderRadius: navRadius,
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
        className={cn(
          "relative pointer-events-auto transition-colors duration-500 max-w-[1400px]",
          isScrolled ? "bg-cream/80 backdrop-blur-2xl border border-ivory/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)]" : "bg-transparent border-transparent"
        )}
      >
        <div className="flex items-center justify-between w-full relative">
          
          {/* Mobile Menu Icon */}
          <button className="lg:hidden p-2 text-charcoal rounded-full hover:bg-black/5 transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          {/* Left Nav (Categories) */}
          <nav className={cn(
            "hidden lg:flex items-center gap-6 font-sans text-xs tracking-widest uppercase font-medium transition-all duration-500",
            isScrolled ? "text-charcoal/70" : "text-charcoal/90"
          )}>
            <div 
              className="relative group py-2"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:text-maroon transition-colors p-1 flex items-center"
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-4 bg-cream/90 backdrop-blur-2xl border border-ivory shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl p-6 min-w-[240px] flex flex-col gap-4 z-50 tracking-normal normal-case"
                  >
                     <Link href="/category/bride" className="text-sm font-semibold text-charcoal hover:text-maroon transition-colors">
                        Bride
                     </Link>
                     <Link href="/category/grooms" className="text-sm font-semibold text-charcoal hover:text-maroon transition-colors">
                        Grooms
                     </Link>
                     <Link href="/category/ethnic" className="text-sm font-semibold text-charcoal hover:text-maroon transition-colors">
                        Ethnic
                     </Link>
                     <Link href="/category/celebrities" className="text-sm font-semibold text-charcoal hover:text-maroon transition-colors">
                        Celebrities
                     </Link>
                     
                     <div className="border-t border-charcoal/10 pt-4 mt-2">
                       <Link href="/category/semi-party-wear" className="text-sm font-semibold text-charcoal hover:text-maroon transition-colors">
                          Semi Party Wear
                       </Link>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative group py-2">
              <span className="hover:text-maroon transition-colors cursor-pointer flex items-center gap-1">
                Collections
              </span>
              <div className="absolute top-full left-0 hidden group-hover:block pt-4">
                <div className="mac-glass rounded-2xl p-4 flex flex-col gap-4 w-56">
                   <Link href="/category/onam-2026-chaayam" className="text-xs hover:text-maroon transition-colors">Onam '26</Link>
                   <Link href="/category/eves-garden-2024" className="text-xs hover:text-maroon transition-colors">Eves Garden '24</Link>
                   <Link href="/category/parinaya-2026" className="text-xs hover:text-maroon transition-colors">Parinaya '26</Link>
                </div>
              </div>
            </div>

            <a href="https://calendly.com/maneeshachandranweb/30min" target="_blank" rel="noopener noreferrer" className="hover:text-maroon transition-colors">
              Book Consultation
            </a>
          </nav>

          {/* Logo */}
          <Link 
            href="/" 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-3"
          >
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-maroon/20 shadow-sm flex items-center justify-center bg-maroon">
                <Logo className="w-6 h-6 md:w-8 md:h-8 text-ivory" />
             </div>
             <motion.span 
               layout
               className={cn(
                 "font-serif tracking-[0.2em] text-maroon font-semibold transition-all duration-500",
                 isScrolled ? "text-xl" : "text-2xl md:text-3xl"
               )}
             >
               MANEESHA CHANDRAN
             </motion.span>
          </Link>

          {/* Right Nav (Search & Cart) */}
          <div className="flex items-center gap-2 md:gap-4 text-charcoal">
            {/* Integrated Search */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "hidden sm:flex items-center rounded-full border transition-all duration-300 hover:bg-black/5",
                isScrolled ? "bg-cream/50 border-ivory/50 px-4 py-2" : "bg-transparent border-charcoal/20 px-4 py-2"
              )}
            >
              <Search className="w-4 h-4 text-charcoal/60 shrink-0" strokeWidth={2} />
              <span className="text-xs ml-2 text-charcoal/60">Search...</span>
            </button>
            
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 rounded-full hover:bg-black/5"
            >
               <Search className="w-4 h-4" strokeWidth={2} />
            </button>
            
            <div 
              className="relative"
              onMouseEnter={() => setIsSavedOpen(true)}
              onMouseLeave={() => setIsSavedOpen(false)}
            >
              <button 
                onClick={() => setIsSavedOpen(!isSavedOpen)}
                className="hover:text-maroon transition-colors p-2 relative rounded-full hover:bg-black/5"
              >
                <Heart className={cn("w-4 h-4 transition-colors", savedItems.length > 0 ? "text-maroon fill-maroon" : "")} strokeWidth={2} />
                {savedItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-maroon rounded-full border border-cream"></span>
                )}
              </button>

              <AnimatePresence>
                {isSavedOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-4 bg-cream/95 backdrop-blur-2xl border border-ivory shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl p-6 w-[320px] flex flex-col gap-4 z-50 pointer-events-auto"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-serif text-lg text-charcoal">Saved Items</h3>
                      <button onClick={() => setIsSavedOpen(false)} className="text-charcoal/40 hover:text-charcoal transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {savedItems.length === 0 ? (
                      <p className="text-sm font-light text-charcoal/50 text-center py-4">No items saved yet.</p>
                    ) : (
                      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
                        {savedItems.map(item => (
                          <div key={item.savedItemId} className="flex gap-4 items-center group relative border-b border-charcoal/5 pb-4 last:border-0 last:pb-0">
                            <Link href={`/product/${item.id}`} onClick={() => setIsSavedOpen(false)} className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-charcoal/5">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </Link>
                            <div className="flex-grow min-w-0">
                              <Link href={`/product/${item.id}`} onClick={() => setIsSavedOpen(false)} className="font-serif text-sm text-charcoal hover:text-maroon transition-colors truncate block">
                                {item.name}
                              </Link>
                              <p className="text-xs font-sans text-charcoal/50 mt-1">Size: {item.size}</p>
                              <p className="text-xs font-sans text-charcoal mt-1 tracking-wide">{item.price}</p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <button 
                                onClick={() => {
                                  moveToCart(item.savedItemId);
                                  setIsSavedOpen(false);
                                  navigate.push('/cart');
                                }}
                                className="w-8 h-8 flex items-center justify-center bg-charcoal text-cream rounded-full hover:bg-charcoal-light transition-colors"
                                title="Move to Cart"
                              >
                                <ShoppingBag className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => removeFromSaved(item.savedItemId)}
                                className="w-8 h-8 flex items-center justify-center border border-charcoal/20 text-charcoal rounded-full hover:border-charcoal hover:text-charcoal transition-colors"
                                title="Remove"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/cart" className="hover:text-maroon transition-colors p-2 relative rounded-full hover:bg-black/5">
              <ShoppingBag className="w-4 h-4" strokeWidth={2} />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-maroon rounded-full border border-cream"></span>
              )}
            </Link>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-cream/95 backdrop-blur-3xl flex flex-col items-center pt-24 px-6 pointer-events-auto overflow-y-auto"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-3 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-6 h-6 text-charcoal" />
            </button>

            <div className="w-full max-w-2xl relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-charcoal/40" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections, products..."
                className="w-full bg-white/50 border border-charcoal/10 rounded-full py-5 pl-16 pr-8 text-xl text-charcoal placeholder:text-charcoal/30 outline-none focus:border-maroon/30 focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div className="w-full max-w-2xl mt-12 flex flex-col gap-4 pb-24">
              {searchQuery && filteredItems.length === 0 && (
                <p className="text-center text-charcoal/50 text-lg">No results found for "{searchQuery}"</p>
              )}
              
              {filteredItems.map(item => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.link}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/60 transition-colors group border border-transparent hover:border-charcoal/5"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-charcoal/5">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-charcoal group-hover:text-maroon transition-colors">{item.name}</h4>
                    <p className="text-xs font-sans uppercase tracking-widest text-charcoal/40 mt-1">{item.type}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

