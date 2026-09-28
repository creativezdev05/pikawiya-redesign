"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

export interface CarouselSlide {
  src: string;
  alt: string;
  year?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  tag?: string;
}

interface ImageCarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
  className?: string;
  heightClassName?: string;
  rounded?: boolean;
}

const SLIDE_TRANSITION = { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const };

const textContainerVariants = {
  hidden: {},
  visible: {},
};

// Tag + title drop in from above the frame; the year rises in from below —
// the two halves converge on the block's resting spot at the top-left.
const topVariants = {
  hidden: { opacity: 0, y: -160 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" as const } },
};

const bottomVariants = {
  hidden: { opacity: 0, y: 160 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" as const, delay: 0.15 } },
};

export default function ImageCarousel({
  slides,
  autoPlayInterval = 4500,
  className = "",
  heightClassName = "h-[60vh] min-h-[380px] max-h-[640px]",
  rounded = true,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [slides.length, isPaused, autoPlayInterval, goNext]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];
  const hasOverlayText = Boolean(currentSlide.tag || currentSlide.title || currentSlide.year);

  return (
    <section
      className={`relative w-full overflow-hidden ${rounded ? "rounded-2xl" : ""} ${heightClassName} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={currentSlide.src}
          initial={{ y: "-100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={SLIDE_TRANSITION}
          className="absolute inset-0"
        >
          <Image
            src={currentSlide.src}
            alt={currentSlide.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10" />

      {hasOverlayText && (
        <div className="absolute inset-x-0 top-0 z-10 flex justify-start pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.src}
              variants={textContainerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
              className="pointer-events-auto mt-20 md:mt-28 max-w-xl bg-[radial-gradient(ellipse_160%_160%_at_top_left,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.32)_30%,rgba(0,0,0,0.16)_55%,rgba(0,0,0,0.05)_78%,rgba(0,0,0,0)_92%)] pl-6 pr-14 pt-6 pb-14 md:pl-12 md:pr-20 md:pt-8 md:pb-20 space-y-3"
            >
              {/* {currentSlide.tag && (
                <motion.div variants={topVariants} className="inline-flex">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ochre/25 border border-ochre/50 text-ochre text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-md drop-shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                    {currentSlide.tag}
                  </span>
                </motion.div>
              )} */}

              {currentSlide.title && (
                <motion.h1
                  variants={topVariants}
                  className="text-white text-2xl sm:text-3xl md:text-5xl font-bold leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]"
                >
                  {currentSlide.title}
                </motion.h1>
              )}

              {currentSlide.year && (
                <motion.h2
                  variants={bottomVariants}
                 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]"
                >
                  {currentSlide.year}
                </motion.h2>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/35"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/35"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-2.5">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentIndex ? "w-7 bg-ochre" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
