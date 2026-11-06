"use client";

import Image from "next/image";
import NextImage from "next/image";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";

type Funder = {
  name: string;
  logo: string;
  /** Logo is white / light (or baked on black) — sit it on a dark pad */
  onDark?: boolean;
};

const FUNDERS: Funder[] = [
  { name: "AHCSA", logo: "/assets/funders/1.png", onDark: true },
  { name: "Department of Health", logo: "/assets/funders/2.svg" },
  { name: "Eyre and Far North Local Health Network", logo: "/assets/funders/3.svg" },
  { name: "Flinders and Upper North Local Health Network", logo: "/assets/funders/4.svg", onDark: true },
  { name: "NACCHO", logo: "/assets/funders/5.png", onDark: true },
  { name: "NIAA", logo: "/assets/funders/6.png", onDark: true },
  { name: "SA Health", logo: "/assets/funders/7.svg" },
  { name: "SAHMRI", logo: "/assets/funders/8.svg" },
  { name: "RDWA", logo: "/assets/funders/9.svg", onDark: true },
  { name: "Adelaide University Rural Health", logo: "/assets/funders/10.png", onDark: true },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

function FunderItem({ funder }: { funder: Funder }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setIsFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const shiftX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const shiftY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]), springConfig);
  const logoX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);
  const logoY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-22, -8]), springConfig);

  const spotlight = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(180px circle at ${((Number(x) + 0.5) * 100).toFixed(1)}% ${((Number(y) + 0.5) * 100).toFixed(1)}%, rgba(226, 114, 36, 0.22), transparent 55%)`
  );

  const enableMagnet = !reduceMotion && isFinePointer;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableMagnet || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div variants={itemVariants} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          ...(enableMagnet
            ? { rotateX, rotateY, x: shiftX, y: shiftY }
            : {}),
          transformPerspective: 900,
          transformStyle: "preserve-3d",
        }}
        className="group relative flex h-full flex-col items-center gap-4 rounded-2xl border-2 border-border/80 bg-page/60 px-4 py-6 text-center outline-none transition-colors duration-300 hover:border-ochre/50 md:px-5 md:py-7"
      >
        {enableMagnet && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: spotlight }}
          />
        )}

        <div className="relative z-10 w-full" style={{ transformStyle: "preserve-3d" }}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-4 top-4 h-14 rounded-xl bg-[#1b2433]/30 blur-md md:h-16"
          />
          <motion.div
            style={
              enableMagnet
                ? { x: logoX, y: logoY, z: 46, transformStyle: "preserve-3d" }
                : { y: -14, z: 32, transformStyle: "preserve-3d" }
            }
            className={`relative flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border-2 px-3 py-2 shadow-[0_18px_28px_-12px_rgba(27,36,51,0.55),0_2px_0_rgba(255,255,255,0.35)_inset] md:h-28 ${
              funder.onDark
                ? "border-white/25 bg-[#111111]"
                : "border-border/80 bg-white"
            }`}
          >
          <div className="relative h-full w-full">
            <Image
              src={funder.logo}
              alt={funder.name}
              fill
              unoptimized
              sizes="(max-width: 768px) 40vw, 180px"
              className="object-contain"
            />
          </div>
          </motion.div>
        </div>

        <p className="relative z-10 text-sm font-semibold leading-snug text-ink md:text-base">
          {funder.name}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function FundersList() {
  return (
    <section className="relative z-10 w-full overflow-hidden border-t border-border bg-surface py-12 md:py-16">
      <NextImage
        src="/assets/home/main_page_2nd_bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div 
        className="absolute inset-[-20%] z-10 opacity-20 pointer-events-none animate-drift"
        style={{ 
          backgroundImage: "url('/assets/background-pattern-new1.png')",
          backgroundSize: "contain",
          /* Swap out the filter string below to change the color */
          filter: "brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(210%) hue-rotate(349deg) brightness(93%) contrast(82%)"
        }}
      />
      <div className="relative z-20 mx-auto mb-10 max-w-7xl px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 text-xl font-extrabold uppercase tracking-[0.14em] text-ochre md:gap-4 md:text-3xl"
        >
          <span className="h-0.5 w-12 bg-ochre md:w-16" />
          Our Funders
          <span className="h-0.5 w-12 bg-ochre md:w-16" />
        </motion.span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-20 mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5"
        style={{ perspective: 1200 }}
      >
        {FUNDERS.map((funder) => (
          <FunderItem key={funder.name} funder={funder} />
        ))}
      </motion.div>
    </section>
  );
}
