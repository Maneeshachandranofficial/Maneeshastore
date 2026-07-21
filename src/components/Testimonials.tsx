'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

// Defaults — move to Sanity later if the client wants to edit these.
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'My bridal lehenga was beyond anything I imagined. Every thread felt personal — I have never felt more myself than on my wedding day.',
    name: 'Ananya R.',
    role: 'Bride, Kochi',
  },
  {
    quote:
      'The team understood my vision instantly. The fit, the detailing, the drape — flawless. Truly couture in every sense.',
    name: 'Meera & Rahul',
    role: 'Parinaya Collection',
  },
  {
    quote:
      'From the first consultation to the final fitting, it was an experience of pure luxury. Timeless is the only word for it.',
    name: 'Sneha K.',
    role: 'Eves Garden',
  },
];

export default function Testimonials({ items = DEFAULT_TESTIMONIALS }: { items?: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((p) => (p + 1) % items.length);
  const prev = () => setIndex((p) => (p - 1 + items.length) % items.length);
  const active = items[index];

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
      <SectionHeading eyebrow="Kind Words" title="What Our" titleAccent="Clients Say" />

      <div className="relative mt-14 min-h-[13rem] w-full">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <p className="font-sans text-xl font-light italic leading-relaxed text-charcoal/80 md:text-2xl">
              &ldquo;{active.quote}&rdquo;
            </p>
            <span className="mt-8 h-px w-8 bg-gold" />
            <cite className="mt-5 not-italic">
              <span className="block font-sans text-sm uppercase tracking-[0.18em] text-charcoal">
                {active.name}
              </span>
              <span className="mt-1 block font-sans text-xs tracking-wide text-charcoal/50">{active.role}</span>
            </cite>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition-colors hover:border-maroon hover:text-maroon"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-maroon' : 'w-1.5 bg-charcoal/20 hover:bg-charcoal/40'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next testimonial"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition-colors hover:border-maroon hover:text-maroon"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
