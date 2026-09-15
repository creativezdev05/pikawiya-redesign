"use client";

import { useId, useMemo } from "react";

type CulturalPatternProps = {
  className?: string;
  variant?: "about" | "vision" | "values" | "services" | "heritage" | "contact" | "footer" | "mission";
  showFeet?: boolean;
};

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

function ringDots(cx: number, cy: number, rings: number, startR: number, gap: number) {
  const pts: { x: number; y: number; r: number }[] = [];
  for (let ring = 0; ring < rings; ring++) {
    const radius = startR + ring * gap;
    const count = Math.max(8, Math.round(10 + ring * 4));
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push({
        x: round(cx + Math.cos(a) * radius),
        y: round(cy + Math.sin(a) * radius),
        r: ring === 0 ? 3.0 : 2.2,
      });
    }
  }
  pts.push({ x: round(cx), y: round(cy), r: 3.8 });
  return pts;
}

function generateArcSnakePath(xBase: number, yBase: number, radius = 35, turns = 6, rotDeg = 0) {
  let path = `M 0 0`;
  for (let i = 0; i < turns; i++) {
    const sweep = i % 2 === 0 ? 1 : 0;
    const yTarget = (i + 1) * radius * 2;
    path += ` A ${radius} ${radius} 0 0 ${sweep} 0 ${yTarget}`;
  }
  return { path, xBase: round(xBase), yBase: round(yBase), rotDeg: round(rotDeg) };
}

function generateHandmadeSpiralPath(turns = 3.5, maxR = 65) {
  const pts: string[] = [];
  const steps = Math.round(turns * 24);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const r = t * maxR;
    const x = round(Math.cos(angle) * r);
    const y = round(Math.sin(angle) * r);
    if (i === 0) pts.push(`M ${x} ${y}`);
    else pts.push(`L ${x} ${y}`);
  }
  return pts.join(" ");
}

function generateUShapePath(width: number, height: number) {
  const r = width / 2;
  return `M 0 0 L 0 ${height - r} A ${r} ${r} 0 0 0 ${width} ${height - r} L ${width} 0`;
}

