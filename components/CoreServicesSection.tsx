import React from 'react';
import NextImage from 'next/image';
import { ArrowRight, ArrowUpRight, HeartPulse, Sparkles, LucideIcon } from 'lucide-react';
import ButtonLink from './ButtonLink';
import PageTitle from './PageTitle';
import CulturalPattern from './CulturalPattern';
import { motion } from "framer-motion";

export type ServiceItem = {
  name: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  desc: string;
  image: string;
  objectPosition?: string;
  imageClass?: string;
  badgeBg?: string;    // Custom badge background shade (e.g. "bg-emerald-950/80 border-emerald-500/30")
  iconColor?: string;  // Custom icon text shade (e.g. "text-emerald-400")
  glowColor?: string;  // Custom glow color (e.g. "bg-emerald-500/40")
};

export default function CoreServicesSection({ mainServices }: { mainServices: ServiceItem[] }) {
  return (
    <section className="relative overflow-hidden landing-ink py-16 md:py-28">
      {/* Background: solid navy (same colour as the old bg image, minus its bottom arc) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[#1b2433]"
        aria-hidden="true"
      />
      {/* Background Cultural Elements - Updated variant to core-service for matching consistent pattern layout */}
      {/* <CulturalPattern variant="core-service" showFeet /> */}
      
      {/* Positions taken from the 1920px layout: "%" tracks the section, numbers are offsets from the top edge
          that scale with the motifs — so the layout holds at every screen size. */}
      <CulturalPattern 
        variant="core-service"
        fit="fill"
        // motif1Config={[{ x: 7, y: 200 }]}
        // motif1Config={[{ x: 7, y: 200 }]}
        // motif2Config={[{ x: 1050, y: 800 }]}
        // motif3Config={[{ x: 100, y: 500 }]}
        // dotsConfig={[{ x: "10%", y: "23%" }, { x: "89%", y: "59%" }]}
        dashedOrbitsConfig={[{ x: "25%", y: "50%", radius:26 }, { x: "17%", y: "86%", radius:26 }]}
        // uShapeConfig={[{ x: "1.5%", y: "80%" }]}
        // assembleMotifConfig={[{ x: "93%", y: "12%", radius: 75, duration: 1.7 }]}
        cornerTLConfig={{ x: 360, y: -250 }}       // Pin strictly to top-left edge
        cornerBRConfig={{ x: "80%", y: "101%" }}  // Pin strictly to bottom-right edge
        // flowPathsConfig={[
        // {
        //   startX: "0%",
        //   startY: "0%",
        //   endX: "95%",
        //   endY: "0%",
        //   controlX: "20%",
        //   controlY: "15%",
        //   speed: 10,
        //   dotCount: 15,
        //   strokeColor: "#E66023",
        //   dotColor: "#E66023",
        //   x: "10%",
        //   y: -10,
        //   length: "100%"
        // },
      // ]}

      />
      {/* <div className="absolute inset-0 z-0 landing-ink-veil--soft" /> */}
      
      {/* Subtle Warm Backdrop Blur & Ambient Glow */}
      {/* <div className="absolute top-1/4 -left-20 w-96 h-96 bg-ochre/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-navy/80 rounded-full blur-3xl pointer-events-none" /> */}

      {/* Decorative rotating medallion — spins continuously. Below lg the header stacks into a single
          column (pill/title/paragraph, then the button underneath), so it sits high up near the pill;
          from lg it sits beside a wider row and can safely go a bit lower. */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute z-2 top-[8%] md:top-[10%] lg:top-[9%] left-[86%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 lg:w-52 lg:h-52 xl:w-60 xl:h-60 pointer-events-none select-none animate-spin-slow motion-reduce:animate-none"
      >
        <NextImage
          src="/assets/patterns/petter_circle_animation_1-1.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 160px, 240px"
          className="object-contain"
        />
      </div>

      {/* Top line-art strip — full section width. Kept shorter than the section's own top padding
          (py-16 / md:py-28) at every breakpoint so it never overlaps down into the header row and
          covers the "Community-Led Healing" pill; it stays confined to the empty band above it. */}
      {/* <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-1 h-12 sm:h-16 md:h-20 lg:h-24 pointer-events-none select-none opacity-80 animate-glow-pulse motion-reduce:filter-none"
        style={{
          backgroundImage: "url(/assets/patterns/bottom_animation.svg)",
          backgroundRepeat: "no-repeat",
          // "cover" scales by width here (container is much wider, relative to its own short height,
          // than the artwork's own 1870x194 aspect), so it always spans the full section width. Centering
          // both axes (rather than the earlier "center top") keeps the crop on the artwork's vertical
          // middle, where its line/dots actually sit, instead of the top edge of its bounding box —
          // which was cropping down to just the two corner arcs and hiding everything between them.
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      /> */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

        {/* SECTION HEADER: Split Story & Action Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 border-b border-ochre/15 pb-10">
          <div className="lg:col-span-8 space-y-4">
            <motion.div
                    whileHover={{ 
                    scale: 1.2,
                     
                  }}
                transition={{ type: "spring", stiffness: 400, damping: 70 }}
                whileTap={{ scale: 2 }}
            className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs md:text-sm font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-ochre animate-pulse" />
              Community-Led Healing
            </motion.div>
            <motion.div  
                 whileHover={{ 
                    scale: 1.2,
                     
                  }}
                transition={{ type: "spring", stiffness: 400, damping: 70 }}
                whileTap={{ scale: 2 }}>
            <PageTitle 
              as="h2" 
              onDark 
              className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-white"
            >
              Essential Clinical & Cultural Healthcare Services
            </PageTitle>
            </motion.div>

            <p className="text-sand/80 text-base md:text-lg max-w-2xl leading-relaxed font-light">
              Built on a foundation of compassionate emergency care in remote lands, our program delivers 
              <strong className="accent-text font-semibold"> culturally safe, doctor-led clinical services </strong> 
              tailored specifically for Aboriginal communities.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <ButtonLink 
              href="/services"
              className="btn-ochre group relative inline-flex items-center justify-center gap-3 px-7 py-4 text-sm font-semibold rounded-xl shadow-lg shadow-ochre/20 transition-all duration-300 hover:shadow-ochre/40 hover:-translate-y-0.5"
            >
              <span>Explore All Care Services</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
          </div>
        </div>

        {/* SERVICES DISPLAY: Asymmetric Narrative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mainServices.map((item, idx) => {
            const Icon = item.icon;
            const isFeatured = idx === 0;

            return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 14,
                mass: 0.9,
                delay: idx * 0.12,
                opacity: { duration: 0.35, delay: idx * 0.12 },
              }}
              className={`card-3d group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white ${
                isFeatured ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Visual Image Header Frame */}
              <div className="relative w-full h-56 md:h-64 overflow-hidden bg-neutral-100">
                <NextImage
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
                    "imageClass" in item && item.imageClass ? item.imageClass : ""
                  }`}
                  style={{ objectPosition: item.objectPosition }}
                />
                
                {/* Subtle Image Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Service Badge Icon */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="relative group/icon">
                    <div 
                      className={`absolute -inset-1.5 rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 ${
                        item.glowColor || "bg-ochre/40"
                      }`}
                    />
                  </div>
                </div>

                {/* Cultural Indicator Tag */}
                {isFeatured && (
                  <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ochre backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3 h-3" /> Core Priority
                  </div>
                )}

                {/* Steeper Decreasing Wave Divider (Higher on left, dipping lower down to the right) */}
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none leading-none">
                  <svg 
                    className="relative block w-full h-14 text-white" 
                    viewBox="0 0 1200 120" 
                    preserveAspectRatio="none"
                  >
                    <path 
                      d="M0,10 C400,30 700,90 1200,100 L1200,120 L0,120 Z" 
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* Service Text Content (Dark Text on White Background) */}
              <div className="p-6 md:p-7 pt-3 flex-1 flex flex-col justify-between relative z-10 bg-white">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-ochre transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 group-hover:text-neutral-900 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>

                {/* Card Bottom Accent Link */}
                <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-ochre">
                  <span className="uppercase tracking-wider opacity-80 group-hover:opacity-100">Care Program</span>
                  <span className="w-8 h-8 rounded-full bg-ochre/10 flex items-center justify-center transition-all duration-300 group-hover:bg-ochre group-hover:text-white">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Hover Glow Edge Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-ochre/40 rounded-2xl pointer-events-none transition-colors duration-500" />
            </motion.div>
            );
          })}
        </div>

        {/* SECTION FOOTER: Remote Care Promise Banner */}
        <div className="mt-14 p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre shrink-0">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-base font-bold">Delivering emergency & routine care anywhere</h4>
              <p className="text-sand/65 text-xs md:text-sm">From urban clinics to the most isolated remote communities.</p>
            </div>
          </div>
          <ButtonLink 
            href="/contact" 
            className="text-sand hover:text-white text-xs md:text-sm font-semibold underline underline-offset-4 shrink-0 transition"
          >
            Request Remote Outreach Service &rarr;
          </ButtonLink>
        </div>

      </div>

      {/* Bottom line-art strip — the artwork sits still; a light beam sweeps continuously along its
          lines and dots on top of it, reading as "flow" */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-1 h-48 md:h-72 pointer-events-none select-none"
      >
        {/* <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: "url(/assets/patterns/bottom_animation.svg)",
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
            backgroundPosition: "left top",
          }}
        />
        <div
          className="absolute inset-0 animate-flow-sweep motion-reduce:hidden"
          style={{
            maskImage: "url(/assets/patterns/bottom_animation.svg)",
            maskRepeat: "repeat-x",
            maskSize: "auto 100%",
            maskPosition: "left top",
            WebkitMaskImage: "url(/assets/patterns/bottom_animation.svg)",
            WebkitMaskRepeat: "repeat-x",
            WebkitMaskSize: "auto 100%",
            WebkitMaskPosition: "left top",
            backgroundImage:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 48%, rgba(255,158,66,0.95) 50%, rgba(255,255,255,0.9) 52%, transparent 100%)",
            backgroundSize: "220% 100%",
          }}
        /> */}
      </div>
    </section>
  );
}