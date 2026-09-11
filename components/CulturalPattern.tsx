"use client";

import { useId, useMemo } from "react";

type CulturalPatternProps = {
  className?: string;
  variant?: "about" | "vision" | "values" | "services" | "heritage" | "contact" | "footer" | "mission";
  showFeet?: boolean;
};

/** Deterministic seed from variant — stable across SSR, different per section */
function seedFrom(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 10) / 10;

function ringDots(cx: number, cy: number, rings: number, startR: number, gap: number, density = 8) {
  const pts: { x: number; y: number; r: number }[] = [];
  for (let ring = 0; ring < rings; ring++) {
    const radius = startR + ring * gap;
    const count = Math.max(6, Math.round(density + ring * 3.5));
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push({
        x: round(cx + Math.cos(a) * radius),
        y: round(cy + Math.sin(a) * radius),
        r: ring === 0 ? 2.1 : 1.5,
      });
    }
  }
  pts.push({ x: round(cx), y: round(cy), r: 2.8 });
  return pts;
}

/** Vertical flame-like column: bright at bottom, fading upward */
function flameColumn(x: number, yBottom: number, height: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const sway = Math.sin(t * Math.PI * 2.2 + x * 0.01) * (8 + t * 10);
    return {
      x: x + sway,
      y: yBottom - t * height,
      r: 2.4 - t * 1.2,
      // bottom bright first, wave travels upward
      delay: i * 0.14,
    };
  });
}

