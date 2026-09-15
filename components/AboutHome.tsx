import React from "react";
import { 
  Heart, Compass, Award, Lightbulb, Users, Flame, 
  ArrowRight, ShieldCheck, HandHeart, Landmark, Sparkles, Target, Compass as PathIcon 
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import CulturalPattern from "./CulturalPattern";
import PageTitle from "./PageTitle";
import FlashlightContainer from "@/components/FlashlightContainer";

export default function AboutSection() {
  const values = [
    { name: "Believe", icon: Heart, desc: "We are making a difference together." },
    { name: "Initiative", icon: Lightbulb, desc: "We develop new programs and services in response to unmet needs." },
    { name: "Persistence", icon: Flame, desc: "Where others give up, we reach out." },
    { name: "Respect", icon: Users, desc: "We treat others in the community and workplace with respect." },
    { name: "Consultation", icon: Compass, desc: "We engage our community to understand your needs." },
    { name: "Honour", icon: Award, desc: "Our service and history reflect upon the past, learn from it and promote change." },
  ];

  const highlights = [
    { icon: ShieldCheck, label: "Aboriginal Controlled", desc: "Community governed health service" },
    { icon: HandHeart, label: "Culturally Safe Care", desc: "Holistic clinical & community support" },
    { icon: Landmark, label: "Strong Governance", desc: "Accountable to community & Country" },
    { icon: Users, label: "Community First", desc: "Local knowledge, lasting relationships" },
  ];

  const visionPoints = [
    "We provide holistic health care services that set a benchmark for other ACCHOs.",
    "We are embraced by our workers, external bodies, and the wider community.",
    "We foster an environment of diversity and harmony.",
    "We support the living preferences of our people wherever they live.",
    "We aspire to be part of an Aboriginal community that is healthy at all ages and across generations.",
    "We demonstrate good governance and exceed the expectations of our funding bodies.",
  ];

  return (
    <>
      {/* 1. WHO WE ARE — Deep Navy with Layered Card Highlights */}
      <section className="relative overflow-hidden landing-ink py-20 md:py-32 text-sand dark:text-ink">
        <CulturalPattern 
        variant="about"
        motif1Config={[{ x: -30, y: 150 }]}
        motif2Config={[{ x: 1200, y: 650 }]}
        motif3Config={[{ x: -20, y: 460 }]}
        dotsConfig={[{ x: 130, y: 200 }, { x: 1170, y: 300 }]}
        spiralsConfig={[{ x: 300, y: 400 }]}
        uShapeConfig={[{ x: -40 , y: 700 }]}
        showFeet
      />
        <div aria-hidden="true" className="cultural-background cultural-background--about" />
        <div className="absolute inset-0 z-0 landing-ink-veil--soft" />
        
        {/* Soft Ambient Glows */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-ochre/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs md:text-sm font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-ochre animate-pulse" /> Who We Are
                </span>
                
                <PageTitle as="h2" onDark className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-white">
                  Proudly Aboriginal. Driven by Purpose & Lore.
                </PageTitle>
              </div>

              <div className="space-y-4 text-sand/85 text-base md:text-lg leading-relaxed font-light">
                <p>
                  Pika Wiya Health Service is an{" "}
                  <strong className="text-white font-semibold underline decoration-ochre/60 underline-offset-4">
                    Aboriginal Community Controlled Health Organisation
                  </strong>
                  , operating with care for community on Country. Born from emergency care in remote lands, we deliver professional,{" "}
                  <strong className="text-ochre font-semibold">culturally safe healthcare</strong> grounded in lived experience and accountability.
                </p>
                <p>
                  Guided by our Board, elders, and constitution, we bring{" "}
                  <strong className="text-white font-medium">clinical care, family support, and cultural guidance</strong> together under one shared vision —{" "}
                  <strong className="accent-text font-semibold">health our way, for our people</strong>.
                </p>
              </div>

              {/* 2x2 Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.label} 
                      className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm flex items-start gap-3.5 transition-all duration-300 hover:border-ochre/40 hover:bg-white/[0.07]"
                    >
                      <div className="mt-0.5 w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-ochre/20 text-ochre border border-ochre/30">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-xs text-sand/65 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-ochre/15 border border-ochre/30 text-ochre font-semibold text-sm hover:bg-ochre hover:text-white transition-all duration-300 group"
                >
                  <span>Read Our Full Story & History</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Artwork Display Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square max-h-[500px] w-full overflow-hidden rounded-2xl border-2 border-ochre/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] group">
                <NextImage
                  src="/assets/patterns/pat1.jpg"
                  alt="Aboriginal artwork — cultural storytelling through pattern and Country"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Artwork Overlay Scrim & Culture Tag */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-navy/85 backdrop-blur-md border border-white/10">
                  <p className="text-ochre text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Traditional Storytelling
                  </p>
                  <p className="text-white text-xs mt-1 text-sand/80">
                    Connecting ancestral wisdom with modern community care across South Australia.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VISION — Clean Light Theme with Numbered Cards Grid */}
      <section className="relative overflow-hidden landing-paper py-20 md:py-32">
        {/* <CulturalPattern variant="vision" className="cultural-pattern--light" /> */}
        <CulturalPattern 
        variant="vision"
        motif1Config={[{ x: -30, y: 150 }]}
        motif2Config={[{ x: 1200, y: 650 }]}
        motif3Config={[{ x: -20, y: 460 }]}
        dotsConfig={[{ x: 130, y: 200 }, { x: 1170, y: 300 }]}
        spiralsConfig={[{ x: 300, y: 400 }]}
        uShapeConfig={[{ x: -40 , y: 700 }]}
        showFeet
      />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Header & Large Graphic Block */}
            <div className="lg:col-span-5 space-y-8 sticky top-24">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs md:text-sm font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-ochre animate-pulse" /> Looking Ahead
                </span>
                
                <PageTitle as="h3" className="text-[clamp(2rem,3.8vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-ink">
                  Our Strategic Vision
                </PageTitle>

                <p className="text-ink/75 text-base md:text-lg font-light leading-relaxed">
                  Setting benchmarks in{" "}
                  <strong className="text-ink font-semibold border-b-2 border-ochre/40">
                    holistic Aboriginal healthcare
                  </strong>{" "}
                  — grounded by lore, community control, and clinical excellence.
                </p>
              </div>

              {/* Graphic Feature Box */}
              <div className="relative w-full overflow-hidden rounded-2xl border border-ochre/30 shadow-xl bg-white p-2 group">
                <NextImage
                  src="/assets/about-us-01.png"
                  alt="Pika Wiya Health Service — community and culture"
                  width={1400}
                  height={1400}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="h-auto w-full object-contain rounded-xl transition-transform duration-700 group-hover:scale-102"
                />
              </div>
            </div>

            {/* Right Vision Points List */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {visionPoints.map((point, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-ochre/15 rounded-2xl p-6 space-y-3 transition-all duration-300 hover:border-ochre hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-ochre font-extrabold text-2xl tracking-tight">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-ochre/10 text-ochre flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-ink/80 text-sm leading-relaxed font-normal group-hover:text-ink transition-colors">
                    {point}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. VALUES — Modern Dark Flashlight Grid */}
      <section className="relative overflow-hidden landing-ink py-20 md:py-32 text-sand dark:text-ink">
        <CulturalPattern 
          variant="values"
          motif1Config={[{ x: -30, y: 150 }]}
          motif2Config={[{ x: 1300, y: 650 }]}
          motif3Config={[{ x: -50, y: 460 }]}
          dotsConfig={[{ x: 130, y: 200 }, { x: 1170, y: 200 }]}
          spiralsConfig={[{ x: 300, y: 400 }]}
          uShapeConfig={[{ x: -40 , y: 700 }]}
          showFeet
        />
        <div aria-hidden="true" className="cultural-background cultural-background--values" />
        <div className="absolute inset-0 z-0 landing-ink-veil--soft" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 space-y-14">
          
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs md:text-sm font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-ochre" /> How We Work
            </span>
            
            <PageTitle as="h3" onDark className="text-[clamp(2rem,3.8vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              Guiding Values
            </PageTitle>

            <p className="text-sand/75 text-base md:text-lg font-light">
              The foundational principles guiding every <strong className="text-white font-medium">clinical interaction, outreach program, and community partnership</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val) => {
              const IconComponent = val.icon;
              return (
                <FlashlightContainer
                  key={val.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 space-y-5 backdrop-blur-sm transition-all duration-300 hover:border-ochre/60 hover:bg-navy/80 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre transition-all duration-300 group-hover:bg-ochre group-hover:text-white">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white group-hover:text-ochre-light transition-colors">{val.name}</h4>
                    <p className="text-sand/70 text-sm leading-relaxed group-hover:text-sand transition-colors">{val.desc}</p>
                  </div>
                </FlashlightContainer>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. PURPOSE BANNER — High-Contrast Cultural Statement */}
      <section className="relative overflow-hidden bg-ochre py-16 md:py-20 shadow-inner">
        {/* Subtle Background Pattern Mask */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1.2px, transparent 1.2px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/15 text-white text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
            <PathIcon className="w-3.5 h-3.5" /> Our Overarching Purpose
          </span>
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight max-w-4xl mx-auto">
            &quot;To provide health care our way to our people so our community is healthy at every age.&quot;
          </blockquote>
        </div>
      </section>
    </>
  );
}