export default function CulturalPattern({
  className = "",
  variant = "about",
  showFeet = true,
}: CulturalPatternProps) {
  const uid = useId().replace(/:/g, "");
  const footRightId = `pw-foot-right-${uid}`;
  const handId = `pw-hand-${uid}`;

  const layout = useMemo(() => {
    const rand = mulberry32(seedFrom(variant));

    // Three horizontal placement bands across full 1200px width
    const pickX = (zone: "left" | "center" | "right") => {
      if (zone === "left") return round(50 + rand() * 250);
      if (zone === "center") return round(450 + rand() * 300);
      return round(880 + rand() * 250);
    };

    // 1. Dot Spirals (Left, Center & Right)
    const spirals = [
      { cx: pickX("left"), cy: round(140 + rand() * 180), rings: 4, startR: 12, gap: 14 },
      { cx: pickX("center"), cy: round(360 + rand() * 160), rings: 5, startR: 14, gap: 16 },
      { cx: pickX("right"), cy: round(480 + rand() * 200), rings: 4, startR: 12, gap: 14 },
    ];

    // 2. Stroke Spirals (Distributed)
    const handmadeSpirals = [
      {
        x: pickX("right"),
        y: round(120 + rand() * 160),
        rot: round(rand() * 360),
        scale: round(0.9 + rand() * 0.3),
        path: generateHandmadeSpiralPath(3.5, 65),
      },
      {
        x: pickX("left"),
        y: round(440 + rand() * 200),
        rot: round(rand() * 360),
        scale: round(0.9 + rand() * 0.3),
        path: generateHandmadeSpiralPath(3.5, 65),
      },
      {
        x: pickX("center"),
        y: round(600 + rand() * 140),
        rot: round(rand() * 360),
        scale: round(0.8 + rand() * 0.3),
        path: generateHandmadeSpiralPath(3.0, 55),
      },
    ];

    // 3. Snake Arc Waves (Left, Center, Right)
    const snakes = [
      generateArcSnakePath(pickX("left"), round(40 + rand() * 100), round(24 + rand() * 8), 5, round(-15 + rand() * 30)),
      generateArcSnakePath(pickX("center"), round(180 + rand() * 140), round(28 + rand() * 8), 4, round(-25 + rand() * 50)),
      generateArcSnakePath(pickX("right"), round(80 + rand() * 120), round(24 + rand() * 8), 5, round(-15 + rand() * 30)),
    ];

    // 4. U-Shapes (Community meeting icons)
    const uShapes = [
      { x: pickX("left"), y: round(280 + rand() * 180), rot: round(rand() * 360), scale: round(0.85 + rand() * 0.3), layers: 4 },
      { x: pickX("center"), y: round(150 + rand() * 200), rot: round(rand() * 360), scale: round(0.95 + rand() * 0.3), layers: 5 },
      { x: pickX("right"), y: round(320 + rand() * 220), rot: round(rand() * 360), scale: round(0.85 + rand() * 0.3), layers: 4 },
    ];

    // 5. Handprints (Left, Center, Right)
    const hands = [
      { x: pickX("left"), y: round(160 + rand() * 450), rot: round(-30 + rand() * 60), scale: round(1.1 + rand() * 0.3), flip: false },
      { x: pickX("center"), y: round(480 + rand() * 250), rot: round(-20 + rand() * 40), scale: round(1.2 + rand() * 0.3), flip: true },
      { x: pickX("right"), y: round(180 + rand() * 450), rot: round(-30 + rand() * 60), scale: round(1.1 + rand() * 0.3), flip: true },
    ];

    // 6. Dual Vertical Human Footprint Trails (Stepping up Left AND Right margins simultaneously)
    const footCountPerSide = showFeet ? 10 : 0;
    
    const buildTrail = (baseX: number) => {
      return Array.from({ length: footCountPerSide }, (_, i) => {
        const t = i / Math.max(footCountPerSide - 1, 1);
        const isLeft = i % 2 === 0;
        const strideOffset = isLeft ? -16 : 16;
        return {
          x: round(baseX + strideOffset + Math.sin(t * Math.PI) * 12),
          y: round(740 - t * 680),
          isLeft,
        };
      });
    };

    const leftFootprints = buildTrail(round(120 + rand() * 80));
    const rightFootprints = buildTrail(round(1000 + rand() * 80));

    return {
      spirals,
      handmadeSpirals,
      snakes,
      uShapes,
      hands,
      leftFootprints,
      rightFootprints,
      showFeet,
    };
  }, [variant, showFeet]);

  return (
    <div aria-hidden="true" className={`cultural-pattern cultural-pattern--${variant} ${className}`}>
      <div className="cultural-pattern__dotfield opacity-30" />

      <svg
        className="cultural-pattern__canvas overflow-visible"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Human Footprint Pointing Upward */}
          <g id={footRightId}>
            <path
              d="M 0 18 
                 C -6 18, -10 12, -10 4 
                 C -10 -4, -6 -9, -4 -12 
                 C -3 -13.5, -4.5 -18, -7 -22 
                 C -9 -25, -7 -29, -2 -31 
                 C 3 -33, 8 -30, 9 -23 
                 C 10 -16, 7 -10, 4 -4 
                 C 2 2, 7 8, 7 13 
                 C 7 16, 4 18, 0 18 Z"
              fill="#E85D26"
              opacity="0.85"
            />
            <ellipse cx="-4" cy="-35" rx="3.2" ry="4" fill="#E85D26" opacity="0.9" />
            <ellipse cx="1" cy="-34" rx="2.4" ry="3" fill="#E85D26" opacity="0.9" />
            <ellipse cx="5" cy="-32" rx="2.1" ry="2.6" fill="#E85D26" opacity="0.9" />
            <ellipse cx="8.5" cy="-29.5" rx="1.8" ry="2.2" fill="#E85D26" opacity="0.9" />
            <ellipse cx="11.5" cy="-26.5" rx="1.5" ry="1.9" fill="#E85D26" opacity="0.9" />
          </g>

          <g id={handId}>
            <path
              d="M-11 8 C-13 2 -12 -4 -9 -8 C-6 -11 -2 -12 2 -11 C7 -10 11 -6 12 -1 C13 5 12 12 10 18 C8 24 4 28 0 29 C-5 30 -10 24 -11 18 Z"
              fill="#E85D26"
              opacity="0.85"
            />
            <path d="M-6 -10 L-4.5 -34 C-2.5 -36 -1 -32 -1 -20 L-1.5 -10 Z" fill="#E85D26" opacity="0.85" />
            <path d="M0 -11 L1.5 -38 C3.5 -40 5 -35 5 -22 L4 -11 Z" fill="#E85D26" opacity="0.9" />
          </g>
        </defs>

        <g>
          {/* Dot Spirals (Rotating & Breathing) */}
          {layout.spirals.map((sp, si) => {
            const dots = ringDots(sp.cx, sp.cy, sp.rings, sp.startR, sp.gap);
            return (
              <g
                key={`sky-${si}`}
                className="cultural-sky-spiral-rotate"
                style={{
                  transformOrigin: `${sp.cx}px ${sp.cy}px`,
                  animationDuration: `${28 + si * 6}s`,
                  animationDirection: si % 2 === 0 ? "normal" : "reverse",
                }}
              >
                {dots.map((d, di) => (
                  <circle
                    key={di}
                    cx={d.x}
                    cy={d.y}
                    r={d.r}
                    fill="#FF6B35"
                    opacity={0.85}
                    className="cultural-dot-pulse"
                    style={{ animationDelay: `${(di % 5) * 0.3}s` }}
                  />
                ))}
              </g>
            );
          })}

          {/* Handmade Stroke Spirals */}
          {layout.handmadeSpirals.map((hs, hsi) => (
            <g
              key={`hm-spiral-${hsi}`}
              transform={`translate(${hs.x}, ${hs.y}) rotate(${hs.rot}) scale(${hs.scale})`}
              className="cultural-sky-spiral-rotate"
              style={{
                transformOrigin: "0px 0px",
                animationDuration: `${22 + hsi * 5}s`,
                animationDirection: hsi % 2 === 0 ? "reverse" : "normal",
              }}
            >
              <path
                d={hs.path}
                fill="none"
                stroke="#E85D26"
                strokeWidth="4"
                strokeDasharray="6 8"
                strokeLinecap="round"
                opacity="0.3"
                className="cultural-vertical-snake"
                style={{ animationDuration: `${10 + hsi * 3}s` }}
              />
              <path
                d={hs.path}
                fill="none"
                stroke="#FF8C42"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                strokeLinecap="round"
                opacity="0.85"
                className="cultural-vertical-snake"
                style={{ animationDuration: `${10 + hsi * 3}s` }}
              />
            </g>
          ))}

          {/* Arc Snakes (Flowing Animated Lines across all 3 zones) */}
          {layout.snakes.map((snake, i) => (
            <g
              key={`arc-snake-${i}`}
              transform={`translate(${snake.xBase}, ${snake.yBase}) rotate(${snake.rotDeg})`}
            >
              <path
                d={snake.path}
                fill="none"
                stroke="#E85D26"
                strokeWidth="5"
                strokeDasharray="8 12"
                strokeLinecap="round"
                opacity="0.25"
                className="cultural-vertical-snake"
                style={{ animationDuration: `${14 + i * 4}s` }}
              />
              <path
                d={snake.path}
                fill="none"
                stroke="#FF8C42"
                strokeWidth="3"
                strokeDasharray="8 12"
                strokeLinecap="round"
                opacity="0.85"
                className="cultural-vertical-snake"
                style={{ animationDuration: `${14 + i * 4}s` }}
              />
            </g>
          ))}

          {/* U-Shapes (Pulsing Meeting Symbols) */}
          {layout.uShapes.map((u, ui) => (
            <g
              key={`ushape-${ui}`}
              transform={`translate(${u.x}, ${u.y}) rotate(${u.rot}) scale(${u.scale})`}
              className="cultural-u-shape-pulse"
              style={{ animationDelay: `${-ui * 1.2}s` }}
            >
              {Array.from({ length: u.layers }, (_, l) => {
                const w = 40 + l * 18;
                const h = 50 + l * 18;
                return (
                  <path
                    key={l}
                    d={generateUShapePath(w, h)}
                    fill="none"
                    stroke="#FF7A3D"
                    strokeWidth={3 - l * 0.4}
                    strokeDasharray="6 8"
                    strokeLinecap="round"
                    opacity={0.85 - l * 0.15}
                    transform={`translate(${-w / 2}, ${-h / 2})`}
                  />
                );
              })}
            </g>
          ))}

          {/* Handprints (Floating Drift Motion) */}
          {layout.hands.map((h, i) => (
            <g
              key={`hand-${i}`}
              className="cultural-hand-float"
              style={{ animationDelay: `${-i * 1.5}s` }}
              transform={`translate(${h.x}, ${h.y}) rotate(${h.rot}) scale(${h.flip ? -h.scale : h.scale}, ${h.scale})`}
            >
              <use href={`#${handId}`} />
            </g>
          ))}

          {/* Dual Footprint Trails (Left AND Right Margins) */}
          {layout.showFeet && (
            <>
              {/* Left Side Trail */}
              <g className="cultural-footprints-left">
                {layout.leftFootprints.map((fp, i) => {
                  const next = layout.leftFootprints[Math.min(i + 1, layout.leftFootprints.length - 1)];
                  const prev = layout.leftFootprints[Math.max(i - 1, 0)];
                  const dx = i < layout.leftFootprints.length - 1 ? next.x - fp.x : fp.x - prev.x;
                  const dy = i < layout.leftFootprints.length - 1 ? next.y - fp.y : fp.y - prev.y;
                  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

                  return (
                    <g
                      key={`fp-left-${i}`}
                      opacity="0.85"
                      transform={`translate(${fp.x}, ${fp.y}) rotate(${angle}) scale(${fp.isLeft ? -0.85 : 0.85}, 0.85)`}
                    >
                      <use href={`#${footRightId}`} />
                    </g>
                  );
                })}
              </g>

              {/* Right Side Trail */}
              <g className="cultural-footprints-right">
                {layout.rightFootprints.map((fp, i) => {
                  const next = layout.rightFootprints[Math.min(i + 1, layout.rightFootprints.length - 1)];
                  const prev = layout.rightFootprints[Math.max(i - 1, 0)];
                  const dx = i < layout.rightFootprints.length - 1 ? next.x - fp.x : fp.x - prev.x;
                  const dy = i < layout.rightFootprints.length - 1 ? next.y - fp.y : fp.y - prev.y;
                  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

                  return (
                    <g
                      key={`fp-right-${i}`}
                      opacity="0.85"
                      transform={`translate(${fp.x}, ${fp.y}) rotate(${angle}) scale(${fp.isLeft ? -0.85 : 0.85}, 0.85)`}
                    >
                      <use href={`#${footRightId}`} />
                    </g>
                  );
                })}
              </g>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}