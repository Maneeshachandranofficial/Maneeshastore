'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GridCard from '@/components/GridCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomeClient({ heroProducts, featuredProducts, siteSettings }: { heroProducts: any[], featuredProducts: any[], siteSettings?: any }) {
  const navigate = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);

  const sloganLine1 = siteSettings?.sloganLine1 || 'Timeless Luxury';
  const sloganLine2 = siteSettings?.sloganLine2 || 'For Timeless Love.';
  const aboutHeading = siteSettings?.aboutHeading || 'Rooted in heritage.';
  const aboutHeadingAccent = siteSettings?.aboutHeadingAccent || 'Crafted for the modern era.';
  const aboutBody = siteSettings?.aboutBody || 'In a world dominated by fast fashion, MANEESHA CHANDRAN stands apart as a designer brand that stitches individuality into every thread. Based in Kochi, this label is redefining bridal and groom wear through deep customization and a heart-led design process.';

  const heroImages = heroProducts.length > 0 ? heroProducts : [
    { id: '1', image: 'https://placehold.co/1920x1080/4A1517/FCF9F2?text=Loading...' }
  ];

  const nextHero = () => setHeroIndex((prev) => (prev + 1) % heroImages.length);
  const prevHero = () => setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="bg-white min-h-screen selection:bg-maroon selection:text-white">
      
      {/* Edge-to-Edge Hero Section */}
      <section className="relative w-full h-screen overflow-hidden bg-charcoal">
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => navigate.push(`/product/${heroImages[heroIndex].id}`)}
          >
            <img 
              src={heroImages[heroIndex].image}
              alt="Featured Maneesha Chandran"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          </motion.div>
        </AnimatePresence>



        {/* Integrated Slogan */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 md:pb-32 px-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-10 h-[1px] bg-gold mb-6"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="font-sans text-3xl md:text-5xl lg:text-6xl text-white text-center leading-tight tracking-[0.05em] drop-shadow-lg max-w-4xl uppercase"
          >
            {sloganLine1} <br className="hidden md:block" />
            <span className="font-light text-gold-light normal-case tracking-wide">{sloganLine2}</span>
          </motion.h1>
        </div>

        {/* Carousel Controls */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
          <button onClick={(e) => { e.stopPropagation(); prevHero(); }} className="pointer-events-auto p-4 text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextHero(); }} className="pointer-events-auto p-4 text-white/70 hover:text-white transition-colors">
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 right-8 md:right-16 flex gap-3 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === heroIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Zero-Gap Editorial Grid */}
      <section className="bg-white">
        <div className="flex flex-col items-center text-center py-24 md:py-32">
          <h2 className="font-sans text-xs tracking-[0.3em] uppercase text-charcoal/60 mb-6">Curated This Season</h2>
          <h3 className="font-sans text-3xl md:text-5xl text-charcoal">Masterpieces</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {featuredProducts.map((product: any) => (
            <GridCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="py-24 flex justify-center">
          <Link 
            href="/lookbook"
            className="inline-flex items-center gap-4 text-charcoal hover:text-maroon font-sans tracking-[0.2em] uppercase text-xs transition-colors border-b border-charcoal/20 hover:border-maroon pb-2"
          >
            View Full Lookbook <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* About Section - Minimal and Dark */}
      <section className="py-32 md:py-48 px-6 bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-black mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-10">
           <img src="/logo.svg" alt="Maneesha Chandran" className="h-16 md:h-24 mx-auto mb-16 opacity-80" />
          <h2 className="font-sans text-3xl md:text-5xl leading-tight mb-10">
            {aboutHeading}<br/><span className="italic text-gold">{aboutHeadingAccent}</span>
          </h2>
          <p className="font-sans text-white/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            {aboutBody}
          </p>
        </div>
      </section>

    </div>
  );
}
