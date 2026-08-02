'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { img, imgSrcSet } from '@/utils/img';
import { cn } from '@/utils/cn';

// Exponential ease-out — the curve the rest of the storefront already moves on.
const EASE = [0.16, 1, 0.3, 1] as const;

// A flick counts as a swipe even when the finger barely travels.
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 220;

type Props = { images: string[]; name: string };

function altFor(name: string, i: number) {
  return i === 0 ? name : `${name} — view ${i + 1}`;
}

/**
 * Product imagery: one photo at a time with contextual arrows, and a
 * full-screen viewer for looking at the piece properly. Arrows disappear at
 * each end rather than sitting there dead, so the control only ever appears
 * when there is somewhere to go.
 */
export default function ProductGallery({ images, name }: Props) {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // A swipe ends in a click on touch devices; without this, flicking through
  // photos would keep throwing the viewer open.
  const didDragRef = useRef(false);

  const count = images.length;
  const canPrev = index > 0;
  const canNext = index < count - 1;

  const go = useCallback(
    (target: number) => {
      setSlide(([current]) => {
        const clamped = Math.max(0, Math.min(count - 1, target));
        return [clamped, clamped > current ? 1 : -1];
      });
    },
    [count]
  );

  // Step relative to whatever slide is current *now*, not the one captured at
  // render — otherwise held arrow keys and fast clicks land on the same target.
  const step = useCallback(
    (delta: number) => {
      setSlide(([current]) => [
        Math.max(0, Math.min(count - 1, current + delta)),
        delta > 0 ? 1 : -1,
      ]);
    },
    [count]
  );

  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  // Warm the neighbouring photos so an arrow press swaps instantly.
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => {
      const src = img(images[i], 1300, 85);
      if (!src) return;
      const pre = new window.Image();
      pre.src = src;
    });
  }, [index, images]);

  // Viewer: lock the page, wire the keyboard, park focus on the close button.
  useEffect(() => {
    if (!isViewerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsViewerOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key !== 'Tab') return;

      // aria-modal only tells assistive tech focus is contained — it does not
      // contain it. Without this, Tab walks out of the viewer onto the page
      // still sitting behind the overlay.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isViewerOpen, prev, next]);

  const openViewer = useCallback(() => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    setIsViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setIsViewerOpen(false);
    triggerRef.current?.focus();
  }, []);

  const onSwipe = (offsetX: number, velocityX: number) => {
    if (offsetX < -SWIPE_DISTANCE || velocityX < -SWIPE_VELOCITY) next();
    else if (offsetX > SWIPE_DISTANCE || velocityX > SWIPE_VELOCITY) prev();
  };

  const slide = {
    enter: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir > 0 ? 28 : -28,
      filter: reduceMotion ? 'blur(0px)' : 'blur(4px)',
    }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir > 0 ? -28 : 28,
      filter: reduceMotion ? 'blur(0px)' : 'blur(4px)',
    }),
  };

  return (
    <>
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex w-full items-center justify-center rounded-2xl bg-ivory p-4 md:rounded-[1.75rem] md:p-8">
          {/* Fixed 4:5 stage — every piece gets the same window, so the page
              never reflows between photos or between products. */}
          <div className="group/stage relative aspect-[4/5] max-h-[75vh] w-full overflow-hidden rounded-xl">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: EASE }}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragStart={() => {
                  didDragRef.current = false;
                }}
                onDrag={(_, info) => {
                  if (Math.abs(info.offset.x) > 6) didDragRef.current = true;
                }}
                onDragEnd={(_, info) => onSwipe(info.offset.x, info.velocity.x)}
                className="absolute inset-0"
              >
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={openViewer}
                  aria-label={`View ${altFor(name, index)} larger`}
                  className="h-full w-full cursor-zoom-in"
                >
                  <img
                    src={img(images[index], 1300, 85)}
                    srcSet={imgSrcSet(images[index], [600, 900, 1300, 1600], 85)}
                    sizes="(max-width: 1024px) 92vw, 40vw"
                    alt={altFor(name, index)}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                    draggable={false}
                    className="h-full w-full select-none object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:group-hover/stage:scale-[1.03]"
                  />
                </button>
              </motion.div>
            </AnimatePresence>

            {canPrev && (
              <GalleryArrow side="left" onClick={prev} label="Previous photo" />
            )}
            {canNext && (
              <GalleryArrow side="right" onClick={next} label="Next photo" />
            )}
          </div>
        </div>

        {count > 1 && (
          <Dots count={count} index={index} onSelect={go} tone="dark" />
        )}
      </div>

      {/* The viewer starts closed, so server and first client render agree and
          the portal only ever mounts after an interaction. */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isViewerOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                ref={dialogRef}
                onClick={closeViewer}
                role="dialog"
                aria-modal="true"
                aria-label={`${name} — photo viewer`}
                className="fixed inset-0 z-[120] flex flex-col bg-charcoal/95 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between px-5 py-5 md:px-8">
                  <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/55">
                    {count > 1 ? `${index + 1} / ${count}` : ''}
                  </span>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={closeViewer}
                    aria-label="Close viewer"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 active:scale-[0.97]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* No stopPropagation here: clicking the empty space beside the
                    photo should close, like any lightbox. The image, arrows and
                    dots stop it themselves. */}
                <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-20">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                      key={index}
                      custom={direction}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.32, ease: EASE }}
                      drag={count > 1 ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.16}
                      onDragEnd={(_, info) => onSwipe(info.offset.x, info.velocity.x)}
                      onClick={(e) => e.stopPropagation()}
                      src={img(images[index], 2000, 88)}
                      srcSet={imgSrcSet(images[index], [900, 1300, 1600, 2000], 88)}
                      sizes="100vw"
                      alt={altFor(name, index)}
                      draggable={false}
                      className="absolute max-h-full max-w-full select-none object-contain"
                    />
                  </AnimatePresence>

                  {canPrev && (
                    <GalleryArrow side="left" onClick={prev} label="Previous photo" tone="light" />
                  )}
                  {canNext && (
                    <GalleryArrow side="right" onClick={next} label="Next photo" tone="light" />
                  )}
                </div>

                {count > 1 && (
                  <div className="flex justify-center pb-8 pt-2" onClick={(e) => e.stopPropagation()}>
                    <Dots count={count} index={index} onSelect={go} tone="light" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function GalleryArrow({
  side,
  onClick,
  label,
  tone = 'dark',
}: {
  side: 'left' | 'right';
  onClick: () => void;
  label: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className={cn(
        'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-colors duration-200 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:h-11 md:w-11',
        side === 'left' ? 'left-2 md:left-3' : 'right-2 md:right-3',
        tone === 'dark'
          ? 'bg-cream/90 text-charcoal shadow-[0_2px_10px_rgba(31,26,23,0.14)] backdrop-blur-sm hover:bg-cream hover:text-maroon focus-visible:outline-maroon/60'
          : 'bg-white/10 text-white/85 backdrop-blur-sm hover:bg-white/20 hover:text-white focus-visible:outline-white/60'
      )}
    >
      {side === 'left' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}

function Dots({
  count,
  index,
  onSelect,
  tone,
}: {
  count: number;
  index: number;
  onSelect: (i: number) => void;
  tone: 'dark' | 'light';
}) {
  return (
    // Wraps rather than overflowing: the dot row fits one line up to ~14
    // photos, and there is no cap on how many she can upload.
    <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to photo ${i + 1}`}
          aria-current={i === index}
          className="flex h-6 items-center px-1"
        >
          <span
            className={cn(
              'block h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
              i === index ? 'w-6' : 'w-1.5',
              tone === 'dark'
                ? i === index
                  ? 'bg-charcoal'
                  : 'bg-charcoal/25'
                : i === index
                  ? 'bg-white'
                  : 'bg-white/40'
            )}
          />
        </button>
      ))}
    </div>
  );
}
