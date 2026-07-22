'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import CollectionBanner from '@/components/CollectionBanner';
import StatsRow from '@/components/StatsRow';
import Testimonials from '@/components/Testimonials';
import ConsultationCTA from '@/components/ConsultationCTA';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import LogoLockup from '@/components/LogoLockup';

const CALENDLY = 'https://calendly.com/maneeshachandranweb/30min';

const normalize = (s?: string) => (s || '').trim().toLowerCase().replace(/\s+/g, '-');

export default function HomeClient({
  products = [],
  heroProducts = [],
  featuredProducts = [],
  collections = [],
  siteSettings,
}: {
  products?: any[];
  heroProducts?: any[];
  featuredProducts?: any[];
  collections?: any[];
  siteSettings?: any;
}) {
  const navigate = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const sloganLine1 = siteSettings?.sloganLine1 || 'Timeless Luxury';
  const sloganLine2 = siteSettings?.sloganLine2 || 'For Timeless Love.';
  const aboutHeading = siteSettings?.aboutHeading || 'Rooted in heritage.';
  const aboutHeadingAccent = siteSettings?.aboutHeadingAccent || 'Crafted for the modern era.';
  const aboutBody =
    siteSettings?.aboutBody ||
    'In a world dominated by fast fashion, MANEESHA CHANDRAN stands apart as a designer brand that stitches individuality into every thread. Based in Kochi, this label is redefining bridal and groom wear through deep customization and a heart-led design process.';
  const calendlyUrl = siteSettings?.calendlyUrl || CALENDLY;

  const heroImages =
    heroProducts.length > 0
      ? heroProducts
      : [{ id: '1', image: 'https://placehold.co/1920x1080/531416/FCF9F2?text=Maneesha+Chandran' }];

  // Representative cover image per category / collection, derived from products.
  const imageFor = (matcher: (p: any) => boolean, fallback: string) =>
    products.find((p) => matcher(p) && p.image)?.image || fallback;

  const categoryCards = useMemo(() => {
    const fb = heroImages[0]?.image;
    return [
      { href: '/category/bride', label: 'The Bride', caption: 'Couture bridal, made only for you', image: imageFor((p) => p.categoryId === 'bride', fb) },
      { href: '/category/groom', label: 'The Groom', caption: 'Regal silhouettes for the modern groom', image: imageFor((p) => p.categoryId === 'groom', fb) },
      { href: '/category/ethnic', label: 'Ethnic', caption: 'Handloom weaves & festive drapes', image: imageFor((p) => p.categoryId === 'ethnic', fb) },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, heroProducts]);

  const collectionCards = useMemo(() => {
    const fb = heroImages[0]?.image;
    const list = collections.length
      ? collections
      : [
          { id: 'onam-2026-chaayam', name: 'Onam 2026 Chaayam', description: 'A festive ode to Kerala, reimagined in colour.' },
          { id: 'eves-garden-2024', name: 'Eves Garden 2024', description: 'Florals and drapes for the eternal romantic.' },
          { id: 'parinaya-2026', name: 'Parinaya 2026', description: 'The wedding edit — where vows meet couture.' },
        ];
    return list
      .filter((c: any) => normalize(c.id) !== 'signature-couture')
      .map((c: any) => ({
        href: `/category/${c.id}`,
        name: c.name,
        description: c.description,
        image: imageFor((p) => normalize(p.collection) === normalize(c.id), fb),
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, collections, heroProducts]);

  const paginate = (dir: number) => {
    setDirection(dir);
    setHeroIndex((p) => (p + dir + heroImages.length) % heroImages.length);
  };
  const nextHero = () => paginate(1);
  const prevHero = () => paginate(-1);
  const goToHero = (idx: number) => {
    setDirection(idx > heroIndex ? 1 : -1);
    setHeroIndex(idx);
  };

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setHeroIndex((p) => (p + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Keyboard arrow-key navigation for the hero
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevHero();
      else if (e.key === 'ArrowRight') nextHero();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroImages.length]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir >= 0 ? '100%' : '-100%', opacity: 0.4 }),
    center: { x: '0%', opacity: 1 },
    exit: (dir: number) => ({ x: dir >= 0 ? '-100%' : '100%', opacity: 0.4 }),
  };

  return (
    <div className="bg-cream">
      {/* ============ HERO (full-bleed rectangle covering the screen) ============ */}
      <section className="pt-20">
        <div className="relative h-[calc(100dvh-5rem)] min-h-[520px] w-full overflow-hidden bg-charcoal">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={heroIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: 'spring', stiffness: 260, damping: 32 }, opacity: { duration: 0.4 } }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => navigate.push(`/product/${heroImages[heroIndex].id}`)}
            >
              <img
                src={heroImages[heroIndex].image}
                alt="Featured Maneesha Chandran couture"
                className="h-full w-full object-cover object-[center_28%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30" />
            </motion.div>
          </AnimatePresence>

          {/* Slogan */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-7 md:p-14 lg:p-20">
            <Reveal className="max-w-2xl" delay={0.2}>
              <span className="mb-6 flex items-center gap-4">
                <span className="h-px w-12 bg-gold" />
                <span className="eyebrow text-gold-light/90">Maison de Couture</span>
              </span>
              <h1 className="display-xl text-white">
                {sloganLine1}
                <br />
                <span className="text-white">{sloganLine2}</span>
              </h1>
              <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/lookbook"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-sans text-[11px] uppercase tracking-[0.2em] text-black transition-colors hover:bg-black hover:text-white"
                >
                  Explore Lookbook
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/50 px-8 py-4 font-sans text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10"
                >
                  <Calendar className="h-4 w-4" /> Book Consultation
                </a>
              </div>
            </Reveal>
          </div>

          {/* Arrows */}
          <div className="pointer-events-none absolute inset-x-4 top-1/2 z-30 flex -translate-y-1/2 justify-between md:inset-x-6">
            <button type="button" onClick={(e) => { e.stopPropagation(); prevHero(); }} aria-label="Previous slide" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); nextHero(); }} aria-label="Next slide" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-6 right-6 z-30 flex gap-2 md:bottom-8 md:right-10">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => { e.stopPropagation(); goToHero(idx); }}
                aria-label={`Go to slide ${idx + 1}`}
                className="flex h-8 items-center px-1"
              >
                <span className={`block h-1.5 rounded-full transition-all duration-300 ${idx === heroIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 1 · COLLECTIONS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow="Seasonal Edits" title="The" titleAccent="Collections" className="mb-20" />
        <div className="flex flex-col gap-24 md:gap-32">
          {collectionCards.map((c, i) => (
            <CollectionBanner key={c.href} {...c} index={i} />
          ))}
        </div>
      </section>

      {/* ============ 2 · SIGNATURE MASTERPIECES ============ */}
      {featuredProducts.length > 0 && (
        <section className="bg-ivory/50 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading eyebrow="Curated This Season" title="Signature" titleAccent="Masterpieces" className="mb-16" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {featuredProducts.map((product: any, i: number) => (
                <Reveal key={product.id} delay={(i % 4) * 0.08}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
            <div className="mt-16 flex justify-center">
              <Link
                href="/lookbook"
                className="group inline-flex items-center gap-4 border-b border-charcoal/20 pb-2 font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal transition-colors hover:border-maroon hover:text-maroon"
              >
                View Full Lookbook
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ 3 · EXPLORE OUR ATELIERS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow="The House Of" title="Explore Our" titleAccent="Ateliers" className="mb-16" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categoryCards.map((c, i) => (
            <Reveal key={c.href} delay={i * 0.1}>
              <CategoryCard {...c} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ BRAND STORY ============ */}
      <section className="relative overflow-hidden bg-maroon px-6 py-28 text-white md:py-40">
        <Reveal className="relative z-10 mx-auto max-w-3xl text-center">
          <LogoLockup className="mx-auto mb-14 h-14 w-auto text-white opacity-95 md:h-20" />
          <span className="eyebrow mb-6 block text-gold-light/70">Our Philosophy</span>
          <h2 className="display-md text-white">
            {aboutHeading}
            <br />
            <span className="text-white">{aboutHeadingAccent}</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-sans text-lg font-light leading-relaxed text-white/70">{aboutBody}</p>
        </Reveal>
      </section>

      {/* ============ ATELIER STATS ============ */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-28">
        <StatsRow stats={siteSettings?.stats?.length ? siteSettings.stats : undefined} />
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-ivory/50 py-24 md:py-32">
        <Testimonials items={siteSettings?.testimonials?.length ? siteSettings.testimonials : undefined} />
      </section>

      {/* ============ CONSULTATION CTA ============ */}
      <ConsultationCTA calendlyUrl={calendlyUrl} />
    </div>
  );
}
