import React from "react";
import { Heart, Compass, Award, Lightbulb, Users, Flame, ArrowRight, ShieldCheck, HandHeart, Landmark } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import CulturalPattern from "./CulturalPattern";

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
      {/* WHO WE ARE — navy (after white mission) */}
      <section className="relative overflow-hidden bg-[#000D1F] py-20 md:py-28 text-sand">
        <CulturalPattern variant="about" />
        <div aria-hidden="true" className="cultural-background cultural-background--about" />
        <div className="absolute inset-0 z-0 bg-[#000D1F]/72" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2.5 text-[#E85D26] text-sm md:text-base font-bold uppercase tracking-[0.14em]">
                <span className="h-px w-10 bg-[#E85D26]" /> Who we are
              </span>
              <h2 className="text-[clamp(1.9rem,4vw,3.1rem)] font-extrabold text-white leading-[1.05] tracking-[-0.02em]">
                Proudly Aboriginal.{" "}
                <span className="text-[#E85D26]">Driven by purpose.</span>
              </h2>
              <p className="text-sand/80 text-base md:text-lg leading-relaxed max-w-xl">
                Pika Wiya Health Service is an{" "}
                <strong className="accent-text">Aboriginal Community Controlled Health Organisation</strong>,
                operating with care for community on Country. We deliver professional,{" "}
                <strong className="accent-text">culturally safe healthcare</strong> grounded in lived
                experience, accountability, and strong regional capability.
              </p>
              <p className="text-sand/80 text-base leading-relaxed max-w-xl">
                Guided by our Board and constitution, we bring{" "}
                <strong className="accent-text">clinical care, family support, cultural guidance</strong> and
                community wellbeing together under one shared vision —{" "}
                <strong className="accent-text">health our way, for our people</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="mt-0.5 w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-[#E85D26]/15 text-[#E85D26] border border-[#E85D26]/30">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-xs text-sand/60 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#E85D26] font-semibold text-sm hover:gap-3 transition-all mt-2"
              >
                Read our full story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative aspect-square max-h-[520px] w-full overflow-hidden border border-[#E85D26]/30 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
              <NextImage
                src="/assets/home/art-mulka-600.avif"
                alt="Aboriginal artwork — cultural storytelling through pattern and Country"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#000D1F]/90 via-[#000D1F]/40 to-transparent p-5">
                <p className="text-[#E85D26] text-[11px] font-semibold uppercase tracking-[0.16em]">Cultural Artwork</p>
                <p className="text-white text-sm mt-1">&ldquo;Mulka&rdquo; — honouring story, Country and community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION — white */}
      <section className="relative overflow-hidden bg-white py-20 md:py-24">
        <CulturalPattern variant="vision" className="cultural-pattern--light" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-start">
            <div className="space-y-10">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-2.5 text-[#E85D26] text-sm md:text-base font-bold uppercase tracking-[0.14em]">
                  <span className="h-px w-10 bg-[#E85D26]" /> Looking ahead
                </span>
                <h3 className="text-[clamp(1.8rem,3.8vw,3rem)] font-extrabold text-[#000D1F] leading-[1.05] tracking-[-0.02em]">
                  Our Vision
                </h3>
                <p className="text-[#000D1F]/70 text-base md:text-lg">
                  Setting benchmarks in{" "}
                  <strong className="accent-text">holistic Aboriginal healthcare</strong> — grounded by culture,
                  trusted by community.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {visionPoints.map((point, index) => (
                  <div
                    key={index}
                    className="border-t-2 border-[#E85D26]/50 pt-5 pb-2 space-y-3 hover:border-[#E85D26] transition"
                  >
                    <span className="text-[#E85D26] font-extrabold text-2xl tracking-tight">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[#000D1F]/70 text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[440px] md:min-h-[560px] lg:min-h-[640px] overflow-hidden border border-[#E85D26]/25 shadow-[0_20px_50px_-24px_rgba(26,22,21,0.3)]">
              <NextImage
                src="/assets/about-us-01.png"
                alt="Pika Wiya Health Service — community and culture"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VALUES — navy */}
      <section className="relative overflow-hidden bg-[#000D1F] py-20 md:py-24 text-sand">
        <CulturalPattern variant="values" />
        <div aria-hidden="true" className="cultural-background cultural-background--values" />
        <div className="absolute inset-0 z-0 bg-[#000D1F]/72" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2.5 text-[#E85D26] text-sm md:text-base font-bold uppercase tracking-[0.14em]">
              <span className="h-px w-10 bg-[#E85D26]" /> How we work
            </span>
            <h3 className="text-[clamp(1.8rem,3.8vw,3rem)] font-extrabold text-white leading-[1.05] tracking-[-0.02em]">
              Our Values
            </h3>
            <p className="text-sand/75">
              The principles guiding every <strong className="accent-text">program and interaction</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((val) => {
              const IconComponent = val.icon;
              return (
                <div
                  key={val.name}
                  className="border border-sand/15 bg-white/[0.03] p-6 space-y-4 hover:border-[#E85D26]/60 hover:bg-[#E85D26]/10 transition"
                >
                  <div className="w-11 h-11 rounded-full bg-[#E85D26]/15 border border-[#E85D26]/25 flex items-center justify-center text-[#E85D26]">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{val.name}</h4>
                    <p className="text-sand/65 text-sm mt-1.5 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PURPOSE BANNER — ochre accent break */}
      <section className="relative overflow-hidden bg-[#E85D26]">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1.2px, transparent 1.2px)",
              backgroundSize: "18px 18px",
            }}
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-14 md:py-16">
          <span className="text-white/85 uppercase tracking-[0.14em] text-sm font-bold">Our Purpose</span>
          <p className="text-2xl md:text-4xl font-extrabold text-white mt-3 leading-tight tracking-[-0.02em] max-w-4xl">
            &quot;To provide health care our way to our people so our community is healthy at every age.&quot;
          </p>
        </div>
      </section>
    </>
  );
}
