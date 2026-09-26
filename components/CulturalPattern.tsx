"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

type OrbitConfig = {
  x?: number | string;
  y?: number | string;
  radius?: number;
  speed?: number;
  pathWidth?: number;
  pathHeight?: number;

};

type PointConfig = {
  x?: number | string;
  y?: number | string;
};

/** Dot-orbit motif. Size fields are optional so existing placements keep their look. */
type DotsConfig = PointConfig & {
  rings?: number;
  startR?: number;
  gap?: number;
  /** Seconds per full rotation. */
  speed?: number;
  /**
   * "sun" (default): multicoloured dot-painting sun — yellow centre, red/peach/orange/blue rings that turn
   * in alternating directions. "classic": the original single-colour rotating rings.
   */
  pattern?: "sun" | "classic";
};

type CornerConfig = {
  x?: number | string;
  y?: number | string;
};

type FlowPathConfig = {
  x?: number | string; // Base X position
  y?: number | string; // Base Y position
  length?: number | string; // Overall horizontal span/length of the curve
  startX?: number | string; // Relative or explicit start X (optional)
  startY?: number | string; // Relative or explicit start Y (optional)
  endX?: number | string; // Relative or explicit end X (optional)
  endY?: number | string; // Relative or explicit end Y (optional)
  controlX?: number | string; // Quadratic Bezier control point X (optional)
  controlY?: number | string; // Quadratic Bezier control point Y (optional)
  speed?: number; // Duration in seconds for dots to complete a full travel cycle
  dotCount?: number;
  strokeColor?: string;
  dotColor?: string;
};

type CulturalPatternProps = {
  className?: string;
  variant?:
    | "about"
    | "vision"
    | "values"
    | "services"
    | "heritage"
    | "contact"
    | "footer"
    | "mission"
    | "core-service";
  showFeet?: boolean;
  showSnakes?: boolean;

  dotsConfig?: DotsConfig[];
  motif1Config?: PointConfig[];
  motif2Config?: PointConfig[];
  motif3Config?: PointConfig[];
  dashedOrbitsConfig?: OrbitConfig[];
  handsConfig?: PointConfig[];
  uShapeConfig?: PointConfig[];
  flowPathsConfig?: FlowPathConfig[];

  cornerTLConfig?: CornerConfig;
  cornerBRConfig?: CornerConfig;

  /**
   * "meet" (default): everything is drawn on a fixed 1200×800 canvas scaled to fit and centred in the container.
   * "fill": the canvas matches the container, so positions track it at every screen size —
   *   "%" values are a share of the container's width/height (use for placement), plain numbers are
   *   design units from the top-left that scale with the motifs (use for edge offsets), and motif
   *   sizes scale with the container width.
   */
  fit?: "meet" | "fill";
};

// Motif size range in "fill" mode, as a multiple of the 1200px-wide design.
const FILL_MIN_SCALE = 0.55;
const FILL_MAX_SCALE = 1.8;

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

function parseCoord(
  val: number | string | undefined,
  defaultVal: number,
  maxCanvasBound: number
): number {
  if (val === undefined) return defaultVal;
  if (typeof val === "number") return val;
  if (typeof val === "string" && val.endsWith("%")) {
    const percentage = parseFloat(val) / 100;
    return percentage * maxCanvasBound;
  }
  const parsed = parseFloat(val);
  return isNaN(parsed) ? defaultVal : parsed;
}

/**
 * Concentric rings of dots. With `rand`, each dot is nudged off its ideal spot and sized a little
 * differently — like dots pressed by hand with a stick — while staying deterministic for SSR.
 */
function generateGraduatedCircularDots(
  cx: number,
  cy: number,
  rings: number,
  startR: number,
  gap: number,
  rand?: () => number
) {
  const jitter = (amount: number) => (rand ? (rand() - 0.5) * 2 * amount : 0);
  const pts: { x: number; y: number; r: number; o: number }[] = [];
  for (let ring = 0; ring < rings; ring++) {
    const radius = startR + ring * gap;
    const count = Math.max(8, Math.round(12 + ring * 6));
    const dotRadius = Math.max(1.8, 4.5 - ring * 0.5);
    // Each ring starts at a slightly different angle so the dots don't line up into spokes.
    const phase = jitter(Math.PI / count);

    for (let i = 0; i < count; i++) {
      const a = phase + ((i + jitter(0.18)) / count) * Math.PI * 2;
      const rr = radius + jitter(gap * 0.12);
      pts.push({
        x: round(cx + Math.cos(a) * rr),
        y: round(cy + Math.sin(a) * rr),
        r: round(Math.max(1.2, dotRadius * (1 + jitter(0.22)))),
        o: round(0.8 + jitter(0.15)),
      });
    }
  }
  pts.push({ x: round(cx), y: round(cy), r: 5.5, o: 0.8 });
  return pts;
}

