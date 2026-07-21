'use client';
import { motion } from 'motion/react';

interface Stat {
  value: string;
  label: string;
}

const DEFAULT_STATS: Stat[] = [
  { value: '500+', label: 'Bespoke pieces crafted' },
  { value: '12+', label: 'Years of couture' },
  { value: '20+', label: 'Cities delivered' },
  { value: '100%', label: 'Hand-finished' },
];

// Elegant atelier stat tiles. Defaults are editable later via Sanity siteSettings.
export default function StatsRow({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-y-12 gap-x-6 md:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
          className="flex flex-col items-center text-center"
        >
          <span className="font-sans text-4xl font-light text-gold-dark md:text-5xl">{stat.value}</span>
          <span className="mt-3 max-w-[10rem] font-sans text-[11px] uppercase tracking-[0.2em] text-charcoal/55">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
