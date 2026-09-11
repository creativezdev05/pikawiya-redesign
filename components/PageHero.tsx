import Image from "next/image";
import PageTitle from "./PageTitle";
import TrLogo, { type TrLogoMotion, type TrLogoPlacement } from "./TrLogo";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  trLogo?: TrLogoMotion;
  trLogoPlacement?: TrLogoPlacement;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  trLogo,
  trLogoPlacement = "tr",
}: PageHeroProps) {
  return (
    <section className="relative z-10 flex min-h-[100svh] items-center overflow-hidden bg-navy md:min-h-screen">
      <div className="absolute inset-[-20px]">
        <div className="page-hero__media relative h-full w-full motion-safe:animate-[heroFloat_20s_ease-in-out_infinite]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] opacity-50 scale-[1.08]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/78 via-navy/42 to-navy/85" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/45 to-navy/10" aria-hidden="true" />
      </div>

      {trLogo ? <TrLogo motion={trLogo} placement={trLogoPlacement} className="tr-logo--hero" /> : null}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="max-w-[700px]">
          <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
            {eyebrow}
          </span>
          <PageTitle
            onDark
            className="mb-5 text-[clamp(2.75rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
          >
            {title}
          </PageTitle>
          {description ? (
            <p className="max-w-[540px] text-base leading-relaxed text-white/70 md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