export default function CulturalPattern({
  className = "",
  variant = "about",
  showFeet = false,
}: CulturalPatternProps) {
  const uid = useId().replace(/:/g, "");
  const footId = `pw-foot-${uid}`;
  const handId = `pw-hand-${uid}`;

  const layout = useMemo(() => {
    const rand = mulberry32(seedFrom(variant));
    const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

    // Walking path — right → left (RTL)
    const startY = 560 + rand() * 100;
    const footCount = showFeet ? 5 : 0;
    const footprints = Array.from({ length: footCount }, (_, i) => {
      const t = i / Math.max(footCount - 1, 1);
      return {
        x: round(1080 - t * 920),
        y: round(startY + Math.sin(t * Math.PI * 0.85 + rand()) * 18 - t * 40),
      };
    });

    const spiralCount = 2 + Math.floor(rand() * 2);
    const spirals = Array.from({ length: spiralCount }, (_, i) => {
      const onRight = i % 2 === 1;
      return {
        cx: round(onRight ? 980 + rand() * 160 : 70 + rand() * 140),
        cy: round(i < 2 ? 90 + rand() * 160 : 520 + rand() * 180),
        rings: 3 + Math.floor(rand() * 3),
        startR: round(8 + rand() * 6),
        gap: round(11 + rand() * 5),
      };
    });

    // Flame columns rising bottom → top
    const flameCount = 3 + Math.floor(rand() * 3);
    const flames = Array.from({ length: flameCount }, () => {
      const col = flameColumn(
        round(80 + rand() * 1040),
        round(720 + rand() * 40),
        round(220 + rand() * 180),
        10 + Math.floor(rand() * 4)
      );
      return col.map((d) => ({ ...d, x: round(d.x), y: round(d.y), r: round(d.r) }));
    });

    // Fewer handprints — 0–1 most of the time, rarely 2
    const showHands = pick([false, false, false, true]);
    const handCount = showHands ? (rand() > 0.7 ? 2 : 1) : 0;
    const hands = Array.from({ length: handCount }, () => ({
      x: round(100 + rand() * 1000),
      y: round(120 + rand() * 480),
      rot: round(-35 + rand() * 70),
      scale: round(1.05 + rand() * 0.55),
      flip: rand() > 0.5,
    }));

    const showLogo = false;
    const logoPos = pick(["tr", "tl", "br"] as const);

    return { footprints, spirals, flames, hands, showFeet, showHands: handCount > 0, showLogo, logoPos };
  }, [variant, showFeet]);

  return (
    <div aria-hidden="true" className={`cultural-pattern cultural-pattern--${variant} ${className}`}>
      <div className="cultural-pattern__dotfield" />

      {layout.showLogo && (
        <img
          src="/assets/PWHS_Logo_Mark.png"
          alt=""
          className={`cultural-pattern__logo cultural-pattern__logo--${layout.logoPos}`}
          draggable={false}
        />
      )}

      <svg
        className="cultural-pattern__canvas"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <g id={footId}>
            <ellipse cx="0" cy="1" rx="14" ry="20" fill="#E85D26" opacity="0.12" />
            <path
              d="M-1.5 -20
                 C-9 -20 -13 -13 -13 -5
                 C-13 4 -10 11 -7 15
                 C-4 19 -1.5 21 0 21
                 C1.5 21 4 19 7 15
                 C10 11 13 4 13 -5
                 C13 -13 9 -20 1.5 -20
                 C0.5 -20 -0.5 -20 -1.5 -20Z"
              fill="#E85D26"
              opacity="0.45"
            />
            <path
              d="M-1 -16
                 C-6.5 -16 -9 -11 -9 -5
                 C-9 3 -7 9 -4.5 13
                 C-2.5 16 -0.8 17.5 0 17.5
                 C0.8 17.5 2.5 16 4.5 13
                 C7 9 9 3 9 -5
                 C9 -11 6.5 -16 1 -16Z"
              fill="#C25324"
              opacity="0.55"
            />
            <circle cx="0" cy="11" r="6.5" fill="none" stroke="#FFB070" strokeWidth="1.3" opacity="0.95" />
            <circle cx="0" cy="11" r="4.2" fill="none" stroke="#FFD0A8" strokeWidth="1.15" />
            <circle cx="0" cy="11" r="2.2" fill="none" stroke="#FFE8D0" strokeWidth="1" />
            <circle cx="0" cy="11" r="0.9" fill="#FFF5EB" />
            <circle cx="0" cy="-3" r="5" fill="none" stroke="#FFB070" strokeWidth="1.15" opacity="0.9" />
            <circle cx="0" cy="-3" r="2.8" fill="none" stroke="#FFD0A8" strokeWidth="1" />
            <circle cx="0" cy="-3" r="1.1" fill="#FFE8D0" />
            <circle cx="-5" cy="4" r="1.15" fill="#FFC090" />
            <circle cx="5" cy="4" r="1.15" fill="#FFC090" />
            <circle cx="-4.5" cy="-10" r="1.05" fill="#FFE0C0" />
            <circle cx="4.5" cy="-10" r="1.05" fill="#FFE0C0" />
            <circle cx="0" cy="-11" r="1.05" fill="#FFE0C0" />
            <circle cx="-8" cy="-22" r="2.6" fill="#E85D26" opacity="0.9" />
            <circle cx="-4" cy="-24.5" r="2.8" fill="#E85D26" opacity="0.95" />
            <circle cx="0" cy="-25.5" r="2.9" fill="#E85D26" />
            <circle cx="4" cy="-24.5" r="2.8" fill="#E85D26" opacity="0.95" />
            <circle cx="8" cy="-22" r="2.6" fill="#E85D26" opacity="0.9" />
            <circle cx="-8" cy="-22" r="0.95" fill="#FFD0A8" />
            <circle cx="-4" cy="-24.5" r="1" fill="#FFD0A8" />
            <circle cx="0" cy="-25.5" r="1.05" fill="#FFE8D0" />
            <circle cx="4" cy="-24.5" r="1" fill="#FFD0A8" />
            <circle cx="8" cy="-22" r="0.95" fill="#FFD0A8" />
          </g>

          {/* Realistic human hand stencil (Aboriginal rock-art style) */}
          <g id={handId}>
            {/* Palm */}
            <path
              d="M-11 8
                 C-13 2 -12 -4 -9 -8
                 C-6 -11 -2 -12 2 -11
                 C7 -10 11 -6 12 -1
                 C13 5 12 12 10 18
                 C8 24 4 28 0 29
                 C-5 30 -10 24 -11 18
                 C-12 14 -11 10 -11 8Z"
              fill="#E85D26"
              opacity="0.7"
            />
            {/* Thumb */}
            <path
              d="M-9 -6
                 C-14 -8 -18 -4 -19 1
                 C-20 6 -17 10 -13 9
                 C-10 8 -8 4 -8 0
                 C-8 -3 -8 -5 -9 -6Z"
              fill="#E85D26"
              opacity="0.7"
            />
            {/* Index */}
            <path
              d="M-6 -10 C-7 -22 -6 -32 -4.5 -34 C-2.5 -36 -1 -32 -1 -20 L-1.5 -10 C-3 -11 -5 -11 -6 -10Z"
              fill="#E85D26"
              opacity="0.7"
            />
            {/* Middle */}
            <path
              d="M0 -11 C-0.5 -24 0 -36 1.5 -38 C3.5 -40 5 -35 5 -22 L4 -11 C2.5 -12 1 -12 0 -11Z"
              fill="#E85D26"
              opacity="0.72"
            />
            {/* Ring */}
            <path
              d="M6 -10 C6.5 -22 7 -32 8.5 -34 C10.5 -36 12 -31 11.5 -19 L10 -10 C8.5 -11 7 -11 6 -10Z"
              fill="#E85D26"
              opacity="0.7"
            />
            {/* Pinky */}
            <path
              d="M11 -6 C12.5 -16 13 -24 14.5 -25.5 C16 -27 17 -23 16 -14 L14 -6 C13 -7 12 -7 11 -6Z"
              fill="#E85D26"
              opacity="0.68"
            />
          </g>
        </defs>

        {/* Sky spirals — unique positions per section */}
        {layout.spirals.map((sp, si) => {
          const dots = ringDots(sp.cx, sp.cy, sp.rings, sp.startR, sp.gap, 7);
          return (
            <g key={`sky-${si}`} className="cultural-sky-spiral" style={{ animationDelay: `${-si * 1.5}s` }}>
              {dots.map((d, di) => (
                <circle key={di} cx={d.x} cy={d.y} r={d.r} fill="#E85D26" />
              ))}
            </g>
          );
        })}

        {/* Flame-rise dots — bright at bottom, travel up & fade */}
        {layout.flames.map((col, ci) => (
          <g key={`flame-${ci}`} className="cultural-flame-col">
            {col.map((d, di) => (
              <circle
                key={di}
                cx={d.x}
                cy={d.y}
                r={d.r}
                fill="#E85D26"
                className="cultural-flame-dot"
                style={{ animationDelay: `${-(ci * 0.6 + d.delay)}s` }}
              />
            ))}
          </g>
        ))}

        {/* Handprints */}
        {layout.showHands &&
          layout.hands.map((h, i) => (
            <g
              key={`hand-${i}`}
              className="cultural-handprint"
              style={{ animationDelay: `${-i * 1.2}s` }}
              transform={`translate(${h.x}, ${h.y}) rotate(${h.rot}) scale(${h.flip ? -h.scale : h.scale}, ${h.scale})`}
            >
              <use href={`#${handId}`} />
            </g>
          ))}

        {/* Walking footprints — RTL path, toes face travel (not twisted) */}
        {layout.showFeet && (
          <g className="cultural-footprints">
            {layout.footprints.map((fp, i) => {
              const next = layout.footprints[Math.min(i + 1, layout.footprints.length - 1)];
              const prev = layout.footprints[Math.max(i - 1, 0)];
              // Direction of travel along RTL path (right → left)
              const dx = i < layout.footprints.length - 1 ? next.x - fp.x : fp.x - prev.x;
              const dy = i < layout.footprints.length - 1 ? next.y - fp.y : fp.y - prev.y;
              // Toes drawn at -Y; +90 aligns them with travel direction in SVG
              const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
              const side = i % 2 === 0 ? -11 : 11;
              return (
                <g
                  key={`fp-${i}`}
                  className="cultural-footprint"
                  style={{ animationDelay: `${i * 0.55}s` }}
                  transform={`translate(${fp.x + side}, ${fp.y}) rotate(${angle}) scale(1.3)`}
                >
                  <use href={`#${footId}`} />
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Bottom rising spark strip */}
      <svg className="cultural-pattern__songline-strip" viewBox="0 0 1200 48" preserveAspectRatio="none">
        {Array.from({ length: 24 }, (_, i) => {
          const x = 40 + i * 48;
          const y = 34 - (i % 5) * 3;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2}
              fill="currentColor"
              className="cultural-flame-dot"
              style={{ animationDelay: `${-i * 0.16}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
