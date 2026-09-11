import Image from "next/image";
import TrLogo, { type TrLogoMotion, type TrLogoPlacement } from "@/components/TrLogo";

const PATTERNS = [
  "/assets/patterns/pat1.jpg",
  "/assets/patterns/pat2.jpg",
  "/assets/patterns/pat3.jpg",
  "/assets/patterns/pat4.jpg",
  "/assets/patterns/pat5.jpg",
  "/assets/patterns/pat6.jpg",
];

export type PatternFieldVariant = "inward" | "rise" | "pulse" | "twirl" | "wave";

type Motion =
  | "orbit"
  | "orbit-rev"
  | "zoom"
  | "drift"
  | "spin"
  | "bob"
  | "sway"
  | "pulse"
  | "twirl"
  | "float"
  | "glide";

type Shape =
  | "band"
  | "blob"
  | "boomerang"
  | "circle"
  | "crescent"
  | "diamond"
  | "kidney"
  | "leaf"
  | "petal"
  | "seed"
  | "wave";

type Motif = {
  id: string;
  side?: "left" | "right";
  motion: Motion;
  shape: Shape;
  width: number;
  height: number;
  top: string;
  inset?: string;
  left?: string;
  tilt?: string;
  delay: string;
  duration: string;
  srcOffset: number;
};

type VariantConfig = {
  travel: "inward" | "edge";
  swapStep: number;
  swapReverse: boolean;
  swapDuration: number;
  motifs: Motif[];
};

