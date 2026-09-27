"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselSlide {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
  className?: string;
  heightClassName?: string;
  rounded?: boolean;
}

// "Broken into bars": the photo is sliced into vertical strips. On enter,
// the strips fly in from alternating above/below and lock into place,
// staggered, so the image looks like it's assembling itself. On exit, the
// same strips fly back out the way they came, staggered in reverse, so it
// looks like the image is breaking apart before the next one assembles.
const BAR_COUNT = 9;
const BAR_STAGGER = 0.04;
const BAR_ENTER_DURATION = 0.85;
const BAR_EXIT_DURATION = 0.75;
const BAR_ENTER_EASE = [0.16, 1, 0.3, 1] as const;
const BAR_EXIT_EASE = [0.65, 0, 0.35, 1] as const;

// The duotone-to-color "reveal" plays once per slide and holds on full
// color (see .animate-carousel-duotone / .animate-carousel-leak in
// globals.css) — it must never repeat while the same photo is showing.
const REVEAL_DURATION_MS = 2800;

function ImageBars({ slide }: { slide: CarouselSlide }) {
  const barWidthPct = 100 / BAR_COUNT;

  return (
    <>
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const goingUp = i % 2 === 0;

        return (
          <motion.div
            key={`${slide.src}-${i}`}
            className="absolute top-0 h-full overflow-hidden"
            style={{ left: `${i * barWidthPct}%`, width: `${barWidthPct}%` }}
            initial={{ y: goingUp ? "-105%" : "105%", opacity: 0 }}
            animate={{
              y: "0%",
              opacity: 1,
              transition: { duration: BAR_ENTER_DURATION, delay: i * BAR_STAGGER, ease: BAR_ENTER_EASE },
            }}
            exit={{
              y: goingUp ? "105%" : "-105%",
              opacity: 0,
              transition: {
                duration: BAR_EXIT_DURATION,
                delay: (BAR_COUNT - 1 - i) * BAR_STAGGER,
                ease: BAR_EXIT_EASE,
              },
            }}
          >
            <div
              className="absolute top-0 h-full"
              style={{ width: `${BAR_COUNT * 100}%`, left: `-${i * 100}%` }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover animate-carousel-duotone"
                style={{ animationDuration: `${REVEAL_DURATION_MS}ms` }}
              />
            </div>
          </motion.div>
        );
      })}
    </>
  );
}

export default function ImageCarousel({
  slides,
  autoPlayInterval = 3000,
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

  return (
    <section
      className={`relative w-full overflow-hidden ${rounded ? "rounded-2xl" : ""} ${heightClassName} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="sync">
        <ImageBars key={currentSlide.src} slide={currentSlide} />
      </AnimatePresence>

      {/* Light leak sweep, timed to bloom in as the duotone filter above lifts into full color.
          Keyed to the slide so it plays once fresh per photo instead of looping. */}
      <div
        key={currentSlide.src}
        className="pointer-events-none absolute inset-[-35%] animate-carousel-leak"
        style={{
          background: "radial-gradient(circle, rgba(255,208,140,0.6), rgba(255,208,140,0) 62%)",
          mixBlendMode: "screen",
          animationDuration: `${REVEAL_DURATION_MS}ms`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10" />

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
