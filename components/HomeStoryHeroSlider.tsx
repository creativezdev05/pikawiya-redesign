"use client";

import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronRight,ShieldCheck,  ArrowRight,
  Baby,
  Globe2,
  HeartPulse,
  Landmark,
  Stethoscope,
  Sun,
  Users,
  type LucideIcon, } from "lucide-react";

export interface HeroSlide {
  id: string;
  imageSrc: string;
  badge?: string;
  title: string;
  description: string;
  year?: string;
  subtitle?: string;
  imageAlt?: string;
  tag?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
}

// const DEFAULT_SLIDES: HeroSlide[] = [
//   {
//     id: "1",
//     imageSrc: "/assets/home/hero-1.jpg",
//     badge: "Aboriginal Health Care",
//     title: "Empowering Community Through Quality Healthcare",
//     description:
//       "Pika Wiya Health Service provides culturally appropriate primary health care services to Aboriginal people in Port Augusta and surrounding regions.",
//     primaryBtnText: "Explore Our Services",
//     primaryBtnLink: "/services",
//     secondaryBtnText: "Contact Clinic",
//     secondaryBtnLink: "/contact",
//   },
//   {
//     id: "2",
//     imageSrc: "/assets/home/hero-2.jpg",
//     badge: "Community Wellbeing",
//     title: "Holistic Care Rooted in Culture & Tradition",
//     description:
//       "Delivering comprehensive clinical services, preventative health programs, and social support tailored to our community’s needs.",
//     primaryBtnText: "View Programs",
//     primaryBtnLink: "/services",
//     secondaryBtnText: "About PWHS",
//     secondaryBtnLink: "/about",
//   },
//   {
//     id: "3",
//     imageSrc: "/assets/home/hero-3.jpg",
//     badge: "Dedicated Support",
//     title: "Partnering for Healthy Futures & Strong Families",
//     description:
//       "Working together with local elders, health professionals, and partners to ensure accessible care for generations to come.",
//     primaryBtnText: "Latest News",
//     primaryBtnLink: "/news",
//     secondaryBtnText: "Our Governance",
//     secondaryBtnLink: "/governance",
//   },
// ];

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "foundation",
    year: "Early 1970s",
    title: "The Women Went Themselves",
    subtitle: "Grassroots mobilization for self-determination",
    description:
      "Driven by profound courage and a commitment to community wellbeing, local leaders took direct action to secure self-determined health services, laying the vital groundwork for Pika Wiya Health Service.",
    imageSrc: "/assets/home/home-crousel/1.png",
    imageAlt: "Community healthcare gathering",
    tag: "Heritage",
  },
  {
    id: "expansion",
    year: "1974",
    title: "Geneva Said Yes",
    subtitle: "International recognition & regional advocacy",
    description:
      "A pivotal moment when community advocacy gained international acknowledgment at the World Health Organization in Geneva, validating community-led primary health care models.",
    imageSrc: "/assets/home/home-crousel/2.png",
    imageAlt: "Outreach health services",
    tag: "Growth",
  },
  {
    id: "connection",
    year: "1983",
    title: "A Generation of Health Workers",
    subtitle: "Empowering regional workforce and tradition",
    description:
      "Embedding traditional knowledge, elder wisdom, and holistic wellbeing practices into professional pathways, fostering a dedicated generation of regional health practitioners.",
    imageSrc: "/assets/home/home-crousel/3.png",
    imageAlt: "Cultural knowledge sharing",
    tag: "Culture",
  },
  {
    id: "incorporation",
    year: "December 1984",
    title: "Pika Wiya Incorporated",
    subtitle: "Formal structure for regional care",
    description:
      "Achieving formal incorporation to expand clinical infrastructure, secure sustainable funding streams, and broaden comprehensive outreach programs across the regional footprint.",
    imageSrc: "/assets/home/home-crousel/4.png",
    imageAlt: "Modern medical facilities",
    tag: "Milestone",
  },
  {
    id: "anangu-bibi",
    year: "2004",
    title: "Anangu Bibi Begins",
    subtitle: "Specialized maternal and child health focus",
    description:
      "The launch of the Anangu Bibi program, dedicated to providing culturally secure, family-centered support for mothers, babies, and young children throughout their developmental journey.",
    imageSrc: "/assets/home/home-crousel/5.png",
    imageAlt: "Maternal and child wellness support",
    tag: "Care",
  },
  {
    id: "community-control",
    year: "2011",
    title: "Fully Community Controlled",
    subtitle: "Absolute self-determination in governance",
    description:
      "Reaching complete community control, ensuring that regional governance, cultural authority, and community voices directly drive every clinical and operational decision.",
    imageSrc: "/assets/home/home-crousel/6.png",
    imageAlt: "Community leadership and governance",
    tag: "Empowerment",
  },
  {
    id: "today-ours",
    year: "Today",
    title: "Still Ours",
    subtitle: "Continuing the legacy of community healing",
    description:
      "Remaining fiercely independent, community-owned, and dedicated to delivering holistic, doctor-led clinical and cultural healthcare services for generations to come.",
    imageSrc: "/assets/home/home-crousel/7.png",
    imageAlt: "Modern community healthcare delivery",
    tag: "Future",
  },
];
interface HomeStoryHeroSliderProps {
  slides?: HeroSlide[];
  autoPlayInterval?: number;
}

