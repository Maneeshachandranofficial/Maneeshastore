'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, X, Heart, MoreHorizontal, ChevronDown, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';
import LogoLockup from './LogoLockup';
import { useStore } from '../context/StoreContext';

type SearchItem = { id: string; name: string; image?: string | null; type: 'category' | 'collection' | 'product'; link: string };

const CALENDLY = 'https://calendly.com/maneeshachandranweb/30min';

const collectionLinks = [
  { href: '/category/onam-2026-chaayam', label: "Onam '26 Chaayam" },
  { href: '/category/eves-garden-2024', label: "Eves Garden '24" },
  { href: '/category/parinaya-2026', label: "Parinaya '26" },
];

const coutureLinks = [
  { href: '/category/bride', label: 'Bride' },
  { href: '/category/groom', label: 'Groom' },
  { href: '/category/ethnic', label: 'Ethnic' },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchData, setSearchData] = useState<SearchItem[]>([]);
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

  // Lazily load the real catalogue (same-origin API → no CORS) on first search open.
  useEffect(() => {
    if (!isSearchOpen || searchData.length > 0) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/search-index');
        const json = await res.json();
        if (active) setSearchData(json.items || []);
      } catch (err) {
        console.error('Search fetch error:', err);
      }
    })();
    return () => {
      active = false;
    };
  }, [isSearchOpen, searchData.length]);

  const filteredItems = searchQuery
    ? searchData.filter((item) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const linkClass = 'font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/70 hover:text-black transition-colors';
  // Smaller icons on mobile (keeps the absolutely-centred logo clear); full 44px on desktop.
  const iconClass = 'relative flex h-8 w-8 items-center justify-center rounded-full text-charcoal transition-colors hover:text-black md:h-11 md:w-11';

  return (
    <div ref={navRef} className="fixed inset-x-0 top-0 z-50">
      {/* Static full-width white bar */}
      <header className="relative flex h-20 items-center justify-between border-b border-black/10 bg-white px-4 md:px-10">
        {/* Left: 3-dot menu + (desktop) Collections / Bride / Groom */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-1.5 flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:text-black"
          >
            <MoreHorizontal className="h-6 w-6" />
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
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
                    <div className="flex flex-col gap-1 rounded-2xl bg-black p-3 shadow-2xl">
                      {collectionLinks.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setIsCollectionsOpen(false)}
                          className="rounded-xl px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.16em] text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/category/bride" className={linkClass}>Bride</Link>
            <Link href="/category/groom" className={linkClass}>Groom</Link>
            <Link href="/category/ethnic" className={linkClass}>Ethnic</Link>
          </nav>
        </div>

        {/* Center: logo lockup — absolutely centred so it stays dead-centre
            regardless of the differing side-cluster widths */}
        <Link
          href="/"
          aria-label="Maneesha Chandran — home"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          <LogoLockup className="h-10 w-auto text-black md:h-14" />
        </Link>

        {/* Right: search, saved, cart */}
        <div className="flex items-center gap-0 md:gap-2">
          <button onClick={() => setIsSearchOpen(true)} aria-label="Search" className={iconClass}>
            <Search className="h-[18px] w-[18px]" />
          </button>

          <div className="relative">
            <button onClick={() => setIsSavedOpen(!isSavedOpen)} aria-label="Saved items" className={iconClass}>
              <Heart className={cn('h-[18px] w-[18px] transition-colors', savedItems.length > 0 && 'fill-black text-black')} />
              {savedItems.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-black" />}
            </button>
            <AnimatePresence>
              {isSavedOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full z-50 mt-4 flex w-[320px] flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-2xl"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-sans text-lg text-charcoal">Saved Items</h3>
                    <button onClick={() => setIsSavedOpen(false)} className="text-charcoal/40 transition-colors hover:text-charcoal">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {savedItems.length === 0 ? (
                    <p className="py-4 text-center text-sm font-light text-charcoal/50">No items saved yet.</p>
                  ) : (
                    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-2">
                      {savedItems.map((item) => (
                        <div key={item.savedItemId} className="group relative flex items-center gap-4 border-b border-black/5 pb-4 last:border-0 last:pb-0">
                          <Link href={`/product/${item.id}`} onClick={() => setIsSavedOpen(false)} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ivory">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-opacity group-hover:opacity-80" />
                          </Link>
                          <div className="min-w-0 flex-grow">
                            <Link href={`/product/${item.id}`} onClick={() => setIsSavedOpen(false)} className="block truncate font-sans text-sm text-charcoal transition-colors hover:text-black">
                              {item.name}
                            </Link>
                            <p className="mt-1 font-sans text-xs text-charcoal/50">{item.price}</p>
                          </div>
                          <div className="flex shrink-0 flex-col gap-2">
                            <button
                              onClick={() => { moveToCart(item.savedItemId); setIsSavedOpen(false); navigate.push('/cart'); }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white transition-opacity hover:opacity-80"
                            >
                              <ShoppingBag className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeFromSaved(item.savedItemId)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/15 text-charcoal/50 transition-colors hover:text-black"
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

          <Link href="/cart" aria-label="Cart" className={iconClass}>
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartItems.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-black" />}
          </Link>
        </div>
      </header>

      {/* 3-dot full menu — opens on all screens (black block) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[95] flex flex-col overflow-y-auto bg-black px-8 pb-12 pt-7 text-white md:px-16"
          >
            <div className="flex items-center justify-between">
              <LogoLockup className="h-10 w-auto text-white md:h-12" />
              <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu" className="p-2 text-white/70 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 gap-12 pt-16 md:grid-cols-3 md:pt-24">
              {/* Couture */}
              <div>
                <span className="mb-6 block font-sans text-[10px] uppercase tracking-[0.35em] text-white/40">Couture</span>
                <ul className="flex flex-col gap-4">
                  {coutureLinks.map((c, i) => (
                    <motion.li key={c.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                      <Link href={c.href} onClick={() => setIsMenuOpen(false)} className="font-sans text-2xl font-light text-white/90 transition-colors hover:text-white">
                        {c.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Collections */}
              <div>
                <span className="mb-6 block font-sans text-[10px] uppercase tracking-[0.35em] text-white/40">Collections</span>
                <ul className="flex flex-col gap-4">
                  {collectionLinks.map((c, i) => (
                    <motion.li key={c.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                      <Link href={c.href} onClick={() => setIsMenuOpen(false)} className="font-sans text-lg font-light text-white/80 transition-colors hover:text-white">
                        {c.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Atelier */}
              <div>
                <span className="mb-6 block font-sans text-[10px] uppercase tracking-[0.35em] text-white/40">Atelier</span>
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link href="/lookbook" onClick={() => setIsMenuOpen(false)} className="font-sans text-lg font-light text-white/80 transition-colors hover:text-white">
                      Lookbook
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="font-sans text-lg font-light text-white/80 transition-colors hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a href="mailto:maneeshachandranofficial@gmail.com" onClick={() => setIsMenuOpen(false)} className="font-sans text-lg font-light text-white/80 transition-colors hover:text-white">
                      Contact Us
                    </a>
                  </li>
                </ul>
                <a
                  href={CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-85"
                >
                  <Calendar className="h-4 w-4" /> Book Consultation
                </a>
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
            className="pointer-events-auto fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto bg-white/97 px-6 pt-24 backdrop-blur-2xl"
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
                className="w-full rounded-2xl border border-black/10 bg-white py-5 pl-16 pr-8 font-sans text-xl text-charcoal outline-none transition-all placeholder:text-charcoal/30 focus:border-black/40"
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
                  className="group flex items-center gap-6 border-b border-black/5 p-4 transition-colors last:border-0 hover:bg-black/[0.03]"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ivory">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-opacity group-hover:opacity-80" />
                    ) : (
                      <span className="font-sans text-lg text-charcoal/40">{item.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-sans text-lg text-charcoal transition-colors group-hover:text-black">{item.name}</h4>
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
