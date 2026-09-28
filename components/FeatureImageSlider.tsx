"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface FeatureSlide {
  src: string;
  alt: string;
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

export default function FeatureImageSlider({
  slides,
  autoPlayInterval = 4500,
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

  const goTo = useCallback(
    (target: number) => {
      setIndexDirection(([prev]) => [target, target > prev ? 1 : -1]);
      progressKey.current += 1;
    },
    []
  );

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => paginate(1), autoPlayInterval);
    return () => clearInterval(timer);
  }, [slides.length, isPaused, autoPlayInterval, paginate]);

  if (slides.length === 0) return null;

  const current = slides[index];

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

      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent pointer-events-none" />

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