// Ring sequence of the sun motif, inside → out, as in the dot-painting reference.
// `at` = radius as a share of the outer radius, `dot` = dot radius as a share of the outer radius.
const SUN_RINGS = [
  { at: 0.2, dot: 0.02, color: "#E4502A", opacity: 0.95 },
  { at: 0.265, dot: 0.018, color: "#FFC9A6", opacity: 0.75 },
  { at: 0.33, dot: 0.022, color: "#FFB287", opacity: 0.85 },
  { at: 0.4, dot: 0.024, color: "#7F96A5", opacity: 0.9 },
  { at: 0.47, dot: 0.024, color: "#FFB88F", opacity: 0.8 },
  { at: 0.54, dot: 0.026, color: "#FF914F", opacity: 0.9 },
  { at: 0.62, dot: 0.034, color: "#E24E22", opacity: 0.95 },
  { at: 0.7, dot: 0.027, color: "#FFB88F", opacity: 0.8 },
  { at: 0.775, dot: 0.029, color: "#FF9A5A", opacity: 0.85 },
  { at: 0.855, dot: 0.031, color: "#7D93A1", opacity: 0.9 },
  { at: 0.94, dot: 0.033, color: "#8DB6D3", opacity: 0.9 },
] as const;

/**
 * Dots for each ring of the sun motif, evenly spaced (about one dot-width apart) with a little seeded
 * hand-placed jitter. Deterministic, so server and client render the same.
 */
function generateSunRings(outerR: number, rand: () => number) {
  const jitter = (amount: number) => (rand() - 0.5) * 2 * amount;
  return SUN_RINGS.map((ring) => {
    const radius = ring.at * outerR;
    const dotR = Math.max(1.2, ring.dot * outerR);
    const count = Math.max(10, Math.round((2 * Math.PI * radius) / (dotR * 2.35)));
    const phase = jitter(Math.PI / count);
    const dots = Array.from({ length: count }, (_, i) => {
      const a = phase + ((i + jitter(0.12)) / count) * Math.PI * 2;
      const rr = radius + jitter(dotR * 0.18);
      return {
        x: round(Math.cos(a) * rr),
        y: round(Math.sin(a) * rr),
        r: round(dotR * (1 + jitter(0.12))),
      };
    });
    return { ...ring, radius: round(radius), dotR: round(dotR), dots };
  });
}

function generateInvertedUShapePath(width: number, height: number) {
  const r = width / 2;
  return `M 0 ${height} L 0 ${r} A ${r} ${r} 0 0 1 ${width} ${r} L ${width} ${height}`;
}

