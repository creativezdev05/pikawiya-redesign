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

function generateGraduatedCircularDots(cx: number, cy: number, rings: number, startR: number, gap: number) {
  const pts: { x: number; y: number; r: number }[] = [];
  
  for (let ring = 0; ring < rings; ring++) {
    const radius = startR + ring * gap;
    const count = Math.max(8, Math.round(10 + ring * 5));
    const dotRadius = Math.max(1.2, round(3.6 - ring * 0.6));

    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push({
        x: round(cx + Math.cos(a) * radius),
        y: round(cy + Math.sin(a) * radius),
        r: dotRadius,
      });
    }
  }
  pts.push({ x: round(cx), y: round(cy), r: 4.2 });
  return pts;
}

function generateHypnoticSpiralPath(turns = 4.5, maxRadius = 60, pointsPerTurn = 36) {
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

function generateUShapePath(width: number, height: number) {
  const r = width / 2;
  return `M 0 0 L 0 ${height - r} A ${r} ${r} 0 0 0 ${width} ${height - r} L ${width} 0`;
}

function generateArcSnakePath(xBase: number, yBase: number, radius = 35, turns = 5, rotDeg = 0) {
  let path = `M 0 0`;
  for (let i = 0; i < turns; i++) {
    const sweep = i % 2 === 0 ? 1 : 0;
    const yTarget = (i + 1) * radius * 2;
    path += ` A ${radius} ${radius} 0 0 ${sweep} 0 ${yTarget}`;
  }
  return { path, xBase: round(xBase), yBase: round(yBase), rotDeg: round(rotDeg) };
}

export default function CulturalPattern({
  className = "",
  variant = "about",
  showFeet = true,
}: CulturalPatternProps) {
  const uid = useId().replace(/:/g, "");
  const footRightId = `pw-foot-right-${uid}`;
  const handId = `pw-hand-${uid}`;
  const sideFadeMaskId = `pw-side-fade-${uid}`;

  const motif1Id = `pw-motif-1-${uid}`;
  const motif2Id = `pw-motif-2-${uid}`;
  const motif3Id = `pw-motif-3-${uid}`;

  const layout = useMemo(() => {
    const rand = mulberry32(seedFrom(variant));

    const pickX = (zone: "left" | "center" | "right") => {
      if (zone === "left") return round(60 + rand() * 240);
      if (zone === "center") return round(450 + rand() * 300);
      return round(880 + rand() * 240);
    };

    const circularDotMotifs = [
      { cx: pickX("left"), cy: round(180 + rand() * 120), rings: 3, startR: 10, gap: 14, speed: 22, dir: "normal" },
      { cx: pickX("center"), cy: round(380 + rand() * 140), rings: 4, startR: 12, gap: 15, speed: 25, dir: "reverse" },
      { cx: pickX("right"), cy: round(220 + rand() * 140), rings: 3, startR: 10, gap: 14, speed: 20, dir: "normal" },
    ];

    // Increased size (0.7 to 0.9) and doubled quantity
    const imageMotifs = [
      { x: pickX("left"), y: round(100 + rand() * 120), type: motif1Id, scale: round(0.7 + rand() * 0.2), speed: 18, dir: "normal" },
      { x: pickX("center"), y: round(140 + rand() * 160), type: motif2Id, scale: round(0.75 + rand() * 0.2), speed: 20, dir: "reverse" },
      { x: pickX("right"), y: round(120 + rand() * 140), type: motif3Id, scale: round(0.7 + rand() * 0.2), speed: 16, dir: "normal" },
      { x: pickX("left"), y: round(380 + rand() * 140), type: motif2Id, scale: round(0.72 + rand() * 0.18), speed: 22, dir: "reverse" },
      { x: pickX("center"), y: round(420 + rand() * 160), type: motif1Id, scale: round(0.78 + rand() * 0.2), speed: 17, dir: "normal" },
      { x: pickX("right"), y: round(460 + rand() * 140), type: motif3Id, scale: round(0.7 + rand() * 0.2), speed: 19, dir: "reverse" },
      { x: pickX("left"), y: round(600 + rand() * 120), type: motif3Id, scale: round(0.75 + rand() * 0.15), speed: 21, dir: "normal" },
      { x: pickX("right"), y: round(620 + rand() * 120), type: motif2Id, scale: round(0.8 + rand() * 0.15), speed: 18, dir: "reverse" },
    ];

    // Accelerated speeds (down to 3.5s - 4.5s)
    const hypnoticSpirals = [
      { x: pickX("left"), y: round(140 + rand() * 120), turns: 4.5, radius: 55, speed: 3.5, rot: round(rand() * 360) },
      { x: pickX("center"), y: round(240 + rand() * 180), turns: 5, radius: 70, speed: 4.2, rot: round(rand() * 360) },
      { x: pickX("right"), y: round(160 + rand() * 140), turns: 4.5, radius: 60, speed: 3.8, rot: round(rand() * 360) },
      { x: pickX("center"), y: round(560 + rand() * 140), turns: 5, radius: 65, speed: 4.0, rot: round(rand() * 360) },
    ];

    const dottedUMotifs = [
      { x: pickX("left"), y: round(340 + rand() * 160), rot: round(rand() * 360), layers: 4, speed: 5, dir: 1 },
      { x: pickX("center"), y: round(180 + rand() * 180), rot: round(rand() * 360), layers: 5, speed: 6, dir: -1 },
      { x: pickX("right"), y: round(360 + rand() * 180), rot: round(rand() * 360), layers: 4, speed: 4.5, dir: 1 },
      { x: pickX("left"), y: round(600 + rand() * 120), rot: round(rand() * 360), layers: 4, speed: 5.5, dir: -1 },
    ];

    const snakes = [
      generateArcSnakePath(pickX("left"), round(40 + rand() * 100), round(24 + rand() * 8), 5, round(-15 + rand() * 30)),
      generateArcSnakePath(pickX("right"), round(80 + rand() * 120), round(24 + rand() * 8), 5, round(-15 + rand() * 30)),
    ];

    const hands = [
      { x: pickX("left"), y: round(180 + rand() * 400), rot: round(-30 + rand() * 60), scale: round(1.1 + rand() * 0.3), flip: false },
      { x: pickX("center"), y: round(500 + rand() * 220), rot: round(-20 + rand() * 40), scale: round(1.2 + rand() * 0.3), flip: true },
      { x: pickX("right"), y: round(200 + rand() * 400), rot: round(-30 + rand() * 60), scale: round(1.1 + rand() * 0.3), flip: true },
    ];

    // Reduced feet count to 3 per side
    const footCountPerSide = showFeet ? 3 : 0;
    const buildTrail = (baseX: number) => {
      return Array.from({ length: footCountPerSide }, (_, i) => {
        const t = i / Math.max(footCountPerSide - 1, 1);
        const isLeft = i % 2 === 0;
        const strideOffset = isLeft ? -14 : 14;
        const edgeFade = Math.sin(t * Math.PI) * 0.5;

        return {
          x: round(baseX + strideOffset + Math.sin(t * Math.PI) * 10),
          y: round(650 - t * 450),
          isLeft,
          opacity: round(edgeFade),
        };
      });
    };

    const leftFootprints = buildTrail(round(120 + rand() * 60));
    const rightFootprints = buildTrail(round(1020 + rand() * 60));

    return {
      circularDotMotifs,
      imageMotifs,
      hypnoticSpirals,
      dottedUMotifs,
      snakes,
      hands,
      leftFootprints,
      rightFootprints,
      showFeet,
    };
  }, [variant, showFeet, motif1Id, motif2Id, motif3Id]);

  return (
    <div aria-hidden="true" className={`cultural-pattern cultural-pattern--${variant} ${className}`}>
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

        @keyframes dashTravelReverse {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 50; }
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
        .dash-travel-reverse {
          animation: dashTravelReverse linear infinite;
        }
        .cultural-sky-spiral-rotate {
          animation: slowContainerRotate linear infinite;
        }
      `}</style>

      <div className="cultural-pattern__dotfield opacity-30" />

      <svg
        className="cultural-pattern__canvas overflow-visible"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id={sideFadeMaskId}>
            <rect x="0" y="0" width="1200" height="800" fill="white" />
            <rect x="0" y="0" width="1200" height="800" fill="url(#pw-edge-gradient)" />
          </mask>

          <linearGradient id="pw-edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="black" stopOpacity="0.3" />
            <stop offset="12%" stopColor="white" stopOpacity="0" />
            <stop offset="88%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.3" />
          </linearGradient>

          {/* Motif 1: People Symbol Meeting Place */}
          <g id={motif1Id}>
            <circle cx="0" cy="0" r="14" fill="#FF7A3D" />
            <circle cx="0" cy="0" r="24" stroke="#E85D26" strokeWidth="3" strokeDasharray="3 3" fill="none" />
            <circle cx="0" cy="0" r="36" stroke="#FF7A3D" strokeWidth="4" fill="none" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = i * 45;
              return (
                <g key={i} transform={`rotate(${a})`}>
                  <path d="M -7 -46 A 7 7 0 0 1 7 -46" stroke="#FF7A3D" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <circle cx="0" cy="-56" r="3" fill="#E85D26" />
                </g>
              );
            })}
          </g>

          {/* Motif 2: Concentric Ring & Outer Orbit Dots */}
          <g id={motif2Id}>
            <circle cx="0" cy="0" r="16" fill="#E85D26" />
            <circle cx="0" cy="0" r="28" stroke="#FF7A3D" strokeWidth="4" fill="none" />
            <circle cx="0" cy="0" r="42" stroke="#E85D26" strokeWidth="6" strokeDasharray="5 5" fill="none" />
            <circle cx="0" cy="0" r="56" stroke="#FF7A3D" strokeWidth="3" fill="none" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return <circle key={i} cx={68 * Math.cos(a)} cy={68 * Math.sin(a)} r="3.5" fill="#FF8C42" />;
            })}
          </g>

          {/* Motif 3: Sunburst Rays Meeting Place */}
          <g id={motif3Id}>
            <circle cx="0" cy="0" r="18" fill="#FF8C42" />
            <circle cx="0" cy="0" r="32" stroke="#E85D26" strokeWidth="3" fill="none" />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = i * 36;
              return (
                <g key={i} transform={`rotate(${a})`}>
                  <line x1="0" y1="-36" x2="0" y2="-48" stroke="#FF7A3D" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="0" cy="-55" r="3.5" fill="#E85D26" />
                </g>
              );
            })}
          </g>

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

        <g mask={`url(#${sideFadeMaskId})`}>
          {/* 1. Circular Dot Motifs */}
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
                  <circle
                    key={di}
                    cx={d.x}
                    cy={d.y}
                    r={d.r}
                    fill="#FF6B35"
                    opacity={0.75}
                  />
                ))}
              </g>
            );
          })}

          {/* 2. Scaled-Up Image Motifs */}
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
              <g transform={`translate(${im.x}, ${im.y}) scale(${im.scale})`} opacity="0.85">
                <use href={`#${im.type}`} />
              </g>
            </g>
          ))}

          {/* 3. Accelerated Hypnotic Spirals */}
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
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    className="spiral-pulse-ring"
                    style={{ animationDuration: `${sp.speed}s`, animationDelay: `${-spi * 0.8}s` }}
                  />

                  <path
                    d={pathData}
                    fill="none"
                    stroke="#E85D26"
                    strokeWidth="4.5"
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
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                    className="draw-hypnotic-spiral"
                    style={{ animationDuration: `${sp.speed}s`, animationDelay: `${-spi * 0.8}s` }}
                  />

                  <circle cx="0" cy="0" r="3.5" fill="#FF6B35" opacity="0.9" />
                </g>
              </g>
            );
          })}

          {/* 4. Dotted Traveling U-Shapes */}
          {layout.dottedUMotifs.map((u, ui) => (
            <g
              key={`dotted-u-${ui}`}
              transform={`translate(${u.x}, ${u.y}) rotate(${u.rot})`}
            >
              {Array.from({ length: u.layers }, (_, l) => {
                const w = 24 + l * 14;
                const h = 30 + l * 14;
                const dotRadius = Math.max(1.5, round(3.2 - l * 0.4));
                
                return (
                  <path
                    key={l}
                    d={generateUShapePath(w, h)}
                    fill="none"
                    stroke="#FF7A3D"
                    strokeWidth={dotRadius * 2}
                    strokeDasharray={`0.1 ${round(dotRadius * 3 + 2)}`}
                    strokeLinecap="round"
                    opacity={0.85 - l * 0.12}
                    transform={`translate(${-w / 2}, ${-h / 2})`}
                    className={u.dir === 1 ? "dash-travel-normal" : "dash-travel-reverse"}
                    style={{
                      animationDuration: `${u.speed + l * 1}s`,
                    }}
                  />
                );
              })}
            </g>
          ))}

          {/* 5. Snake Arc Waves */}
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
                opacity="0.2"
                className="cultural-vertical-snake"
                style={{ animationDuration: `${7 + i * 2}s` }}
              />
              <path
                d={snake.path}
                fill="none"
                stroke="#FF8C42"
                strokeWidth="3"
                strokeDasharray="8 12"
                strokeLinecap="round"
                opacity="0.7"
                className="cultural-vertical-snake"
                style={{ animationDuration: `${7 + i * 2}s` }}
              />
            </g>
          ))}

          {/* 6. Handprints */}
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

          {/* 7. Reduced Footprint Trails */}
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
                      transform={`translate(${fp.x}, ${fp.y}) rotate(${angle}) scale(${fp.isLeft ? -0.65 : 0.65}, 0.65)`}
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
                      transform={`translate(${fp.x}, ${fp.y}) rotate(${Number(angle).toFixed(4)}) scale(${fp.isLeft ? -0.65 : 0.65}, 0.65)`}
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