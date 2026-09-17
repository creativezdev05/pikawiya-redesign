import Image from "next/image";
import PageTitle from "./PageTitle";
import TrLogo, { type TrLogoMotion, type TrLogoPlacement } from "./TrLogo";
import CulturalPattern from "./CulturalPattern";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  imageSrc: string;
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
  imageAlt,
  trLogo,
  trLogoPlacement = "tr",
  trLogoClassName = "",
  pageName=""
}: PageHeroProps) {
  return (
    <section className="relative z-10 flex min-h-[100svh] items-center overflow-hidden  md:min-h-screen">
      {
        pageName === 'service' &&
        <CulturalPattern 
          variant="about"
          motif1Config={[{ x: "-10%", y: "40%" }]}
          // motif2Config={[{ x: 1200, y: 650 }]}
          // motif3Config={[{ x: -20, y: 460 }]}
          // dotsConfig={[{ x: "-10%", y: "40%" }]}
          // dashedOrbitsConfig={[{ x: 1000, y: 200 }, { x: 1000, y: 200 } , { x: 1000, y: 100 }]}
        dashedOrbitsConfig={[{ x: 900, y: 200, pathHeight:150, pathWidth:300, speed:10 }, { x: 200, y: 400, pathHeight:120, pathWidth:420, speed:10 } , { x: 300, y: 600, pathHeight:120, pathWidth:400, speed:10 }]}

          uShapeConfig={[{ x: "-16%" , y: 750 }]}
          cornerTLConfig={{ x: "15%", y: "-30%" }}       // Pin strictly to top-left edge
          cornerBRConfig={{ x: "80%", y: "120%" }}  // Pin strictly to bottom-right edge
        />
      }
      {
        pageName == 'about' &&
        <CulturalPattern 
          variant="about"
          // motif1Config={[{ x: -30, y: 150 }]}
          // motif2Config={[{ x: 1200, y: 650 }]}
          // motif3Config={[{ x: -20, y: 460 }]}
          dotsConfig={[{ x: "-10%", y: "40%" }]}
          // dashedOrbitsConfig={[{ x: 1000, y: 200 }, { x: 1000, y: 200 } , { x: 1000, y: 100 }]}
        dashedOrbitsConfig={[{ x: 150, y: 300}, { x: 120, y: 400 } , { x: 170, y: 600 }]}

          uShapeConfig={[{ x: "-16%" , y: 750 }]}
          cornerTLConfig={{ x: "15%", y: "-30%" }}       // Pin strictly to top-left edge
          cornerBRConfig={{ x: "80%", y: "120%" }}  // Pin strictly to bottom-right edge
        />
      }
      <div className="absolute inset-[-20px]">
        <div className="page-hero__media relative h-full w-full motion-safe:animate-[heroFloat_20s_ease-in-out_infinite]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center]  scale-[1.08]"
          />
        </div>
        {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/78 via-navy/42 to-navy/85" aria-hidden="true" /> */}
        {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/45 to-navy/10" aria-hidden="true" /> */}
      </div>

      {trLogo ? (
        <TrLogo
          motion={trLogo}
          placement={trLogoPlacement}
          className={`tr-logo--hero ${trLogoClassName}`.trim()}
        />
      ) : null}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="max-w-[700px]">
          <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
            {eyebrow}
          </span>
          <PageTitle
            pageName ="aboutus"
            onDark
            className="mb-5 text-[clamp(2.75rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
          >
            {title}
          </PageTitle>
          {description ? (
            <p className={`max-w-[540px] text-base leading-relaxed md:text-lg ${pageName == 'about' ? 'text-ink/80' : 'text-white/70'}`}>
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
