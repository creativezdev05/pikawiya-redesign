"use client";

import { getImageProps } from "next/image";
import TrLogo, { type TrLogoMotion, type TrLogoPlacement } from "./TrLogo";
import CulturalPattern from "./CulturalPattern";
import HomeStoryHero, { CORNER_DOTS } from "./HomeStoryHero";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  /** Home only: part of `title` rendered on its own line in ochre. */
  titleHighlight?: string;
  description?: string;
  imageSrc: string;
  imageMobileSrc?: string;
  imageAlt: string;
  ctaLabel?: string;
  ctaHref?: string;
  trLogo?: TrLogoMotion;
  trLogoPlacement?: TrLogoPlacement;
  trLogoClassName?: string;
  pageName?: string;
};

export default function PageHero({
  eyebrow,
  title,
  titleHighlight,
  description,
  imageSrc,
  imageMobileSrc,
  imageAlt,
  ctaLabel,
  ctaHref,
  trLogo,
  trLogoPlacement = "tr",
  trLogoClassName = "",
  pageName = "",
}: PageHeroProps) {
  if (pageName === "home") {
    return (
      <HomeStoryHero
        eyebrow={eyebrow}
        title={title}
        titleHighlight={titleHighlight}
        description={description}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
      />
    );
  }

  const commonImgProps = {
    alt: imageAlt,
    fill: true,
    priority: true,
    sizes: "100vw",
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

  const objectPosition = pageName === "about" ? "object-center min-[960px]:object-right" : "object-center";

  return (
    <section className="relative z-10 flex min-h-[85dvh] w-full items-center overflow-hidden pt-28 pb-12 lg:min-h-screen lg:pt-32 lg:pb-16">
      {/* Cultural Patterns */}
      {pageName === "news" && (
        <CulturalPattern
          variant="about"
          dashedOrbitsConfig={[
            { x: 100, y: 200, pathHeight: 150, pathWidth: 300, speed: 10 },
            { x: 200, y: 400, pathHeight: 120, pathWidth: 420, speed: 10 },
            { x: 300, y: 600, pathHeight: 120, pathWidth: 400, speed: 10 },
          ]}
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
        <div className="page-hero__media relative h-full w-full motion-safe:animate-[heroFloat_20s_ease-in-out_infinite]">
          {/* Only the source matching the viewport is downloaded. */}
          <picture className="block h-full w-full">
            <source media="(min-width: 960px)" srcSet={desktopSrcSet} />
            <source media="(max-width: 959px)" srcSet={mobileSrcSet} />
            <img
              {...restImgProps}
              /* object-cover never distorts, unlike the old [object-fit:fill] stretch */
              className={`h-full w-full object-cover ${objectPosition}`}
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
      </div>

      {/* Corner dot arc — fill mode so "100%" is the section's real corner, not the fixed 1200×800 canvas. */}
      {(pageName === "news" || pageName === "service" || pageName === "about") && (
        <CulturalPattern variant="about" fit="fill" className="z-[1]" dotsConfig={CORNER_DOTS} />
      )}

      {trLogo ? (
        <TrLogo
          motion={trLogo}
          placement={trLogoPlacement}
          className={`tr-logo--hero ${trLogoClassName}`.trim()}
        />
      ) : null}

      {/* Left Column */}
      {/* <div className="lg:col-span-8 text-left pl-0 md:pl-4">
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
    </section>
  );
}