export function HomeStoryHeroSlider({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 4500,
}: HomeStoryHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [slides.length, autoPlayInterval]);

  const currentSlide = slides[currentIndex];

  const irisVariants: Variants = {
    initial: {
      clipPath: "circle(0% at 50% 50%)",
    },
    animate: {
      clipPath: "circle(150% at 50% 50%)",
      transition: {
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      clipPath: "circle(150% at 50% 50%)",
      transition: {
        duration: 0.1,
      },
    },
  };

  const textContainerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.4,
        staggerChildren: 0.12,
        duration: 0.5,
      },
    },
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-screen flex flex-col justify-start overflow-hidden bg-navy text-white">
      
      {/* Dynamic Iris Slide Layer */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentSlide.id}
          variants={irisVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 z-0 w-full h-full"
        >
          {/* Base Background Image */}
          <NextImage
            src={currentSlide.imageSrc}
            alt={currentSlide.title}
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover object-center"
          />

        </motion.div>
      </AnimatePresence>

      {/* Top-Left Story Content Card — anchored below the fixed logo/nav, fading softly into the image */}
      <div className="absolute inset-x-0 top-0 z-30 flex justify-start pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id + "-content"}
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            className="pointer-events-auto mt-20 sm:mt-24 lg:mt-28 xl:mt-32 max-w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-[radial-gradient(ellipse_160%_160%_at_top_left,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.6)_30%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.12)_78%,rgba(0,0,0,0)_92%)] pl-5 pr-10 pt-5 pb-10 sm:pl-7 sm:pr-14 sm:pt-6 sm:pb-14 lg:pl-9 lg:pr-20 lg:pt-8 lg:pb-20 space-y-3 sm:space-y-4 text-left"
          >
            {/* Category / Badge Pill */}
            {(currentSlide.badge || currentSlide.tag) && (
              <motion.div variants={textItemVariants} className="inline-flex">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ochre/25 border border-ochre/50 text-ochre text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-md drop-shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                  {currentSlide.badge ?? currentSlide.tag}
                </span>
              </motion.div>
            )}

            {/* Top-Left Title */}
            <motion.h1
              variants={textItemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]"
            >
              {currentSlide.title}
            </motion.h1>

            <motion.h2
              variants={textItemVariants}
              className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.6)]"
            >
              {currentSlide.year}
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={textItemVariants}
              className="max-w-md text-base sm:text-lg lg:text-xl leading-relaxed text-white/90 font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
            >
              {currentSlide.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={textItemVariants}
              className="flex flex-wrap items-center gap-3.5 pt-1"
            >
              {currentSlide.primaryBtnText && currentSlide.primaryBtnLink && (
                <Link
                  href={currentSlide.primaryBtnLink}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-ochre hover:bg-ochre-dark text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{currentSlide.primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {currentSlide.secondaryBtnText && currentSlide.secondaryBtnLink && (
                <Link
                  href={currentSlide.secondaryBtnLink}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{currentSlide.secondaryBtnText}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Slider Indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2.5">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full h-2 ${
              index === currentIndex
                ? "w-7 bg-ochre"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}

export default HomeStoryHeroSlider;