const VARIANTS: Record<PatternFieldVariant, VariantConfig> = {
  inward: {
    travel: "inward",
    swapStep: 2,
    swapReverse: false,
    swapDuration: 9,
    motifs: [
      { id: "x1", motion: "glide", shape: "band", width: 1600, height: 88, top: "min(24%, 28vh)", left: "-20%", tilt: "-18deg", delay: "0s", duration: "14s", srcOffset: 0 },
      { id: "x2", motion: "glide", shape: "band", width: 1600, height: 70, top: "min(58%, 62vh)", left: "-24%", tilt: "16deg", delay: "0.4s", duration: "16s", srcOffset: 3 },
      { id: "l1", side: "left", motion: "orbit", shape: "blob", width: 270, height: 310, top: "2%", inset: "2%", tilt: "-8deg", delay: "0s", duration: "9s", srcOffset: 0 },
      { id: "l2", side: "left", motion: "zoom", shape: "petal", width: 180, height: 250, top: "24%", inset: "6%", tilt: "14deg", delay: "0.15s", duration: "5.5s", srcOffset: 1 },
      { id: "l3", side: "left", motion: "spin", shape: "crescent", width: 210, height: 210, top: "50%", inset: "3%", delay: "0.25s", duration: "12s", srcOffset: 2 },
      { id: "l4", side: "left", motion: "drift", shape: "leaf", width: 160, height: 240, top: "74%", inset: "5%", tilt: "-18deg", delay: "0.35s", duration: "6.5s", srcOffset: 4 },
      { id: "r1", side: "right", motion: "zoom", shape: "kidney", width: 250, height: 180, top: "5%", inset: "3%", tilt: "10deg", delay: "0.1s", duration: "6s", srcOffset: 5 },
      { id: "r2", side: "right", motion: "orbit", shape: "seed", width: 150, height: 240, top: "30%", inset: "5%", tilt: "-12deg", delay: "0.2s", duration: "7.5s", srcOffset: 2 },
      { id: "r3", side: "right", motion: "spin", shape: "diamond", width: 190, height: 190, top: "54%", inset: "7%", delay: "0.4s", duration: "11s", srcOffset: 4 },
      { id: "r4", side: "right", motion: "drift", shape: "boomerang", width: 260, height: 160, top: "76%", inset: "2%", tilt: "16deg", delay: "0.5s", duration: "7s", srcOffset: 1 },
    ],
  },
  rise: {
    travel: "edge",
    swapStep: 1,
    swapReverse: true,
    swapDuration: 11,
    motifs: [
      { id: "x1", motion: "glide", shape: "band", width: 1700, height: 76, top: "min(38%, 118vh)", left: "-22%", tilt: "-28deg", delay: "0s", duration: "15s", srcOffset: 5 },
      { id: "x2", motion: "glide", shape: "band", width: 1700, height: 58, top: "min(68%, 162vh)", left: "-18%", tilt: "24deg", delay: "0.5s", duration: "13s", srcOffset: 2 },
      { id: "l1", side: "left", motion: "bob", shape: "leaf", width: 170, height: 280, top: "4%", inset: "-5%", delay: "0s", duration: "7s", srcOffset: 5 },
      { id: "l2", side: "left", motion: "float", shape: "seed", width: 140, height: 250, top: "30%", inset: "-3%", delay: "0.2s", duration: "9s", srcOffset: 3 },
      { id: "l3", side: "left", motion: "bob", shape: "kidney", width: 240, height: 170, top: "56%", inset: "-6%", delay: "0.4s", duration: "8s", srcOffset: 1 },
      { id: "l4", side: "left", motion: "float", shape: "petal", width: 160, height: 220, top: "80%", inset: "-2%", delay: "0.6s", duration: "10s", srcOffset: 4 },
      { id: "r1", side: "right", motion: "float", shape: "boomerang", width: 240, height: 170, top: "6%", inset: "-5%", delay: "0.1s", duration: "8.5s", srcOffset: 0 },
      { id: "r2", side: "right", motion: "bob", shape: "crescent", width: 200, height: 200, top: "32%", inset: "-2%", delay: "0.3s", duration: "6.5s", srcOffset: 2 },
      { id: "r3", side: "right", motion: "float", shape: "blob", width: 230, height: 190, top: "58%", inset: "-6%", delay: "0.5s", duration: "9.5s", srcOffset: 5 },
      { id: "r4", side: "right", motion: "bob", shape: "diamond", width: 160, height: 160, top: "82%", inset: "-3%", delay: "0.7s", duration: "7.5s", srcOffset: 1 },
    ],
  },
  pulse: {
    travel: "edge",
    swapStep: 3,
    swapReverse: false,
    swapDuration: 7,
    motifs: [
      { id: "x1", motion: "glide", shape: "band", width: 1700, height: 84, top: "min(36%, 116vh)", left: "-20%", tilt: "32deg", delay: "0s", duration: "12s", srcOffset: 2 },
      { id: "x2", motion: "glide", shape: "band", width: 1500, height: 52, top: "min(70%, 168vh)", left: "-26%", tilt: "-12deg", delay: "0.35s", duration: "11s", srcOffset: 4 },
      { id: "l1", side: "left", motion: "pulse", shape: "diamond", width: 210, height: 210, top: "2%", inset: "-6%", delay: "0s", duration: "5s", srcOffset: 2 },
      { id: "l2", side: "left", motion: "sway", shape: "petal", width: 160, height: 220, top: "26%", inset: "-2%", delay: "0.2s", duration: "6s", srcOffset: 4 },
      { id: "l3", side: "left", motion: "pulse", shape: "blob", width: 230, height: 170, top: "50%", inset: "-5%", delay: "0.35s", duration: "4.5s", srcOffset: 0 },
      { id: "l4", side: "left", motion: "sway", shape: "crescent", width: 190, height: 190, top: "76%", inset: "-3%", delay: "0.5s", duration: "7s", srcOffset: 5 },
      { id: "r1", side: "right", motion: "sway", shape: "leaf", width: 170, height: 240, top: "4%", inset: "-4%", delay: "0.1s", duration: "5.5s", srcOffset: 1 },
      { id: "r2", side: "right", motion: "pulse", shape: "kidney", width: 220, height: 160, top: "30%", inset: "-6%", delay: "0.25s", duration: "6.5s", srcOffset: 3 },
      { id: "r3", side: "right", motion: "sway", shape: "seed", width: 140, height: 240, top: "54%", inset: "-2%", delay: "0.4s", duration: "4.8s", srcOffset: 2 },
      { id: "r4", side: "right", motion: "pulse", shape: "boomerang", width: 230, height: 150, top: "78%", inset: "-5%", delay: "0.55s", duration: "5.8s", srcOffset: 4 },
    ],
  },
  twirl: {
    travel: "edge",
    swapStep: 1,
    swapReverse: false,
    swapDuration: 12,
    motifs: [
      { id: "x1", motion: "glide", shape: "band", width: 1800, height: 70, top: "min(28%, 32vh)", left: "-22%", tilt: "42deg", delay: "0s", duration: "18s", srcOffset: 4 },
      { id: "x2", motion: "glide", shape: "band", width: 1800, height: 56, top: "min(66%, 68vh)", left: "-20%", tilt: "-38deg", delay: "0.6s", duration: "16s", srcOffset: 1 },
      { id: "l1", side: "left", motion: "twirl", shape: "seed", width: 170, height: 250, top: "3%", inset: "-5%", delay: "0s", duration: "14s", srcOffset: 4 },
      { id: "l2", side: "left", motion: "sway", shape: "boomerang", width: 230, height: 150, top: "28%", inset: "-2%", delay: "0.25s", duration: "7s", srcOffset: 0 },
      { id: "l3", side: "left", motion: "twirl", shape: "petal", width: 180, height: 250, top: "52%", inset: "-6%", delay: "0.4s", duration: "18s", srcOffset: 2 },
      { id: "l4", side: "left", motion: "float", shape: "kidney", width: 220, height: 160, top: "78%", inset: "-3%", delay: "0.55s", duration: "8s", srcOffset: 5 },
      { id: "r1", side: "right", motion: "float", shape: "crescent", width: 200, height: 200, top: "5%", inset: "-4%", delay: "0.15s", duration: "9s", srcOffset: 1 },
      { id: "r2", side: "right", motion: "twirl", shape: "blob", width: 250, height: 200, top: "30%", inset: "-6%", delay: "0.3s", duration: "16s", srcOffset: 3 },
      { id: "r3", side: "right", motion: "sway", shape: "leaf", width: 160, height: 240, top: "56%", inset: "-2%", delay: "0.45s", duration: "6.5s", srcOffset: 5 },
      { id: "r4", side: "right", motion: "twirl", shape: "diamond", width: 180, height: 180, top: "80%", inset: "-5%", delay: "0.6s", duration: "13s", srcOffset: 0 },
    ],
  },
  wave: {
    travel: "edge",
    swapStep: 2,
    swapReverse: true,
    swapDuration: 10,
    motifs: [
      { id: "x1", motion: "glide", shape: "band", width: 1700, height: 80, top: "min(26%, 30vh)", left: "-18%", tilt: "-14deg", delay: "0s", duration: "13s", srcOffset: 1 },
      { id: "x2", motion: "glide", shape: "band", width: 1700, height: 64, top: "min(56%, 58vh)", left: "-24%", tilt: "12deg", delay: "0.45s", duration: "15s", srcOffset: 4 },
      { id: "l1", side: "left", motion: "sway", shape: "kidney", width: 250, height: 160, top: "4%", inset: "-6%", tilt: "-12deg", delay: "0s", duration: "6s", srcOffset: 1 },
      { id: "l2", side: "left", motion: "bob", shape: "leaf", width: 160, height: 260, top: "28%", inset: "-4%", tilt: "8deg", delay: "0.2s", duration: "8s", srcOffset: 4 },
      { id: "l3", side: "left", motion: "float", shape: "crescent", width: 200, height: 200, top: "52%", inset: "-2%", delay: "0.35s", duration: "7s", srcOffset: 0 },
      { id: "l4", side: "left", motion: "sway", shape: "petal", width: 170, height: 230, top: "76%", inset: "-5%", tilt: "16deg", delay: "0.5s", duration: "9s", srcOffset: 3 },
      { id: "r1", side: "right", motion: "bob", shape: "blob", width: 230, height: 180, top: "3%", inset: "-3%", tilt: "10deg", delay: "0.1s", duration: "7.5s", srcOffset: 5 },
      { id: "r2", side: "right", motion: "sway", shape: "seed", width: 150, height: 240, top: "26%", inset: "-6%", tilt: "-14deg", delay: "0.3s", duration: "6.5s", srcOffset: 2 },
      { id: "r3", side: "right", motion: "bob", shape: "boomerang", width: 250, height: 150, top: "50%", inset: "-2%", tilt: "18deg", delay: "0.45s", duration: "8.5s", srcOffset: 4 },
      { id: "r4", side: "right", motion: "float", shape: "wave", width: 220, height: 180, top: "74%", inset: "-5%", tilt: "-8deg", delay: "0.6s", duration: "10s", srcOffset: 1 },
    ],
  },
};

