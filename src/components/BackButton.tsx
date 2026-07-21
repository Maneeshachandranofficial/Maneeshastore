'use client';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

// Brand-consistent in-site back button. Hidden on the homepage and Studio.
// Sits just below the fixed nav, top-left, on both desktop and mobile
// (covers iPhone, which lacks a reliable system back gesture in-browser).
export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/' || pathname.startsWith('/studio')) return null;

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      className="fixed left-3 top-[5.25rem] z-40 inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-cream/85 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.15em] text-charcoal shadow-sm backdrop-blur-md transition-colors hover:border-maroon hover:text-maroon md:left-6 md:top-[6rem]"
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </button>
  );
}