function generateFixedLongSnakePath(
  xStart: number,
  yStart: number,
  width = 1200,
  turns = 10
) {
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

function generateSnakeMiddleDotPoints(
  xStart: number,
  yStart1 = 25,
  yStart2 = 48,
  width = 1200,
  turns = 12
) {
  const segmentWidth = width / turns;
  const dots: { x: number; y: number }[] = [];
  const midY = (yStart1 + yStart2) / 2;
  const arcHeight = 6;

  for (let i = 0; i < turns; i++) {
    const sweep = i % 2 === 0 ? 1 : 0;
    const nextX = xStart + (i + 1) * segmentWidth;
    const controlX = xStart + (i + 0.5) * segmentWidth;
    const dotX = round(controlX);
    const dotY = round(midY + (sweep === 1 ? arcHeight * 0.5 : -arcHeight * 0.5));
    dots.push({ x: dotX, y: dotY });

    if (i === turns - 1) {
      dots.push({ x: round(nextX), y: round(midY) });
    }
  }
  return dots;
}

function generateFoldCornerPatternPath(
  xStart: number,
  yStart: number,
  length = 1100,
  segments = 12
) {
  let path1 = `M ${xStart} ${yStart}`;
  let path2 = `M ${xStart} ${yStart + 16}`;
  let path3 = `M ${xStart} ${yStart + 32}`;
  let path4 = `M ${xStart} ${yStart + 48}`;
  const segLen = length / segments;

  const dots: { x: number; y: number }[] = [];
  for (let i = 0; i < segments; i++) {
    const nextX = xStart + (i + 1) * segLen;
    const ctrlX = xStart + (i + 0.5) * segLen;
    const wave = i % 2 === 0 ? 12 : -12;

    path1 = `${path1} Q ${ctrlX} ${yStart + wave}, ${nextX} ${yStart}`;
    path2 = `${path2} Q ${ctrlX} ${yStart + 16 + wave}, ${nextX} ${yStart + 16}`;
    path3 = `${path3} Q ${ctrlX} ${yStart + 32 + wave}, ${nextX} ${yStart + 32}`;
    path4 = `${path4} Q ${ctrlX} ${yStart + 48 + wave}, ${nextX} ${yStart + 48}`;

    dots.push({ x: round(ctrlX), y: round(yStart + 8 + wave * 0.5) });
    dots.push({ x: round(ctrlX), y: round(yStart + 24 + wave * 0.5) });
    dots.push({ x: round(ctrlX), y: round(yStart + 40 + wave * 0.5) });
  }

  return { line1: path1, line2: path2, line3: path3, line4: path4, dots };
}

export default function CulturalPattern({
  className = "",
  variant = "about",
  showFeet = false,
  showSnakes = false,
  dotsConfig,
  motif1Config,
  motif2Config,
  motif3Config,
  dashedOrbitsConfig,
  handsConfig,
  uShapeConfig,
  flowPathsConfig,
  cornerTLConfig,
  cornerBRConfig,
  fit = "meet",
}: CulturalPatternProps) {
  const isFill = fit === "fill";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!isFill) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setBox({ w: entry.contentRect.width, h: entry.contentRect.height })
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isFill]);

  const canvasW = isFill && box ? box.w : 1200;
  const canvasH = isFill && box ? box.h : 800;
  // Size multiplier for motifs: 1 on the fixed canvas, width-relative (clamped) in fill mode.
  const size = isFill ? Math.min(FILL_MAX_SCALE, Math.max(FILL_MIN_SCALE, canvasW / 1200)) : 1;

  const uid = useId().replace(/:/g, "");
  const footRightId = `pw-foot-right-${uid}`;
  const handId = `pw-hand-${uid}`;

  const motif1Id = `pw-motif-1-${uid}`;
  const motif2Id = `pw-motif-2-${uid}`;
  const motif3Id = `pw-motif-3-${uid}`;

  const fixedSnakes = [
    {
      path1: generateFixedLongSnakePath(0, 25, 1200, 12),
      path2: generateFixedLongSnakePath(0, 48, 1200, 12),
      dots: generateSnakeMiddleDotPoints(0, 25, 48, 1200, 12),
    },
  ];

  const cornerPattern = generateFoldCornerPatternPath(0, 0, 1100, 12);

  const layout = useMemo(() => {
    const rand = mulberry32(seedFrom(`pattern-${variant}`));

    // Resolve a position on the canvas. Fill mode: "%" is a share of the container, numbers scale with the motifs.
    const isPct = (v: number | string | undefined) => typeof v === "string" && v.trim().endsWith("%");
    const px = (v: number | string | undefined, def: number) =>
      isFill
        ? isPct(v)
          ? (parseFloat(v as string) / 100) * canvasW
          : parseCoord(v, def, 1200) * size
        : parseCoord(v, def, 1200);
    const py = (v: number | string | undefined, def: number) =>
      isFill
        ? isPct(v)
          ? (parseFloat(v as string) / 100) * canvasH
          : parseCoord(v, def, 800) * size
        : parseCoord(v, def, 800);

    const circularDotMotifs = (dotsConfig ?? []).map((pt) => ({
      cx: px(pt.x, 100),
      cy: py(pt.y, 150),
      rings: pt.rings ?? 4,
      startR: pt.startR ?? 14,
      gap: pt.gap ?? 16,
      speed: pt.speed ?? 24,
      dir: rand() > 0.5 ? "normal" : "reverse",
      pattern: pt.pattern ?? "sun",
    }));

    const imageMotifs = [
      ...(motif1Config ?? []).map((pt) => ({
        x: px(pt.x, 90),
        y: py(pt.y, 300),
        type: motif1Id,
        scale: 1.50,
        speed: 22,
        dir: "normal",
      })),
      ...(motif2Config ?? []).map((pt) => ({
        x: px(pt.x, 1110),
        y: py(pt.y, 350),
        type: motif2Id,
        scale: 1.0,
        speed: 20,
        dir: "reverse",
      })),
      ...(motif3Config ?? []).map((pt) => ({
        x: px(pt.x, 100),
        y: py(pt.y, 480),
        type: motif3Id,
        scale: 1.25,
        speed: 24,
        dir: "normal",
      })),
    ];

    const effectiveOrbitsConfig =
      dashedOrbitsConfig !== undefined
        ? dashedOrbitsConfig
        : variant === "heritage"
        ? [
            { x: 150, y: 250, radius: 40, speed: 7, pathWidth: 150, pathHeight: 65 },
            { x: 1050, y: 550, radius: 45, speed: 8, pathWidth: 170, pathHeight: 75 },
          ]
        : [];

    const orbitingCircles = effectiveOrbitsConfig.map((orbit, index) => ({
      x: px(orbit.x, 150 + index * 200),
      y: py(orbit.y, 250 + index * 100),
      radius: orbit.radius ?? 40,
      speed: orbit.speed ?? 6 + (index % 3),
      pathWidth: orbit.pathWidth ?? 150 + (index % 2) * 20,
      pathHeight: orbit.pathHeight ?? 65 + (index % 3) * 10,
    }));

    const flowPaths = (flowPathsConfig ?? []).map((fp, i) => {
      // 1. Resolve base container position
      const baseX = px(fp.x, 100 + i * 250);
      const baseY = py(fp.y, 200 + i * 150);
      const curveLength = px(fp.length, 400);

      // 2. Resolve start/end points relative to baseX and baseY (using curveLength as width scope)
      const startX = fp.startX !== undefined ? parseCoord(fp.startX, 0, curveLength) + baseX : baseX;
      // Vertical offsets are in 1200×800 design units, scaled like the motifs so the curve keeps its shape.
      const startY = fp.startY !== undefined ? parseCoord(fp.startY, 0, 800) * size + baseY : baseY;
      
      const endX = fp.endX !== undefined ? parseCoord(fp.endX, curveLength, curveLength) + baseX : startX + curveLength;
      const endY = fp.endY !== undefined ? parseCoord(fp.endY, 0, 800) * size + baseY : startY;

      // 3. Resolve control points relative to the base offset
      const defaultControlX = (startX + endX) / 2;
      const defaultControlY = Math.min(startY, endY) - 70 * size;
      
      const controlX = fp.controlX !== undefined ? parseCoord(fp.controlX, 0, curveLength) + baseX : defaultControlX;
      const controlY = fp.controlY !== undefined ? parseCoord(fp.controlY, 0, 800) * size + baseY : defaultControlY;

      return {
        id: `flow-path-${uid}-${i}`,
        d: `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`,
        speed: fp.speed ?? 8,
        dotCount: fp.dotCount ?? 4,
        strokeColor: fp.strokeColor ?? "#FF8C42",
        dotColor: fp.dotColor ?? "#FF6B35",
      };
    });

    const hands = (handsConfig ?? []).map((pt) => ({
      x: px(pt.x, 140),
      y: py(pt.y, 180),
      rot: round(-30 + rand() * 60),
      scale: round(1.3 + rand() * 0.3),
      flip: rand() > 0.5,
    }));

    const uShapes = (uShapeConfig ?? []).map((pt) => ({
      x: px(pt.x, 60),
      y: py(pt.y, 720),
    }));

    const tlCorner = cornerTLConfig
      ? {
          x: px(cornerTLConfig.x, 0),
          y: py(cornerTLConfig.y, 0),
        }
      : null;

    const brCorner = cornerBRConfig
      ? {
          x: px(cornerBRConfig.x, 1200),
          y: py(cornerBRConfig.y, 800),
        }
      : null;

    const footCountPerSide = showFeet ? 3 : 0;
    const buildTrail = (baseX: number) => {
      return Array.from({ length: footCountPerSide }, (_, i) => {
        const t = i / Math.max(footCountPerSide - 1, 1);
        const isLeft = i % 2 === 0;
        const strideOffset = isLeft ? -16 : 16;
        const edgeFade = Math.sin(t * Math.PI) * 0.6;

        return {
          x: round(px(baseX + strideOffset + Math.sin(t * Math.PI) * 10, 0)),
          y: round(py(650 - t * 450, 0)),
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
      orbitingCircles,
      flowPaths,
      hands,
      uShapes,
      leftFootprints,
      rightFootprints,
      showFeet,
      tlCorner,
      brCorner,
    };
  }, [
    showFeet,
    variant,
    dotsConfig,
    motif1Config,
    motif2Config,
    motif3Config,
    dashedOrbitsConfig,
    handsConfig,
    uShapeConfig,
    flowPathsConfig,
    cornerTLConfig,
    cornerBRConfig,
    isFill,
    canvasW,
    canvasH,
    size,
    motif1Id,
    motif2Id,
    motif3Id,
    uid,
  ]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden cultural-pattern cultural-pattern--${variant} ${className}`}
    >
      <style jsx>{`
        @keyframes slowContainerRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes dashTravelForward {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -50;
          }
        }
        @keyframes blinkSequence {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
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
        @keyframes sunPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.12);
            opacity: 1;
          }
        }
        .cultural-sun-pulse {
          animation: sunPulse 4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .cultural-sky-spiral-rotate,
          .cultural-sun-pulse {
            animation: none;
          }
        }
      `}</style>

      {/* Fill mode waits for the first measurement so nothing flashes at the wrong size. */}
      {(!isFill || box) && (
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 ${canvasW} ${canvasH}`}
        preserveAspectRatio={isFill ? "none" : "xMidYMid meet"}
      >
        <defs>
          <g id={motif1Id}>
            <circle cx="0" cy="0" r="18" fill="#FF7A3D" />
            <circle
              cx="0"
              cy="0"
              r="32"
              stroke="#E85D26"
              strokeWidth="3.5"
              strokeDasharray="4 4"
              fill="none"
            />
            <circle
              cx="0"
              cy="0"
              r="48"
              stroke="#FF7A3D"
              strokeWidth="4.5"
              fill="none"
            />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = i * 45;
              return (
                <g key={i} transform={`rotate(${a})`}>
                  <path
                    d="M -9 -60 A 9 9 0 0 1 9 -60"
                    stroke="#FF7A3D"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="0" cy="-72" r="4" fill="#E85D26" />
                </g>
              );
            })}
          </g>

          <g id={motif2Id}>
            <circle cx="0" cy="0" r="22" fill="#E85D26" />
            <circle
              cx="0"
              cy="0"
              r="38"
              stroke="#FF7A3D"
              strokeWidth="4.5"
              fill="none"
            />
            <circle
              cx="0"
              cy="0"
              r="56"
              stroke="#E85D26"
              strokeWidth="6.5"
              strokeDasharray="6 6"
              fill="none"
            />
            <circle
              cx="0"
              cy="0"
              r="74"
              stroke="#FF7A3D"
              strokeWidth="3.5"
              fill="none"
            />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return (
                <circle
                  key={i}
                  cx={88 * Math.cos(a)}
                  cy={88 * Math.sin(a)}
                  r="4.5"
                  fill="#FF8C42"
                />
              );
            })}
          </g>

          <g id={motif3Id}>
            <circle cx="0" cy="0" r="24" fill="#FF8C42" />
            <circle
              cx="0"
              cy="0"
              r="42"
              stroke="#E85D26"
              strokeWidth="3.5"
              fill="none"
            />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = i * 36;
              return (
                <g key={i} transform={`rotate(${a})`}>
                  <line
                    x1="0"
                    y1="-46"
                    x2="0"
                    y2="-62"
                    stroke="#FF7A3D"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
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
            <path
              d="M-6 -10 L-4.5 -34 C-2.5 -36 -1 -32 -1 -20 L-1.5 -10 Z"
              fill="#E85D26"
              opacity="0.85"
            />
            <path
              d="M0 -11 L1.5 -38 C3.5 -40 5 -35 5 -22 L4 -11 Z"
              fill="#E85D26"
              opacity="0.9"
            />
          </g>
        </defs>

        <g>
          {showSnakes && fixedSnakes.map((snake, i) => (
            <g key={`fixed-snake-${i}`} transform={isFill ? `scale(${canvasW / 1200})` : undefined}>
              <path
                d={snake.path1}
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
                d={snake.path2}
                fill="none"
                stroke="#FF8C42"
                strokeWidth="1.2"
                strokeDasharray="4 8"
                strokeLinecap="round"
                opacity="0.75"
                className="cultural-vertical-snake"
                style={{ animationDuration: `${16 + i * 4}s` }}
              />
              {snake.dots.map((dot, di) => (
                <circle
                  key={`snake-dot-${i}-${di}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="2.5"
                  fill="#FF7A3D"
                  style={{
                    animation: `blinkSequence 1.5s infinite ease-in-out`,
                    animationDelay: `${di * 0.12}s`,
                    transformOrigin: `${dot.x}px ${dot.y}px`,
                  }}
                />
              ))}
            </g>
          ))}

          {/* Top-Left Fold Corner Pattern */}
          {layout.tlCorner && (
            <g
              transform={`translate(${layout.tlCorner.x}, ${layout.tlCorner.y}) scale(${size}) rotate(135)`}
            >
              <path
                d={cornerPattern.line1}
                fill="none"
                stroke="#E85D26"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.4"
              />
              <path
                d={cornerPattern.line2}
                fill="none"
                stroke="#FF8C42"
                strokeWidth="2.5"
                strokeDasharray="3 6"
                opacity="0.8"
              />
              <path
                d={cornerPattern.line3}
                fill="none"
                stroke="#FF7A3D"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <path
                d={cornerPattern.line4}
                fill="none"
                stroke="#E85D26"
                strokeWidth="1.5"
                opacity="0.5"
              />
              {cornerPattern.dots.map((dot, cdi) => (
                <circle
                  key={`tl-dot-${cdi}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="2.2"
                  fill="#FF6B35"
                  style={{
                    animation: `blinkSequence 1.2s infinite ease-in-out`,
                    animationDelay: `${cdi * 0.1}s`,
                    transformOrigin: `${dot.x}px ${dot.y}px`,
                  }}
                />
              ))}
            </g>
          )}

          {/* Bottom-Right Fold Corner Pattern */}
          {layout.brCorner && (
            <g
              transform={`translate(${layout.brCorner.x}, ${layout.brCorner.y}) scale(${size}) rotate(-45)`}
            >
              <path
                d={cornerPattern.line1}
                fill="none"
                stroke="#E85D26"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.4"
              />
              <path
                d={cornerPattern.line2}
                fill="none"
                stroke="#FF8C42"
                strokeWidth="2.5"
                strokeDasharray="3 6"
                opacity="0.8"
              />
              <path
                d={cornerPattern.line3}
                fill="none"
                stroke="#FF7A3D"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <path
                d={cornerPattern.line4}
                fill="none"
                stroke="#E85D26"
                strokeWidth="1.5"
                opacity="0.5"
              />
              {cornerPattern.dots.map((dot, cdi) => (
                <circle
                  key={`br-dot-${cdi}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="2.2"
                  fill="#FF6B35"
                  style={{
                    animation: `blinkSequence 1.2s infinite ease-in-out`,
                    animationDelay: `${cdi * 0.1}s`,
                    transformOrigin: `${dot.x}px ${dot.y}px`,
                  }}
                />
              ))}
            </g>
          )}

          {/* Curved Flow Paths with Position, Length & Flowing Dots */}
          <g 
            className={isFill ? "cultural-flow-paths" : `cultural-flow-paths transition-transform duration-200 
              [--path-offset:0px]
              [@media(min-width:768px)_and_(max-width:793px)]:[--path-offset:-1633px]
              [@media(min-width:793px)_and_(max-width:828px)]:[--path-offset:-1460px]
              [@media(min-width:828px)_and_(max-width:858px)]:[--path-offset:-1394px]
              [@media(min-width:828px)_and_(max-width:886px)]:[--path-offset:-1300px]
              [@media(min-width:828px)_and_(max-width:927px)]:[--path-offset:-1220px]
              [@media(min-width:927px)_and_(max-width:1012px)]:[--path-offset:-1080px]
              [@media(min-width:1012px)_and_(max-width:1100px)]:[--path-offset:-420px]
              [@media(min-width:1100px)_and_(max-width:1150px)]:[--path-offset:-360px]
              [@media(min-width:1150px)_and_(max-width:1240px)]:[--path-offset:-300px]
              [@media(min-width:1240px)_and_(max-width:1330px)]:[--path-offset:-240px]
              [@media(min-width:1330px)_and_(max-width:1420px)]:[--path-offset:-180px]
              [@media(min-width:1420px)_and_(max-width:1510px)]:[--path-offset:-140px]
              [@media(min-width:1510px)_and_(max-width:1600px)]:[--path-offset:-120px]
              [@media(min-width:1600px)_and_(max-width:1700px)]:[--path-offset:-86px]
              [@media(min-width:1700px)_and_(max-width:1800px)]:[--path-offset:-60px]
              [@media(min-width:1800px)_and_(max-width:1900px)]:[--path-offset:-25px]
              `
            }
            style={isFill ? undefined : { transform: 'translateY(var(--path-offset))' }}
          >
          {layout.flowPaths.map((fp) => {
            return (
              <g key={fp.id}>
                <path
                  id={fp.id}
                  d={fp.d}
                  fill="none"
                  stroke={fp.strokeColor}
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  opacity="0.6"
                />
                {Array.from({ length: fp.dotCount }).map((_, di) => {
                  const delay = -(fp.speed / fp.dotCount) * di;
                  return (
                    <g key={`flow-dot-${di}`}>
                      <circle cx="0" cy="0" r={3.5 * size} fill={fp.dotColor} opacity="0.9">
                        <animateMotion
                          dur={`${fp.speed}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                          rotate="auto"
                        >
                          <mpath href={`#${fp.id}`} />
                        </animateMotion>
                      </circle>
                    </g>
                  );
                })}
              </g>
            );
          })}
          </g>

          {layout.circularDotMotifs.map((motif, mi) => {
            if (motif.pattern === "sun") {
              // Same footprint as the classic motif: the outer ring sits at startR + (rings - 1) × gap.
              const outerR = motif.startR + (motif.rings - 1) * motif.gap;
              const rings = generateSunRings(outerR, mulberry32(seedFrom(`sun-${variant}-${mi}`)));
              const glowId = `pw-sun-glow-${uid}-${mi}`;
              const coreId = `pw-sun-core-${uid}-${mi}`;
              return (
                <g key={`circle-motif-${mi}`} transform={`translate(${motif.cx}, ${motif.cy}) scale(${size})`}>
                  <defs>
                    {/* Warm peach haze behind the rings, like the soft light between the dots in the reference */}
                    <radialGradient id={glowId}>
                      <stop offset="0%" stopColor="#FFF4E0" stopOpacity="0.9" />
                      <stop offset="22%" stopColor="#FFD2B0" stopOpacity="0.55" />
                      <stop offset="70%" stopColor="#FFB88F" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#FFB88F" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id={coreId}>
                      <stop offset="0%" stopColor="#FFFBE6" />
                      <stop offset="45%" stopColor="#FFE14D" />
                      <stop offset="100%" stopColor="#FFC53D" />
                    </radialGradient>
                  </defs>
                  <circle r={outerR * 1.02} fill={`url(#${glowId})`} />

                  {rings.map((ring, ri) => (
                    // Each ring turns on its own: alternate directions, outer rings slower.
                    <g
                      key={ri}
                      className="cultural-sky-spiral-rotate"
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        animationDuration: `${round(motif.speed * (0.55 + ring.at))}s`,
                        animationDirection: (ri % 2 === 0) === (motif.dir === "normal") ? "normal" : "reverse",
                      }}
                    >
                      {/* Soft glow band under the ring */}
                      <circle
                        r={ring.radius}
                        fill="none"
                        stroke={ring.color}
                        strokeWidth={ring.dotR * 2.6}
                        opacity={0.16}
                      />
                      {ring.dots.map((d, di) => (
                        <circle key={di} cx={d.x} cy={d.y} r={d.r} fill={ring.color} opacity={ring.opacity} />
                      ))}
                    </g>
                  ))}

                  {/* Sun: cream halo round a glowing yellow core, gently pulsing */}
                  <g className="cultural-sun-pulse" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <circle r={outerR * 0.15} fill="#FFF3DC" opacity={0.85} />
                    <circle r={outerR * 0.1} fill={`url(#${coreId})`} />
                  </g>
                </g>
              );
            }

            const dots = generateGraduatedCircularDots(
              0,
              0,
              motif.rings,
              motif.startR,
              motif.gap,
              mulberry32(seedFrom(`dots-${variant}-${mi}`))
            );
            return (
              <g
                key={`circle-motif-${mi}`}
                transform={`translate(${motif.cx}, ${motif.cy}) scale(${size})`}
              >
              <g
                className="cultural-sky-spiral-rotate"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
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
                    opacity={d.o}
                  />
                ))}
              </g>
              </g>
            );
          })}

          {layout.imageMotifs.map((im, idx) => (
            <g key={`img-motif-${idx}`} transform={`translate(${im.x}, ${im.y}) scale(${size})`}>
              <g
                className="cultural-sky-spiral-rotate"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  animationDuration: `${im.speed}s`,
                  animationDirection: im.dir as "normal" | "reverse",
                }}
              >
                <g transform={`scale(${im.scale})`} opacity="0.9">
                  <use href={`#${im.type}`} />
                </g>
              </g>
            </g>
          ))}

          {layout.orbitingCircles.map((orbit, oi) => {
            const customPath = `M -${orbit.pathWidth} 0 A ${orbit.pathWidth} ${orbit.pathHeight} 0 1 1 ${orbit.pathWidth} 0 A ${orbit.pathWidth} ${orbit.pathHeight} 0 1 1 -${orbit.pathWidth} 0`;
            return (
              <g
                key={`dashed-orbit-${oi}`}
                transform={`translate(${orbit.x}, ${orbit.y}) scale(${size})`}
              >
                <g>
                  <animateMotion
                    path={customPath}
                    dur={`${orbit.speed}s`}
                    repeatCount="indefinite"
                  />
                  <g>
                    <circle
                      cx="0"
                      cy="0"
                      r={orbit.radius}
                      fill="none"
                      stroke="#FF8C42"
                      strokeWidth="1.5"
                      strokeDasharray="6 6"
                      opacity="0.5"
                    />
                    <circle cx="0" cy="0" r="4.5" fill="#FF7A3D" opacity="0.9" />
                    <circle
                      cx="0"
                      cy="0"
                      r="8"
                      fill="none"
                      stroke="#E85D26"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                  </g>
                </g>
              </g>
            );
          })}

          {layout.uShapes.map((us, usi) => (
            <g
              key={`u-shape-${usi}`}
              transform={`translate(${us.x}, ${us.y}) scale(${size}) rotate(45)`}
            >
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
              transform={`translate(${h.x}, ${h.y}) scale(${size}) rotate(${h.rot}) scale(${
                h.flip ? -h.scale : h.scale
              }, ${h.scale})`}
            >
              <g className="cultural-hand-float" style={{ animationDelay: `${-i * 1}s` }}>
                <use href={`#${handId}`} />
              </g>
            </g>
          ))}

          {layout.showFeet && (
            <>
              <g className="cultural-footprints-left">
                {layout.leftFootprints.map((fp, i) => {
                  const next =
                    layout.leftFootprints[
                      Math.min(i + 1, layout.leftFootprints.length - 1)
                    ];
                  const prev = layout.leftFootprints[Math.max(i - 1, 0)];
                  const dx =
                    i < layout.leftFootprints.length - 1
                      ? next.x - fp.x
                      : fp.x - prev.x;
                  const dy =
                    i < layout.leftFootprints.length - 1
                      ? next.y - fp.y
                      : fp.y - prev.y;
                  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
                  return (
                    <g
                      key={`fp-left-${i}`}
                      opacity={fp.opacity}
                      transform={`translate(${fp.x}, ${fp.y}) rotate(${angle}) scale(${
                        (fp.isLeft ? -0.8 : 0.8) * size
                      }, ${0.8 * size})`}
                    >
                      <use href={`#${footRightId}`} />
                    </g>
                  );
                })}
              </g>

              <g className="cultural-footprints-right">
                {layout.rightFootprints.map((fp, i) => {
                  const next =
                    layout.rightFootprints[
                      Math.min(i + 1, layout.rightFootprints.length - 1)
                    ];
                  const prev = layout.rightFootprints[Math.max(i - 1, 0)];
                  const dx =
                    i < layout.rightFootprints.length - 1
                      ? next.x - fp.x
                      : fp.x - prev.x;
                  const dy =
                    i < layout.rightFootprints.length - 1
                      ? next.y - fp.y
                      : fp.y - prev.y;
                  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
                  return (
                    <g
                      key={`fp-right-${i}`}
                      opacity={fp.opacity}
                      transform={`translate(${fp.x}, ${fp.y}) rotate(${Number(
                        angle
                      ).toFixed(4)}) scale(${(fp.isLeft ? -0.8 : 0.8) * size}, ${0.8 * size})`}
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
      )}
    </div>
  );
}