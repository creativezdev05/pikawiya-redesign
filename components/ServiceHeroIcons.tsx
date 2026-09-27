import Image from "next/image";
import type { CSSProperties } from "react";

const SERVICE_HERO_ICONS = [
  { src: "/assets/icons/health_care.png", alt: "Healthcare Services" },
  { src: "/assets/icons/clinical_health_care.png", alt: "Clinical Care" },
  { src: "/assets/icons/family_support.png", alt: "Family Support" },
  { src: "/assets/icons/emotional.png", alt: "Emotional Wellbeing" },
  { src: "/assets/icons/youth_program.png", alt: "Youth Programs" },
  { src: "/assets/icons/male__female_icon.png", alt: "Community Health" },
];

export default function ServiceHeroIcons() {
  const total = SERVICE_HERO_ICONS.length;

  return (
    <div className="service-hero-icons" aria-hidden="true">
      <span className="service-hero-icons__dial" />
      <div className="service-hero-icons__hover-zone">
        {SERVICE_HERO_ICONS.map((icon, index) => {
          // Start at 12 o'clock (-90deg) and space icons evenly around the dial.
          // The spoke rotates around the dial's own center, so this single angle
          // both places the icon and (via the anchor's counter-rotation) is all
          // that's needed to keep it upright while the whole wheel spins.
          const angleDeg = -90 + (360 / total) * index;

          return (
            <div
              key={icon.src}
              className="service-hero-icon-spoke"
              style={{
                "--base-angle": `${angleDeg}deg`,
                "--pop-delay": `${0.12 * index}s`,
                "--ring-delay": `${0.12 * index + 0.35}s`,
              } as CSSProperties}
            >
              <div className="service-hero-icon-anchor">
                <div className="service-hero-icon">
                  <span className="service-hero-icon__ring" />
                  <span className="service-hero-icon__ring service-hero-icon__ring--slow" />
                  <span className="service-hero-icon__glyph">
                    <Image
                      src={icon.src}
                      alt={icon.alt}
                      fill
                      sizes="90px"
                      className="service-hero-icon__img"
                    />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
