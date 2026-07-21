'use client';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';

const DEFAULT_CALENDLY = 'https://calendly.com/maneeshachandranweb/30min';

// Full-width consultation band → Calendly booking.
export default function ConsultationCTA({ calendlyUrl = DEFAULT_CALENDLY }: { calendlyUrl?: string }) {
  return (
    <section className="px-4 py-10 md:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-maroon px-6 py-20 text-center md:py-28">
        {/* Subtle gold texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full border border-gold" />
          <div className="absolute -bottom-24 -right-10 h-96 w-96 rounded-full border border-gold" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto flex max-w-2xl flex-col items-center"
        >
          <span className="eyebrow mb-6 text-gold-light/80">By Appointment</span>
          <h2 className="display-md text-white">
            Begin your <span className="italic text-gold-light">bespoke journey</span>
          </h2>
          <p className="mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-white/70">
            Every Maneesha Chandran creation begins with a conversation. Book a private consultation and let us
            craft something timeless, made only for you.
          </p>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-gold px-9 py-4 font-sans text-[12px] uppercase tracking-[0.2em] text-maroon-dark transition-all duration-300 hover:bg-gold-light"
          >
            <Calendar className="h-4 w-4" />
            Book a Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
