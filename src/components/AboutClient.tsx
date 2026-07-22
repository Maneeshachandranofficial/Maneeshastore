'use client';
import { motion } from 'motion/react';
import Reveal from '@/components/Reveal';
import ConsultationCTA from '@/components/ConsultationCTA';

interface Milestone {
  year?: string;
  title?: string;
  description?: string;
  image?: string;
}

const DEFAULT_TIMELINE: Milestone[] = [
  { year: '2013', title: 'The Beginning', description: 'Maneesha Chandran opens her first atelier in Kochi, driven by a love for hand-crafted couture.' },
  { year: '2016', title: 'First Bridal Line', description: 'The debut bridal collection redefines regional wedding wear with a modern, personal touch.' },
  { year: '2019', title: 'Onam Chaayam', description: 'The signature handloom collection launches, celebrating Kerala’s heritage in contemporary silhouettes.' },
  { year: '2022', title: 'National Recognition', description: 'Featured across leading publications and worn by celebrities on and off the runway.' },
  { year: '2026', title: 'A New Chapter', description: 'A fully bespoke consultation experience and an expanded couture house for brides and grooms alike.' },
];

export default function AboutClient({ about }: { about?: any }) {
  const eyebrow = about?.eyebrow || 'The House';
  const heading = about?.heading || 'About Maneesha Chandran';
  const intro =
    about?.intro ||
    'Based in Kochi, MANEESHA CHANDRAN is a designer house built on individuality — where every thread is stitched with intention. In a world of fast fashion, the label stands apart, redefining bridal and groom couture through deep customization and a heart-led design process.';
  const timelineHeading = about?.timelineHeading || 'The Journey';
  const timeline: Milestone[] = about?.timeline?.length ? about.timeline : DEFAULT_TIMELINE;

  return (
    <div className="min-h-screen bg-cream pt-36 md:pt-44">
      {/* Intro */}
      <section className="mx-auto max-w-4xl px-6 pb-20 text-center md:pb-28">
        <Reveal>
          <span className="eyebrow mb-6 block">{eyebrow}</span>
          <h1 className="display-lg text-charcoal">{heading}</h1>
          <span className="mx-auto my-8 block h-px w-12 bg-black" />
          <p className="mx-auto max-w-2xl font-sans text-lg font-light leading-relaxed text-charcoal/70">{intro}</p>
        </Reveal>

        {about?.portrait && (
          <Reveal className="mt-14" delay={0.1}>
            <div className="relative mx-auto aspect-[4/5] max-h-[60vh] w-full max-w-md overflow-hidden rounded-[1.75rem] bg-ivory">
              <img src={about.portrait} alt={heading} className="h-full w-full object-cover" />
            </div>
          </Reveal>
        )}
      </section>

      {/* Timeline (black block) */}
      <section className="bg-maroon px-6 py-24 text-white md:py-32">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mb-16 text-center md:mb-24">
            <span className="mb-6 block font-sans text-[10px] uppercase tracking-[0.35em] text-white/40">Milestones</span>
            <h2 className="display-md text-white">{timelineHeading}</h2>
          </Reveal>

          <div className="relative">
            {/* Center line (desktop) / left line (mobile) */}
            <span className="absolute left-4 top-0 h-full w-px bg-white/20 md:left-1/2 md:-translate-x-1/2" />

            <div className="flex flex-col gap-14 md:gap-20">
              {timeline.map((m, i) => {
                const right = i % 2 === 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative pl-12 md:grid md:grid-cols-2 md:gap-12 md:pl-0"
                  >
                    {/* Node */}
                    <span className="absolute left-4 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-white ring-4 ring-black md:left-1/2" />

                    {/* Content */}
                    <div className={right ? 'md:col-start-2 md:pl-6' : 'md:pr-6 md:text-right'}>
                      <span className="font-sans text-3xl font-light text-white/50 md:text-4xl">{m.year}</span>
                      <h3 className="mt-2 font-sans text-xl font-light text-white">{m.title}</h3>
                      <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/60">{m.description}</p>
                      {m.image && (
                        <div className="mt-5 overflow-hidden rounded-xl">
                          <img src={m.image} alt={m.title || ''} className="h-48 w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Consultation CTA */}
      <ConsultationCTA />
    </div>
  );
}
