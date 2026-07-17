'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, Heart, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';
import { categories, collections, products } from '../data/store';
import { useStore } from '../context/StoreContext';

export default function Navigation() {
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

  return (
    <div ref={navRef} className="sticky top-0 left-0 w-full z-50 bg-maroon shadow-md">
      {/* Top Header Bar */}
      <header className="w-full flex items-center justify-between h-28 px-6 md:px-12">
        {/* Left: 3-Dot Menu */}
        <div className="flex-1 flex justify-start">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gold hover:text-white transition-colors flex items-center gap-2 group"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <MoreHorizontal className="w-6 h-6" />}
            <span className="hidden md:block font-sans text-xs tracking-widest uppercase">Menu</span>
          </button>
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex-1 flex justify-center items-center">
          <img src="/logo.svg" alt="Maneesha Chandran" className="h-16 md:h-20 object-contain" />
        </Link>

        {/* Right: Icons */}
        <div className="flex-1 flex justify-end items-center gap-4 text-gold">
          {/* Search */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:text-white transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          
          {/* Saved */}
          <div className="relative">
            <button 
              onClick={() => setIsSavedOpen(!isSavedOpen)}
              className="p-2 hover:text-white transition-colors relative"
            >
              <Heart className={cn("w-5 h-5 transition-colors", savedItems.length > 0 ? "fill-gold text-gold" : "")} />
              {savedItems.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
              )}
            </button>

            {/* Saved Dropdown */}
            <AnimatePresence>
              {isSavedOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-4 bg-white shadow-2xl rounded-sm p-6 w-[320px] flex flex-col gap-4 z-50 pointer-events-auto border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-sans text-lg text-charcoal">Saved Items</h3>
                    <button onClick={() => setIsSavedOpen(false)} className="text-gray-400 hover:text-charcoal transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {savedItems.length === 0 ? (
                    <p className="text-sm font-light text-gray-500 text-center py-4">No items saved yet.</p>
                  ) : (
                    <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
                      {savedItems.map(item => (
                        <div key={item.savedItemId} className="flex gap-4 items-center group relative border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                          <Link href={`/product/${item.id}`} onClick={() => setIsSavedOpen(false)} className="w-16 h-16 bg-gray-50 shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                          </Link>
                          <div className="flex-grow min-w-0">
                            <Link href={`/product/${item.id}`} onClick={() => setIsSavedOpen(false)} className="font-sans text-sm text-charcoal hover:text-maroon transition-colors truncate block">
                              {item.name}
                            </Link>
                            <p className="text-xs font-sans text-gray-500 mt-1">{item.price}</p>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <button 
                              onClick={() => { moveToCart(item.savedItemId); setIsSavedOpen(false); navigate.push('/cart'); }}
                              className="w-8 h-8 flex items-center justify-center bg-charcoal text-white hover:bg-maroon transition-colors"
                            >
                              <ShoppingBag className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => removeFromSaved(item.savedItemId)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:text-red-500 transition-colors"
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

          {/* Cart */}
          <Link href="/cart" className="p-2 hover:text-white transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
            )}
          </Link>
        </div>
      </header>

      {/* Push-Down Mega Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-maroon-dark overflow-hidden border-t border-maroon-light"
          >
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Couture */}
              <div>
                <h3 className="font-sans text-gold text-lg mb-6 tracking-wide">Couture</h3>
                <ul className="flex flex-col gap-4 font-sans text-sm text-ivory/70 tracking-widest uppercase">
                  <li><Link href="/category/bride" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Bride</Link></li>
                  <li><Link href="/category/grooms" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Grooms</Link></li>
                  <li><Link href="/category/ethnic" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Ethnic Wear</Link></li>
                  <li><Link href="/category/celebrities" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Celebrities</Link></li>
                </ul>
              </div>

              {/* Collections */}
              <div>
                <h3 className="font-sans text-gold text-lg mb-6 tracking-wide">Collections</h3>
                <ul className="flex flex-col gap-4 font-sans text-sm text-ivory/70 tracking-widest uppercase">
                  <li><Link href="/category/onam-2026-chaayam" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Onam '26 Chaayam</Link></li>
                  <li><Link href="/category/eves-garden-2024" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Eves Garden '24</Link></li>
                  <li><Link href="/category/parinaya-2026" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Parinaya '26</Link></li>
                </ul>
              </div>

              {/* Atelier */}
              <div>
                <h3 className="font-sans text-gold text-lg mb-6 tracking-wide">Atelier</h3>
                <ul className="flex flex-col gap-4 font-sans text-sm text-ivory/70 tracking-widest uppercase">
                  <li><Link href="/lookbook" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Lookbook</Link></li>
                  <li><a href="https://calendly.com/maneeshachandranweb/30min" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Book Consultation</a></li>
                  <li><a href="mailto:maneeshachandranofficial@gmail.com" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
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
                placeholder="Search couture..."
                className="w-full bg-white/50 border border-charcoal/10 rounded-sm py-5 pl-16 pr-8 text-xl font-sans text-charcoal placeholder:text-charcoal/30 outline-none focus:border-maroon/30 focus:bg-white transition-all"
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
                  className="flex items-center gap-6 p-4 hover:bg-white/60 transition-colors group border-b border-charcoal/5 last:border-0"
                >
                  <div className="w-16 h-16 shrink-0 bg-charcoal/5">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                  </div>
                  <div>
                    <h4 className="font-sans text-lg text-charcoal group-hover:text-maroon transition-colors">{item.name}</h4>
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
