"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

type StoryMilestone = {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tag: string;
};

const storyMilestones: StoryMilestone[] = [
  {
    id: "foundation",
    year: "Early 1970s",
    title: "The Women Went Themselves",
    subtitle: "Grassroots mobilization for self-determination",
    description:
      "Driven by profound courage and a commitment to community wellbeing, local leaders took direct action to secure self-determined health services, laying the vital groundwork for Pika Wiya Health Service.",
    imageSrc: "/assets/story/1970.png",
    imageAlt: "Community healthcare gathering",
    tag: "Heritage",
  },
  {
    id: "expansion",
    year: "1974",
    title: "Geneva Said Yes",
    subtitle: "International recognition & regional advocacy",
    description:
      "A pivotal moment when community advocacy gained international acknowledgment at the World Health Organization in Geneva, validating community-led primary health care models.",
    imageSrc: "/assets/story/1974.png",
    imageAlt: "Outreach health services",
    tag: "Growth",
  },
  {
    id: "connection",
    year: "1983",
    title: "A Generation of Health Workers",
    subtitle: "Empowering regional workforce and tradition",
    description:
      "Embedding traditional knowledge, elder wisdom, and holistic wellbeing practices into professional pathways, fostering a dedicated generation of regional health practitioners.",
    imageSrc: "/assets/story/1983.png",
    imageAlt: "Cultural knowledge sharing",
    tag: "Culture",
  },
  {
    id: "incorporation",
    year: "December 1984",
    title: "Pika Wiya Incorporated",
    subtitle: "Formal structure for regional care",
    description:
      "Achieving formal incorporation to expand clinical infrastructure, secure sustainable funding streams, and broaden comprehensive outreach programs across the regional footprint.",
    imageSrc: "/assets/story/1984.png",
    imageAlt: "Modern medical facilities",
    tag: "Milestone",
  },
  {
    id: "anangu-bibi",
    year: "2004",
    title: "Anangu Bibi Begins",
    subtitle: "Specialized maternal and child health focus",
    description:
      "The launch of the Anangu Bibi program, dedicated to providing culturally secure, family-centered support for mothers, babies, and young children throughout their developmental journey.",
    imageSrc: "/assets/story/2004.png",
    imageAlt: "Maternal and child wellness support",
    tag: "Care",
  },
  {
    id: "community-control",
    year: "2011",
    title: "Fully Community Controlled",
    subtitle: "Absolute self-determination in governance",
    description:
      "Reaching complete community control, ensuring that regional governance, cultural authority, and community voices directly drive every clinical and operational decision.",
    imageSrc: "/assets/story/2011.png",
    imageAlt: "Community leadership and governance",
    tag: "Empowerment",
  },
  {
    id: "today-ours",
    year: "Today",
    title: "Still Ours",
    subtitle: "Continuing the legacy of community healing",
    description:
      "Remaining fiercely independent, community-owned, and dedicated to delivering holistic, doctor-led clinical and cultural healthcare services for generations to come.",
    imageSrc: "/assets/story/2026.png",
    imageAlt: "Modern community healthcare delivery",
    tag: "Future",
  },
];

function MilestoneCard({
  milestone,
  index,
  setActiveCardIndex,
}: {
  milestone: StoryMilestone;
  index: number;
  setActiveCardIndex: (i: number) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Track scroll progress specifically for this milestone section
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 30,
    restDelta: 0.001,
  });

  // Slow, gradual scale from small (0.4) to full size (1) as you scroll through
  const scale = useTransform(smoothProgress, [0.15, 0.55], [0.4, 1]);
  const opacity = useTransform(smoothProgress, [0.1, 0.3], [0, 1]);

  return (
    <motion.div
      ref={cardRef}
      onViewportEnter={() => setActiveCardIndex(index)}
      className="flex h-screen w-full items-center justify-center p-4 sm:p-8 snap-center snap-always [perspective:1200px]"
    >
      <motion.article
        style={{
          scale,
          opacity,
        }}
        className="relative h-[82vh] w-full max-w-5xl rounded-3xl bg-neutral-900/90 border-2 border-orange-500/30 backdrop-blur-xl overflow-hidden group [transform-style:preserve-3d] shadow-2xl shadow-orange-500/10"
      >
        {/* Image Container */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src={milestone.imageSrc}
              alt={milestone.imageAlt}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
        </div>

        {/* Glowing Top/Bottom Border Accents */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

        {/* Card Main Overlay Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-8 sm:p-14">
          {/* Year & Badge Header */}
          <div className="flex items-center justify-between">
            <span className="rounded-xl bg-neutral-950/80 backdrop-blur-md px-4 py-1.5 text-xl font-bold text-orange-400 border border-orange-500/40 font-mono shadow-xl">
              {milestone.year}
            </span>
            <span className="rounded-md bg-orange-500/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-orange-300 border border-orange-500/30">
              {milestone.tag}
            </span>
          </div>

          {/* Details & Text Content */}
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest">
              {milestone.subtitle}
            </p>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
              {milestone.title}
            </h3>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              {milestone.description}
            </p>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function OurStory() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 15,
    damping: 25,
    restDelta: 0.0001,
  });

  // High-Density Galaxy Starfield Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const numStars = 3000;
    const maxDepth = 2500;

    const stars = Array.from({ length: numStars }, () => ({
      x: (Math.random() - 0.5) * 7000,
      y: (Math.random() - 0.5) * 7000,
      z: Math.random() * maxDepth,
      color: Math.random() > 0.35 ? "#f97316" : "#ffffff",
      baseRadius: Math.random() * 4.5 + 0.8,
    }));

    let cameraZ = 0;

    const render = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      const scrollVal = smoothProgress.get();
      cameraZ += 0.9 + scrollVal * 2.8;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        let relativeZ = star.z - cameraZ;

        while (relativeZ < 10) {
          star.z += maxDepth;
          relativeZ = star.z - cameraZ;
        }

        const focalLength = 350;
        const k = focalLength / relativeZ;
        const px = cx + star.x * k;
        const py = cy + star.y * k;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, Math.max(0.15, 1 - relativeZ / maxDepth));
          const radius = Math.max(0.5, star.baseRadius * k);

          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [smoothProgress]);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-neutral-950">
      {/* Canvas Immersive Starfield Background */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      {/* Vignette Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-radial from-transparent via-neutral-950/40 to-neutral-950" />

      {/* Fixed Header Counter Overlay */}
      <div className="sticky top-8 left-8 right-8 z-20 flex justify-between items-center pointer-events-none px-8">
        <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-orange-400 uppercase border border-orange-500/20 backdrop-blur-md">
          Our Story Milestones
        </span>

        <div className="flex items-center gap-3 bg-neutral-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-neutral-800">
          <span className="text-xs font-mono text-orange-400">
            0{activeCardIndex + 1} / 0{storyMilestones.length}
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-xs text-neutral-400 font-mono"
          >
            ↓
          </motion.div>
        </div>
      </div>

      {/* Snap Scroll Viewport */}
      <div className="relative z-10 h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        {storyMilestones.map((milestone, index) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            index={index}
            setActiveCardIndex={setActiveCardIndex}
          />
        ))}
      </div>
    </section>
  );
}