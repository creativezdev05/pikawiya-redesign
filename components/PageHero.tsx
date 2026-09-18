import Image, {getImageProps } from "next/image";
import PageTitle from "./PageTitle";
import TrLogo, { type TrLogoMotion, type TrLogoPlacement } from "./TrLogo";
import CulturalPattern from "./CulturalPattern";

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
  pageName=""
}: PageHeroProps) {
  // 1. Define common properties applied to both desktop and mobile versions
  const commonImgProps = {
    alt: imageAlt,
    fill: true,
    priority: true,
    sizes: "100vw",
    className: "object-contain object-[72%_center] scale-[1.08]"
  };

  // 2. Generate Next.js optimized sets for desktop (>= 960px)
  const { props: { srcSet: desktopSrcSet } } = getImageProps({
    ...commonImgProps,
    src: imageSrc,
  });

  // 3. Generate Next.js optimized sets for mobile (< 960px). Fall back to imageSrc if empty.
  const { props: { srcSet: mobileSrcSet, ...restImgProps } } = getImageProps({
    ...commonImgProps,
    src: imageMobileSrc || imageSrc,
  });
  return (
    <section className="relative z-10 flex w-full aspect-[16/9] md:aspect-[21/9] items-center overflow-hidden">
      {pageName === 'news' &&
        <CulturalPattern 
          variant="about"
          dashedOrbitsConfig={[{ x: 100, y: 200, pathHeight:150, pathWidth:300, speed:10 }, { x: 200, y: 400, pathHeight:120, pathWidth:420, speed:10 } , { x: 300, y: 600, pathHeight:120, pathWidth:400, speed:10 }]}
          dotsConfig={[{ x: "-25%", y: "40%" }]}

          uShapeConfig={[{ x: "-15%" , y: 750 }]}
          cornerTLConfig={{ x: "40%", y: "-30%" }}       // Pin strictly to top-left edge
        />
      }
       {pageName === 'service' &&
        <CulturalPattern 
          variant="about"
        dashedOrbitsConfig={[{ x: 900, y: 200, pathHeight:150, pathWidth:300, speed:10 }, { x: 200, y: 400, pathHeight:120, pathWidth:420, speed:10 } , { x: 300, y: 600, pathHeight:120, pathWidth:400, speed:10 }]}

          uShapeConfig={[{ x: "-42%" , y: 750 }]}
          cornerTLConfig={{ x: "15%", y: "-30%" }}       // Pin strictly to top-left edge
        />
      }
      {pageName == 'about' &&
        <CulturalPattern 
          variant="about"
          dotsConfig={[{ x: "-18%", y: "28%" }]}
          dashedOrbitsConfig={[{ x: 1000, y: 200 }, { x: 1000, y: 200 } , { x: 1000, y: 100 }]}

          uShapeConfig={[{ x: "-34%" , y: "90%" }]}
          cornerTLConfig={{ x: "3%", y: "-16%" }}       // Pin strictly to top-left edge
          cornerBRConfig={{ x: "80%", y: "120%" }}  // Pin strictly to bottom-right edge
        />
      }
      <div className="absolute inset-[0px]">
        <div className="page-hero__media relative h-full w-full  motion-safe:animate-[heroFloat_20s_ease-in-out_infinite]">
          
          {/* 4. Responsive <picture> element built with Next.js optimization pipelines */}
          <picture>
            {/* Active on viewport widths 960px and up */}
            <source media="(min-width: 960px)" srcSet={desktopSrcSet} />
            
            {/* Active on viewports smaller than 960px */}
            <source media="(max-width: 959px)" srcSet={mobileSrcSet} />
            
            {/* Native img tag that handles styles and properties injected from getImageProps */}
            <img {...restImgProps} className="h-full w-full object-cover object-bottom" />
          </picture>

        </div>
        {pageName === "about" && (
          <div className="block lg:hidden"> {/* Hidden on screens 1024px/960px and up */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-page/78 via-page/42 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-page/95 via-page/40 via-35% to-transparent to-50%" aria-hidden="true" />
          </div>
        )}
        {pageName === "news" && (
          <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 via-40% to-transparent to-70%" aria-hidden="true" />
          </>
        )}
        {pageName !== "about" &&
          <>
          {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/78 via-navy/42 to-navy/85" aria-hidden="true" /> */}
          {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/45 to-navy/10" aria-hidden="true" /> */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/40 via-35% to-transparent to-50%" aria-hidden="true" />
          </>
        }
        
      </div>

      {trLogo ? (
        <TrLogo
          motion={trLogo}
          placement={trLogoPlacement}
          className={`tr-logo--hero ${trLogoClassName}`.trim()}
        />
      ) : null}

      <div className="relative z-10  w-full max-w-7xl px-4 pt-12 pb-20 md:pl-15 md:px-15 md:pt-8 md:pb-42 flex flex-col justify-start items-start" style={{paddingLeft:"195px"}}>
  <div className="max-w-[700px] text-left">
    <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
      {eyebrow}
    </span>
    <PageTitle
      pageName="aboutus"
      onDark
      className="mb-4 text-[clamp(2.75rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
    >
      {title}
    </PageTitle>
    {description ? (
      <p className={`max-w-[540px] text-base leading-relaxed md:text-lg ${pageName === 'about' ? 'text-ink/80' : 'text-white/70'}`}>
        {description}
      </p>
    ) : null}
  </div>
</div>
    </section>
  );
}
