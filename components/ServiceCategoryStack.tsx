"use client";

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { ServiceCategory } from "@/lib/supabaseClient";
import NextImage from 'next/image';

// Space reserved for the fixed navbar when a card sticks
const NAV_OFFSET = 88;
// Height of each category's title strip that stays visible once stacked
const HEADER_PEEK = 64;

type Props = {
  categories: ServiceCategory[];
};

export default function ServiceCategoryStack({ categories }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  // Progress across the whole stack drives the shrink of earlier cards (cards-parallax technique)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Front card = the last one whose sticky position has been reached
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    let next = 0;
    markerRefs.current.forEach((marker, i) => {
      if (!marker) return;
      const stickAt = marker.getBoundingClientRect().top + y - (NAV_OFFSET + i * HEADER_PEEK);
      if (y >= stickAt - 4) next = i;
    });
    setActiveIndex(next);
  });

  const scrollToCategory = (index: number) => {
    // Markers sit at each card's natural position and carry a scroll-margin equal
    // to the card's sticky top, so scrolling to them lands the card fully in view
    markerRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div ref={containerRef} className="relative">
      {categories.map((category, index) => {
        const top = NAV_OFFSET + index * HEADER_PEEK;
        return (
          <Fragment key={category.id}>
            <div
              ref={(el) => {
                markerRefs.current[index] = el;
              }}
              id={`category-${category.id}`}
              aria-hidden="true"
              style={{ scrollMarginTop: top }}
            />
            <StackCard
              category={category}
              index={index}
              total={categories.length}
              top={top}
              progress={scrollYProgress}
              reduceMotion={!!reduceMotion}
              isActive={index === activeIndex}
              hasNext={index < categories.length - 1}
              // Front card: slide the next card up over it. Stacked card: bring it back to the front.
              onSelect={() => scrollToCategory(index === activeIndex ? index + 1 : index)}
            />
            {/* Scroll gap before the next card. Kept as a separate element: a margin on the
                sticky card would make it unstick early and uncover the card beneath */}
            {index < categories.length - 1 && <div aria-hidden="true" className="h-[30vh]" />}
          </Fragment>
        );
      })}
    </div>
  );
}

type StackCardProps = {
  category: ServiceCategory;
  index: number;
  total: number;
  top: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
  isActive: boolean;
  hasNext: boolean;
  onSelect: () => void;
};

function StackCard({
  category,
  index,
  total,
  top,
  progress,
  reduceMotion,
  isActive,
  hasNext,
  onSelect,
}: StackCardProps) {
  // Cards further back in the stack end up slightly smaller; the last card never shrinks
  const targetScale = Math.max(0.88, 1 - (total - 1 - index) * 0.03);
  const scale = useTransform(progress, [index / total, 1], [1, reduceMotion ? 1 : targetScale]);
  const bodyId = `category-body-${category.id}`;
  // The last card has nothing to slide over it once it is at the front
  const clickable = !isActive || hasNext;

  return (
<motion.section
  aria-labelledby={`category-title-${category.id}`}
  className="sticky flex flex-col overflow-hidden rounded-3xl border border-ochre/20 bg-white shadow-[0_-12px_40px_-16px_rgba(0,0,0,0.25)]"
  style={{
    top,
    scale,
    transformOrigin: "top center",
    zIndex: index + 1,
    height: `calc(100svh - ${top}px - 1.5rem)`,
  }}
>
  {/* Left Accent Ribbon Edge */}
  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-ochre via-amber-500 to-ochre z-20" />

  {/* Accordion / Category Header Toggle Strip */}
  <button
    type="button"
    onClick={onSelect}
    disabled={!clickable}
    aria-controls={bodyId}
    aria-expanded={isActive}
    className="group/header relative z-10 flex shrink-0 items-center gap-3 px-5 md:px-8 text-left bg-[#1B2433] border-b border-ochre/20 cursor-pointer disabled:cursor-default transition-colors enabled:hover:bg-[#1B2433]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ochre"
    style={{ height: HEADER_PEEK }}
  >
    <span className="shrink-0 text-xs md:text-sm font-bold tabular-nums text-ochre">
      {String(index + 1).padStart(2, "0")}
    </span>
    <h2
      id={`category-title-${category.id}`}
      className="flex-1 truncate text-lg md:text-2xl font-extrabold tracking-tight text-white group-hover/header:text-ochre transition-colors"
    >
      {category.category_title}
    </h2>
    <span className="hidden sm:inline-flex shrink-0 items-center rounded-full bg-ochre/20 px-3 py-1 text-xs font-semibold text-ochre">
      {category.services.length} {category.services.length === 1 ? "service" : "services"}
    </span>
    {clickable && (
      <ChevronDown
        className={`w-5 h-5 shrink-0 text-ochre transition-transform duration-300 ${
          isActive ? "rotate-180 group-hover/header:-translate-y-0.5" : "group-hover/header:translate-y-0.5"
        }`}
        aria-hidden="true"
      />
    )}
  </button>

  {/* Scrollable Content Area */}
  <div id={bodyId} className="bg-page relative min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8 space-y-8">
    
    {/* Category Hero Header Box - bg-[#1B2433] removed; relies on bg-surface or transparent layout */}
    <div className="relative p-6 md:p-8 rounded-2xl overflow-hidden border border-ochre/20 shadow-lg group/title space-y-4 bg-surface">
      
      {/* Banner Image Container */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <NextImage
          src="/assets/home/banner-bg-01.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 992px"
          className="object-contain object-right opacity-90"
        />
      </div>

      {/* Category Content */}
      <div className="relative z-10 space-y-3">
        <h3 className="text-2xl md:text-3xl font-extrabold text-ochre tracking-tight">
          {category.category_title}
        </h3>
        {category.category_desc && (
          <p className="text-ink/80 text-sm md:text-base leading-relaxed break-words font-medium max-w-3xl">
            {category.category_desc}
          </p>
        )}
      </div>

    </div>

    {/* Services Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch p-1">
      {category.services.map((service) => (
        <Link
          key={service.id}
          href={`/services/${service.slug}`}
          className="group flex flex-col h-full text-sm font-semibold text-ochre hover:text-ochre-dark transition"
        >
          <div className="card-3d zoom-box relative bg-surface border border-border p-6 rounded-2xl flex flex-col justify-between h-full w-full shadow-sm origin-center transition-all duration-500 hover:z-20 hover:scale-[1.02] hover:border-ochre hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.25)]">
            <div className="space-y-3 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-ink group-hover:text-ochre transition-colors duration-300 line-clamp-2">
                {service.title}
              </h3>
              <p className="text-ink/70 text-sm leading-relaxed line-clamp-3">
                {service.short_desc}
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-border flex items-center gap-1 text-ochre">
              Learn More <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>

  </div>
</motion.section>
  );
}
