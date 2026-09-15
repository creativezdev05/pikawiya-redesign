import React from 'react';
import NextImage from 'next/image';
import { Quote, ShieldCheck, Heart } from 'lucide-react';
// Import your design components (PageTitle, FlashlightContainer, CulturalPattern, etc.)
import PageTitle from './PageTitle';
import FlashlightContainer from './FlashlightContainer';
import CulturalPattern from './CulturalPattern';

export default function MissionSection() {
  return (
    <section className="relative overflow-hidden landing-paper py-20 md:py-32">
      {/* Background Cultural Motif */}
      <CulturalPattern variant="mission" className="cultural-pattern--light" />

      {/* Ambient background glow accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-ochre/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Main Split Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Mission Text & Founding Pillar Cards */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Header Tag */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs md:text-sm font-bold uppercase tracking-widest">
								<span className="w-2 h-2 rounded-full bg-ochre animate-pulse" />
								Community-Led Healing
							</div>
              
              <PageTitle 
                as="h3" 
                className="text-[clamp(2rem,3.8vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-ink"
              >
                Empowering Community Through 
               Health, Dignity & Culture
              </PageTitle>
            </div>

            {/* Core Mission Narrative */}
            <p className="text-ink/80 text-base md:text-xl leading-relaxed max-w-2xl font-light">
              Pika Wiya Health Service Aboriginal Corporation delivers a{" "}
              <strong className="text-ink font-semibold border-b-2 border-ochre/40">
                culturally appropriate service
              </strong>{" "}
              to Aboriginal and Torres Strait Islander people—addressing preventative, promotive, and curative aspects of health to ensure our community achieves greater{" "}
              <strong className="text-ochre font-semibold">
                dignity and quality of life
              </strong>{" "}
              equal with all Australians.
            </p>

            {/* Founding Context Highlights (3 Founding Women Origin Pillar) */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/60 border border-ochre/20 backdrop-blur-sm space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-ochre/10 text-ochre flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-ink">Grassroots Emergency Care</h4>
                <p className="text-xs text-ink/70 leading-relaxed">
                  Founded when three women stepped up to treat an injured individual in urgent need, establishing our deep community bond.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/60 border border-ochre/20 backdrop-blur-sm space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-ochre/10 text-ochre flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-ink">Community Ownership</h4>
                <p className="text-xs text-ink/70 leading-relaxed">
                  Driven by Aboriginal leadership to ensure clinical care respects traditional lore, language, and cultural safety.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Framed Portrait Spotlight */}
          <div className="lg:col-span-5 relative">
            
            {/* Decorative Offset Backdrop Frame */}
            <div className="absolute -inset-3 rounded-3xl border-2 border-dashed border-ochre/30 -rotate-2 pointer-events-none" />

            {/* Image Container Card */}
            <div className="relative rounded-2xl overflow-hidden border border-ochre/30 shadow-2xl bg-navy group min-h-[460px] md:min-h-[520px]">
              <NextImage
                src="/assets/about/Rachael-Schmerl.jpeg"
                alt="Rachael Schmerl, Chief Executive Officer of Pika Wiya Health Service"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center scale-[1.08] transition-transform duration-700 ease-out group-hover:scale-115"
              />

              {/* Gradient Scrim for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />

              {/* Top Quote Tag */}
              <div className="absolute top-5 left-5 z-10 w-10 h-10 rounded-full bg-ochre/90 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5" />
              </div>

              {/* Executive Flashlight Banner */}
              <div className="absolute bottom-5 left-5 right-5 z-10">
                <FlashlightContainer className="relative overflow-hidden rounded-xl bg-navy/95 border-l-4 border-ochre px-6 py-4 backdrop-blur-md shadow-2xl">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(rgba(232,93,38,0.5) 1px, transparent 1px)",
                      backgroundSize: "10px 10px",
                    }}
                  />
                  <span className="relative text-ochre text-xs font-extrabold uppercase tracking-[0.2em]">
                    Executive Leadership
                  </span>
                  <h4 className="relative text-white text-lg md:text-xl font-bold mt-0.5">
                    Rachael Schmerl
                  </h4>
                  <p className="relative text-sand/80 text-xs md:text-sm font-medium">
                    Chief Executive Officer
                  </p>
                </FlashlightContainer>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}