'use client';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

// Brand-consistent in-site back button. Hidden on the homepage and Studio.
// Sits just below the fixed nav, top-left, on both desktop and mobile
// (covers iPhone, which lacks a reliable system back gesture in-browser).
//
// This renders on the client only, deliberately. Sitting in the root layout,
// it was being prerendered onto the statically-generated homepage on Vercel —
// `usePathname()` did not resolve to "/" at build time there, even though it
// did in a local production build, so the button shipped to the one page it
// must never appear on. Deciding after hydration means the check always runs
// against the real URL. Costs one frame on inner pages; the alternative is a
// wrong button on the homepage.
export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const isHydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  if (!isHydrated) return null;
  if (!pathname || pathname === '/' || pathname.startsWith('/studio')) return null;

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
      className="fixed left-3 top-[7.5rem] z-40 inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-cream/85 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.15em] text-charcoal shadow-sm backdrop-blur-md transition-colors hover:border-maroon hover:text-maroon md:left-6 md:top-[9rem]"
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </button>
  );
}
