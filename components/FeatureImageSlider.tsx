"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";

export interface FeatureSlide {
  src: string;
  alt: string;
  title?: string;
  tag?: string;
  nutrients?: string[];
}

interface FeatureImageSliderProps {
  slides: FeatureSlide[];
  autoPlayInterval?: number;
  className?: string;
  heightClassName?: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 1.15,
    x: direction > 0 ? "12%" : "-12%",
    rotate: direction > 0 ? 2 : -2,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: "0%",
    rotate: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 1.08,
    x: direction > 0 ? "-12%" : "12%",
    rotate: direction > 0 ? -2 : 2,
    transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const },
  }),
};

const textUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

export default function FeatureImageSlider({
  slides,
  autoPlayInterval = 5000,
  className = "",
  heightClassName = "h-72 sm:h-96 lg:h-full",
}: FeatureImageSliderProps) {
  const [[index, direction], setIndexDirection] = useState<[number, number]>([0, 1]);
  const [isPaused, setIsPaused] = useState(false);
  const progressKey = useRef(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setIndexDirection(([prev]) => {
        const next = (prev + newDirection + slides.length) % slides.length;
        return [next, newDirection];
      });
      progressKey.current += 1;
    },
    [slides.length]
  );

  const goTo = useCallback((target: number) => {
    setIndexDirection(([prev]) => [target, target > prev ? 1 : -1]);
    progressKey.current += 1;
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => paginate(1), autoPlayInterval);
    return () => clearInterval(timer);
  }, [slides.length, isPaused, autoPlayInterval, paginate]);

  if (slides.length === 0) return null;

  const current = slides[index];
  const hasText = Boolean(current.title || current.nutrients?.length);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl shadow-2xl ${heightClassName} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current.src}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: 1.12 }}
            transition={{ duration: autoPlayInterval / 1000 + 1.1, ease: "linear" }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Base scrim so photo + text stay readable regardless of image */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/35 to-navy/0 pointer-events-none" />

      {hasText && (
        <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 pb-16 sm:pb-20">
          <AnimatePresence mode="wait">
            <motion.div key={current.src} className="space-y-3">
              {current.tag && (
                <motion.span
                  custom={0}
                  variants={textUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ochre/90 text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider shadow-sm"
                >
                  <Leaf className="w-3 h-3" />
                  {current.tag}
                </motion.span>
              )}

              {current.title && (
                <motion.h3
                  custom={0.08}
                  variants={textUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                  className="text-white text-2xl sm:text-3xl font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
                >
                  {current.title}
                </motion.h3>
              )}

              {current.nutrients && current.nutrients.length > 0 && (
                <motion.ul
                  custom={0.16}
                  variants={textUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="flex flex-wrap gap-x-4 gap-y-1.5"
                >
                  {current.nutrients.map((nutrient) => (
                    <li
                      key={nutrient}
                      className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-ochre shrink-0" />
                      {nutrient}
                    </li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/35 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/35 hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className="relative h-1.5 rounded-full bg-white/30 overflow-hidden transition-all duration-500"
                style={{ width: i === index ? 32 : 8 }}
              >
                {i === index && !isPaused && (
                  <motion.span
                    key={progressKey.current}
                    className="absolute inset-y-0 left-0 bg-ochre rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
                  />
                )}
                {i === index && isPaused && (
                  <span className="absolute inset-0 bg-ochre rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
