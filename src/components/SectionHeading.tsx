'use client';
import Reveal from './Reveal';
import { cn } from '../utils/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  align?: 'center' | 'left';
  tone?: 'dark' | 'light';
  className?: string;
}

// Shared editorial section header: small tracked eyebrow, gold rule, display title.
export default function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  align = 'center',
  tone = 'dark',
  className,
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  return (
    <Reveal
      className={cn(
        'flex flex-col',
        isCenter ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <span className={cn('eyebrow mb-5', tone === 'light' && 'text-white/50')}>{eyebrow}</span>
      )}
      <span className={cn('w-10 h-px bg-gold mb-6', isCenter && 'mx-auto')} />
      <h2 className={cn('display-md', tone === 'light' ? 'text-white' : 'text-charcoal')}>
        {title}
        {titleAccent && (
          <>
            {' '}
            <span className="text-charcoal">{titleAccent}</span>
          </>
        )}
      </h2>
    </Reveal>
  );
}
