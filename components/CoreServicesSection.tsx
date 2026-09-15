import React from 'react';
import NextImage from 'next/image';
import { ArrowRight, ArrowUpRight, HeartPulse, Sparkles, LucideIcon } from 'lucide-react';
import ButtonLink from './ButtonLink';
import PageTitle from './PageTitle';
import CulturalPattern from './CulturalPattern';

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
      {/* Background Cultural Elements - Updated variant to core-service for matching consistent pattern layout */}
      {/* <CulturalPattern variant="core-service" showFeet /> */}
      <CulturalPattern 
        variant="core-services"
        motif1Config={[{ x: 95, y: -80 }]}
        motif2Config={[{ x: 1050, y: 800 }]}
        motif3Config={[{ x: 100, y: 500 }]}
        dotsConfig={[{ x: 130, y: 200 }, { x: 1070, y: 300 }]}
        spiralsConfig={[{ x: 300, y: 400 }]}
        uShapeConfig={[{ x: 100, y: 900 }]}

      />
      <div className="absolute inset-0 z-0 landing-ink-veil--soft" />
      
      {/* Subtle Warm Backdrop Blur & Ambient Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-ochre/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-navy/80 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        
        {/* SECTION HEADER: Split Story & Action Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 border-b border-ochre/15 pb-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs md:text-sm font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-ochre animate-pulse" />
              Community-Led Healing
            </div>
            
            <PageTitle 
              as="h2" 
              onDark 
              className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-white"
            >
              Essential Clinical & Cultural Healthcare Services
            </PageTitle>

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
              <div
                key={idx}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-500 ${
                  isFeatured 
                    ? "md:col-span-2 lg:col-span-1 border-ochre/40 bg-gradient-to-b from-navy/90 to-earth-dark/95 shadow-xl" 
                    : "border-white/10 bg-navy/60 hover:border-ochre/50"
                } hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]`}
              >
                {/* Visual Image Header Frame */}
                <div className="relative w-full h-56 md:h-64 overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                  
                  {/* Service Badge Icon with Individual Color Shades & Radial Glow */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="relative group/icon">
                      {/* Radial Ambient Glow */}
                      <div 
                        className={`absolute -inset-1.5 rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 ${
                          item.glowColor || "bg-ochre/40"
                        }`}
                      />

                      {/* Icon Container Badge */}
                      <div 
                        className={`relative w-11 h-11 rounded-xl backdrop-blur-md border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 ${
                          item.badgeBg || "bg-earth-dark/80 border-ochre/30"
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Cultural Indicator Tag for Special Services */}
                  {isFeatured && (
                    <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ochre/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" /> Core Priority
                    </div>
                  )}
                </div>

                {/* Service Text Content */}
                <div className="p-6 md:p-7 flex-1 flex flex-col justify-between relative z-10">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-ochre-light transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-sand/70 text-sm leading-relaxed line-clamp-3 group-hover:text-sand/90 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Bottom Accent Link */}
                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-ochre">
                    <span className="uppercase tracking-wider opacity-80 group-hover:opacity-100">Care Program</span>
                    <span className="w-8 h-8 rounded-full bg-ochre/10 flex items-center justify-center transition-all duration-300 group-hover:bg-ochre group-hover:text-white">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Hover Glow Edge Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-ochre/30 rounded-2xl pointer-events-none transition-colors duration-500" />
              </div>
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
    </section>
  );
}