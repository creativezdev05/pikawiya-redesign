"use client";

import { useId, useMemo } from "react";

type PointConfig = {
  x?: number; // Exact horizontal position from left (0 to 1200)
  y?: number; // Exact vertical position from top (0 to 800)
};

type CulturalPatternProps = {
  className?: string;
  variant?: "about" | "vision" | "values" | "services" | "heritage" | "contact" | "footer" | "mission" | "core-service";
  showFeet?: boolean;
  
  dotsConfig?: PointConfig[];
  motif1Config?: PointConfig[];
  motif2Config?: PointConfig[];
  motif3Config?: PointConfig[];
  spiralsConfig?: PointConfig[];
  handsConfig?: PointConfig[];
  uShapeConfig?: PointConfig[];
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

function generateGraduatedCircularDots(cx: number, cy: number, rings: number, startR: number, gap: number) {
  const pts: { x: number; y: number; r: number }[] = [];
  for (let ring = 0; ring < rings; ring++) {
    const radius = startR + ring * gap;
    const count = Math.max(8, Math.round(12 + ring * 6));
    const dotRadius = Math.max(1.8, round(4.5 - ring * 0.5));

    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push({
        x: round(cx + Math.cos(a) * radius),
        y: round(cy + Math.sin(a) * radius),
        r: dotRadius,
      });
    }
  }
  pts.push({ x: round(cx), y: round(cy), r: 5.5 });
  return pts;
}

function generateHypnoticSpiralPath(turns = 4.5, maxRadius = 80, pointsPerTurn = 36) {
  const totalPoints = Math.round(turns * pointsPerTurn);
  let path = "";
  for (let i = 0; i <= totalPoints; i++) {
    const t = i / totalPoints;
    const angle = t * turns * Math.PI * 2;
    const r = t * maxRadius;
    const x = round(Math.cos(angle) * r);
    const y = round(Math.sin(angle) * r);
    if (i === 0) {
      path += `M ${x} ${y}`;
    } else {
      path += ` L ${x} ${y}`;
    }
  }
  return path;
}

// Inverted/opposite direction U-shape path (complementary curve)
function generateInvertedUShapePath(width: number, height: number) {
  const r = width / 2;
  return `M 0 ${height} L 0 ${r} A ${r} ${r} 0 0 1 ${width} ${r} L ${width} ${height}`;
}

function generateFixedLongSnakePath(xStart: number, yStart: number, width = 1200, turns = 10) {
  let path = `M ${xStart} ${yStart}`;
  const segmentWidth = width / turns;
  const arcHeight = 6;

  for (let i = 0; i < turns; i++) {
    const sweep = i % 2 === 0 ? 1 : 0;
    const nextX = xStart + (i + 1) * segmentWidth;
    const controlX = xStart + (i + 0.5) * segmentWidth;
    const controlY = yStart + (sweep === 1 ? arcHeight : -arcHeight);
    path += ` Q ${controlX} ${controlY}, ${nextX} ${yStart}`;
  }
  return path;
}

