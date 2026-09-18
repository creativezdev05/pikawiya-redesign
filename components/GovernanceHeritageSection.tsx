import React from "react";
import NextImage from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Footprints } from "lucide-react";
import CulturalPattern from "./CulturalPattern";
import PageTitle from "./PageTitle";
import { motion } from "framer-motion";

export default function GovernanceHeritageSection() {
  return (
    <section className="relative overflow-hidden landing-paper py-20 md:py-32">
      <div 
        className="absolute inset-[-20%] z-10 opacity-20 pointer-events-none animate-drift"
        style={{ 
          backgroundImage: "url('/assets/background-pattern.png')",
          backgroundSize: "contain",
          /* Swap out the filter string below to change the color */
          filter: "brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(210%) hue-rotate(349deg) brightness(93%) contrast(82%)"
        }}
      />
      {/* Tailwind custom keyframes inline */}
      
      {/* Background Cultural Pattern */}
      {/* <CulturalPattern variant="heritage" className="cultural-pattern--light" /> */}
      {/* <CulturalPattern 
          variant="heritage"
          // motif1Config={[{ x: -50, y: 150 }]}
          // motif2Config={[{ x: 1300, y: 650 }]}
          // motif3Config={[{ x: -60, y: 460 }]}
          dotsConfig={[{ x: 130, y: 100 }, { x: 1270, y: 200 }]}
          dashedOrbitsConfig={[{ x: 100, y: 200 }, { x: 300, y: 400 } , { x: 1000, y: 300 }]}
          uShapeConfig={[{ x: -40 , y: 700 }]}
          cornerTLConfig={{ x: "25%", y: "-30%" }}       // Pin strictly to top-left edge
          cornerBRConfig={{ x: "80%", y: "120%" }}  // Pin strictly to bottom-right edge
          flowPathsConfig={[
          {
            startX: "100%",
            startY: "0%",
            endX: "0%",
            endY: "100%",
            controlX: "95%",
            controlY: "85%",
            speed: 10,
            dotCount: 20,
            strokeColor: "#E66023",
            dotColor: "#E66023",
            // x: "10%",
            // y: "10%",
            length: "100%"
          },
        ]}
          // showFeet
        /> */}

      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-ochre/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Visual Heritage Frame with Floating Context Badge */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            {/* Offset Cultural Border Accent */}
            <div className="absolute -inset-3 rounded-3xl border-2 border-dashed border-ochre/30 rotate-1 pointer-events-none" />

            <div className="relative min-h-[420px] md:min-h-[500px] rounded-2xl overflow-hidden border border-ochre/30 shadow-2xl bg-navy group">
              <NextImage
                src="/assets/home/services-heritage-800.png"
                alt="Aboriginal cultural heritage artwork"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Soft Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

              {/* Top Tag: Ancestral Heritage */}
              <div className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-earth-dark/80 backdrop-blur-md border border-ochre/30 text-white text-xs font-bold uppercase tracking-wider">
                <Footprints className="w-3.5 h-3.5 text-ochre" /> Ancestral Tracks
              </div>

              {/* Floating Story Card Overlay */}
              <div className="absolute bottom-5 left-5 right-5 z-10 p-5 rounded-xl bg-navy/90 backdrop-blur-md border border-white/10 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-ochre text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Community-Driven Governance
                </div>
                <p className="text-sand/85 text-xs md:text-sm leading-relaxed">
                  From a emergency response led by three women to a fully incorporated health service governed directly by local elders and community members.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Governance Narrative & CTAs */}
          <div className="lg:col-span-6 space-y-8 order-1 lg:order-2">
            
            {/* Header Area */}
            <div className="space-y-4">
              <motion.div
              whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 2 }}
              className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs md:text-sm font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-ochre animate-pulse" />
              Community-Led Healing
            	</motion.div>
              
              <motion.div  whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 2 }}>
                <PageTitle
                  as="h2" 
                  className="text-[clamp(2rem,3.8vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-ink"
                >
                  Walking with our ancestors. 
                  Building for community.
                </PageTitle>
              </motion.div>
            </div>

            {/* Main Paragraph */}
            <p className="text-ink/80 leading-relaxed text-base md:text-xl font-light">
              Pika Wiya Health Service operates under the guidance of our{" "}
              <strong className="text-ink font-semibold border-b-2 border-ochre/40">
                Aboriginal Board of Directors
              </strong>{" "}
              and constitution. We walk paths shaped by our ancestors — honouring tradition while ensuring{" "}
              <strong className="text-ochre font-semibold">
                community priorities
              </strong>{" "}
              drive every aspect of our care.
            </p>

            {/* Key Governance Pillars */}
            <div className="p-5 rounded-2xl bg-white/60 border border-ochre/20 backdrop-blur-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ochre">Constitutional Commitment</h4>
              <p className="text-xs md:text-sm text-ink/75 leading-relaxed">
                Our board ensures self-determination, accountability, and absolute transparency back to Country and the families we serve across all clinical programs.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/governance"
                className="btn-ochre group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-ochre hover:bg-ochre-dark text-white text-sm font-semibold rounded-xl shadow-lg shadow-ochre/20 transition-all duration-300 hover:shadow-ochre/40 hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Governance &amp; Rule Book</span>
              </Link>
              
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-ink/15 hover:border-ochre hover:bg-white text-ink text-sm font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Learn About PWHS</span>
                <ArrowRight className="w-4 h-4 text-ochre" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}