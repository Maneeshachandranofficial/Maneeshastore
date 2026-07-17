import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import Link from 'next/link';
import { cn } from '../utils/cn';

interface TiltCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
  };
  className?: string;
  imageClassName?: string;
}

export default function TiltCard({ product, className, imageClassName }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Very subtle springs for luxury feel
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ perspective: 2000 }}
      className={cn("w-full group cursor-pointer flex flex-col", className)}
    >
      <Link href={`/product/${product.id}`} className="block">
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className={cn(
            "block relative w-full bg-ivory rounded-none transition-shadow duration-700 overflow-visible",
            "hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]",
            imageClassName || "aspect-[9/16]"
          )}
        >
        <div
          style={{ transform: "translateZ(10px)" }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="relative w-full h-full overflow-hidden bg-cream">
             <motion.img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover origin-center"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.02)] pointer-events-none"></div>
          </div>
        </div>
        </motion.div>
      </Link>
      
      {/* Label outside the card, clean editorial style */}
      <div className="mt-4 md:mt-6 flex flex-col items-center text-center">
         <h3 className="font-sans text-charcoal text-base md:text-lg tracking-wide mb-1">{product.name}</h3>
         <p className="font-sans font-normal text-charcoal/60 text-xs md:text-sm tracking-wider">{product.price}</p>
      </div>
    </motion.div>
  );
}
