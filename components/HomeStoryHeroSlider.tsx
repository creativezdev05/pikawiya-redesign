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
    imageSrc: "/assets/home/home-crousel/2.jpeg",
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

  const hoverSpring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 70,
    duration: 0.6,
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

      {/* Story copy in the morphing blob — top-left under the fixed nav */}
      <div className="absolute inset-x-0 top-0 z-30 flex justify-start pointer-events-none">
        <div
          key={currentSlide.id + "-content"}
          className="intro_layers pointer-events-auto mt-20 gap-3 sm:mt-24 sm:gap-4 lg:mt-28 xl:mt-32"
        >
            {(currentSlide.badge || currentSlide.tag) && (
              <div className="inline-flex">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/35 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-ochre-light" />
                  {currentSlide.badge ?? currentSlide.tag}
                </span>
              </div>
            )}

            <motion.h1
              whileHover={{ scale: 1.06 }}
              transition={hoverSpring}
              className="text-shimmer text-2xl font-semibold leading-[1.15] tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl"
            >
              {currentSlide.title}
            </motion.h1>

            {currentSlide.year && (
              <motion.h4
                whileHover={{ scale: 1.06 }}
                transition={hoverSpring}
                className="text-shimmer text-base font-semibold sm:text-lg lg:text-xl"
              >
                {currentSlide.year}
              </motion.h4>
            )}

            <p
              className="max-w-md text-base leading-relaxed text-white sm:text-lg lg:text-xl"
            >
              {currentSlide.description}
            </p>

            {(currentSlide.primaryBtnText || currentSlide.secondaryBtnText) && (
              <div className="flex flex-wrap items-center justify-start gap-3.5 pt-1">
                {currentSlide.primaryBtnText && currentSlide.primaryBtnLink && (
                  <Link
                    href={currentSlide.primaryBtnLink}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ochre px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ochre-dark"
                  >
                    <span>{currentSlide.primaryBtnText}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}

                {currentSlide.secondaryBtnText && currentSlide.secondaryBtnLink && (
                  <Link
                    href={currentSlide.secondaryBtnLink}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/15 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/25"
                  >
                    <span>{currentSlide.secondaryBtnText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
        </div>
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