'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, X, Heart, Menu, ChevronDown, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';
import LogoLockup from './LogoLockup';
import { categories, collections, products } from '../data/store';
import { useStore } from '../context/StoreContext';

const CALENDLY = 'https://calendly.com/maneeshachandranweb/30min';

const collectionLinks = [
  { href: '/category/onam-2026-chaayam', label: "Onam '26 Chaayam" },
  { href: '/category/eves-garden-2024', label: "Eves Garden '24" },
  { href: '/category/parinaya-2026', label: "Parinaya '26" },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useRouter();
  const { savedItems, cartItems, moveToCart, removeFromSaved } = useStore();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsSavedOpen(false);
        setIsCollectionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSearchOpen || isMenuOpen ? 'hidden' : 'unset';
  }, [isSearchOpen, isMenuOpen]);

  const allSearchableItems = [
    ...categories.map((c) => ({ ...c, type: 'category' as const, link: `/category/${c.id}` })),
    ...collections.map((c) => ({ ...c, type: 'collection' as const, link: `/category/${c.id}` })),
    ...products.map((p) => ({ ...p, type: 'product' as const, link: `/product/${p.id}` })),
  ];
  const filteredItems = searchQuery
    ? allSearchableItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const linkClass = 'font-sans text-[11px] uppercase tracking-[0.18em] text-ivory/80 hover:text-white transition-colors';
  const iconClass = 'relative p-2 text-gold transition-colors hover:text-white';

  return (
    <div ref={navRef} className="fixed inset-x-0 top-0 z-50">
      {/* Static full-width bar */}
      <header className="flex h-20 items-center justify-between bg-maroon px-5 shadow-md shadow-black/10 md:px-12">
        {/* Left: hamburger (mobile) / Collections + Lookbook + Book (desktop) */}
        <div className="flex flex-1 items-center justify-start gap-6">
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 text-gold transition-colors hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            {/* Collections dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <button className={cn(linkClass, 'flex items-center gap-1')}>
                Collections <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {isCollectionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full w-60 pt-4"
                  >
                    <div className="flex flex-col gap-1 rounded-2xl border border-gold/15 bg-maroon-dark/95 p-3 shadow-2xl backdrop-blur-md">
                      {collectionLinks.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setIsCollectionsOpen(false)}
                          className="rounded-xl px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.16em] text-ivory/75 transition-colors hover:bg-maroon-light/40 hover:text-white"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/lookbook" className={linkClass}>
              Lookbook
            </Link>
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-sans text-[10px] uppercase tracking-[0.18em] text-maroon-dark transition-colors hover:bg-gold-light"
            >
              <Calendar className="h-3.5 w-3.5" /> Book Consultation
            </a>
          </nav>
        </div>

        {/* Center: logo lockup (inline vector) */}
        <Link href="/" aria-label="Maneesha Chandran — home" className="flex shrink-0 items-center justify-center px-3">
          <LogoLockup className="h-11 w-auto text-gold md:h-14" />
        </Link>

        {/* Right: search, saved, cart */}
        <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
          <button onClick={() => setIsSearchOpen(true)} aria-label="Search" className={iconClass}>
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* Saved */}
          <div className="relative">
            <button onClick={() => setIsSavedOpen(!isSavedOpen)} aria-label="Saved items" className={iconClass}>
              <Heart className={cn('h-[18px] w-[18px] transition-colors', savedItems.length > 0 && 'fill-gold text-gold')} />
              {savedItems.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-white" />}
            </button>
            <AnimatePresence>
              {isSavedOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full z-50 mt-4 flex w-[320px] flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-sans text-lg text-charcoal">Saved Items</h3>
                    <button onClick={() => setIsSavedOpen(false)} className="text-gray-400 transition-colors hover:text-charcoal">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {savedItems.length === 0 ? (
                    <p className="py-4 text-center text-sm font-light text-gray-500">No items saved yet.</p>
                  ) : (
                    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-2">
                      {savedItems.map((item) => (
                        <div key={item.savedItemId} className="group relative flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                          <Link href={`/product/${item.id}`} onClick={() => setIsSavedOpen(false)} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-opacity group-hover:opacity-80" />
                          </Link>
                          <div className="min-w-0 flex-grow">
                            <Link href={`/product/${item.id}`} onClick={() => setIsSavedOpen(false)} className="block truncate font-sans text-sm text-charcoal transition-colors hover:text-maroon">
                              {item.name}
                            </Link>
                            <p className="mt-1 font-sans text-xs text-gray-500">{item.price}</p>
                          </div>
                          <div className="flex shrink-0 flex-col gap-2">
                            <button
                              onClick={() => { moveToCart(item.savedItemId); setIsSavedOpen(false); navigate.push('/cart'); }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal text-white transition-colors hover:bg-maroon"
                            >
                              <ShoppingBag className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeFromSaved(item.savedItemId)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
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
          <Link href="/cart" aria-label="Cart" className={iconClass}>
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartItems.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-white" />}
          </Link>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col bg-maroon px-8 pb-10 pt-8 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <LogoLockup className="h-10 w-auto text-gold" />
              <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu" className="p-2 text-gold hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-14 flex flex-1 flex-col overflow-y-auto">
              <span className="eyebrow mb-3 text-gold-light/70">Collections</span>
              {collectionLinks.map((c, i) => (
                <motion.div key={c.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                  <Link href={c.href} onClick={() => setIsMenuOpen(false)} className="block py-3 font-sans text-2xl font-light text-ivory">
                    {c.label}
                  </Link>
                </motion.div>
              ))}

              <span className="eyebrow mb-3 mt-10 text-gold-light/70">Atelier</span>
              <Link href="/lookbook" onClick={() => setIsMenuOpen(false)} className="block py-2 font-sans text-base uppercase tracking-[0.16em] text-ivory/70">
                Lookbook
              </Link>
              <a href="mailto:maneeshachandranofficial@gmail.com" onClick={() => setIsMenuOpen(false)} className="block py-2 font-sans text-base uppercase tracking-[0.16em] text-ivory/70">
                Contact Us
              </a>
            </nav>

            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 font-sans text-[11px] uppercase tracking-[0.2em] text-maroon-dark"
            >
              <Calendar className="h-4 w-4" /> Book a Consultation
            </a>
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
            className="pointer-events-auto fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto bg-cream/95 px-6 pt-24 backdrop-blur-3xl"
          >
            <button onClick={() => setIsSearchOpen(false)} aria-label="Close search" className="absolute right-8 top-8 rounded-full p-3 transition-colors hover:bg-black/5">
              <X className="h-6 w-6 text-charcoal" />
            </button>
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-charcoal/40" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search couture..."
                className="w-full rounded-2xl border border-charcoal/10 bg-white/50 py-5 pl-16 pr-8 font-sans text-xl text-charcoal outline-none transition-all placeholder:text-charcoal/30 focus:border-maroon/30 focus:bg-white"
              />
            </div>
            <div className="mt-12 flex w-full max-w-2xl flex-col gap-4 pb-24">
              {searchQuery && filteredItems.length === 0 && (
                <p className="text-center text-lg text-charcoal/50">No results found for &ldquo;{searchQuery}&rdquo;</p>
              )}
              {filteredItems.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.link}
                  onClick={() => setIsSearchOpen(false)}
                  className="group flex items-center gap-6 border-b border-charcoal/5 p-4 transition-colors last:border-0 hover:bg-white/60"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-charcoal/5">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-opacity group-hover:opacity-80" />
                  </div>
                  <div>
                    <h4 className="font-sans text-lg text-charcoal transition-colors group-hover:text-maroon">{item.name}</h4>
                    <p className="mt-1 font-sans text-xs uppercase tracking-widest text-charcoal/40">{item.type}</p>
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