function swapSrcs(offset: number, step: number, reverse: boolean) {
  const srcs = [0, 1, 2].map((i) => PATTERNS[(offset + i * step) % PATTERNS.length]);
  return reverse ? [...srcs].reverse() : srcs;
}

export default function PatternField({
  variant = "inward",
  logoMotion,
  logoPlacement = "tr",
}: {
  variant?: PatternFieldVariant;
  logoMotion?: TrLogoMotion;
  logoPlacement?: TrLogoPlacement;
}) {
  const config = VARIANTS[variant];
  const slice = config.swapDuration / 3;

  return (
    <>
    <div
      className={`pattern-field pattern-field--${config.travel}`}
      aria-hidden="true"
      style={{ ["--swap-duration" as string]: `${config.swapDuration}s` }}
    >
      {config.motifs.map((motif) => (
        <div
          key={`${variant}-${motif.id}`}
          className={`pattern-field__piece pattern-field__piece--${motif.motion}${motif.shape === "band" ? " pattern-field__piece--cross" : ""}${motif.side ? ` pattern-field__piece--${motif.side}` : ""}`}
          style={{
            top: motif.top,
            left: motif.left ?? (motif.side === "left" ? motif.inset : undefined),
            right: motif.side === "right" ? motif.inset : undefined,
            ["--piece-w" as string]: `${motif.width}px`,
            ["--piece-h" as string]: `${motif.height}px`,
            ["--pattern-delay" as string]: motif.delay,
            ["--pattern-duration" as string]: motif.duration,
          }}
        >
          <div
            className={`pattern-field__shape pattern-field__shape--${motif.shape}`}
            style={{ ["--tilt" as string]: motif.tilt ?? "0deg" }}
          >
            {swapSrcs(motif.srcOffset, config.swapStep, config.swapReverse).map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                unoptimized
                quality={95}
                sizes={`${Math.max(motif.width, motif.height)}px`}
                className="pattern-field__swap object-cover"
                style={{
                  animationDelay: `${i * slice + Number.parseFloat(motif.delay)}s`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
    {logoMotion ? <TrLogo motion={logoMotion} placement={logoPlacement} /> : null}
    </>
  );
}