export default function CulturalPattern({
  className = "",
  variant = "about",
  showFeet = false,
  dotsConfig,
  motif1Config,
  motif2Config,
  motif3Config,
  spiralsConfig,
  handsConfig,
  uShapeConfig,
}: CulturalPatternProps) {
  const uid = useId().replace(/:/g, "");
  const footRightId = `pw-foot-right-${uid}`;
  const handId = `pw-hand-${uid}`;

  const motif1Id = `pw-motif-1-${uid}`;
  const motif2Id = `pw-motif-2-${uid}`;
  const motif3Id = `pw-motif-3-${uid}`;

  const fixedSnakes = [
    generateFixedLongSnakePath(0, 25, 1200, 12),
    generateFixedLongSnakePath(0, 48, 1200, 12),
  ];

  const layout = useMemo(() => {
    const rand = mulberry32(seedFrom(`pattern-${variant}`));

    const circularDotMotifs = (dotsConfig ?? []).map((pt) => ({
      cx: pt.x ?? 100,
      cy: pt.y ?? 150,
      rings: 4, startR: 14, gap: 16, speed: 24, dir: rand() > 0.5 ? "normal" : "reverse",
    }));

    const imageMotifs = [
      ...(motif1Config ?? []).map((pt) => ({ x: pt.x ?? 90, y: pt.y ?? 300, type: motif1Id, scale: 1.25, speed: 22, dir: "normal" })),
      ...(motif2Config ?? []).map((pt) => ({ x: pt.x ?? 1110, y: pt.y ?? 350, type: motif2Id, scale: 1.25, speed: 20, dir: "reverse" })),
      ...(motif3Config ?? []).map((pt) => ({ x: pt.x ?? 100, y: pt.y ?? 480, type: motif3Id, scale: 1.25, speed: 24, dir: "normal" })),
    ];

    const hypnoticSpirals = (spiralsConfig ?? []).map((pt) => ({
      x: pt.x ?? 120,
      y: pt.y ?? 220,
      turns: 4.8, radius: 75, speed: 4.0, rot: round(rand() * 360),
    }));

    const hands = (handsConfig ?? []).map((pt) => ({
      x: pt.x ?? 140,
      y: pt.y ?? 180,
      rot: round(-30 + rand() * 60),
      scale: round(1.3 + rand() * 0.3),
      flip: rand() > 0.5,
    }));

    const uShapes = (uShapeConfig ?? []).map((pt) => ({
      x: pt.x ?? 60,
      y: pt.y ?? 720,
    }));

    const footCountPerSide = showFeet ? 3 : 0;
    const buildTrail = (baseX: number) => {
      return Array.from({ length: footCountPerSide }, (_, i) => {
        const t = i / Math.max(footCountPerSide - 1, 1);
        const isLeft = i % 2 === 0;
        const strideOffset = isLeft ? -16 : 16;
        const edgeFade = Math.sin(t * Math.PI) * 0.6;

        return {
          x: round(baseX + strideOffset + Math.sin(t * Math.PI) * 10),
          y: round(650 - t * 450),
          isLeft,
          opacity: round(edgeFade),
        };
      });
    };

    const leftFootprints = buildTrail(120);
    const rightFootprints = buildTrail(1080);

    return {
      circularDotMotifs,
      imageMotifs,
      hypnoticSpirals,
      hands,
      uShapes,
      leftFootprints,
      rightFootprints,
      showFeet,
    };
  }, [showFeet, variant, dotsConfig, motif1Config, motif2Config, motif3Config, spiralsConfig, handsConfig, uShapeConfig, motif1Id, motif2Id, motif3Id]);

  return (
    <div 
      aria-hidden="true" 
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden cultural-pattern cultural-pattern--${variant} ${className}`}
    >
      <style jsx>{`
        @keyframes drawSpiralFromCenter {
          0% { stroke-dashoffset: 1000; opacity: 0.15; }
          45% { stroke-dashoffset: 0; opacity: 0.85; }
          55% { stroke-dashoffset: 0; opacity: 0.85; }
          100% { stroke-dashoffset: -1000; opacity: 0.15; }
        }
        @keyframes spiralPulseWave {
          0%, 100% { transform: scale(0.2); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
        @keyframes slowContainerRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes dashTravelForward {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -50; }
        }
        .draw-hypnotic-spiral {
          stroke-dasharray: 1000;
          animation: drawSpiralFromCenter ease-in-out infinite alternate;
        }
        .spiral-pulse-ring {
          animation: spiralPulseWave ease-in-out infinite alternate;
          transform-origin: center;
        }
        .slow-spiral-rotation {
          animation: slowContainerRotate 22s linear infinite;
        }
        .dash-travel-normal {
          animation: dashTravelForward linear infinite;
        }
        .cultural-sky-spiral-rotate {
          animation: slowContainerRotate linear infinite;
        }
      `}</style>

      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <g id={motif1Id}>
            <circle cx="0" cy="0" r="18" fill="#FF7A3D" />
            <circle cx="0" cy="0" r="32" stroke="#E85D26" strokeWidth="3.5" strokeDasharray="4 4" fill="none" />
            <circle cx="0" cy="0" r="48" stroke="#FF7A3D" strokeWidth="4.5" fill="none" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = i * 45;
              return (
                <g key={i} transform={`rotate(${a})`}>
                  <path d="M -9 -60 A 9 9 0 0 1 9 -60" stroke="#FF7A3D" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  <circle cx="0" cy="-72" r="4" fill="#E85D26" />
                </g>
              );
            })}
          </g>

          <g id={motif2Id}>
            <circle cx="0" cy="0" r="22" fill="#E85D26" />
            <circle cx="0" cy="0" r="38" stroke="#FF7A3D" strokeWidth="4.5" fill="none" />
            <circle cx="0" cy="0" r="56" stroke="#E85D26" strokeWidth="6.5" strokeDasharray="6 6" fill="none" />
            <circle cx="0" cy="0" r="74" stroke="#FF7A3D" strokeWidth="3.5" fill="none" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return <circle key={i} cx={88 * Math.cos(a)} cy={88 * Math.sin(a)} r="4.5" fill="#FF8C42" />;
            })}
          </g>

          <g id={motif3Id}>
            <circle cx="0" cy="0" r="24" fill="#FF8C42" />
            <circle cx="0" cy="0" r="42" stroke="#E85D26" strokeWidth="3.5" fill="none" />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = i * 36;
              return (
                <g key={i} transform={`rotate(${a})`}>
                  <line x1="0" y1="-46" x2="0" y2="-62" stroke="#FF7A3D" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="0" cy="-70" r="4.5" fill="#E85D26" />
                </g>
              );
            })}
          </g>

          <g id={footRightId}>
            <path
              d="M 0 18 C -6 18, -10 12, -10 4 C -10 -4, -6 -9, -4 -12 C -3 -13.5, -4.5 -18, -7 -22 C -9 -25, -7 -29, -2 -31 C 3 -33, 8 -30, 9 -23 C 10 -16, 7 -10, 4 -4 C 2 2, 7 8, 7 13 C 7 16, 4 18, 0 18 Z"
              fill="#E85D26"
            />
            <ellipse cx="-4" cy="-35" rx="3.2" ry="4" fill="#E85D26" />
            <ellipse cx="1" cy="-34" rx="2.4" ry="3" fill="#E85D26" />
            <ellipse cx="5" cy="-32" rx="2.1" ry="2.6" fill="#E85D26" />
            <ellipse cx="8.5" cy="-29.5" rx="1.8" ry="2.2" fill="#E85D26" />
            <ellipse cx="11.5" cy="-26.5" rx="1.5" ry="1.9" fill="#E85D26" />
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
          {fixedSnakes.map((pathData, i) => (
            <g key={`fixed-snake-${i}`}>
              <path
                d={pathData}
                fill="none"
                stroke="#E85D26"
                strokeWidth="2"
                strokeDasharray="4 8"
                strokeLinecap="round"
                opacity="0.25"
                className="cultural-vertical-snake"
                style={{ animationDuration: `${16 + i * 4}s` }}
              />
              <path
                d={pathData}
                fill="none"
                stroke="#FF8C42"
                strokeWidth="1.2"
                strokeDasharray="4 8"
                strokeLinecap="round"
                opacity="0.75"
                className="cultural-vertical-snake"
                style={{ animationDuration: `${16 + i * 4}s` }}
              />
            </g>
          ))}

          {layout.circularDotMotifs.map((motif, mi) => {
            const dots = generateGraduatedCircularDots(motif.cx, motif.cy, motif.rings, motif.startR, motif.gap);
            return (
              <g
                key={`circle-motif-${mi}`}
                className="cultural-sky-spiral-rotate"
                style={{
                  transformOrigin: `${motif.cx}px ${motif.cy}px`,
                  animationDuration: `${motif.speed}s`,
                  animationDirection: motif.dir as "normal" | "reverse",
                }}
              >
                {dots.map((d, di) => (
                  <circle key={di} cx={d.x} cy={d.y} r={d.r} fill="#FF6B35" opacity={0.8} />
                ))}
              </g>
            );
          })}

          {layout.imageMotifs.map((im, idx) => (
            <g
              key={`img-motif-${idx}`}
              className="cultural-sky-spiral-rotate"
              style={{
                transformOrigin: `${im.x}px ${im.y}px`,
                animationDuration: `${im.speed}s`,
                animationDirection: im.dir as "normal" | "reverse",
              }}
            >
              <g transform={`translate(${im.x}, ${im.y}) scale(${im.scale})`} opacity="0.9">
                <use href={`#${im.type}`} />
              </g>
            </g>
          ))}

          {layout.hypnoticSpirals.map((sp, spi) => {
            const pathData = generateHypnoticSpiralPath(sp.turns, sp.radius);
            return (
              <g
                key={`hypno-spiral-${spi}`}
                transform={`translate(${sp.x}, ${sp.y}) rotate(${sp.rot})`}
                style={{ transformOrigin: `${sp.x}px ${sp.y}px` }}
              >
                <g className="slow-spiral-rotation" style={{ transformOrigin: "0px 0px" }}>
                  <circle
                    cx="0"
                    cy="0"
                    r={sp.radius * 0.9}
                    fill="none"
                    stroke="#FF8C42"
                    strokeWidth="1.8"
                    strokeDasharray="4 6"
                    className="spiral-pulse-ring"
                    style={{ animationDuration: `${sp.speed}s`, animationDelay: `${-spi * 0.8}s` }}
                  />
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#E85D26"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.3"
                    className="draw-hypnotic-spiral"
                    style={{ animationDuration: `${sp.speed}s`, animationDelay: `${-spi * 0.8}s` }}
                  />
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#FF7A3D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                    className="draw-hypnotic-spiral"
                    style={{ animationDuration: `${sp.speed}s`, animationDelay: `${-spi * 0.8}s` }}
                  />
                  <circle cx="0" cy="0" r="4.5" fill="#FF6B35" opacity="0.95" />
                </g>
              </g>
            );
          })}

          {layout.uShapes.map((us, usi) => (
            <g key={`u-shape-${usi}`} transform={`translate(${us.x}, ${us.y}) rotate(45)`}>
              {Array.from({ length: 4 }, (_, l) => {
                const w = 45 + l * 22;
                const h = 55 + l * 22;
                const dotRadius = Math.max(2.2, round(4.2 - l * 0.3));
                return (
                  <path
                    key={l}
                    d={generateInvertedUShapePath(w, h)}
                    fill="none"
                    stroke="#FF7A3D"
                    strokeWidth={dotRadius * 2}
                    strokeDasharray={`0.1 ${round(dotRadius * 3.5 + 3)}`}
                    strokeLinecap="round"
                    opacity={0.92 - l * 0.12}
                    transform={`translate(${-w / 2}, ${-h / 2})`}
                    className="dash-travel-normal"
                    style={{ animationDuration: `${6 + l * 1.2}s` }}
                  />
                );
              })}
            </g>
          ))}

          {layout.hands.map((h, i) => (
            <g
              key={`hand-${i}`}
              className="cultural-hand-float"
              style={{ animationDelay: `${-i * 1}` }}
              transform={`translate(${h.x}, ${h.y}) rotate(${h.rot}) scale(${h.flip ? -h.scale : h.scale}, ${h.scale})`}
            >
              <use href={`#${handId}`} />
            </g>
          ))}

          {layout.showFeet && (
            <>
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
                      opacity={fp.opacity}
                      transform={`translate(${fp.x}, ${fp.y}) rotate(${angle}) scale(${fp.isLeft ? -0.8 : 0.8}, 0.8)`}
                    >
                      <use href={`#${footRightId}`} />
                    </g>
                  );
                })}
              </g>

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
                      opacity={fp.opacity}
                      transform={`translate(${fp.x}, ${fp.y}) rotate(${Number(angle).toFixed(4)}) scale(${fp.isLeft ? -0.8 : 0.8}, 0.8)`}
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