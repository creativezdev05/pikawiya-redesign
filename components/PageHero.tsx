"use client";

import Image, { getImageProps } from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import TrLogo, { type TrLogoMotion, type TrLogoPlacement } from "./TrLogo";
import CulturalPattern from "./CulturalPattern";

const CAROUSEL_ITEMS = [
  { id: 1, title: "The Women Went Themselves", imageSrc: "/assets/story/1970.png", alt: "Hero image 1" },
  { id: 2, title: "Geneva Said Yes", imageSrc: "/assets/story/1974.png", alt: "Hero image 2" },
  { id: 3, title: "A Generation of Health Workers", imageSrc: "/assets/story/1983.png", alt: "Hero image 3" },
  { id: 4, title: "Pika Wiya Incorporated", imageSrc: "/assets/story/1984.png", alt: "Hero image 4" },
  { id: 5, title: "Anangu Bibi Begins", imageSrc: "/assets/story/2004.png", alt: "Hero image 5" },
  { id: 6, title: "Fully Community Controlled", imageSrc: "/assets/story/2011.png", alt: "Hero image 6" },
  { id: 7, title: "Still Ours", imageSrc: "/assets/story/2026.png", alt: "Hero image 7" },
];

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  imageSrc: string;
  imageMobileSrc?: string;
  imageAlt: string;
  trLogo?: TrLogoMotion;
  trLogoPlacement?: TrLogoPlacement;
  trLogoClassName?: string;
  pageName?: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageMobileSrc,
  imageAlt,
  trLogo,
  trLogoPlacement = "tr",
  trLogoClassName = "",
  pageName = "",
}: PageHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const xX = useMotionValue(0);
  const smoothX = useSpring(xX, { stiffness: 200, damping: 25 });

  const cardWidth = 280;
  const cardGap = -40;

  useEffect(() => {
    if (pageName !== "home") return;

    const updatePosition = () => {
      const step = cardWidth + cardGap;
      const centerOffset = containerRef.current
        ? containerRef.current.offsetWidth / 2 - cardWidth / 2
        : 0;
      xX.set(-activeIndex * step + centerOffset);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [activeIndex, pageName, xX, cardWidth, cardGap]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const dragOffset = info.offset.x;
    let targetIndex = activeIndex;

    if (dragOffset < -50 && activeIndex < CAROUSEL_ITEMS.length - 1) {
      targetIndex = activeIndex + 1;
    } else if (dragOffset > 50 && activeIndex > 0) {
      targetIndex = activeIndex - 1;
    }

    setActiveIndex(targetIndex);
  };

  const commonImgProps = {
    alt: imageAlt,
    fill: true,
    priority: true,
    sizes: "100vw",
    className: "[object-fit:fill]",
  };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...commonImgProps,
    src: imageSrc,
  });

  const {
    props: { srcSet: mobileSrcSet, ...restImgProps },
  } = getImageProps({
    ...commonImgProps,
    src: imageMobileSrc || imageSrc,
  });

  return (
    <section className="relative z-10 w-full min-h-screen flex items-center overflow-hidden pt-28 pb-12 lg:pt-32 lg:pb-16">
      {/* Cultural Patterns */}
      {pageName === "news" && (
        <CulturalPattern
          variant="about"
          dashedOrbitsConfig={[
            { x: 100, y: 200, pathHeight: 150, pathWidth: 300, speed: 10 },
            { x: 200, y: 400, pathHeight: 120, pathWidth: 420, speed: 10 },
            { x: 300, y: 600, pathHeight: 120, pathWidth: 400, speed: 10 },
          ]}
          dotsConfig={[{ x: "-25%", y: "40%" }]}
          uShapeConfig={[{ x: "-15%", y: 750 }]}
          cornerTLConfig={{ x: "40%", y: "-30%" }}
        />
      )}
      {pageName === "service" && (
        <CulturalPattern
          variant="about"
          dashedOrbitsConfig={[
            { x: 900, y: 200, pathHeight: 150, pathWidth: 300, speed: 10 },
            { x: 200, y: 400, pathHeight: 120, pathWidth: 420, speed: 10 },
            { x: 300, y: 600, pathHeight: 120, pathWidth: 400, speed: 10 },
          ]}
          uShapeConfig={[{ x: "-42%", y: 750 }]}
          cornerTLConfig={{ x: "15%", y: "-30%" }}
        />
      )}
      {pageName === "about" && (
        <CulturalPattern
          variant="about"
          dotsConfig={[{ x: "-18%", y: "28%" }]}
          dashedOrbitsConfig={[
            { x: 1000, y: 200 },
            { x: 1000, y: 200 },
            { x: 1000, y: 100 },
          ]}
          uShapeConfig={[{ x: "-34%", y: "90%" }]}
          cornerTLConfig={{ x: "3%", y: "-16%" }}
          cornerBRConfig={{ x: "80%", y: "120%" }}
        />
      )}

      {/* Hero Background Media & Gradients */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <div
          className={`page-hero__media relative h-full w-full ${
            pageName !== "home" &&
            "motion-safe:animate-[heroFloat_20s_ease-in-out_infinite]"
          }`}
        >
          <picture className="h-full w-full block">
            <source media="(min-width: 960px)" srcSet={desktopSrcSet} />
            <source media="(max-width: 959px)" srcSet={mobileSrcSet} />
            <img
              {...restImgProps}
              /* [object-fit:fill] forces the image to stretch 100% horizontally and vertically without cropping any side */
              className="h-full w-full [object-fit:fill]"
            />
          </picture>
        </div>

        {pageName === "about" && (
          <div className="block lg:hidden">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-page/78 via-page/42 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-page/95 via-page/40 via-35% to-transparent to-50%"
              aria-hidden="true"
            />
          </div>
        )}
        {pageName === "news" && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 via-40% to-transparent to-70%"
            aria-hidden="true"
          />
        )}
        {/* {pageName !== "about" && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/45 via-navy/30 via-40% to-navy/20 to-40%"
            aria-hidden="true"
          />
        )} */}
      </div>

      {trLogo ? (
        <TrLogo
          motion={trLogo}
          placement={trLogoPlacement}
          className={`tr-logo--hero ${trLogoClassName}`.trim()}
        />
      ) : null}

      {/* Layout Content */}
      <div className="relative z-10 w-full pl-4 md:pl-8 lg:pl-12 pr-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column */}
        {/* <div
          className={`${
            pageName === "home" ? "lg:col-span-5" : "lg:col-span-8"
          } text-left pl-0 md:pl-4`}
        >
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
            {eyebrow}
          </span>
          <PageTitle
            pageName={pageName}
            onDark
            className="mb-4 text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
          >
            {title}
          </PageTitle>
          {description ? (
            <p className="max-w-[560px] text-base leading-relaxed md:text-lg text-ink/80">
              {description}
            </p>
          ) : null}
        </div> */}

        {/* Right Column: Dynamic Image Drag Carousel */}
        {pageName === "hhh" && (
          <div
            ref={containerRef}
            className="lg:col-span-7 w-full overflow-hidden min-w-0 py-6 relative flex items-center h-[520px]"
          >
            <motion.div
              drag="x"
              dragConstraints={{
                left: -(CAROUSEL_ITEMS.length - 1) * (cardWidth + cardGap),
                right: 0,
              }}
              style={{ x: smoothX }}
              onDragEnd={handleDragEnd}
              className="flex items-center cursor-grab active:cursor-grabbing w-max absolute left-0"
            >
              {CAROUSEL_ITEMS.map((item, idx) => {
                const distanceFromCenter = Math.abs(idx - activeIndex);

                const heightClass =
                  distanceFromCenter === 0
                    ? "h-[420px] sm:h-[480px]"
                    : distanceFromCenter === 1
                    ? "h-[350px]"
                    : "h-[280px]";

                const opacity =
                  distanceFromCenter === 0
                    ? 1
                    : distanceFromCenter === 1
                    ? 0.85
                    : 0.5;

                const zIndex = 30 - distanceFromCenter * 10;

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    animate={{
                      opacity,
                      zIndex,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 24,
                    }}
                    style={{
                      width: `${cardWidth}px`,
                      marginRight: `${cardGap}px`,
                    }}
                    className={`relative overflow-hidden rounded-3xl shrink-0 border border-white/20 shadow-2xl select-none transition-all duration-500 ease-out ${heightClass}`}
                  >
                    <Image
                      src={item.imageSrc}
                      alt={item.alt}
                      fill
                      sizes="350px"
                      className="object-cover pointer-events-none"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {item.title && (
                      <div className="absolute bottom-5 left-5 right-5 z-10">
                        <p className="text-white font-semibold text-xl leading-tight drop-shadow-md">
                          {item.title}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}