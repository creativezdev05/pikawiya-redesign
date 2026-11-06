"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

const SERVICE_HERO_ICONS = [
  { src: "/assets/icons/health_care.png", alt: "Healthcare Services" },
  { src: "/assets/icons/clinical_health_care.png", alt: "Clinical Care" },
  { src: "/assets/icons/family_support.png", alt: "Family Support" },
  { src: "/assets/icons/emotional.png", alt: "Emotional Wellbeing" },
  { src: "/assets/icons/youth_program.png", alt: "Youth Programs" },
  { src: "/assets/icons/male__female_icon.png", alt: "Community Health" },
];

/** Degrees per second once the wheel is up to speed. One turn every 13s. */
const SPIN_SPEED = 360 / 13;
/** How quickly spin speed eases in (and back up if the pointer returns mid-rewind). */
const SPIN_EASE = 2.5;
/** Peak reverse speed on the way back to the resting clock positions. */
const RETURN_SPEED = 64;
const RETURN_EASE = 3;
/** Distance (degrees) over which the rewind eases to a stop. */
const BRAKE_WINDOW = 100;

export default function ServiceHeroIcons() {
  const total = SERVICE_HERO_ICONS.length;
  const zoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let angle = 0;
    let velocity = 0;
    let hovering = false;
    let home = 0;
    let raf = 0;
    let last = 0;
    let running = false;

    const apply = () => {
      zone.style.setProperty("--orbit", `${angle}deg`);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.032, last ? (now - last) / 1000 : 0.016);
      last = now;

      if (hovering) {
        velocity += (SPIN_SPEED - velocity) * (1 - Math.exp(-SPIN_EASE * dt));
        angle += velocity * dt;
      } else {
        const remaining = angle - home;
        const pullingForward = velocity > 0.5;
        const brake = Math.min(1, Math.max(0, remaining) / BRAKE_WINDOW);
        const mag = pullingForward ? RETURN_SPEED : RETURN_SPEED * Math.pow(brake, 0.82);
        velocity += (-mag - velocity) * (1 - Math.exp(-RETURN_EASE * dt));
        const next = angle + velocity * dt;

        if (next <= home || (remaining < 0.35 && velocity <= 0)) {
          angle = 0;
          velocity = 0;
          home = 0;
          apply();
          stop();
          return;
        }

        angle = next;
      }

      apply();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const onEnter = () => {
      hovering = true;
      start();
    };

    const onLeave = () => {
      hovering = false;
      const wrapped = ((angle % 360) + 360) % 360;
      home = angle - wrapped;

      if (wrapped < 0.4 && velocity <= 0) {
        angle = 0;
        velocity = 0;
        home = 0;
        apply();
        stop();
        return;
      }

      start();
    };

    zone.addEventListener("pointerenter", onEnter);
    zone.addEventListener("pointerleave", onLeave);

    return () => {
      zone.removeEventListener("pointerenter", onEnter);
      zone.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="service-hero-icons" aria-hidden="true">
      <span className="service-hero-icons__dial" />
      <div ref={zoneRef} className="service-hero-icons__hover-zone">
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
