'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TiltCard from '@/components/TiltCard';
import Logo from '@/components/Logo';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { client } from '@/sanity/client';
import { allProductsQuery } from '@/sanity/queries';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useRouter();

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.05]);
  const textY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  const [heroIndex, setHeroIndex] = useState(0);
  
  const [heroProducts, setHeroProducts] = useState<any[]>([]);

  const heroImages = heroProducts.length > 0 ? heroProducts : [
    { id: '1', image: 'https://placehold.co/1080x1920/4A1517/FCF9F2?text=Loading...' }
  ];

  const nextHero = () => setHeroIndex((prev) => (prev + 1) % heroImages.length);
  const prevHero = () => setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await client.fetch(allProductsQuery);
        setFeaturedProducts(fetchedProducts.slice(0, 4));
        setHeroProducts(fetchedProducts.slice(4, 9)); // Use next 5 products for hero
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
    
    const timer = setInterval(() => {
      nextHero();
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-cream min-h-screen selection:bg-blush selection:text-charcoal">
      
      {/* Editorial Hero Section */}
      <section ref={heroRef} className="relative min-h-screen pt-24 pb-12 flex flex-col items-center overflow-hidden bg-gradient-to-b from-blush/20 via-cream to-cream">
        
        <motion.div 
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-10 md:pt-20 text-center flex flex-col items-center mb-10"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-charcoal leading-[1.1] tracking-tight max-w-4xl mx-auto"
          >
            Timeless Luxury <br className="hidden md:block" />
            for Timeless Love.
          </motion.h1>
        </motion.div>

        <div className="w-full mx-auto px-6 relative z-0 flex-grow flex items-center justify-center py-12 gap-4 md:gap-12">
           <button onClick={prevHero} className="p-3 rounded-full hover:bg-maroon/5 transition-colors text-charcoal shrink-0">
             <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
           </button>
           
           <motion.div 
              style={{ scale: heroScale }}
              className="h-[50vh] md:h-[60vh] lg:h-[70vh] aspect-[9/16] relative overflow-hidden shadow-2xl shrink-0 cursor-pointer bg-ivory"
              onClick={() => navigate.push(`/product/${heroImages[heroIndex].id}`)}
           >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={heroIndex}
                  src={heroImages[heroIndex].image}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  alt="Featured Bridal Gown"
                  className="w-full h-full object-cover absolute inset-0"
                />
              </AnimatePresence>
           </motion.div>

           <button onClick={nextHero} className="p-3 rounded-full hover:bg-maroon/5 transition-colors text-charcoal shrink-0">
             <ChevronRight className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
           </button>
        </div>
      </section>

      {/* Staggered Editorial Grid */}
      <section className="py-32 md:py-48 px-6 bg-ivory">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col items-center text-center mb-24 md:mb-32">
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Curated Masterpieces</h2>
            <div className="w-12 h-[1px] bg-maroon mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.2, delay: (idx % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={idx % 2 !== 0 ? "mt-12 sm:mt-16 md:mt-24 lg:mt-32" : ""}
              >
                <TiltCard product={product} imageClassName="aspect-[9/16]" />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-32 flex justify-center">
            <Link 
              href="/lookbook"
              className="inline-flex items-center gap-4 text-charcoal hover:text-maroon font-sans tracking-widest uppercase text-sm font-medium transition-colors border-b border-charcoal/20 hover:border-maroon pb-2"
            >
              View Full Lookbook <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Spacious and minimal */}
      <section className="py-32 md:py-48 px-6 bg-cream">
        <div className="max-w-4xl mx-auto text-center">
           <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden border border-maroon/20 mb-12 flex items-center justify-center bg-maroon">
             <Logo className="w-12 h-12 md:w-16 md:h-16 text-ivory" />
           </div>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal leading-tight mb-10">
            Rooted in heritage.<br/>Crafted for the modern era.
          </h2>
          <p className="font-sans text-charcoal-light text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            In a world dominated by fast fashion, MANEESHA CHANDRAN stands apart as a designer brand that stitches individuality into every thread. Based in Kochi, this label is redefining bridal and groom wear through deep customization and a heart-led design process. Here, clients don’t just shop—they co-create, shaping their outfits hand-in-hand with designers for that perfect, personal touch.
          </p>
        </div>
      </section>

    </div>
  );
}


